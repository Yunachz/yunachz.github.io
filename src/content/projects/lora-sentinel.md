---
slug: lora-sentinel
title: LoRaSentinel
summary: Dokumentasi pemantauan suhu dan kelembapan dari node DHT22 melalui LoRa ke gateway ESP32, dengan penerusan data dan dashboard.
category: Telemetri & IoT
draft: false
featured: true
order: 30
tags:
  - ESP32
  - LoRa
  - DHT22
  - Reed-Solomon
  - FastAPI
cover: assets/projects/lora-sentinel.webp
alt: Close-up modul Ra-02 dan papan ESP32 yang dipasang pada perfboard; foto dari dokumentasi repositori publik.
coverWidth: 1545
coverHeight: 1071
repositoryUrl: https://github.com/Yunachz/LoRaSentinel
sourceLinks:
  - label: README
    url: https://github.com/Yunachz/LoRaSentinel/blob/main/README.md
  - label: Foto prototipe
    url: https://raw.githubusercontent.com/Yunachz/LoRaSentinel/main/docs/hardware-implementation-gateway.png
  - label: Firmware gateway
    url: https://github.com/Yunachz/LoRaSentinel/blob/main/firmware/gateway/gateway_esp32.ino
  - label: Aplikasi server
    url: https://github.com/Yunachz/LoRaSentinel/blob/main/server/app.py
---

README repositori mendokumentasikan node sensor DHT22 yang mengirim data suhu dan kelembapan melalui LoRa menuju gateway ESP32. Dokumentasi menjelaskan koreksi galat Reed–Solomon, penerusan data melalui UDP, dan dashboard FastAPI.

### Batas informasi

Belum ada pengukuran jangkauan, packet loss, atau deployment aktif yang diverifikasi. README menyebut `server/server.py`, sementara tree repositori yang diaudit memuat `server/app.py`; instruksi setup tidak dinyatakan telah diuji.
