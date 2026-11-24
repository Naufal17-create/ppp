# 🚀 Modern Fullstack Portfolio & Music Lounge — Muhammad Naufal

Website portofolio profesional, modern, responsif, dan interaktif yang dilengkapi arsitektur **Fullstack (Frontend + Backend REST API)** serta **CyberPulse Music Player** dengan lagu bawaan agar pengalaman menjelajah web tidak membosankan bagi calon klien dan perekrut.

---

## ✨ Fitur-Fitur Unggulan

1. **🎧 CyberPulse Interactive Music Player (Lagu Bawaan & Musik Favorit)**:
   - **Pemutar Musik Mengambang (*Floating Widget*)**: Terpasang di pojok kanan bawah dengan mode mini pill dan kartu pemutar penuh.
   - **Animasi Vinyl Berputar & Equalizer**: Visual piringan hitam (*vinyl record*) yang berputar saat lagu dimainkan serta bar gelombang audio (*equalizer*) yang memantul mengikuti ritme.
   - **Lagu Bawaan Santai untuk Coding**:
     1. *Midnight Lo-Fi Coding* (Lo-Fi Beats santai)
     2. *Cyberpunk Neon Drive* (Retrowave 80-an berenergi)
     3. *Coffee Shop & Rain* (Chillhop jazz akustik hangat)
     4. *Deep Focus Flow* (Ambient elektronik penambah konsentrasi)
     5. *Senja & Nostalgia Jakarta* (Indie pop akustik)
   - **Dual Audio Engine (Anti-Mogok)**: Menggunakan streaming audio berkualitas tinggi dengan *fallback* instan ke **Web Audio API Procedural Synthesizer** bila perangkat sedang offline, sehingga musik dijamin **100% selalu berbunyi**.
   - **Kontrol Lengkap**: Play/Pause, Next, Previous, Shuffle, Repeat, Volume slider, Mute, Scrub bar pencarian detik, dan Tombol Favorit (Love).

2. **🎶 Audio Lounge & Rekomendasi Lagu Pengunjung**:
   - Bagian khusus **"Teman Coding & Lagu Favorit Naufal"** di halaman web.
   - Modal pop-up **"Rekomendasikan Lagu"**: Pengunjung dapat menyarankan lagu favorit mereka ke Naufal dan datanya tersimpan langsung ke backend!

3. **⚙️ Arsitektur Fullstack & REST API**:
   - **PowerShell Native REST Engine (`server.ps1`)**: Server bawaan Windows siap pakai tanpa perlu instalasi tambahan (zero setup).
   - **Node.js + Express Backend (`backend/server.js`)**: Struktur backend standar industri berbasis Express.js.
   - **C# ASP.NET Core Minimal API (`backend/Program.cs`)**: Backend performa tinggi berbasis .NET.
   - **Database JSON Real-Time (`data/`)**:
     - `data/music.json`: Data playlist, jumlah suka, dan status favorit.
     - `data/messages.json`: Arsip pesan formulir kontak yang dikirim pengunjung.
     - `data/recommendations.json`: Daftar lagu yang disarankan oleh pengunjung.

4. **🎨 5 Pilihan Tema Warna Interaktif**:
   - 🟣 **Cyber Violet** (Default mewah)
   - 🟢 **Emerald Matrix** (Hacker terminal)
   - 🔵 **Electric Blue** (Enterprise tech)
   - 🟡 **Sunset Amber** (Hangat & artistik)
   - 🔴 **Neon Rose** (Berani & futuristik)

5. **💻 Interactive Developer Console (Terminal Unix)**:
   - Pengunjung dapat mengetik perintah:
     - `help`: Menampilkan semua perintah
     - `music`: Mengecek status lagu yang sedang diputar
     - `play`: Memutar musik santai
     - `pause`: Menjeda musik
     - `whoami`, `skills`, `projects`, `contact`, `matrix`, `clear`

6. **📱 Showcase Proyek Filterable + Modal Detail Pop-up**:
   - Filter: *All, Fullstack, Frontend, Web App, UI/UX Creative*.
   - Modal detail interaktif menampilkan spesifikasi arsitektur, metrik performa, dan tombol Demo / Repo.

7. **📊 Matrix Keahlian & Infinite Marquee**:
   - Kategori: *Frontend*, *Backend & Database*, serta *DevOps & Tools*.

8. **⏳ Glowing Career & Education Timeline**:
   - Jejak langkah karir dan pendidikan Naufal lengkap dengan testimoni klien bintang 5 dan FAQ accordion.

9. **📬 Formulir Kontak & Integrasi WhatsApp Direct**:
   - Formulir kontak terhubung langsung ke backend REST API (`POST /api/contact`) dan tombol cepat chat WhatsApp.

---

## 📁 Struktur Berkas Proyek

```
Web Portofolio Naufal/
│
├── index.html                 # Halaman utama web (SEO semantik & music player markup)
├── start.bat                  # Shortcut 1-klik buka langsung di browser default
├── start-server.bat           # Shortcut 1-klik jalankan Fullstack Server lokal
├── server.ps1                 # Fullstack HTTP Server & REST API native Windows
├── README.md                  # Panduan lengkap
│
├── css/
│   ├── style.css              # Styling utama, tata letak, glassmorphism, responsive
│   ├── animations.css         # Keyframe animasi partikel, teks gradient & glow
│   └── music-player.css       # Styling CyberPulse Player, piringan vinyl & lounge
│
├── js/
│   ├── projects-data.js       # Data profil, keahlian, dan proyek portofolio
│   ├── music-player.js        # Engine pemutar musik, equalizer & sinkronisasi API
│   ├── particles.js           # Sistem partikel canvas interaktif
│   └── main.js                # Logika terminal, form kontak & tema
│
├── data/                      # Database JSON persisten
│   ├── music.json             # Data playlist lagu & jumlah likes
│   ├── messages.json          # Database pesan kontak dari pengunjung
│   └── recommendations.json   # Rekomendasi lagu dari pengunjung
│
├── backend/                   # Source code backend modular
│   ├── server.js              # Express.js REST API server
│   ├── package.json           # Dependensi Node.js
│   ├── Program.cs             # ASP.NET Core C# Minimal API
│   ├── PortfolioApi.csproj    # File project C#
│   └── README.md              # Dokumentasi teknis backend & API
│
└── assets/
    ├── images/                # Asset vektor SVG (Avatar, mockup proyek)
    │   └── music/             # Cover album vinyl SVG untuk setiap lagu bawaan
    └── audio/                 # Folder untuk menambahkan file audio MP3 kustom
```

---

## 🛠️ Cara Menjalankan

### Opsi 1: Klik Ganda `start-server.bat` (Rekomendasi Utama Fullstack)
1. Klik ganda berkas **`start-server.bat`**.
2. Server lokal akan aktif di `http://localhost:8080/` dan otomatis membuka browser Anda.
3. Seluruh fitur frontend, backend REST API, pemutar musik, like lagu, rekomendasi musik, dan formulir kontak akan berjalan 100% terintegrasi secara real-time!

### Opsi 2: Tekan `F5` di Visual Studio Code
Cukup buka folder ini di VS Code dan tekan tombol **F5**. Browser Chrome / Edge akan otomatis terbuka menampilkan portofolio.

### Opsi 3: Klik Ganda `start.bat`
Klik ganda `start.bat` untuk membuka langsung halaman web di browser default Anda.

---

## 🎵 Cara Menambahkan Lagu Musik Anda Sendiri

Ingin menambahkan lagu MP3 favorit Anda sendiri ke playlist?
1. Salin berkas `.mp3` Anda ke dalam folder `assets/audio/` (misalnya `lagu-saya.mp3`).
2. Buka berkas `data/music.json` atau `js/music-player.js`.
3. Tambahkan objek lagu baru:
   ```json
   {
     "id": "track-custom-1",
     "title": "Judul Lagu Anda",
     "artist": "Nama Artis",
     "album": "Nama Album",
     "duration": "3:30",
     "genre": "Lofi / Indie",
     "cover": "assets/images/music/cover-lofi.svg",
     "audioUrl": "assets/audio/lagu-saya.mp3",
     "isFavorite": true,
     "likes": 50,
     "vibe": "Lagu favorit penambah semangat."
   }
   ```
4. Simpan berkas, dan lagu Anda akan langsung muncul di pemutar musik!
