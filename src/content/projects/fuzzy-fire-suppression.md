---
slug: fuzzy-fire-suppression
title: Fuzzy Fire Suppression
summary: Dokumentasi prototipe ESP32 yang mengolah input sensor dengan logika fuzzy Mamdani untuk mengendalikan kipas, pompa, dan alarm.
category: Embedded & Control
draft: false
featured: true
order: 10
tags:
  - ESP32
  - C++
  - Mamdani Fuzzy
  - PWM
  - MATLAB FIS
cover: assets/projects/fuzzy-fire-suppression.webp
alt: Prototipe ESP32 dengan sensor asap, buzzer, konverter daya, dan driver motor; foto dari dokumentasi repositori publik.
coverWidth: 760
coverHeight: 570
repositoryUrl: https://github.com/Yunachz/Fuzzy-Fire-Suppression
sourceLinks:
  - label: README
    url: https://github.com/Yunachz/Fuzzy-Fire-Suppression/blob/main/README.md
  - label: Foto prototipe
    url: https://raw.githubusercontent.com/Yunachz/Fuzzy-Fire-Suppression/main/docs/images/03_prototype_top_labeled.png
  - label: Firmware ESP32
    url: https://github.com/Yunachz/Fuzzy-Fire-Suppression/blob/main/firmware/fuzzy_fire_system.ino
  - label: Desain FIS
    url: https://github.com/Yunachz/Fuzzy-Fire-Suppression/blob/main/fuzzy_design/fuzzy-system.fis
---

README repositori menjelaskan prototipe ESP32 dengan sensor suhu dan kelembapan, asap, serta api. Logika fuzzy Mamdani digunakan untuk mengatur kipas, pompa, dan alarm; inferensi C++ berjalan pada mikrokontroler.

Repositori juga menyertakan rancangan FIS, wiring, dan dokumentasi visual prototipe.

### Batas informasi

Dokumentasi prototipe dan rancangan kontrol bukan bukti sertifikasi proteksi kebakaran atau efektivitas pemadaman di kondisi nyata.
