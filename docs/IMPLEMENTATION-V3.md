# Implementasi V3

Implementasi menggunakan Astro Content Collections dan menghasilkan situs statis. HomePageV3 membaca profil, proyek, skills, software, pengalaman, pendidikan, dan sertifikat dari koleksi. Route detail proyek statis menyediakan fallback URL untuk setiap proyek.

## Kontrak data

- copy.id dan copy.en menyimpan seluruh konten yang tampil dalam dua bahasa.
- src/lib/project-categories.json menjadi registry label dan urutan kategori; filter memakai kategori proyek yang benar-benar ada.
- src/content.config.ts memvalidasi struktur record, bilingual array, media, dan tanggal.
- scripts/v3-content-validation.mjs memvalidasi hubungan antar-koleksi dan aset lokal serta menerima penambahan data sesuai schema.
- Profile menjadi sumber GPA, bahasa, portrait, lokasi, dan PDF per bahasa dokumen.
- Placeholder memakai ilustrasi lokal dengan alt text yang menyatakan gambar bukan dokumentasi kegiatan, prototipe, atau scan sertifikat.

## Antarmuka

- Tema tersimpan di local storage; animasi lingkaran View Transition berasal dari ikon tema, dengan fallback untuk reduced motion dan browser tanpa dukungan.
- Bahasa ID/EN tersimpan dan diterapkan ke salinan antarmuka, status dialog, aria-label, dan isi bilingual.
- Proyek memakai carousel horizontal dengan kontrol manual, drag/swipe, filter kategori, jeda gerak, dan dialog proyek pada halaman yang sama.
- Pengalaman memakai galeri manual melingkar; tidak ada autoplay. Detail berada di bawah gambar.
- Skills membuka detail melalui accordion horizontal dan software memakai ikon lokal dengan monogram sebagai fallback.
- Dialog CV memilih bahasa dokumen sebelum membuka PDF. Link unduh hanya tampil setelah pilihan bahasa.
- Kartu sertifikat bersifat statis. Kontak email dapat menyalin alamat atau membuka mail client.

Catatan QA aktual dan status penerimaan disimpan terpisah di docs/QA-V3.md.
