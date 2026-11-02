# Panduan konten portfolio

Konten disimpan sebagai Markdown atau JSON terstruktur di `src/content/`; template Astro membangun HTML statis dari sana. Menambah, mengubah, atau menghapus satu entri proyek tidak mengharuskan perubahan layout. Jangan menambahkan peran, hasil ukur, pendidikan, pengalaman, keahlian, dokumen, atau kontak pribadi yang belum dikonfirmasi dan disetujui.

## Menambah atau mengubah proyek

1. Buat satu file Markdown di `src/content/projects/`, misalnya `pengatur-suhu.md`; nama file bukan URL publik.
2. Isi frontmatter berdasarkan contoh di bawah dan tulis ringkasan berbasis dokumentasi yang dapat dibaca publik. Tautkan README serta bukti lain yang benar-benar ada.
3. Entri baru otomatis menjadi draft (`draft: true`), tidak muncul di halaman, archive, filter, sitemap, atau rute publik. Setelah konten diperiksa dan boleh diterbitkan, set `draft: false`.
4. Gunakan `featured: true` hanya untuk proyek yang ingin ditampilkan di beranda. Batasnya diatur oleh `featuredLimit` pada `src/content/site/settings.json` (default 6, maksimal 6). Entri yang tidak featured tetap ada di archive.
5. Atur `order` bila urutan tertentu diperlukan; default `100`. Urutan seri dipecahkan memakai slug. Kategori adalah teks bebas dan bisa ditambah tanpa mengubah schema/template.
6. Jika menambah `cover`, simpan file yang benar-benar berasal dari proyek di `public/assets/projects/`, lalu isi `cover`, `alt`, `coverWidth`, dan `coverHeight` berdasarkan file aslinya. Alt menjelaskan yang terlihat dan dimensi intrinsik menjaga ruang gambar sebelum file tampil. Jika foto berasal dari repositori publik, tambahkan `sourceLinks` berlabel `Foto prototipe` dengan URL file sumber yang tepat. Cover harus menunjuk aset yang ada; jangan memakai foto stok sebagai bukti proyek atau membuat foto/diagram pengganti.
7. Periksa perubahan dengan `npm run check`, `npm test`, dan `npm run build`; lalu tinjau pratinjau lokal sebelum menerbitkan.

```yaml
---
slug: pengatur-suhu
title: Nama proyek yang benar
summary: Ringkasan singkat berdasarkan README atau dokumentasi yang tersedia.
category: Instrumentasi & Control
draft: true
featured: false
order: 100
tags:
  - ESP32
  - Sensor
cover: assets/projects/nama.webp
alt: Tampilan perangkat yang didokumentasikan pada repositori.
coverWidth: 1280
coverHeight: 720
repositoryUrl: https://github.com/Yunachz/nama-repositori
sourceLinks:
  - label: README
    url: https://github.com/Yunachz/nama-repositori/blob/main/README.md
  - label: Foto prototipe
    url: https://raw.githubusercontent.com/Yunachz/nama-repositori/main/docs/foto-prototipe.png
---

Penjelasan lanjutan dengan batas klaim yang jelas.
```

Hapus entri dengan menghapus file Markdown terkait. Jalankan semua pemeriksaan lagi agar slug route, archive, dan sitemap diperbarui dalam build berikutnya.

## Skema proyek

| Field | Aturan |
| --- | --- |
| `slug` | Wajib, unik lintas koleksi proyek, huruf kecil/kebab-case; membentuk `/projects/<slug>/`. |
| `title` | Wajib, teks non-kosong, maksimal 88 karakter. |
| `summary` | Wajib, teks non-kosong, maksimal 280 karakter; dipakai untuk kartu, detail, dan metadata. |
| `category` | Wajib, teks bebas non-kosong; nilai kategori, jumlah, dan filter dihitung dari proyek terbit. |
| `draft` | Default `true`; hanya `false` masuk ke beranda/arsip/filter/count/sitemap dan mendapat halaman detail statis. |
| `featured` | Default `false`; hanya proyek terbit yang featured ditampilkan di beranda, sampai batas `featuredLimit`. |
| `order` | Bilangan bulat opsional, default `100`; ascending, lalu slug. |
| `tags` | Daftar teks opsional, default kosong; gunakan istilah yang disebut dalam dokumentasi proyek. |
| `repositoryUrl`, `demoUrl` | Opsional; harus URL HTTPS. Tombol/link hilang jika nilainya tidak ada. |
| `cover`, `alt`, `coverWidth`, `coverHeight` | Opsional; cover harus berada di `public/assets/projects/`, aset harus ada, dan alt serta dimensi intrinsik positif wajib bersama cover. Untuk foto dari repo publik, cantumkan URL file sumber di `sourceLinks` dengan label `Foto prototipe`. |
| `sourceLinks` | Daftar label dan URL HTTPS opsional untuk README, source, atau bukti publik lainnya. |

Schema Astro di `src/content.config.ts` memeriksa struktur/type Markdown dan JSON saat check/build. `scripts/validate-content.mjs` menangani aturan lintas file yang perlu melihat seluruh koleksi: slug duplikat proyek, collision slug section, referensi proyek yang belum terbit, serta path aset lokal.

## Mengelola bagian profil lain

- `src/content/site/profile.json` menyimpan nama dan bidang yang terkonfirmasi. `summary`, `photo`, `photoAlt`, `cv`, dan `cvLabel` opsional. Foto lokal berada di `public/assets/profile/` dan memerlukan alt; CV lokal berada di `public/assets/documents/`, atau bisa memakai URL HTTPS.
- `src/content/site/contact.json` memiliki GitHub sebagai tautan utama; `email` dan `linkedin` opsional. Tombol untuk kanal opsional tidak dirender jika nilainya kosong.
- `src/content/site/settings.json` menyimpan `locale`, URL situs, dan `featuredLimit` (default 6, maksimal 6).
- Section naratif generik adalah satu file Markdown per entri di `src/content/sections/` dengan `title`, `slug`, `order`, dan `draft`. Konten yang terbit dirender oleh template section yang sama di beranda; slug harus unik dan tidak sama dengan anchor halaman.
- Item keahlian berada di `src/content/skills/*.json`: `name`, `category`, `context` (opsional), `projectSlugs` (opsional), `order` (default `100`), `draft` (default `true`). Item terbit hanya boleh menunjuk proyek yang juga terbit.
- Item pengalaman di `src/content/experience/*.json` memerlukan `organization`, `role`, `summary`; `period` opsional.
- Item pendidikan di `src/content/education/*.json` memerlukan `institution`, `program`; `summary` dan `period` opsional.
- Kredensial di `src/content/credentials/*.json` memerlukan `name` dan `issuer`; `issuedAt`, `verifyUrl`, dan dokumen opsional. Berkas lokal berada di `public/assets/documents/`.
- Koleksi profil tersebut memakai default draft sehingga tidak muncul sebelum ditandai `draft: false`. Template menyembunyikan section kosong; CV/email tidak muncul tanpa data.

Tambahkan entri baru ke file koleksi yang sudah ada untuk menambah daftar tanpa mengedit tata letak. Menambahkan jenis data atau perilaku baru—misalnya formulir, kalkulasi, atau desain section yang berbeda—memerlukan perubahan template, bukan sekadar menambah konten.

## QA konten

`npm test` menggunakan fixture sintetis dalam memori (bukan data publik situs) untuk memeriksa 1, 3, 10, dan 30 entri; aturan default; slug invalid/duplikat; asset, alt, dan dimensi cover invalid; sorting; serta pengecualian draft. Hanya berkas yang berada di `src/content/` dipertimbangkan oleh build situs.
