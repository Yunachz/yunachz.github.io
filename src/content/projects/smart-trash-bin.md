---
slug: smart-trash-bin
title: Smart Trash Bin
summary: Dokumentasi pemilahan sampah dengan klasifikasi EfficientNet-B3 di PC, penggerak kompartemen ESP32, pemantauan kapasitas, dan dashboard.
category: IoT & Computer Vision
draft: false
featured: false
order: 40
tags:
  - ESP32
  - EfficientNet-B3
  - PyTorch
  - MQTT
  - Flask
cover: assets/projects/smart-trash-bin.webp
alt: Kolase dokumentasi tempat sampah dengan kamera pada wadah dan rangkaian sensor di dalamnya; foto dari repositori publik.
coverWidth: 289
coverHeight: 410
repositoryUrl: https://github.com/Yunachz/Smart-Trash-Bin
sourceLinks:
  - label: README
    url: https://github.com/Yunachz/Smart-Trash-Bin/blob/main/README.md
  - label: Foto prototipe
    url: https://raw.githubusercontent.com/Yunachz/Smart-Trash-Bin/main/docs/hardware-implementation.png
  - label: Firmware ESP32
    url: https://github.com/Yunachz/Smart-Trash-Bin/blob/main/firmware/smart-trash-bin-esp32.ino
  - label: Inferensi Python
    url: https://github.com/Yunachz/Smart-Trash-Bin/blob/main/vision/inference.py
---

README repositori menjelaskan klasifikasi gambar sampah menggunakan EfficientNet-B3 di PC. Hasil klasifikasi dikirim melalui MQTT ke ESP32 untuk menggerakkan tutup kompartemen.

Dokumentasi juga membahas pemantauan kapasitas menggunakan sensor ultrasonik dan load cell, serta dashboard Flask.

### Batas informasi

Inferensi didokumentasikan berjalan di PC, bukan seluruhnya di ESP32. Angka akurasi pada README tidak direproduksi oleh audit ini.
