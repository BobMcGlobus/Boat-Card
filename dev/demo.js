// Dev-only preview harness. Registers minimal stand-ins for the Home Assistant
// frontend elements the cards rely on (ha-card, ha-icon, ha-form,
// ha-camera-stream) so the layout renders in a bare `vite` dev server.
import '../src/boat-card.ts';

// ---- HA element stubs (dev only, never shipped in dist) ----
if (!customElements.get('ha-card')) {
  customElements.define(
    'ha-card',
    class extends HTMLElement {
      connectedCallback() {
        this.style.display = 'block';
      }
    }
  );
}
// NOTE: these stubs use Shadow DOM and never touch their light DOM. A stub that
// sets its own light-DOM innerHTML (as an earlier version did) ejects Lit's
// adjacent child-part markers and breaks re-rendering — the real HA elements are
// Shadow-DOM based, so mirror that here.
if (!customElements.get('ha-icon')) {
  customElements.define(
    'ha-icon',
    class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' }).innerHTML =
          '<span style="display:inline-grid;place-items:center;' +
          'width:var(--mdc-icon-size,20px);height:var(--mdc-icon-size,20px)">' +
          '<span style="width:70%;height:70%;border:2px solid currentColor;' +
          'border-radius:4px;opacity:.5"></span></span>';
      }
      set icon(v) {
        this.setAttribute('icon', String(v));
      }
      get icon() {
        return this.getAttribute('icon');
      }
    }
  );
}
if (!customElements.get('ha-form')) {
  customElements.define(
    'ha-form',
    class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' }).innerHTML =
          '<div style="padding:10px;opacity:.6">[ ha-form — nur in Home Assistant sichtbar ]</div>';
      }
    }
  );
}
if (!customElements.get('ha-camera-stream')) {
  customElements.define(
    'ha-camera-stream',
    class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' }).innerHTML =
          '<style>:host{display:block;width:100%;height:100%}</style>' +
          '<div style="width:100%;height:100%;display:grid;place-items:center;' +
          'color:#9fb4d6;background:repeating-linear-gradient(45deg,#1b2a44,' +
          '#1b2a44 12px,#22354f 12px,#22354f 24px)">● LIVE (mast)</div>';
      }
    }
  );
}

// ---- mock hass ----
const s = (entity_id, state, attributes = {}) => ({
  entity_id,
  state: String(state),
  attributes,
  last_changed: '',
  last_updated: '',
});

const hass = {
  language: 'de',
  locale: { language: 'de' },
  states: {
    'sensor.solar_power': s('sensor.solar_power', 25, { unit_of_measurement: 'W', friendly_name: 'Solar' }),
    'sensor.solar_main_power': s('sensor.solar_main_power', 21, { unit_of_measurement: 'W' }),
    'sensor.solar_main_yield_today': s('sensor.solar_main_yield_today', 90, { unit_of_measurement: 'Wh' }),
    'sensor.solar_main_voltage': s('sensor.solar_main_voltage', 13.8, { unit_of_measurement: 'V' }),
    'sensor.solar_secondary_power': s('sensor.solar_secondary_power', 4, { unit_of_measurement: 'W' }),
    'sensor.solar_secondary_yield_today': s('sensor.solar_secondary_yield_today', 12, { unit_of_measurement: 'Wh' }),
    'sensor.battery_soc': s('sensor.battery_soc', 78, { unit_of_measurement: '%', friendly_name: 'Hauptbatterie' }),
    'sensor.main_battery_soc': s('sensor.main_battery_soc', 78, { unit_of_measurement: '%' }),
    'sensor.main_battery_voltage': s('sensor.main_battery_voltage', 12.9, { unit_of_measurement: 'V' }),
    'sensor.main_battery_current': s('sensor.main_battery_current', 2.1, { unit_of_measurement: 'A' }),
    'sensor.motor_battery_soc': s('sensor.motor_battery_soc', 64, { unit_of_measurement: '%' }),
    'sensor.motor_battery_voltage': s('sensor.motor_battery_voltage', 12.6, { unit_of_measurement: 'V' }),
    'sensor.fridge_temperature': s('sensor.fridge_temperature', 6.4, { unit_of_measurement: '°C', friendly_name: 'Kühlschrank' }),
    'sensor.water_temperature': s('sensor.water_temperature', 18.2, { unit_of_measurement: '°C', friendly_name: 'Wasser' }),
    'sensor.boat_speed': s('sensor.boat_speed', 4.2, { unit_of_measurement: 'kn' }),
    'sensor.boat_heading': s('sensor.boat_heading', 118, { unit_of_measurement: '°' }),
    'device_tracker.boat': s('device_tracker.boat', 'not_home', { latitude: 51.3705, longitude: 7.4523 }),
    'switch.fridge': s('switch.fridge', 'on', { friendly_name: 'Kühlschrank' }),
    'switch.depth_sounder': s('switch.depth_sounder', 'off', { friendly_name: 'Echolot' }),
    'switch.nav_lights': s('switch.nav_lights', 'off', { friendly_name: 'Positionslicht' }),
    'switch.camera_power': s('switch.camera_power', 'on', { friendly_name: 'Kamera' }),
    'camera.mast': s('camera.mast', 'streaming', { friendly_name: 'Mast', entity_picture: '' }),
    'select.mast_ptz_preset': s('select.mast_ptz_preset', 'Steg', { options: ['Steg', 'Cockpit', 'Bug'] }),
  },
  callService: (d, srv, data) => {
    console.log('callService', d, srv, data);
    return Promise.resolve();
  },
  callWS: () => Promise.resolve({}),
};

function make(tag, config, target) {
  const el = document.createElement(tag);
  el.setConfig(config);
  el.hass = hass;
  document.getElementById(target).appendChild(el);
  return el;
}

make(
  'boat-card',
  {
    type: 'custom:boat-card',
    title: 'Hoppetosse',
    card_style: 'marine',
    variant: 'dock',
    show_variant_switch: true,
    chips: [
      {
        entity: 'sensor.solar_power',
        icon: 'mdi:solar-power',
        color: 'amber',
        positions: {
          dock: { x: 60, y: 28, dot: 'left' },
          sailing: { x: 55, y: 22, dot: 'left' },
          trailer: { x: 60, y: 30, dot: 'left' },
        },
      },
      {
        entity: 'sensor.battery_soc',
        icon: 'mdi:battery',
        color: 'green',
        positions: {
          dock: { x: 66, y: 58, dot: 'right' },
          sailing: { x: 60, y: 58, dot: 'right' },
          trailer: { x: 66, y: 60, dot: 'right' },
        },
      },
      {
        entity: 'sensor.water_temperature',
        icon: 'mdi:coolant-temperature',
        color: 'light-blue',
        positions: {
          dock: { x: 22, y: 74, dot: 'right' },
          sailing: { x: 18, y: 80, dot: 'right' },
          trailer: { x: 20, y: 86, dot: 'right', hidden: true },
        },
      },
    ],
    stats: [
      { entity: 'sensor.solar_main_yield_today', icon: 'mdi:flash', name: 'Ertrag' },
      { entity: 'sensor.solar_power', icon: 'mdi:solar-power', name: 'Solar' },
      { entity: 'sensor.battery_soc', icon: 'mdi:battery', name: 'Batterie' },
    ],
    gps: {
      speed: 'sensor.boat_speed',
      heading: 'sensor.boat_heading',
      location: 'device_tracker.boat',
    },
    controls: [
      { entity: 'switch.fridge', icon: 'mdi:fridge-outline', name: 'Kühlung' },
      { entity: 'switch.depth_sounder', icon: 'mdi:altimeter', name: 'Echolot' },
      { entity: 'switch.nav_lights', icon: 'mdi:lightbulb', name: 'Licht' },
      { entity: 'switch.camera_power', icon: 'mdi:cctv', name: 'Kamera' },
    ],
  },
  'col-main'
);

make(
  'boat-battery-card',
  {
    type: 'custom:boat-battery-card',
    title: 'Batterie & Solar',
    card_style: 'marine',
    main_battery: {
      name: 'Hauptbatterie',
      soc: 'sensor.main_battery_soc',
      voltage: 'sensor.main_battery_voltage',
      current: 'sensor.main_battery_current',
    },
    motor_battery: {
      name: 'Motorbatterie',
      soc: 'sensor.motor_battery_soc',
      voltage: 'sensor.motor_battery_voltage',
    },
    solar_main: {
      name: 'Solar Hauptmodul',
      power: 'sensor.solar_main_power',
      yield_today: 'sensor.solar_main_yield_today',
      voltage: 'sensor.solar_main_voltage',
    },
    solar_secondary: {
      name: 'Solar Zweitmodul',
      power: 'sensor.solar_secondary_power',
      yield_today: 'sensor.solar_secondary_yield_today',
    },
  },
  'col-side'
);

make(
  'boat-fridge-card',
  {
    type: 'custom:boat-fridge-card',
    title: 'Kühlschrank',
    card_style: 'marine',
    switch: 'switch.fridge',
    temperature: 'sensor.fridge_temperature',
  },
  'col-side'
);

make(
  'boat-camera-card',
  {
    type: 'custom:boat-camera-card',
    title: 'Kamera (Mast)',
    card_style: 'marine',
    camera: 'camera.mast',
    power: 'switch.camera_power',
    ptz: true,
    presets: 'select.mast_ptz_preset',
  },
  'col-side'
);

make(
  'boat-grafana-card',
  {
    type: 'custom:boat-grafana-card',
    title: 'Grafana',
    card_style: 'marine',
    url: 'https://grafana.example/d/abc/boot?orgId=1',
    height: 260,
  },
  'col-side'
);
