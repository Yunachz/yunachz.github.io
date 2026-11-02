# Portfolio Muhammad Fajar Sodik

Portfolio Astro statis untuk `https://yunachz.github.io/`. Konten proyek, profil, serta daftar lain berada di Content Collections, terpisah dari template. HTML utama sudah dirender saat build; JavaScript hanya menambah kontrol tema, menu mobile, dan filter arsip.

Empat foto perangkat diproses menjadi WebP lokal dari file yang sama di repositori publik masing-masing, disertai alt text dan tautan sumber. Portfolio tidak membuat potret, CV, email, riwayat, atau hasil ukur yang belum diberikan.

## Menjalankan lokal

Gunakan Node.js 24 dan npm:

```sh
npm install
npm run check
npm test
npm run build
npm run preview
```

Pratinjau produksi lokal berjalan di `http://127.0.0.1:4321/`. Gunakan `docs/CONTENT-GUIDE.md` untuk menambah, mengedit, dan menghapus data tanpa mengubah layout.

## Build dan GitHub Pages

Astro mengeluarkan website ke `dist/`. `.github/workflows/deploy.yml` membangun dan mengunggah hasil build itu ke environment GitHub Pages ketika dijalankan pada branch `main` atau secara manual. Source, panduan, dan data pribadi yang tidak disetujui tidak menjadi isi artifact.

`astro.config.mjs` saat ini memakai root base (`/`) karena targetnya user site `Yunachz/yunachz.github.io`. Jika deployment diubah menjadi project site, set `base` ke `/<nama-repo>/`; tautan internal, canonical, favicon, sitemap, dan robots menggunakan helper sadar-base.
