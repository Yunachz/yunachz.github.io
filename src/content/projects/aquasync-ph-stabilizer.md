---
slug: aquasync-ph-stabilizer
title: AquaSync pH Stabilizer
categoryIds:
  - control-systems
copy:
  id:
    summary: >-
      Pemantauan pH air berbasis ESP32 dengan dua pompa asam/basa yang diatur
      melalui pulse dosing dan hysteresis.
    paragraphs:
      - >-
        Sistem ini membaca pH air melalui ESP32 dan mengatur dua pompa asam/basa
        memakai pulse dosing serta hysteresis. Rancangannya juga mencakup
        interlock pompa dan kalibrasi sensor.
      - >-
        Dashboard Flask menampilkan pembacaan pH dan status aktuator untuk
        memantau sistem.
    imageAlt: 'Rangkaian sensor, ESP32, dan pompa pada meja kerja.'
  en:
    summary: >-
      ESP32-based water pH monitoring with acid and base pumps controlled
      through pulse dosing and hysteresis.
    paragraphs:
      - >-
        The system reads water pH through an ESP32 and controls acid and base
        pumps using pulse dosing and hysteresis. The design also includes a pump
        interlock and sensor calibration.
      - >-
        A Flask dashboard displays pH readings and actuator status for system
        monitoring.
    imageAlt: 'Sensors, an ESP32, and pumps arranged on a workbench.'
media:
  src: /assets/projects/aquasync-ph-stabilizer.webp
  width: 720
  height: 1280
  kind: photo
draft: false
featured: true
order: 20
tags:
  - ESP32
  - pH Sensing
  - Pulse Dosing
  - Hysteresis
  - Flask
repositoryUrl: 'https://github.com/Yunachz/aquasync-ph-stabilizer'
sourceLinks:
  - labelKey: readme
    url: 'https://github.com/Yunachz/aquasync-ph-stabilizer/blob/main/README.md'
  - labelKey: prototype
    url: >-
      https://raw.githubusercontent.com/Yunachz/aquasync-ph-stabilizer/main/docs/images/prototype-1.png
  - labelKey: firmware
    url: >-
      https://github.com/Yunachz/aquasync-ph-stabilizer/blob/main/firmware/aquasync_firmware.ino
  - labelKey: flask
    url: 'https://github.com/Yunachz/aquasync-ph-stabilizer/blob/main/server/app.py'
---
