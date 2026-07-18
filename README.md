# ⛵ Boat Card

Eine **einzelne, voll konfigurierbare** Home-Assistant-Lovelace-Karte für ein
Segelboot — gleicher Aufbau und dieselben Styles wie
[HealthCard](https://github.com/BobMcGlobus/HealthCard) und
[Weatherglass](https://github.com/BobMcGlobus/Weatherglass).

Die Karte besteht aus einem Titel und einer Liste konfigurierbarer **Sektionen**.
Die Boot-Sektion ist das grafische Herzstück (Boot am Steg / unter Segeln / auf
dem Anhänger) mit frei platzierbaren **Chips**; alle weiteren Sektionen sind
Kacheln für Batterie, Solar, Kühlschrank, Kamera, Grafana oder beliebige Sensoren.

![one card, six styles](https://github.com/BobMcGlobus/Boat-Card)

---

## Installation

### HACS
1. HACS → ⋮ → **Custom repositories** → `https://github.com/BobMcGlobus/Boat-Card`, Typ **Dashboard**.
2. „Boat Card" installieren → HA neu laden. Ressource: `/hacsfiles/Boat-Card/boat-card.js` (Modul).

### Manuell
`npm install && npm run build` → `dist/boat-card.js` nach `config/www/` → als **JavaScript-Modul** einbinden.

---

## Styles

Wie HealthCard, per `card_style`:

| Wert | Look |
|------|------|
| `withings` | Weicher, getönter Standard (Default) |
| `default` | Schlichtes HA-Theme |
| `glass` | Liquid Glass (durchscheinend, Blur) |
| `material` | Material You (tonale Kacheln) |
| `bubble` | Frei schwebende Module |
| `mirror` | Magic Mirror (schwarz, hoher Kontrast) |

---

## Grundgerüst

```yaml
type: custom:boat-card
title: Hoppetosse
card_style: withings      # withings | default | glass | material | bubble | mirror
columns: 2                # Spalten fürs Kachel-Grid (Boot/Kamera/Grafana sind voll breit)
sections:
  - type: boat
    # …
  - type: battery
    # …
```

Weitere Karten-Optionen: `subtitle`, `layout: grid|carousel`, `tiles: false`
(flach statt Kacheln), `flush: true` (ohne Rand), `background: false`.

---

## Sektionen

Jede Sektion hat `type`, optional `name`, `icon`, `color` (Akzent) und
`full_width`. Dazu die typ-spezifischen Felder:

### `boat` — Hero-Bild mit Chips
```yaml
- type: boat
  variant: dock                 # dock | sailing | trailer
  variant_entity: sensor.boat_status   # optional: Ansicht aus Entität
  show_variant_switch: true
  images:                       # optional eigene Renders/Fotos
    dock: /local/boat/dock.png
    sailing: /local/boat/sailing.png
    trailer: /local/boat/trailer.png
  chips:
    - entity: sensor.victron_solar_power
      icon: mdi:solar-power
      color: amber
      positions:
        dock:    { x: 58, y: 26, dot: left }
        sailing: { x: 55, y: 22, dot: left }
        trailer: { x: 58, y: 30, dot: left }
    - entity: sensor.main_battery_soc
      entity2: sensor.water_temperature   # -> "78 / 18,2"
      icon: mdi:battery
      positions:
        dock: { x: 40, y: 66, dot: right }
  gps:
    speed: sensor.boat_speed
    heading: sensor.boat_heading
    location: device_tracker.boat   # lat/lon aus Attributen (oder lat:/lon: Sensoren)
    speed_unit: kn
  controls:                     # ESPHome-Aktoren als Toggle-Reihe
    - { entity: switch.fridge, icon: mdi:fridge-outline, name: Kühlung }
    - { entity: switch.depth_sounder, icon: mdi:altimeter, name: Echolot }
    - { entity: switch.nav_lights, icon: mdi:lightbulb, name: Licht }
    - { entity: switch.camera_power, icon: mdi:cctv, name: Kamera }
```

**Chips pro Ansicht:** jeder Chip hat einen `positions`-Block mit einer eigenen
Position (`x`/`y` = Prozent, `dot` = Label-Richtung) **je Ansicht**. Fehlt eine
Ansicht, greift `x`/`y`/`dot` direkt am Chip; `hidden: true` blendet den Chip in
einer Ansicht aus.

### `battery`
```yaml
- type: battery
  name: Hauptbatterie
  soc: sensor.main_battery_soc         # Balken färbt grün/gelb/rot
  voltage: sensor.main_battery_voltage
  current: sensor.main_battery_current
  power: sensor.main_battery_power
  temperature: sensor.main_battery_temp
  time_remaining: sensor.main_battery_ttg
```

### `solar` (Victron)
```yaml
- type: solar
  name: Solar Hauptmodul
  power: sensor.victron_main_pv_power
  yield_today: sensor.victron_main_yield_today
  voltage: sensor.victron_main_pv_voltage
  state: sensor.victron_main_charger_state   # bulk/absorption/float
```

### `fridge`
```yaml
- type: fridge
  switch: switch.fridge          # ESPHome-Aktor
  temperature: sensor.fridge_temperature
  target: number.fridge_setpoint # optional
  power: sensor.fridge_power       # optional
```

### `camera` (Reolink PTZ)
```yaml
- type: camera
  camera: camera.mast_fluent
  switch: switch.camera_power     # optional: Aktor, der die Kamera versorgt
  ptz: true                       # PTZ-Buttons (auto-erkannt: button.*_ptz_*)
  presets: select.mast_ptz_preset
  aspect_ratio: "16:9"
```
PTZ-Buttons werden automatisch gefunden; bei Bedarf explizit via `ptz_buttons: {left, right, up, down, zoom_in, zoom_out}`.

### `grafana`
```yaml
- type: grafana
  url: https://grafana.local/d/abc/boot?orgId=1&panelId=4
  height: 420
  auto_params: true    # hängt &kiosk & &theme= an
```

### `sensor` (generische Wert-Kachel)
```yaml
- type: sensor
  name: Wassertemperatur
  entity: sensor.water_temperature
  icon: mdi:coolant-temperature
  precision: 1
```

---

## Visueller Editor

Alles ist im **UI-Editor** einstellbar — kein YAML nötig:
- Karten-Optionen oben, darunter die **Sektionsliste** (hinzufügen / löschen / sortieren).
- Für die Boot-Sektion: **Chips per Drag** aufs Boot ziehen; Tabs *Steg / Segeln /
  Anhänger* setzen die Position je Ansicht. Der gezogene Punkt ist exakt der
  Ankerpunkt (WYSIWYG).

---

## Passt zu eurer Hardware

Ecowitt WittBoy + Wassertemp → Chips/`sensor` · Haupt-/Motorbatterie → `battery` ·
Victron (2 Module) → `solar` · Reolink PTZ → `camera` · 4 ESPHome-Aktoren →
`controls` in der Boot-Sektion · GPS (Position + Speed) → `gps` in der Boot-Sektion.

Boot-Bilder nach `config/www/boat/` legen und in `images:` referenzieren — ohne
eigene Bilder zeichnet die Karte ein eingebautes SVG-Boot.

---

## Entwicklung

**Node ≥ 18** (Vite 5), z. B. `nvm use 20`.

```bash
npm install
npm run dev       # Galerie (6 Styles): http://localhost:5173/
                  # Editor-Vorschau:     http://localhost:5173/editor.html
npm run build     # -> dist/boat-card.js
npx tsc --noEmit  # Typecheck
```

Stack: TypeScript + Lit + Vite, gebündelt in eine Datei. Getestet: alle 6 Styles,
mehrfacher Re-Render (`hass`-Update-Pfad), visueller Chip-Editor (Drag,
Hinzufügen/Löschen, WYSIWYG-Anker), Sektions-Verwaltung.
