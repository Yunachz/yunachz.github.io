---
slug: smart-trash-bin
title: Smart Trash Bin
categoryIds:
  - iot
  - machine-learning
copy:
  id:
    summary: >-
      Klasifikasi sampah dengan EfficientNet-B3 di PC, terhubung melalui MQTT ke
      ESP32 untuk menggerakkan tutup kompartemen.
    paragraphs:
      - >-
        EfficientNet-B3 mengklasifikasikan gambar sampah di PC. Hasil
        klasifikasi dikirim melalui MQTT ke ESP32 untuk menggerakkan tutup
        kompartemen.
      - >-
        Sistem juga mencakup pemantauan kapasitas menggunakan sensor ultrasonik
        dan load cell, dengan dashboard Flask untuk menampilkan informasi.
    imageAlt: >-
      Kolase tempat sampah dengan kamera pada wadah dan rangkaian sensor di
      dalamnya.
  en:
    summary: >-
      Waste classification with EfficientNet-B3 on a PC, connected over MQTT to
      an ESP32 that operates compartment lids.
    paragraphs:
      - >-
        EfficientNet-B3 classifies waste images on a PC. Classification results
        travel over MQTT to an ESP32 that operates the compartment lids.
      - >-
        The system also includes capacity monitoring with ultrasonic sensors and
        a load cell, with a Flask dashboard for displaying information.
    imageAlt: A collage showing a waste bin with a mounted camera and sensors inside.
media:
  src: /assets/projects/smart-trash-bin.webp
  width: 289
  height: 410
  kind: photo
draft: false
featured: false
order: 40
tags:
  - ESP32
  - EfficientNet-B3
  - PyTorch
  - MQTT
  - Flask
repositoryUrl: 'https://github.com/Yunachz/Smart-Trash-Bin'
sourceLinks:
  - labelKey: readme
    url: 'https://github.com/Yunachz/Smart-Trash-Bin/blob/main/README.md'
  - labelKey: prototype
    url: >-
      https://raw.githubusercontent.com/Yunachz/Smart-Trash-Bin/main/docs/hardware-implementation.png
  - labelKey: esp32-firmware
    url: >-
      https://github.com/Yunachz/Smart-Trash-Bin/blob/main/firmware/smart-trash-bin-esp32.ino
  - labelKey: python-inference
    url: 'https://github.com/Yunachz/Smart-Trash-Bin/blob/main/vision/inference.py'
---
