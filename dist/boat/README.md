# Boot-Bilder / boat images

Lege hier deine drei Render-/Fotovarianten des Bootes ab (transparente PNGs
empfohlen). Referenziere sie in der Karte über `images:`:

```yaml
images:
  dock: /local/boat/dock.png
  sailing: /local/boat/sailing.png
  trailer: /local/boat/trailer.png
```

- **Home Assistant-Pfad:** Dateien nach `config/www/boat/` kopieren →
  erreichbar unter `/local/boat/<name>.png`.
- **HACS-Pfad:** Dateien in `dist/boat/` legen (werden mit ausgeliefert) →
  erreichbar unter `/hacsfiles/boat-card/boat/<name>.png`.

Ohne `images:` zeichnet die Karte ein eingebautes SVG-Boot als Platzhalter.
