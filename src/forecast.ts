// Forecast fetching, ported from Weatherglass (same author, MIT).
import type { ForecastPoint, ForecastType } from './types';
import type { HomeAssistant } from './ha';

/**
 * Fetches a weather forecast for `entityId`. Home Assistant dropped the
 * `forecast` attribute in 2024, so we try the paths in order of reliability:
 *   1. `weather.get_forecasts` service call with a returned response,
 *   2. the live `weather/subscribe_forecast` websocket subscription,
 *   3. the legacy `forecast` attribute (older integrations, dev harness).
 */
export async function fetchForecast(
  hass: HomeAssistant,
  entityId: string,
  forecastType: ForecastType
): Promise<ForecastPoint[]> {
  // 1. service call returning a response
  try {
    const resp = await hass.callWS<{
      response?: Record<string, { forecast?: ForecastPoint[] }>;
    }>({
      type: 'execute_script',
      sequence: [
        {
          service: 'weather.get_forecasts',
          data: { type: forecastType },
          target: { entity_id: entityId },
          response_variable: '_bc_forecast',
        },
        { stop: 'done', response_variable: '_bc_forecast' },
      ],
    });
    const fc = resp?.response?.[entityId]?.forecast;
    if (Array.isArray(fc) && fc.length) return fc;
  } catch {
    /* fall through */
  }

  // 2. live subscription (resolve on the first push, then unsubscribe)
  if (hass.connection?.subscribeMessage) {
    try {
      const fc = await new Promise<ForecastPoint[]>((resolve) => {
        let unsub: (() => void) | undefined;
        const timer = setTimeout(() => {
          unsub?.();
          resolve([]);
        }, 4000);
        hass
          .connection!.subscribeMessage!<{ forecast?: ForecastPoint[] }>(
            (msg) => {
              clearTimeout(timer);
              unsub?.();
              resolve(msg.forecast ?? []);
            },
            {
              type: 'weather/subscribe_forecast',
              forecast_type: forecastType,
              entity_id: entityId,
            }
          )
          .then((u: () => void) => {
            unsub = u;
          })
          .catch(() => resolve([]));
      });
      if (fc.length) return fc;
    } catch {
      /* fall through */
    }
  }

  // 3. legacy attribute
  const attr = hass.states[entityId]?.attributes?.forecast;
  if (Array.isArray(attr) && attr.length) return attr as ForecastPoint[];

  return [];
}
