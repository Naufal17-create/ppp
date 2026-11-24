# ⚙️ Backend Architecture — Web Portofolio Muhammad Naufal

Backend untuk web portofolio ini dirancang fleksibel, terstruktur, dan siap pakai dengan 3 opsi implementasi:

1. **PowerShell Native REST Server (`../server.ps1`)** *(Default & Siap Pakai)*:
   - Berjalan langsung di Windows tanpa perlu menginstal Node.js, Python, atau runtime tambahan apapun.
   - Menyediakan REST API lengkap dan penyajian file statis (`HTML`, `CSS`, `JS`, `SVG`, `MP3`).
   - Menyimpan data persisten secara real-time ke folder `../data/`.
   - **Cara Jalankan**: Klik ganda `start-server.bat` di folder utama.

2. **Node.js + Express REST API (`server.js`)**:
   - Arsitektur standar industri berbasis Express.js dan CORS middleware.
   - **Cara Jalankan**:
     ```bash
     cd backend
     npm install
     npm start
     ```
     Server akan berjalan di `http://localhost:5000`.

3. **C# ASP.NET Core Minimal API (`Program.cs`, `PortfolioApi.csproj`)**:
   - Backend modern dengan framework .NET 8 / .NET 11 berkinerja tinggi.
   - **Cara Jalankan**:
     ```bash
     cd backend
     dotnet run
     ```
     Server akan berjalan di `http://localhost:5000`.

---

## 📡 Dokumentasi Endpoint REST API

Semua endpoint mengembalikan data berformat JSON:

| Method | Endpoint | Deskripsi | Request Body / Parameter |
|---|---|---|---|
| `GET` | `/api/music` | Mengambil seluruh daftar lagu, status favorite, dan jumlah suka | - |
| `POST` | `/api/music/favorite` | Menambah/mengurangi status favorit & like pada lagu | `{ "id": "track-1" }` |
| `GET` | `/api/music/recommendations` | Melihat daftar lagu yang direkomendasikan oleh pengunjung | - |
| `POST` | `/api/music/recommend` | Mengirimkan rekomendasi lagu baru ke Naufal | `{ "title": "...", "artist": "...", "recommender": "...", "note": "..." }` |
| `POST` | `/api/contact` | Mengirim dan menyimpan pesan formulir kontak dari pengunjung | `{ "name": "...", "email": "...", "subject": "...", "message": "..." }` |
| `GET` | `/api/messages` | Melihat seluruh pesan kontak yang masuk ke server | - |

---

## 📁 Penyimpanan Data (`data/`)

Data disimpan dalam format JSON terstruktur di folder `data/`:
- `data/music.json`: Data playlist lagu bawaan dan status like/favorite.
- `data/recommendations.json`: Rekomendasi lagu dari para pengunjung website.
- `data/messages.json`: Pesan kontak yang dikirim oleh calon klien/pengunjung.
