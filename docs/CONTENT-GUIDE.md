# Panduan konten V3

Astro membangun halaman dari data Markdown dan JSON di src/content/. Penambahan entri pada koleksi yang sudah ada tidak memerlukan perubahan layout. Setiap teks yang tampil harus tersedia dalam bahasa Indonesia dan Inggris dengan makna yang setara. Jangan menambahkan jabatan, hasil ukur, tingkat kemahiran, penerbit, tanggal, dokumen, atau fakta lain yang belum didukung sumber.

## Proyek

Buat satu file Markdown di src/content/projects/. Struktur frontmatter ringkas:

    slug: pengatur-suhu
    title: Nama proyek yang benar
    categoryIds:
      - control-systems
    copy:
      id:
        summary: Ringkasan singkat.
        paragraphs:
          - Penjelasan berdasarkan dokumentasi proyek.
        imageAlt: Perangkat yang terlihat pada foto proyek.
      en:
        summary: Short summary.
        paragraphs:
          - Explanation supported by project documentation.
        imageAlt: Device shown in the project photograph.
    media:
      src: /assets/projects/pengatur-suhu.webp
      width: 1280
      height: 720
      kind: photo
    draft: true
    order: 100
    tags:
      - ESP32
    repositoryUrl: https://github.com/Yunachz/nama-repositori

Tambahkan delimiter frontmatter Markdown di awal dan akhir header tersebut. Slug harus unik dan lowercase-kebab-case. Judul wajib nonkosong dan maksimal 88 karakter. categoryIds merujuk ID yang ada di src/lib/project-categories.json; kategori baru perlu label ID/EN di registry. Label kartu, dialog, arsip, dan halaman proyek dihasilkan dari registry tersebut, sehingga project tidak menyimpan categoryLabel duplikat. Jangan memakai label bebas atau memetakan kategori baru ke label lain. Salinan paragraf ID dan EN harus memiliki jumlah yang sama.

Proyek baru menjadi draft secara default. Tetapkan draft: false setelah konten dan sumbernya siap untuk ditampilkan. Proyek terbit ditampilkan di carousel dan arsip. featured serta order mengatur urutan; featured tidak membatasi jumlah proyek publik. Tags opsional. repositoryUrl, demoUrl, dan sourceLinks memakai URL HTTPS.

Media bertipe photo harus berasal dari aset proyek di public/assets/projects/. Media bertipe placeholder disimpan di public/assets/placeholders/ dan harus diberi alt text yang menerangkan bahwa ilustrasi bersifat sementara, bukan bukti prototipe. Simpan file terlebih dahulu, lalu isi jalur, lebar, tinggi intrinsik, dan alt text. Gunakan aset lokal; jangan memakai / sebagai src gambar. Untuk mengganti ilustrasi, letakkan foto dokumentasi sebenarnya di direktori koleksi yang sesuai lalu perbarui src, dimensi, kind, dan alt text.

## Koleksi dan field

| Koleksi | Lokasi | Field utama |
| --- | --- | --- |
| Profil dan kontak | src/content/site/*.json | Profile berisi nama, lokasi, GPA, bahasa, salinan ID/EN, portrait, dan cvByLocale. Contact berisi tautan nyata dan email. |
| Keahlian | src/content/skills/*.json | categoryId, salinan title/shortLabel/summary ID/EN, media, projectSlugs, order, draft. |
| Software | src/content/software/*.json | name, icon lokal, monogram fallback, order, draft. Nama dan ikon tidak menyatakan tingkat kemahiran atau sertifikasi. |
| Pengalaman | src/content/experience/*.json | organization, dates, salinan category/role/summary/details/imageAlt ID/EN, media, order, draft. Jumlah detail ID/EN harus sama. |
| Pendidikan | src/content/education/*.json | institution, dates, salinan program/summary ID/EN, order, draft. Formal dan nonformal dibedakan oleh categoryId. |
| Sertifikat | src/content/credentials/*.json | name dan media; issuer, issuedAt, verifyUrl, document hanya jika sumber baru mendukungnya. Kartu tidak membuka dialog. |

Semua koleksi berbasis record memakai draft true secara default pada schema, kecuali frontmatter proyek yang menentukan draft dengan default sama. Hanya entri draft false yang tampil. Slug record JSON berasal dari nama file. Urutan default 100; order lebih kecil tampil lebih awal.

Setiap periode memakai dates.start dengan format YYYY-MM. dates.kind adalah range, ongoing, atau single. Hanya range memiliki dates.end. Jangan menyimpulkan tanggal, kelulusan, posisi kerja, atau ketersediaan dari label desain.

## Media dan CV

Aset publik berada di public/assets/ dan dipanggil melalui /assets/.... Gunakan direktori yang sesuai:
- assets/profile/ untuk foto profil nyata.
- assets/projects/ untuk foto proyek yang benar-benar terdokumentasi.
- assets/skills/ untuk foto pendukung keahlian yang benar.
- assets/experience/ untuk foto kegiatan yang benar.
- assets/certificates/ hanya untuk scan sertifikat yang tersedia.
- assets/placeholders/ untuk ilustrasi sementara yang bukan bukti.

Field media memiliki src, width, height, dan kind (photo atau placeholder). Media keahlian dapat menggunakan copy.imageAlt ID/EN. Pengalaman menggunakan copy.imageAlt; sertifikat menggunakan media.alt dengan alt ID/EN. Pastikan file gambar sudah ada di public sebelum validasi.

Profile.cvByLocale.id dan .en menunjuk dua PDF lokal di public/assets/documents/. English CV juga ada pada profile.cv untuk fallback lama. Viewer memilih PDF berdasarkan pilihan bahasa dokumen, terpisah dari bahasa antarmuka. Jangan mengganti atau menerjemahkan klaim CV tanpa memeriksa sumber.

## Terjemahan antarmuka

Salinan rekaman ada di copy.id dan copy.en. Label tombol, dialog, status, pesan toast, navigasi, dan teks aksesibilitas berada di src/lib/i18n.ts. Saat menambah interaksi, tambahkan kedua terjemahan di sana; simpan message key pada elemen yang perlu diperbarui saat bahasa berubah. Terjemahan harus alami dan setara, tidak perlu mengikuti susunan kata secara literal.

## Menjalankan pemeriksaan

Jalankan perintah berikut saat mengubah data atau perilaku:

    npm run validate-content
    npm run check
    npm test
    npm run build
    npm run preview

Validator memeriksa registry kategori, salinan bilingual, referensi proyek terbit, tanggal, path/dimensi media, URL, kontak, CV, dan bahasa provenance yang tidak boleh tampil ke publik. Tes regresi mengunci fakta awal sebagai subset sehingga tambahan yang sah tidak memerlukan perubahan ke daftar hitungan tetap. Tes fixture juga memeriksa kategori baru dan metadata opsional yang disertai sumber. Preview perlu ditinjau pada layar lebar dan telepon, dalam bahasa ID/EN serta tema terang/gelap.
