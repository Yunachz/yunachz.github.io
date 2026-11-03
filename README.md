# Muhammad Fajar Sodik  Portfolio

Portfolio statis berbasis Astro untuk https://yunachz.github.io/. Konten bilingual Indonesia/English disimpan sebagai Markdown dan JSON di src/content/, sedangkan layout serta interaksi berada di src/components/, src/lib/, src/scripts/, dan src/styles/.

Data profil, proyek, keahlian, perangkat lunak, pengalaman, pendidikan, sertifikat, dan kontak berasal dari sumber yang diaudit. Situs mempertahankan nama, nilai GPA 3.72 tanpa skala atau semester, foto profil, kontak, serta CV yang disediakan. Ilustrasi sementara hanya dipakai pada slot media yang belum memiliki dokumentasi visual; alt text menjelaskan batas gambar tersebut.

## Pengembangan lokal

Gunakan Node.js 24 dan npm:

    npm install
    npm run validate-content
    npm run check
    npm test
    npm run build
    npm run preview

Pratinjau produksi lokal tersedia di http://127.0.0.1:4321/. Untuk struktur data, terjemahan, dan media, baca docs/CONTENT-GUIDE.md.

## Struktur

- src/content/ menyimpan koleksi yang dirender Astro.
- src/lib/project-categories.json adalah registry label kategori proyek untuk kedua bahasa.
- src/lib/i18n.ts menyimpan salinan antarmuka ID/EN.
- public/assets/ menyimpan foto, ilustrasi sementara, ikon software, dan CV.
- scripts/v3-content-validation.mjs memvalidasi relasi lintas koleksi dan aset lokal.
- tests/ mengunci fakta baseline yang disetujui serta memastikan penambahan data tidak perlu mengubah renderer.

Astro menghasilkan file statis di dist/. Konfigurasi saat ini memakai root base untuk user site Yunachz/yunachz.github.io. Workflow GitHub Pages membangun branch main atau dapat dijalankan manual.
