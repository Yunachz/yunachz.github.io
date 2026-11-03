# V3 public copy — Indonesian and English

Planner handoff, 2 November 2026. Use with [V3-PLAN.md](V3-PLAN.md). Text below is publication copy unless marked as an implementation note. Keep the website polished and natural; the chat's terse style does not apply here. Names, links, dates, and capability limits follow the existing audited content plus the user's new software list.

## Editorial rules

- Preserve proper project, institution, organization, and event names. Translate descriptions and interface controls. Keep all six exact certification names unchanged in both UI languages.
- Use “saya / I” for the personal introduction and invitation. Use neutral technical descriptions for projects; do not imply sole authorship, deployment success, reproduced metrics, or professional expertise.
- Do not publish audit/provenance phrases, source-page numbers, skill percentages, or certificate-verification claims. Real resource links may be labelled naturally as code, diagrams, documentation, or repositories.
- ID GPA is **3,72**; EN GPA is **3.72**. Neither includes a scale or semester.
- Institutional language levels remain **Bahasa Indonesia — Bahasa ibu / Indonesian — Native**, **Bahasa Inggris — Dasar / English — Basic**.
- Variables in braces, such as `{title}` and `{count}`, are interpolation slots. Do not display the braces literally.

## Header, navigation, introduction

| Key | ID | EN |
| --- | --- | --- |
| `brand` | Fajar. | Fajar. |
| `brand.homeLabel` | Fajar, beranda | Fajar, home |
| `nav.about` | Tentang | About |
| `nav.projects` | Proyek | Projects |
| `nav.skills` | Kemampuan | Capabilities |
| `nav.education` | Pendidikan | Education |
| `nav.experience` | Pengalaman | Experience |
| `nav.credentials` | Sertifikasi | Certifications |
| `nav.contact` | Kontak | Contact |
| `nav.label` | Navigasi utama | Main navigation |
| `nav.open` | Buka menu | Open menu |
| `nav.close` | Tutup menu | Close menu |
| `skip` | Lewati ke konten utama | Skip to main content |
| `locale.label` | Bahasa situs | Website language |
| `locale.id` | Bahasa Indonesia | Bahasa Indonesia |
| `locale.en` | English | English |
| `locale.shortId` | ID | ID |
| `locale.shortEn` | EN | EN |
| `theme.toDark` | Gunakan tema gelap | Switch to dark theme |
| `theme.toLight` | Gunakan tema terang | Switch to light theme |
| `hero.eyebrow` | Halo, saya Fajar | Hi, I’m Fajar |
| `hero.name` | Muhammad Fajar Sodik | Muhammad Fajar Sodik |
| `hero.field` | Mahasiswa Teknik Elektro · UPN Veteran Jakarta | Electrical Engineering student · UPN Veteran Jakarta |
| `hero.intro` | Saya mendalami instalasi listrik dan sistem kendali melalui proyek, perkuliahan, kegiatan organisasi, dan pengalaman OJT di ASTON Kemayoran City Hotel. | I explore electrical installations and control systems through coursework, projects, student organizations, and on-the-job training at ASTON Kemayoran City Hotel. |
| `hero.projects` | Jelajahi proyek | Explore projects |
| `hero.cv` | Lihat CV | View CV |
| `facts.gpaLabel` | GPA | GPA |
| `facts.gpaValue` | 3,72 | 3.72 |
| `facts.locationLabel` | Lokasi | Location |
| `facts.location` | Jakarta, Indonesia | Jakarta, Indonesia |
| `facts.indonesianLabel` | Bahasa Indonesia | Indonesian |
| `facts.indonesianValue` | Bahasa ibu | Native |
| `facts.englishLabel` | Bahasa Inggris | English |
| `facts.englishValue` | Dasar | Basic |
| `hero.photoAlt` | Muhammad Fajar Sodik mengenakan seragam biru di luar ruangan | Muhammad Fajar Sodik wearing a blue uniform outdoors |
| `meta.title` | Muhammad Fajar Sodik — Mahasiswa Teknik Elektro | Muhammad Fajar Sodik — Electrical Engineering Student |
| `meta.description` | Kenali Muhammad Fajar Sodik, mahasiswa Teknik Elektro UPN Veteran Jakarta, melalui proyek, kemampuan, pendidikan, dan pengalamannya. | Explore the projects, capabilities, education, and experience of Muhammad Fajar Sodik, an Electrical Engineering student at UPN Veteran Jakarta. |

Implementation note: the compact hero replaces the old separate about section. Its source facts about PCB work, sensors/actuators, soldering, microcontroller communication, Python, machine learning, and event media remain in the detailed skill and experience records below. Do not append all of them to the hero merely to preserve the old paragraph length.

## Section headlines and introductions

| Section | ID headline and introduction | EN headline and introduction |
| --- | --- | --- |
| Projects | **Proyek yang saya kerjakan** Proyek seputar kendali, IoT, machine learning, dan aplikasi desktop yang menjadi bagian dari proses belajar saya. | **Projects I’ve worked on** Projects in control systems, IoT, machine learning, and desktop software that form part of my learning. |
| Capabilities | **Yang bisa saya lakukan** Kemampuan yang saya kembangkan lewat perkuliahan, praktik, proyek, dan kegiatan organisasi. | **What I can do** Capabilities I’m developing through coursework, practical work, projects, and student organizations. |
| Education | **Pendidikan yang membentuk langkah saya** Pendidikan formal dan pelatihan yang menjadi dasar saya di bidang teknik elektro. | **Education that shapes my path** Formal education and training that underpin my studies in electrical engineering. |
| Experience | **Galeri Pengalaman** Dari praktik kerja hingga kegiatan kampus, saya belajar lewat pengalaman langsung dan kerja bersama. | **Experience Gallery** From on-the-job training to campus activities, I learn through practical experience and working with others. |
| Certifications | **Sertifikasi dan pelatihan** Bekal yang melengkapi perjalanan belajar saya di bidang kelistrikan, teknologi, dan pengolahan data. | **Certifications and training** Qualifications and training that complement my learning in electrical work, technology, and data analytics. |
| Contact label | **Mari terhubung** | **Let’s connect** |
| Contact headline | **Mari bekerja sama** Punya ide proyek, rencana kolaborasi, atau peluang karier di bidang teknik elektro? Saya senang berbincang dan mengenal kesempatan baru. | **Let’s work together** Have a project idea, a collaboration in mind, or a career opportunity in electrical engineering? I’d be glad to talk and hear more. |

## Shared controls and states

| Key | ID | EN |
| --- | --- | --- |
| `projects.filterLabel` | Filter proyek menurut bidang | Filter projects by area |
| `projects.all` | Semua | All |
| `projects.control` | Sistem Kendali | Control Systems |
| `projects.iot` | IoT | IoT |
| `projects.ml` | Machine Learning | Machine Learning |
| `projects.desktop` | Aplikasi Desktop | Desktop Apps |
| `projects.countOne` | 1 proyek ditampilkan | 1 project shown |
| `projects.countMany` | {count} proyek ditampilkan | {count} projects shown |
| `projects.empty` | Belum ada proyek dalam kategori ini. | There are no projects in this category yet. |
| `projects.previous` | Proyek sebelumnya | Previous project |
| `projects.next` | Proyek berikutnya | Next project |
| `projects.pause` | Jeda pergerakan proyek | Pause project motion |
| `projects.play` | Putar pergerakan proyek | Play project motion |
| `projects.galleryLabel` | Galeri proyek | Project gallery |
| `projects.position` | Proyek {index} dari {count} | Project {index} of {count} |
| `projects.detail` | Lihat proyek | View project |
| `projects.openDetail` | Lihat proyek {title} | View {title} project |
| `projects.repository` | Buka repositori | Open repository |
| `projects.resources` | Jelajahi proyek | Explore the project |
| `projects.technologies` | Teknologi | Technologies |
| `projects.technologyLabel` | Teknologi dalam proyek {title} | Technologies in {title} |
| `projects.demo` | Buka demo | Open demo |
| `projects.more` | Semua proyek | All projects |
| `projects.prototypeCaption` | Prototipe {title} | {title} prototype |
| `projects.placeholderAlt` | Ilustrasi abstrak untuk proyek {title} | Abstract illustration for the {title} project |
| `skills.tabsLabel` | Kemampuan dan perangkat lunak | Skills and software |
| `skills.tab` | Keahlian | Skills |
| `software.tab` | Perangkat Lunak | Software |
| `skills.expand` | Baca tentang {title} | Read about {title} |
| `skills.collapse` | Tutup uraian {title} | Collapse {title} description |
| `education.formal` | Formal | Formal |
| `education.nonformal` | Nonformal | Non-formal |
| `experience.galleryLabel` | Galeri pengalaman | Experience gallery |
| `experience.previous` | Pengalaman sebelumnya | Previous experience |
| `experience.next` | Pengalaman berikutnya | Next experience |
| `experience.position` | Pengalaman {index} dari {count} | Experience {index} of {count} |
| `experience.activities` | Kegiatan | Activities |
| `experience.showActivities` | Lihat kegiatan | View activities |
| `experience.hideActivities` | Tutup kegiatan | Hide activities |
| `experience.placeholderAlt` | Ilustrasi teknik dan kolaborasi untuk {title} | Illustration of engineering and teamwork for {title} |
| `credentials.placeholderAlt` | Ilustrasi sementara; ini bukan gambar sertifikat. | Temporary illustration; this is not a certificate image. |
| `dialog.close` | Tutup dialog | Close dialog |
| `dialog.closeVisible` | Tutup | Close |
| `dialog.projectLabel` | Proyek {title} | {title} project |
| `fallback.image` | Gambar belum tersedia | Image unavailable |
| `footer.top` | Kembali ke atas | Back to top |
| `footer.copyright` | © 2026 Muhammad Fajar Sodik | © 2026 Muhammad Fajar Sodik |

Implementation notes: use icon-only project/gallery/theme controls with the localized accessible names above. Announce manual gallery selections, not continuous animation frames. A CSS placeholder may be decorative with empty alt; if it is an informative image, use the clearly illustrative alt text. Do not announce a placeholder as a photograph or certificate scan.

## Contact and CV dialog copy

The email, phone, profile links, and documents are canonical facts:

| Item | Value / destination |
| --- | --- |
| Email | `mfajarsodik.work@gmail.com` |
| Mail action | `mailto:mfajarsodik.work@gmail.com` |
| Phone | `+62 896-7121-6008` / `tel:+6289671216008` |
| LinkedIn | `https://www.linkedin.com/in/muhammadfajarsodik` |
| WhatsApp | `https://wa.me/6289671216008` |
| GitHub | `https://github.com/Yunachz` |
| English source CV | `/assets/documents/cv-muhammad-fajar-sodik.pdf` |
| Indonesian translated CV | `/assets/documents/cv-muhammad-fajar-sodik-id.pdf` — to be produced by Luna |

| Key | ID | EN |
| --- | --- | --- |
| `contact.emailCard` | Kirim saya email | Send me an email |
| `contact.copyLabel` | Salin alamat email mfajarsodik.work@gmail.com | Copy email address mfajarsodik.work@gmail.com |
| `contact.copyHint` | Klik alamat untuk menyalin | Click the address to copy |
| `contact.copied` | Email disalin | Email copied |
| `contact.copyFailed` | Email belum tersalin. Pilih dan salin alamatnya secara manual. | Couldn’t copy the email address. Select it and copy it manually. |
| `contact.send` | Buka aplikasi email | Open email app |
| `contact.channels` | Cara menghubungi Fajar | Ways to contact Fajar |
| `contact.linkedin` | LinkedIn Muhammad Fajar Sodik | Muhammad Fajar Sodik on LinkedIn |
| `contact.whatsapp` | Hubungi Fajar melalui WhatsApp | Contact Fajar on WhatsApp |
| `contact.github` | GitHub Yunachz | Yunachz on GitHub |
| `cv.chooseTitle` | Pilih bahasa CV | Choose a CV language |
| `cv.chooseIntro` | Ingin membaca CV dalam bahasa apa? | Which language would you like to read? |
| `cv.choiceId` | Bahasa Indonesia | Bahasa Indonesia |
| `cv.choiceEn` | English | English |
| `cv.previewTitle` | CV Muhammad Fajar Sodik | Muhammad Fajar Sodik’s CV |
| `cv.documentId` | Bahasa Indonesia | Bahasa Indonesia |
| `cv.documentEn` | English | English |
| `cv.frameId` | Pratinjau CV Muhammad Fajar Sodik dalam bahasa Indonesia | Preview of Muhammad Fajar Sodik’s CV in Indonesian |
| `cv.frameEn` | Pratinjau CV Muhammad Fajar Sodik dalam bahasa Inggris | Preview of Muhammad Fajar Sodik’s CV in English |
| `cv.changeLanguage` | Ganti bahasa CV | Change CV language |
| `cv.download` | Unduh CV | Download CV |
| `cv.downloadIdLabel` | Unduh CV bahasa Indonesia dalam format PDF | Download the Indonesian CV as a PDF |
| `cv.downloadEnLabel` | Unduh CV bahasa Inggris dalam format PDF | Download the English CV as a PDF |
| `cv.openPdf` | Buka PDF | Open PDF |
| `cv.loading` | Memuat pratinjau CV… | Loading CV preview… |
| `cv.fallback` | Jika pratinjau tidak muncul, buka PDF atau unduh CV untuk membacanya. | If the preview doesn’t appear, open or download the PDF to read it. |

Implementation note: no download button in the language-choice state. Choosing a document language updates the same popup and reveals the selected PDF's download action. UI locale and document language are independent. Reset to language choice whenever the CV dialog is opened again.

## Existing project archive and fallback routes

These routes remain bilingual even though the primary project interaction uses a popup.

| Key | ID | EN |
| --- | --- | --- |
| `archive.title` | Semua proyek | All projects |
| `archive.metaTitle` | Proyek — Muhammad Fajar Sodik | Projects — Muhammad Fajar Sodik |
| `archive.intro` | Jelajahi proyek kendali, IoT, machine learning, dan aplikasi desktop, atau pilih bidang yang ingin Anda lihat. | Explore projects in control systems, IoT, machine learning, and desktop software, or choose an area to browse. |
| `archive.backHome` | Kembali ke beranda | Back to home |
| `archive.backProjects` | Kembali ke semua proyek | Back to all projects |
| `archive.listHeading` | Daftar proyek | Project list |
| `archive.empty` | Belum ada proyek untuk ditampilkan. | There are no projects to show yet. |
| `resource.readme` | Panduan proyek | Project guide |
| `resource.prototype` | Foto prototipe | Prototype photo |
| `resource.firmware` | Firmware | Firmware |
| `resource.esp32Firmware` | Firmware ESP32 | ESP32 firmware |
| `resource.fis` | Desain FIS | FIS design |
| `resource.gateway` | Firmware gateway | Gateway firmware |
| `resource.server` | Aplikasi server | Server application |
| `resource.flask` | Server Flask | Flask server |
| `resource.inference` | Inferensi Python | Python inference |
| `resource.application` | Aplikasi | Application |
| `resource.menuData` | Data menu | Menu data |

## Five projects

Use these descriptions for cards, dialogs, and fallback routes. Preserve the existing repository URLs, technology tags, and valid resource URLs in each record. Do not append the old “Batas informasi” audit sections to this copy.

### `fuzzy-fire-suppression` — Fuzzy Fire Suppression

**Category:** Embedded & Kendali / Embedded & Control. **Filter:** `control-systems`.

**ID card:** Prototipe ESP32 yang memakai logika fuzzy Mamdani untuk mengatur kipas, pompa, dan alarm dari pembacaan sensor.

**EN card:** An ESP32 prototype using Mamdani fuzzy logic to control a fan, pump, and alarm from sensor readings.

**ID detail:** Prototipe ini membaca suhu, kelembapan, asap, dan api, lalu mengolahnya dengan logika fuzzy Mamdani. Inferensi C++ berjalan pada ESP32 untuk mengatur kipas, pompa, dan alarm.

Rancangan proyek mencakup desain FIS, diagram pengawatan, dan susunan komponen prototipe.

**EN detail:** The prototype reads temperature, humidity, smoke, and flame sensors, then processes the inputs using Mamdani fuzzy logic. C++ inference runs on the ESP32 to control a fan, pump, and alarm.

The project includes an FIS design, a wiring diagram, and the prototype’s component layout.

**Tags:** ESP32 · C++ · Mamdani Fuzzy · PWM · MATLAB FIS.

**Photo alt ID:** Prototipe ESP32 dengan sensor asap, buzzer, konverter daya, dan driver motor.

**Photo alt EN:** ESP32 prototype with a smoke sensor, buzzer, power converter, and motor driver.

**Editorial boundary:** Always call this a prototype. Do not imply certified fire protection, field-proven suppression, or safety effectiveness.

### `aquasync-ph-stabilizer` — AquaSync pH Stabilizer

**Category:** Instrumentasi & Kendali / Instrumentation & Control. **Filter:** `control-systems`.

**ID card:** Pemantauan pH air berbasis ESP32 dengan dua pompa asam/basa yang diatur melalui pulse dosing dan hysteresis.

**EN card:** ESP32-based water pH monitoring with acid and base pumps controlled through pulse dosing and hysteresis.

**ID detail:** Sistem ini membaca pH air melalui ESP32 dan mengatur dua pompa asam/basa memakai pulse dosing serta hysteresis. Rancangannya juga mencakup interlock pompa dan kalibrasi sensor.

Dashboard Flask menampilkan pembacaan pH dan status aktuator untuk memantau sistem.

**EN detail:** The system reads water pH through an ESP32 and controls acid and base pumps using pulse dosing and hysteresis. The design also includes a pump interlock and sensor calibration.

A Flask dashboard displays pH readings and actuator status for system monitoring.

**Tags:** ESP32 · pH Sensing · Pulse Dosing · Hysteresis · Flask.

**Photo alt ID:** Rangkaian sensor, ESP32, dan pompa pada meja kerja.

**Photo alt EN:** Sensors, an ESP32, and pumps arranged on a workbench.

**Editorial boundary:** Do not add accuracy, stabilization-time, dosing-success, or water-safety claims.

### `lora-sentinel` — LoRaSentinel

**Category:** Telemetri & IoT / Telemetry & IoT. **Filter:** `iot`.

**ID card:** Pemantauan suhu dan kelembapan dari sensor DHT22 melalui LoRa ke gateway ESP32 dan dashboard FastAPI.

**EN card:** Temperature and humidity monitoring from DHT22 sensors over LoRa to an ESP32 gateway and a FastAPI dashboard.

**ID detail:** Node sensor DHT22 mengirim data suhu dan kelembapan melalui LoRa menuju gateway ESP32. Alur komunikasinya mencakup koreksi galat Reed–Solomon dan penerusan data melalui UDP.

Dashboard FastAPI menjadi antarmuka untuk menampilkan data telemetri.

**EN detail:** DHT22 sensor nodes send temperature and humidity data over LoRa to an ESP32 gateway. The communication flow includes Reed–Solomon error correction and data forwarding over UDP.

A FastAPI dashboard provides an interface for viewing the telemetry data.

**Tags:** ESP32 · LoRa · DHT22 · Reed-Solomon · FastAPI.

**Photo alt ID:** Modul Ra-02 dan papan ESP32 yang dipasang pada perfboard.

**Photo alt EN:** A Ra-02 module and an ESP32 board mounted on perfboard.

**Editorial boundary:** Preserve the real server link ending in `server/app.py`. Do not add range, node-capacity, packet-loss, live-service, or setup-validation claims.

### `smart-trash-bin` — Smart Trash Bin

**Category:** IoT & Computer Vision in both locales. **Filters:** `iot`, `machine-learning`.

**ID card:** Klasifikasi sampah dengan EfficientNet-B3 di PC, terhubung melalui MQTT ke ESP32 untuk menggerakkan tutup kompartemen.

**EN card:** Waste classification with EfficientNet-B3 on a PC, connected over MQTT to an ESP32 that operates compartment lids.

**ID detail:** EfficientNet-B3 mengklasifikasikan gambar sampah di PC. Hasil klasifikasi dikirim melalui MQTT ke ESP32 untuk menggerakkan tutup kompartemen.

Sistem juga mencakup pemantauan kapasitas menggunakan sensor ultrasonik dan load cell, dengan dashboard Flask untuk menampilkan informasi.

**EN detail:** EfficientNet-B3 classifies waste images on a PC. Classification results travel over MQTT to an ESP32 that operates the compartment lids.

The system also includes capacity monitoring with ultrasonic sensors and a load cell, with a Flask dashboard for displaying information.

**Tags:** ESP32 · EfficientNet-B3 · PyTorch · MQTT · Flask.

**Photo alt ID:** Kolase tempat sampah dengan kamera pada wadah dan rangkaian sensor di dalamnya.

**Photo alt EN:** A collage showing a waste bin with a mounted camera and sensors inside.

**Editorial boundary:** Inference runs on a PC. Do not move it to the ESP32 or add accuracy, throughput, or operational-deployment claims.

### `kafe-kekinian-pos` — Kafe Kekinian POS

**Category:** Aplikasi desktop / Desktop software. **Filter:** `desktop`.

**ID card:** Aplikasi kasir desktop Python/Tkinter untuk katalog, keranjang, stok, promo, loyalitas, dan riwayat transaksi.

**EN card:** A Python/Tkinter desktop point-of-sale application for catalog browsing, carts, stock, promotions, loyalty, and transaction history.

**ID detail:** Aplikasi desktop ini menggunakan Python, Tkinter, dan ttk untuk alur kasir, mulai dari katalog dan keranjang hingga stok, promo, loyalitas, dan riwayat transaksi. Data disimpan dalam JSON.

Pembayaran tunai dan non-tunai tersedia sebagai alur simulasi.

**EN detail:** This desktop application uses Python, Tkinter, and ttk for point-of-sale workflows, from catalog browsing and carts to stock, promotions, loyalty, and transaction history. Data is stored in JSON.

Cash and cashless payments are provided as simulated flows.

**Tags:** Python · Tkinter · ttk · JSON · Desktop POS.

**Placeholder alt ID:** Ilustrasi abstrak untuk aplikasi kasir desktop.

**Placeholder alt EN:** Abstract illustration for a desktop point-of-sale application.

**Editorial boundary:** Keep “simulasi / simulated” in the payment description. Do not claim banking integration, café deployment, web architecture, or an unconfirmed software licence.

## Ten skills

All ten entries remain available in the skills accordion. The short label is for the rotated collapsed card; use the full title and description when expanded. Each short label is a whole word or phrase, not stacked characters. These are capabilities and learning contexts, not proficiency grades.

| Canonical ID | Short label ID / EN | Full title ID / EN | Description ID | Description EN |
| --- | --- | --- | --- | --- |
| `electrical-engineering` | Kelistrikan / Electrical | Teknik Elektro / Electrical Engineering | Bidang studi dan minat utama saya, dengan perhatian pada praktik kelistrikan dan sistem kendali. | My main field of study and interest, with a focus on electrical practice and control systems. |
| `electrical-diagrams` | Diagram / Diagrams | Membaca dan menggambar diagram listrik / Reading and drawing electrical diagrams | Membaca diagram pengawatan dan menggambar diagram listrik. | Reading wiring diagrams and drawing electrical diagrams. |
| `electrical-installations` | Instalasi / Installations | Instalasi penerangan dan motor listrik / Lighting and electric motor installations | Merangkai instalasi penerangan dan instalasi motor listrik. | Assembling lighting installations and electric motor installations. |
| `circuit-analysis` | Rangkaian / Circuits | Analisis rangkaian / Circuit analysis | Menganalisis rangkaian listrik sebagai bagian dari pembelajaran teknik elektro. | Analyzing electrical circuits as part of my electrical engineering studies. |
| `plc` | PLC / PLC | Pemrograman PLC / PLC programming | Menyusun program PLC untuk kebutuhan kendali. | Writing PLC programs for control applications. |
| `python` | Python / Python | Python / Python | Mengembangkan kemampuan pemrograman Python melalui kegiatan KSM IOT 2025. | Developing my Python programming skills through KSM IOT 2025 activities. |
| `editing` | Media / Media | Editing dan dokumentasi / Editing and documentation | Membuat materi visual acara serta dokumentasi foto dan video dalam kegiatan kepanitiaan. | Creating event visuals and photo and video documentation through committee work. |
| `proteus-pcb-learning` | PCB / PCB | Desain rangkaian PCB dengan Proteus / PCB circuit design with Proteus | Belajar mendesain rangkaian PCB menggunakan Proteus dalam kegiatan KSM Mekatronika. | Learning to design PCB circuits in Proteus through KSM Mekatronika. |
| `embedded-learning` | Embedded / Embedded | Sensor, aktuator, dan mikrokontroler / Sensors, actuators, and microcontrollers | Belajar memasang sensor dan aktuator, melakukan soldering, merancang komponen, serta memahami protokol komunikasi mikrokontroler. | Learning to connect sensors and actuators, solder, design components, and understand microcontroller communication protocols. |
| `machine-learning-learning` | Machine Learning / Machine Learning | Machine learning / Machine learning | Mempelajari machine learning dalam kegiatan KSM IOT 2025. | Learning about machine learning through KSM IOT 2025. |

Implementation note: the IDs above are the current filenames. Some audit tables used shorthand such as `ml-learning`; use one stable ID convention in the final schema and references. Avoid adding statements about industrial commissioning, PLC brands, professional PCB experience, or AI proficiency.

## Seven software tiles

The app name is identical in ID and EN. Display it below the icon, without a skill level or certification label. Keep the names exactly as supplied; do not expand them into an unconfirmed product/version.

| Suggested ID | Exact visible name |
| --- | --- |
| `matlab` | MATLAB |
| `arduino-ide` | Arduino IDE |
| `stm32cube` | STM32Cube |
| `altium` | Altium |
| `fusion` | Fusion |
| `proteus` | Proteus |
| `tia-portal` | TIA Portal |

The name below a decorative icon already supplies the accessible text; use empty alt on that icon to avoid reading the same name twice.

## Four education entries

Institution names stay unchanged. Sort newest/current first within each column. The source's ongoing wording is preserved without adding an expected graduation date or semester.

### `upnvj` — Formal

**Institution:** Universitas Pembangunan Nasional Veteran Jakarta.

| Field | ID | EN |
| --- | --- | --- |
| Program | S1 Teknik Elektro | Undergraduate Electrical Engineering |
| Period | Jul 2024 – Sekarang | Jul 2024 – Present |
| Description | Mahasiswa program sarjana Teknik Elektro. | Undergraduate student in Electrical Engineering. |

Optional GPA line uses the canonical numeric value: **GPA 3,72 / GPA 3.72**. Avoid repeating it here if the hero already presents it clearly.

### `smkn-5-jakarta` — Formal

**Institution:** SMKN 5 Jakarta.

| Field | ID | EN |
| --- | --- | --- |
| Program | Teknik Instalasi Tenaga Listrik | Electrical Power Installation Techniques |
| Period | Jul 2022 – Mei 2024 | Jul 2022 – May 2024 |

### `kemala-bhayangkari` — Formal

**Institution:** SMK Kemala Bhayangkari 1 Jakarta.

| Field | ID | EN |
| --- | --- | --- |
| Program | Teknik Instalasi Tenaga Listrik (satu tahun) | Electrical Power Installation Techniques (One Year) |
| Period | Jul 2021 – Jun 2022 | Jul 2021 – Jun 2022 |

### `electrical-training-2023` — Nonformal / Non-formal

**Institution:** Pusat Pelatihan dan Pengembangan Pendidikan Jakarta Timur.

| Field | ID | EN |
| --- | --- | --- |
| Program | Peningkatan Kompetensi Peserta Didik SMK Bidang Keahlian Teknik Kelistrikan — Angkatan I Tahun 2023 | Improving the Competence of Vocational High School Students in the Field of Electrical Engineering Expertise — Class I of 2023 |
| Period | Agu 2023 | Aug 2023 |

This training is one nonformal education entry and one entry in the source's certification list. Do not duplicate it into two certificate cards or label it as a degree.

## Nine experience entries

Use one gallery, not separate galleries by category. Every title, role, period, summary, and activity detail remains readable below the selected image. Summaries are for scanning; they do not replace the activity list. Preserve all dates and proper event names.

### `aston-ojt` — ASTON Kemayoran City Hotel

| Field | ID | EN |
| --- | --- | --- |
| Category | Praktik kerja | On-the-job training |
| Role | Engineering Department (OJT) | Engineering Department (OJT) |
| Period | Okt 2022 – Apr 2023 | Oct 2022 – Apr 2023 |
| Summary | Praktik kerja di bagian engineering hotel, dari perawatan kamar hingga pemeriksaan kondisi peralatan. | On-the-job training in hotel engineering, from room maintenance to checking equipment conditions. |

**ID activities:**

- Melakukan perawatan preventif kamar: membersihkan AC, mengecat ulang bagian dinding yang rusak, grouting lantai, memperbaiki bagian yang rusak, dan mengaplikasikan sealant toilet.
- Menangani keluhan tamu terkait kamar hotel.
- Membantu pekerjaan staf.
- Memeriksa kondisi panel hotel, chiller dan freezer, tekanan gas, serta APAR.
- Melakukan perawatan area hotel saat terjadi kerusakan.

**EN activities:**

- Carried out preventive room maintenance: cleaning air conditioners, repainting damaged wall areas, grouting floors, repairing damaged parts, and applying toilet sealant.
- Handled guest complaints about hotel rooms.
- Assisted staff with their work.
- Checked hotel panels, chillers and freezers, gas pressure, and fire extinguishers.
- Carried out maintenance in hotel areas when damage occurred.

### `ksm-mekatronika` — KSM Mekatronika

| Field | ID | EN |
| --- | --- | --- |
| Category | Organisasi | Student organization |
| Role | Staf Divisi Elektronik | Electronic Division Staff |
| Period | Sep 2024 – Des 2025 | Sep 2024 – Dec 2025 |
| Summary | Belajar desain PCB, pemasangan sensor dan aktuator, serta praktik komponen elektronik. | Learning PCB design, sensor and actuator connections, and practical work with electronic components. |

**ID activities:**

- Belajar membuat desain rangkaian PCB menggunakan Proteus.
- Belajar memasang sensor dan aktuator pada mikrokontroler.
- Belajar teknik soldering dan perancangan komponen.

**EN activities:**

- Learned to create PCB circuit designs using Proteus.
- Learned to connect sensors and actuators to a microcontroller.
- Learned soldering techniques and component design.

### `ksm-iot` — KSM IOT 2025

| Field | ID | EN |
| --- | --- | --- |
| Category | Organisasi | Student organization |
| Role | Staf Divisi Firmware | Firmware Division Staff |
| Period | Feb 2026 – Berjalan | Feb 2026 – Present |
| Summary | Mengembangkan pemahaman tentang Python, komunikasi mikrokontroler, dan machine learning. | Developing an understanding of Python, microcontroller communication, and machine learning. |

**ID activities:**

- Belajar bahasa pemrograman Python.
- Mempelajari protokol komunikasi pada mikrokontroler.
- Belajar machine learning.

**EN activities:**

- Learning the Python programming language.
- Studying microcontroller communication protocols.
- Learning about machine learning.

Implementation note: **KSM IOT 2025** is the source name; its period really begins in **Feb 2026**. Do not normalize the event name or change the date to match it.

### `electrician-gathering` — Electrician Gathering 2025

| Field | ID | EN |
| --- | --- | --- |
| Category | Kepanitiaan | Event committee |
| Role | Staf Divisi PDD | PDD Division Staff |
| Period | Jun 2025 – Des 2025 | Jun 2025 – Dec 2025 |
| Summary | Menyiapkan materi sosialisasi dan mengabadikan kegiatan lewat foto serta video. | Preparing event introduction materials and documenting activities through photos and videos. |

**ID activities:**

- Membuat PowerPoint untuk sosialisasi acara.
- Mengambil foto dan video selama acara untuk dokumentasi.

**EN activities:**

- Created PowerPoint presentations to introduce the event.
- Took photos and videos during the event for documentation.

### `startup-101` — Seminar Start-Up 101 2025

| Field | ID | EN |
| --- | --- | --- |
| Category | Kepanitiaan | Event committee |
| Role | Staf Divisi PDD | PDD Division Staff |
| Period | Agu 2025 – Okt 2025 | Aug 2025 – Oct 2025 |
| Summary | Membuat poster seminar dan mendokumentasikan jalannya acara. | Creating the seminar poster and documenting the event. |

**ID activities:**

- Mendesain poster seminar.
- Melakukan dokumentasi selama acara.

**EN activities:**

- Designed the seminar poster.
- Documented the event.

### `hari-listrik-webinar` — Webinar Nasional Hari Listrik 2025

| Field | ID | EN |
| --- | --- | --- |
| Category | Kepanitiaan | Event committee |
| Role | Staf Divisi PDD | PDD Division Staff |
| Period | Sep 2025 – Nov 2025 | Sep 2025 – Nov 2025 |
| Summary | Menyiapkan materi visual webinar, termasuk sertifikat, plakat, dan template live report. | Preparing webinar visuals, including certificates, plaques, and live-report templates. |

**ID activities:**

- Mendesain sertifikat, plakat, dan template live report.
- Melakukan dokumentasi acara.

**EN activities:**

- Designed certificates, plaques, and live-report templates.
- Documented the event.

### `seminar-mosfet` — Seminar MOSFET 2025

| Field | ID | EN |
| --- | --- | --- |
| Category | Kepanitiaan | Event committee |
| Role | Staf Divisi PDD | PDD Division Staff |
| Period | Okt 2025 – Nov 2025 | Oct 2025 – Nov 2025 |
| Summary | Membuat poster dan sertifikat, serta mendokumentasikan kegiatan seminar. | Creating posters and certificates, and documenting the seminar. |

**ID activities:**

- Mendesain poster dan sertifikat.
- Melakukan dokumentasi acara.

**EN activities:**

- Designed posters and certificates.
- Documented the event.

### `synergy-fest` — Synergy Fest 2025

| Field | ID | EN |
| --- | --- | --- |
| Category | Kepanitiaan | Event committee |
| Role | Staf Divisi PDD | PDD Division Staff |
| Period | Okt 2025 – Berjalan | Oct 2025 – Present |
| Summary | Mengembangkan materi visual acara, dari poster dan media sosial hingga lanyard dan panduan acara. | Developing event visuals, from posters and social media templates to lanyards and guide-book templates. |

**ID activities:**

- Mendesain poster, template live report dan instastory, lanyard, serta template guide book.
- Melakukan dokumentasi acara.

**EN activities:**

- Designed posters, live-report and Instagram Story templates, lanyards, and guide-book templates.
- Documented the event.

### `electrical-competition` — Electrical Competition 2025

| Field | ID | EN |
| --- | --- | --- |
| Category | Kepanitiaan | Event committee |
| Role | Staf Divisi Mobile Legends | Mobile Legends Division Staff |
| Period | Okt 2025 – Des 2025 | Oct 2025 – Dec 2025 |
| Summary | Mendukung pendaftaran, menjadi caster, dan mendampingi peserta melalui Discord saat pertandingan. | Supporting registration, serving as a match commentator, and assisting participants on Discord during matches. |

**ID activities:**

- Membuat formulir pendaftaran melalui Google Forms.
- Menjadi caster.
- Mendampingi peserta melalui Discord saat bermain.

**EN activities:**

- Created registration forms using Google Forms.
- Served as a match commentator.
- Assisted participants through Discord during matches.

Implementation note: PDD is not expanded because the source does not spell it out. OJT stays training; committee responsibilities do not become employment positions.

## Six certifications — exact names in both locales

Use the same canonical title in both languages. These names intentionally contain a mix of Indonesian and English. A translated UI does not require changing an official title. The cards have no popup, invented issuing date, issuer assertion, serial, grade, or verification action.

| Current file ID | Exact name |
| --- | --- |
| `plc-maintenance` | Middle Implementer of Maintenance of PLC Based Control Instruments (BNSP) |
| `lsk-kebtke` | Sertifikat Kompetensi LSK PPSDM KEBTKE |
| `aston-ojt` | ASTON Kemayoran City Hotel On The Job Training |
| `data-analytics` | Data Analytics (Pearson IT Specialist) |
| `ic3-digital-literacy` | IC3 Digital Literacy Global Standard 6 Level 1 |
| `electrical-training-2023` | Pelatihan Peningkatan Kompetensi Peserta Didik SMK Bidang Keahlian Teknik Kelistrikan Angkatan I Tahun 2023 |

Implementation note: collection context disambiguates repeated filenames such as `aston-ojt` and `electrical-training-2023`. DOM IDs should include the collection prefix when necessary. A placeholder is a preview illustration, not a new certificate document.

## Indonesian CV wording map

This is an internal translation guide for the new Indonesian PDF, not another public website section. The original English file has three pages. Use the complete existing facts above; do not translate only the hero summary or omit the later committee entries.

### Headings and source structure

| Source heading | Indonesian heading | Content to preserve |
| --- | --- | --- |
| SUMMARY | RINGKASAN | The translated profile paragraph below. |
| WORK EXPERIENCE | PENGALAMAN PRAKTIK KERJA | ASTON OJT, exact period, and all five activities from `aston-ojt`. |
| EDUCATION | PENDIDIKAN | All three formal institutions/programs/periods above. |
| NON-FORMAL EDUCATION | PENDIDIKAN NONFORMAL | The East Jakarta training institution, program, and August 2023 period. |
| ORGANIZATION EXPERIENCE | PENGALAMAN ORGANISASI | KSM Mekatronika and KSM IOT 2025, roles, periods, and all six combined activities. |
| COMMITTEE EXPERIENCE | PENGALAMAN KEPANITIAAN | All six event committees above, roles, periods, and all thirteen combined activities. |
| SKILLS | KEAHLIAN | The source's six-skill list below, without new software or extra website-only skill entries. |
| CERTIFICATION | SERTIFIKASI | All six exact certification names above. |
| ADDITIONAL INFORMATION | INFORMASI TAMBAHAN | Languages and interest below. |

The source layout places ASTON, education, nonformal education, and KSM Mekatronika on page 1; KSM IOT, committees, and skills on page 2; certifications and additional information on page 3. A translated layout may reflow for readability, but nothing may disappear at a page boundary.

### Indonesian summary for the translated PDF

Saya mahasiswa Universitas Pembangunan Nasional Veteran Jakarta pada program S1 Teknik Elektro. Saya memiliki pengalaman praktik kerja di Engineering Department ASTON Kemayoran City Hotel. Saya dapat merangkai instalasi penerangan dan motor listrik, menggunakan programmable logic controller (PLC), serta membaca diagram pengawatan. Saya dapat bekerja dalam tim dan menyelesaikan masalah. Saya berminat pada peluang karier di bidang teknik elektro.

Editorial note: preserve OJT's date range **Okt 2022 – Apr 2023** in the work entry. The source summary also says “6 months”; the prior audit instructs using the dates without recalculating an exact duration. Do not promote the training role into a permanent engineer position.

### Source CV's six skills

| Source | Indonesian |
| --- | --- |
| Electrical Engineering | Teknik Elektro |
| Read and Draw Electrical Diagram | Membaca dan menggambar diagram listrik |
| PLC Program | Pemrograman PLC |
| Editing | Editing |
| Circuit Analysis | Analisis rangkaian |
| Python | Python |

### Additional information and header

| Field | Indonesian text / invariant value |
| --- | --- |
| Name | Muhammad Fajar Sodik |
| Location | Jakarta, Indonesia |
| Phone | +62 896-7121-6008 |
| Email | mfajarsodik.work@gmail.com |
| LinkedIn | https://www.linkedin.com/in/muhammadfajarsodik |
| Languages | Bahasa Indonesia (bahasa ibu), Bahasa Inggris (dasar) |
| Interest | Teknik Elektro |

The new GPA and seven-app software list belong to the website under the latest user instruction. They are absent from the original English PDF; do not silently add them to only the Indonesian translation. Do not add GitHub, project metrics, certifications IDs, graduation details, or availability statements to the translated source.

### CV factual completeness check

The Indonesian PDF must retain **1 OJT entry with 5 activities; 3 formal education entries; 1 nonformal training entry; 2 organization entries with 6 combined activities; 6 committee entries with 13 combined activities; 6 source skills; 6 exact certification titles; 2 language levels; and the original contact details**. Render every page and compare extracted text before exposing the file through the chooser.

## Editorial completeness and handoff

| Content group | Expected initial count | Coverage here |
| --- | --- | --- |
| Projects | 5 | ID/EN card copy, full detail paragraphs, category membership, tags, alt text, and claim boundaries. |
| Skills | 10 | Current IDs, short accordion labels, full titles, and natural descriptions in both languages. |
| Software | 7 | Exact user names, without inferred levels or versions. |
| Education | 4 | Institution names, programs, dates, and formal/nonformal grouping in both languages. |
| Experience | 9 | Titles, roles, periods, summaries, and every activity in both languages. |
| Certifications | 6 | Exact invariant titles; neutral placeholder state and no detail-dialog copy. |
| Interface | Shared | Navigation, theme/language, controls, announcements, email states, project routes, dialogs, CV choice/preview, footer, and alt/ARIA wording. |

This document supplies copy and factual guardrails. It does not claim that Luna has integrated every string, generated the translated PDF, passed browser checks, or published the release. Those outcomes require the implementation and root review described in V3-PLAN.
