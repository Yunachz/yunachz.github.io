---
slug: aquasync-ph-stabilizer
title: AquaSync pH Stabilizer
summary: Dokumentasi sistem pemantauan pH berbasis ESP32 dengan pengaturan dua pompa melalui pulse dosing dan hysteresis.
category: Instrumentasi & Control
draft: false
featured: true
order: 20
tags:
  - ESP32
  - pH Sensing
  - Pulse Dosing
  - Hysteresis
  - Flask
cover: assets/projects/aquasync-ph-stabilizer.webp
alt: Rangkaian sensor, ESP32, dan pompa pada meja kerja; foto dari dokumentasi repositori publik AquaSync.
coverWidth: 720
coverHeight: 1280
repositoryUrl: https://github.com/Yunachz/aquasync-ph-stabilizer
sourceLinks:
  - label: README
    url: https://github.com/Yunachz/aquasync-ph-stabilizer/blob/main/README.md
  - label: Foto prototipe
    url: https://raw.githubusercontent.com/Yunachz/aquasync-ph-stabilizer/main/docs/images/prototype-1.png
  - label: Firmware
    url: https://github.com/Yunachz/aquasync-ph-stabilizer/blob/main/firmware/aquasync_firmware.ino
  - label: Server Flask
    url: https://github.com/Yunachz/aquasync-ph-stabilizer/blob/main/server/app.py
---

README repositori menjelaskan pemantauan pH air melalui ESP32 dan dua pompa asam/basa yang diatur memakai pulse dosing serta hysteresis. Dokumentasi juga membahas interlock pompa dan kalibrasi sensor.

Sebuah dashboard Flask didokumentasikan untuk menampilkan pembacaan dan status aktuator.

### Batas informasi

Audit dokumentasi ini belum menguji akurasi sensor, waktu stabilisasi, ataupun kualitas dan keamanan air.
