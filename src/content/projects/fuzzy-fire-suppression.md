---
slug: fuzzy-fire-suppression
title: Fuzzy Fire Suppression
categoryIds:
  - control-systems
copy:
  id:
    summary: >-
      Prototipe ESP32 yang memakai logika fuzzy Mamdani untuk mengatur kipas,
      pompa, dan alarm dari pembacaan sensor.
    paragraphs:
      - >-
        Prototipe ini membaca suhu, kelembapan, asap, dan api, lalu mengolahnya
        dengan logika fuzzy Mamdani. Inferensi C++ berjalan pada ESP32 untuk
        mengatur kipas, pompa, dan alarm.
      - >-
        Rancangan proyek mencakup desain FIS, diagram pengawatan, dan susunan
        komponen prototipe.
    imageAlt: >-
      Prototipe ESP32 dengan sensor asap, buzzer, konverter daya, dan driver
      motor.
  en:
    summary: >-
      An ESP32 prototype using Mamdani fuzzy logic to control a fan, pump, and
      alarm from sensor readings.
    paragraphs:
      - >-
        The prototype reads temperature, humidity, smoke, and flame sensors,
        then processes the inputs using Mamdani fuzzy logic. C++ inference runs
        on the ESP32 to control a fan, pump, and alarm.
      - >-
        The project includes an FIS design, a wiring diagram, and the
        prototype’s component layout.
    imageAlt: >-
      ESP32 prototype with a smoke sensor, buzzer, power converter, and motor
      driver.
media:
  src: /assets/projects/fuzzy-fire-suppression.webp
  width: 760
  height: 570
  kind: photo
draft: false
featured: true
order: 10
tags:
  - ESP32
  - C++
  - Mamdani Fuzzy
  - PWM
  - MATLAB FIS
repositoryUrl: 'https://github.com/Yunachz/Fuzzy-Fire-Suppression'
sourceLinks:
  - labelKey: readme
    url: 'https://github.com/Yunachz/Fuzzy-Fire-Suppression/blob/main/README.md'
  - labelKey: prototype
    url: >-
      https://raw.githubusercontent.com/Yunachz/Fuzzy-Fire-Suppression/main/docs/images/03_prototype_top_labeled.png
  - labelKey: esp32-firmware
    url: >-
      https://github.com/Yunachz/Fuzzy-Fire-Suppression/blob/main/firmware/fuzzy_fire_system.ino
  - labelKey: fis-design
    url: >-
      https://github.com/Yunachz/Fuzzy-Fire-Suppression/blob/main/fuzzy_design/fuzzy-system.fis
---
