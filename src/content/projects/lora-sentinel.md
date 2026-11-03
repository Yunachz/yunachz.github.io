---
slug: lora-sentinel
title: LoRaSentinel
categoryIds:
  - iot
copy:
  id:
    summary: >-
      Pemantauan suhu dan kelembapan dari sensor DHT22 melalui LoRa ke gateway
      ESP32 dan dashboard FastAPI.
    paragraphs:
      - >-
        Node sensor DHT22 mengirim data suhu dan kelembapan melalui LoRa menuju
        gateway ESP32. Alur komunikasinya mencakup koreksi galat Reed–Solomon
        dan penerusan data melalui UDP.
      - Dashboard FastAPI menjadi antarmuka untuk menampilkan data telemetri.
    imageAlt: Modul Ra-02 dan papan ESP32 yang dipasang pada perfboard.
  en:
    summary: >-
      Temperature and humidity monitoring from DHT22 sensors over LoRa to an
      ESP32 gateway and a FastAPI dashboard.
    paragraphs:
      - >-
        DHT22 sensor nodes send temperature and humidity data over LoRa to an
        ESP32 gateway. The communication flow includes Reed–Solomon error
        correction and data forwarding over UDP.
      - >-
        A FastAPI dashboard provides an interface for viewing the telemetry
        data.
    imageAlt: A Ra-02 module and an ESP32 board mounted on perfboard.
media:
  src: /assets/projects/lora-sentinel.webp
  width: 1545
  height: 1071
  kind: photo
draft: false
featured: true
order: 30
tags:
  - ESP32
  - LoRa
  - DHT22
  - Reed-Solomon
  - FastAPI
repositoryUrl: 'https://github.com/Yunachz/LoRaSentinel'
sourceLinks:
  - labelKey: readme
    url: 'https://github.com/Yunachz/LoRaSentinel/blob/main/README.md'
  - labelKey: prototype
    url: >-
      https://raw.githubusercontent.com/Yunachz/LoRaSentinel/main/docs/hardware-implementation-gateway.png
  - labelKey: gateway-firmware
    url: >-
      https://github.com/Yunachz/LoRaSentinel/blob/main/firmware/gateway/gateway_esp32.ino
  - labelKey: server
    url: 'https://github.com/Yunachz/LoRaSentinel/blob/main/server/app.py'
---
