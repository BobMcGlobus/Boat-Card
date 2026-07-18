# ⛵ Boat Card

Eine Familie von Home-Assistant-Lovelace-Karten für ein Segelboot — im
gleichen Stil wie [Weatherglass](https://github.com/BobMcGlobus/Weatherglass)
und [HealthCard](https://github.com/BobMcGlobus/HealthCard).

Enthält fünf Karten in **einer** Bundle-Datei (`boat-card.js`):

| Karte | Typ | Zweck |
|-------|-----|-------|
| **Übersicht** | `custom:boat-card` | Grafische Boot-Ansicht (3 Bildvarianten) mit frei platzierbaren Chips, Stats-Zeile, Aktor-Steuerung und GPS |
| **Batterie & Solar** | `custom:boat-battery-card` | Haupt- & Motorbatterie, Victron-Solar Haupt-/Zweitmodul |
| **Kühlschrank** | `custom:boat-fridge-card` | Kühlschrank-Strom (An/Aus) + Temperatur |
| **Kamera** | `custom:boat-camera-card` | Reolink-Livebild + PTZ + Presets |
| **Grafana** | `custom:boat-grafana-card` | Eingebettetes Grafana-Dashboard |

---

## Installation

### HACS (empfohlen)
1. HACS → *Frontend* → ⋮ → *Custom repositories* → dieses Repo als **Dashboard/Lovelace** hinzufügen.
2. „Boat Card" installieren. Die Ressource `…/boat-card.js` wird automatisch registriert.

### Manuell
1. `npm install && npm run build`
2. `dist/boat-card.js` nach `config/www/` kopieren.
3. In den Dashboard-Ressourcen eintragen: `/local/boat-card.js` als **JavaScript-Modul**.

---

## Boot-Bilder

Die Übersichtskarte kennt drei Ansichten: **`dock`** (am Steg), **`sailing`**
(unter Segeln), **`trailer`** (auf dem Anhänger). Eigene Bilder werden über
`images:` gesetzt (siehe [`public/boat/README.md`](public/boat/README.md)).
Ohne eigene Bilder zeichnet die Karte ein eingebautes SVG-Boot.

Die aktive Ansicht kann
- **fix** gesetzt werden (`variant: dock`),
- aus einer **Entität** abgeleitet werden (`variant_entity:` + optional `variant_map:`),
- oder per **Umschalter** oben rechts im Bild manuell gewechselt werden (`show_variant_switch: true`).

---

## Chips — pro Bildvariante positionierbar

> **Visueller Editor:** Chips, Werte-Zeile und Aktoren lassen sich vollständig
> im **UI-Editor** der Karte einstellen — kein YAML nötig. Im Chip-Bereich
> ziehst du die Punkte direkt auf das Boot; über die Tabs *Steg / Segeln /
> Anhänger* legst du pro Ansicht eigene Positionen fest. Das YAML unten
> beschreibt dasselbe für alle, die es lieber tippen.

Wie die Anchors auf der HealthCard, aber mit **je einer Position pro Ansicht**.
Jeder Chip hat einen `entity` und einen `positions`-Block. Position = Prozent
der Bildfläche (`x`/`y`, 0–100). `dot` legt die Richtung des Labels relativ zum
Punkt fest (`left`, `right`, `top`, `bottom`, `top-left`, …). Fehlt eine
Ansicht in `positions`, greift der Fallback `x`/`y`/`dot` am Chip; mit
`hidden: true` wird ein Chip in einer Ansicht ausgeblendet.

```yaml
type: custom:boat-card
title: Hoppetosse
card_style: marine        # marine (blau) | glass | default
variant: dock
show_variant_switch: true
images:
  dock: /local/boat/dock.png
  sailing: /local/boat/sailing.png
  trailer: /local/boat/trailer.png

chips:
  - entity: sensor.victron_solar_power
    icon: mdi:solar-power
    color: amber
    positions:
      dock:    { x: 60, y: 28, dot: left }
      sailing: { x: 55, y: 22, dot: left }
      trailer: { x: 60, y: 30, dot: left }
  - entity: sensor.main_battery_soc
    icon: mdi:battery
    color: green
    positions:
      dock:    { x: 40, y: 70, dot: right }
      sailing: { x: 42, y: 66, dot: right }
      trailer: { x: 40, y: 72, dot: right }
  - entity: sensor.water_temperature
    entity2: sensor.wittboy_temperature   # -> "18,2 / 24,1"
    icon: mdi:coolant-temperature
    color: light-blue
    positions:
      dock:    { x: 20, y: 84, dot: top-right }
      sailing: { x: 18, y: 82, dot: top-right }
      trailer: { hidden: true, x: 0, y: 0 }

stats:                     # kompakte Werte-Zeile unter dem Bild
  - { entity: sensor.victron_yield_today, icon: mdi:flash, name: Ertrag }
  - { entity: sensor.victron_solar_power, icon: mdi:solar-power, name: Solar }
  - { entity: sensor.main_battery_soc, icon: mdi:battery, name: Batterie }

gps:
  speed: sensor.boat_speed
  heading: sensor.boat_heading
  location: device_tracker.boat     # nutzt latitude/longitude-Attribute
  # alternativ:
  # lat: sensor.boat_latitude
  # lon: sensor.boat_longitude
  speed_unit: kn

controls:                  # ESPHome-Aktoren als Toggle-Reihe
  - { entity: switch.fridge, icon: mdi:fridge-outline, name: Kühlung }
  - { entity: switch.depth_sounder, icon: mdi:altimeter, name: Echolot }
  - { entity: switch.nav_lights, icon: mdi:lightbulb, name: Licht }
  - { entity: switch.camera_power, icon: mdi:cctv, name: Kamera }
```

> **Tipp zum Platzieren:** Umschalter einblenden, gewünschte Ansicht wählen und
> die `x`/`y`-Werte iterativ anpassen — die Karte aktualisiert live.

---

## Batterie & Solar

```yaml
type: custom:boat-battery-card
title: Batterie & Solar
main_battery:
  name: Hauptbatterie
  soc: sensor.main_battery_soc
  voltage: sensor.main_battery_voltage
  current: sensor.main_battery_current
  power: sensor.main_battery_power
  temperature: sensor.main_battery_temperature
  time_remaining: sensor.main_battery_time_to_go
motor_battery:
  name: Motorbatterie
  soc: sensor.motor_battery_soc
  voltage: sensor.motor_battery_voltage
solar_main:
  name: Solar Hauptmodul
  power: sensor.victron_main_pv_power
  yield_today: sensor.victron_main_yield_today
  voltage: sensor.victron_main_pv_voltage
  state: sensor.victron_main_charger_state   # bulk/absorption/float
solar_secondary:
  name: Solar Zweitmodul
  power: sensor.victron_second_pv_power
  yield_today: sensor.victron_second_yield_today
```

Der Ladezustand färbt sich grün / gelb / rot und bekommt einen Fortschrittsbalken.

---

## Kühlschrank

```yaml
type: custom:boat-fridge-card
title: Kühlschrank
switch: switch.fridge            # ESPHome-Aktor (Pflicht)
temperature: sensor.fridge_temperature
target: number.fridge_setpoint   # optional
power: sensor.fridge_power        # optional
```

---

## Kamera (Reolink PTZ)

```yaml
type: custom:boat-camera-card
title: Kamera (Mast)
camera: camera.mast_fluent        # Pflicht
power: switch.camera_power        # optional (ESPHome-Aktor)
ptz: true
presets: select.mast_ptz_preset   # Reolink-Preset-Select
aspect_ratio: "16:9"
```

**PTZ-Buttons** werden automatisch erkannt: die Karte sucht
`button.*_ptz_left/right/up/down/zoom_in/zoom_out` und nimmt die Gruppe, deren
Name am besten zur Kamera passt. Falls die Zuordnung nicht passt, explizit setzen:

```yaml
ptz_buttons:
  left: button.mast_ptz_left
  right: button.mast_ptz_right
  up: button.mast_ptz_up
  down: button.mast_ptz_down
  zoom_in: button.mast_ptz_zoom_in
  zoom_out: button.mast_ptz_zoom_out
```

Das Livebild nutzt das eingebaute `ha-camera-stream` (Klick öffnet den
HA-Kameradialog).

---

## Grafana

```yaml
type: custom:boat-grafana-card
title: Grafana
url: https://grafana.local/d/abc123/boot?orgId=1&panelId=4
height: 420
auto_params: true    # hängt &kiosk und &theme=light|dark automatisch an
show_open: true      # Button „in neuem Tab öffnen"
```

`theme` folgt dem Hell-/Dunkel-Modus des Browsers. Voraussetzung: Grafana
erlaubt das Einbetten (`allow_embedding = true`) bzw. passendes
`X-Frame-Options`/CSP.

---

## Passt zu eurer Hardware

- **Ecowitt WittBoy + Wassertemperatur** → als Chips/Stats (`entity`, optional `entity2`).
- **Haupt- & Motorbatterie** → Batterie-Karte.
- **Victron Solar (2 Module)** → Batterie-Karte (`solar_main`, `solar_secondary`).
- **Reolink PTZ (Mast)** → Kamera-Karte.
- **4 ESPHome-Aktoren** (Kühlschrank, Echolot, Kamera, Positionslicht) → `controls:` in der Übersicht bzw. die Kühlschrank-/Kamera-Karte.
- **GPS (Position + Speed)** → `gps:` in der Übersicht.

---

## Entwicklung

**Node ≥ 18 erforderlich** (Vite 5). Per nvm z. B. `nvm use 20`.

```bash
npm install
npm run dev       # Karten-Galerie:  http://localhost:5173/          (dev/demo.js)
                  # Editor-Vorschau: http://localhost:5173/editor.html (dev/editor-demo.js)
npm run build     # -> dist/boat-card.js
npx tsc --noEmit  # optionaler Typecheck (Vite/esbuild prüft Typen nicht)
```

Stack: TypeScript + Lit + Vite, gebündelt in eine Datei. Build + Typecheck
laufen sauber durch; die Karten wurden im Dev-Harness getestet: mehrfacher
Re-Render (der `hass`-Update-Pfad), Varianten-Umschaltung und der visuelle
Chip-Editor (Drag-Platzierung, Hinzufügen/Löschen, Feld-Editieren).

Hell/Dunkel folgt dem **Home-Assistant-Theme** (`hass.themes.darkMode`), nicht
dem Betriebssystem.
