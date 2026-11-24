/**
 * Portfolio Data Configuration
 * Berisi data proyek, keahlian, pengalaman, dan testimoni.
 * Sangat mudah diubah dan disesuaikan untuk kebutuhan pribadi Naufal.
 */

const PORTFOLIO_DATA = {
  profile: {
    name: "Muhammad Naufal",
    nickName: "Naufal",
    title: "Fullstack Web Developer & Creative Engineer",
    location: "Jakarta, Indonesia",
    status: "Tersedia untuk Freelance & Full-time",
    email: "naufal.dev.contact@gmail.com",
    whatsapp: "+6281234567890",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    bio: "Passionate developer yang fokus membangun aplikasi web modern, performa tinggi, dan pengalaman visual interaktif yang memukau. Berpengalaman dalam ekosistem JavaScript/TypeScript modern dari frontend hingga backend cloud architecture.",
    stats: [
      { label: "Tahun Pengalaman", value: "3+", icon: "clock" },
      { label: "Proyek Terselesaikan", value: "28+", icon: "folder-check" },
      { label: "Klien Puas", value: "100%", icon: "award" },
      { label: "Komit GitHub", value: "1.2k+", icon: "git-commit" }
    ]
  },

  skills: {
    frontend: [
      { name: "React / Next.js", level: 92, icon: "atom", desc: "SSR, SSG, Server Components, State Management" },
      { name: "TypeScript", level: 88, icon: "file-code", desc: "Type Safety, Generics, OOP & FP paradigms" },
      { name: "Tailwind CSS", level: 95, icon: "palette", desc: "Responsive Design, Custom Themes, Animation" },
      { name: "HTML5 / Modern CSS", level: 96, icon: "layout", desc: "Semantic Web, CSS Grid/Flexbox, Keyframes" },
      { name: "Vue.js", level: 82, icon: "layers", desc: "Composition API, Pinia, Vue Router" }
    ],
    backend: [
      { name: "Node.js & Express", level: 90, icon: "server", desc: "RESTful API, Microservices, Middleware, Auth" },
      { name: "PostgreSQL / MySQL", level: 85, icon: "database", desc: "Relational Schema, Query Optimization, Prisma ORM" },
      { name: "MongoDB", level: 84, icon: "box", desc: "NoSQL document modeling, Aggregation pipeline" },
      { name: "REST API & GraphQL", level: 88, icon: "network", desc: "API Design, Swagger docs, Query efficiency" },
      { name: "Python / FastAPI", level: 78, icon: "terminal", desc: "Fast API development, Async endpoints, Scripting" }
    ],
    toolsAndDevOps: [
      { name: "Git & GitHub", level: 92, icon: "git-branch", desc: "Git Flow, Pull Requests, Actions CI/CD" },
      { name: "Docker", level: 78, icon: "container", desc: "Containerization, Docker Compose, Deployment" },
      { name: "Linux & Cloud (Vercel/AWS)", level: 82, icon: "cloud", desc: "Server deployment, S3, Environment tuning" },
      { name: "Figma to Code", level: 90, icon: "figma", desc: "Pixel-perfect implementation, Design systems" },
      { name: "Postman & Jest", level: 84, icon: "check-circle", desc: "API testing, Unit test, Integration test" }
    ]
  },

  projects: [
    {
      id: "pro-saas-nexus",
      title: "Nexus Analytics - Modern SaaS Dashboard",
      category: "Fullstack",
      categorySlug: "fullstack",
      description: "Platform analitik bisnis real-time dengan visualisasi data interaktif, monitoring pendapatan, manajemen tim, dan integrasi multi-tenant.",
      longDescription: "Nexus Analytics dirancang untuk membantu startup dan UMKM memantau KPI dan metrik pendapatan secara instan. Menggunakan arsitektur serverless, caching Redis, dan visualisasi chart interaktif dengan WebSocket untuk update data langsung tanpa reload halaman.",
      image: "assets/images/project-nexus.svg",
      tags: ["Next.js 14", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Recharts"],
      featured: true,
      metrics: "⚡ Load time < 0.8s | 📈 15k+ Realtime Data Points",
      demoUrl: "https://example.com/demo-nexus",
      githubUrl: "https://github.com/example/nexus-analytics",
      features: [
        "Dashboard analitik multi-chart real-time (Revenue, Conversion, Churn)",
        "Role-based Access Control (Admin, Manager, Member)",
        "Export laporan dalam format PDF, CSV, dan Excel",
        "Dark/Light adaptive theme dengan preferensi sistem",
        "Kecepatan Lighthouse 99/100"
      ]
    },
    {
      id: "pro-ecom-urban",
      title: "UrbanPulse - High-Conversion E-Commerce Store",
      category: "Frontend",
      categorySlug: "frontend",
      description: "Website e-commerce fashion modern dengan pengalaman belanja ultra-cepat, filter cerdas, cart interaktif, dan integrasi payment gateway Midtrans.",
      longDescription: "UrbanPulse mengedepankan pengalaman visual estetik, navigasi intuitif, dan alur checkout yang efisien. Dilengkapi fitur quick-view, rekomendasi produk berbasis riwayat belanja, dan perhitungan ongkir otomatis.",
      image: "assets/images/project-ecommerce.svg",
      tags: ["React", "Zustand", "Tailwind CSS", "Midtrans API", "Node.js"],
      featured: true,
      metrics: "🚀 40% Peningkatan Konversi Checkout",
      demoUrl: "https://example.com/demo-urbanpulse",
      githubUrl: "https://github.com/example/urbanpulse-store",
      features: [
        "Katalog produk dengan filter dinamis & pencarian fuzzy",
        "Cart & Wishlist interaktif tersimpan lokal & sinkron ke cloud",
        "Simulasi checkout & integrasi payment gateway",
        "Desain responsif dioptimalkan untuk mobile devices",
        "Animasi mikro yang halus untuk feedback pengguna"
      ]
    },
    {
      id: "pro-ai-copilot",
      title: "NovaAI - Smart Content & Code Assistant",
      category: "Web App",
      categorySlug: "webapp",
      description: "Aplikasi produktivitas berbasis kecerdasan buatan untuk merangkum dokumen panjang, membuat draft konten, dan debugging kode program.",
      longDescription: "Memanfaatkan streaming API untuk memberikan respons cepat ala ChatGPT. Dilengkapi syntax highlighter untuk 20+ bahasa pemrograman, export markdown, dan riwayat percakapan yang aman.",
      image: "assets/images/project-ai.svg",
      tags: ["Next.js", "AI SDK", "Tailwind", "Radix UI", "LocalStorage"],
      featured: true,
      metrics: "🤖 5x Lebih Cepat Menulis Draft",
      demoUrl: "https://example.com/demo-novaai",
      githubUrl: "https://github.com/example/novaai-assistant",
      features: [
        "Streaming text generation tanpa lag",
        "Code viewer dengan dark theme & tombol copy satu klik",
        "Prompt template library untuk developer & pemasar",
        "Penyimpanan obrolan terenkripsi di browser"
      ]
    },
    {
      id: "pro-fintech-vault",
      title: "FinVault - Personal Finance & Budget Tracker",
      category: "Fullstack",
      categorySlug: "fullstack",
      description: "Aplikasi pencatatan keuangan pribadi dan target tabungan dengan kalkulator budgeting 50/30/20 dan notifikasi pengingat tagihan.",
      longDescription: "Membantu pengguna mengontrol pengeluaran harian dan bulanan dengan visualisasi grafik lingkaran dan arus kas. Mendukung pencatatan multi-dompet (Bank, E-Wallet, Cash).",
      image: "assets/images/project-fintech.svg",
      tags: ["Vue 3", "Express.js", "MongoDB", "Chart.js", "JWT Auth"],
      featured: false,
      metrics: "💰 Dicoba oleh 500+ Early Adopters",
      demoUrl: "https://example.com/demo-finvault",
      githubUrl: "https://github.com/example/finvault-tracker",
      features: [
        "Pencatatan pengeluaran & pemasukan instan",
        "Visualisasi kategori pengeluaran teratas",
        "Peringatan otomatis saat pengeluaran mendekati limit anggaran",
        "Autentikasi aman dengan enkripsi password bcrypt"
      ]
    },
    {
      id: "pro-task-flow",
      title: "TaskFlow - Kanban Project Collaboration",
      category: "Web App",
      categorySlug: "webapp",
      description: "Aplikasi manajemen tugas bergaya Kanban drag-and-drop dengan fitur timer Pomodoro, label prioritas, dan kolaborasi tim.",
      longDescription: "TaskFlow menghadirkan pengalaman visual manajemen proyek yang fleksibel dan menyenangkan. Dibangun dengan HTML5 Drag & Drop API native dan sinkronisasi status tugas instan.",
      image: "assets/images/project-taskflow.svg",
      tags: ["JavaScript ES6+", "HTML5 Drag&Drop", "CSS Grid", "IndexedDB"],
      featured: false,
      metrics: "⚡ Zero Dependency | Ringan & Cepat",
      demoUrl: "https://example.com/demo-taskflow",
      githubUrl: "https://github.com/example/taskflow-kanban",
      features: [
        "Drag and drop papan tugas halus tanpa lag",
        "Integrasi timer Pomodoro untuk fokus bekerja",
        "Filter berdasarkan tag, deadline, dan tingkat prioritas",
        "Data tersimpan otomatis secara offline"
      ]
    },
    {
      id: "pro-agency-minimal",
      title: "StudioAura - Luxury Brand Agency Landing Page",
      category: "UI/UX",
      categorySlug: "uiux",
      description: "Landing page premium untuk creative digital agency dengan efek parallax mewah, tipografi elegan, dan cursor magnetik.",
      longDescription: "Website representasi digital dengan estetika modern, micro-interactions, smooth scrolling, dan transisi halaman yang memikat calon klien kelas atas.",
      image: "assets/images/project-agency.svg",
      tags: ["Creative CSS", "Canvas API", "Intersection Observer", "Figma"],
      featured: false,
      metrics: "✨ Awwwards Honorable Mention Nominee",
      demoUrl: "https://example.com/demo-studioaura",
      githubUrl: "https://github.com/example/studioaura-landing",
      features: [
        "Animasi teks reveal dan dynamic magnetic cursor",
        "Interactive case study showcase",
        "Formulir brief proyek interaktif bertahap",
        "Optimalisasi gambar WebP dan lazy loading"
      ]
    }
  ],

  experience: [
    {
      role: "Lead Frontend Developer",
      company: "TechNova Solusindo",
      period: "2023 - Sekarang",
      type: "Full-Time",
      description: "Memimpin tim frontend dalam perancangan dan implementasi antarmuka 3 produk SaaS berskala enterprise. Meningkatkan skor performa web dari 65 menjadi 95+ dan menyusun design system modular berbasis React & Tailwind.",
      skills: ["Next.js", "TypeScript", "Design System", "Team Leadership"]
    },
    {
      role: "Fullstack Web Developer",
      company: "Inovasi Digital Kreatif",
      period: "2022 - 2023",
      type: "Full-Time",
      description: "Membangun RESTful API performa tinggi dengan Node.js dan mengintegrasikan frontend responsif. Menangani migrasi database ke PostgreSQL dan mengoptimalkan kecepatan query database hingga 45%.",
      skills: ["Node.js", "PostgreSQL", "React", "Docker", "REST API"]
    },
    {
      role: "Freelance Web Developer & UI Designer",
      company: "Self-Employed",
      period: "2021 - 2022",
      type: "Freelance",
      description: "Menyelesaikan 15+ proyek website untuk klien UMKM, korporat, dan komunitas. Mencakup company profile, katalog digital interaktif, dan landing page konversi tinggi.",
      skills: ["HTML5/CSS3", "JavaScript", "Figma", "WordPress", "SEO"]
    }
  ],

  education: [
    {
      degree: "Sarjana Komputer (S.Kom) - Teknik Informatika",
      institution: "Universitas Terkemuka Indonesia",
      period: "2019 - 2023",
      grade: "IPK 3.82 / 4.00 (Cum Laude)",
      notes: "Fokus riset pada Rekayasa Perangkat Lunak Web & Arsitektur Sistem Terdistribusi."
    }
  ],

  testimonials: [
    {
      quote: "Naufal adalah developer yang sangat berbakat dan komunikatif. Hasil website company profile kami sangat profesional, cepat, dan berhasil meningkatkan lead masuk sebesar 60% dalam bulan pertama!",
      name: "Budi Pratama",
      title: "CEO, PT Nusantara Digital",
      avatar: "assets/images/avatar-1.svg",
      rating: 5
    },
    {
      quote: "Kerjasama dengan Naufal sangat memuaskan! Kualitas kodenya rapi, mudah dibaca, dan desain interaktifnya membuat produk SaaS kami mendapat banyak pujian dari para investor.",
      name: "Sarah Wijaya",
      title: "Head of Product, VisiCloud ID",
      avatar: "assets/images/avatar-2.svg",
      rating: 5
    },
    {
      quote: "Sangat teliti terhadap detail UI/UX dan selalu memberikan solusi teknis yang efisien. Deadline proyek e-commerce kami terpenuhi tanpa kendala sedikit pun. Sangat direkomendasikan!",
      name: "Rian Firmansyah",
      title: "Founder, Kulture Goods",
      avatar: "assets/images/avatar-3.svg",
      rating: 5
    }
  ],

  faqs: [
    {
      q: "Layanan apa saja yang bisa Naufal kerjakan?",
      a: "Saya menyediakan layanan pembuatan Website Company Profile, Web Application (SaaS/Dashboard), E-Commerce, Landing Page konversi tinggi, hingga integrasi API & optimasi kecepatan web."
    },
    {
      q: "Berapa lama estimasi pengerjaan sebuah proyek?",
      a: "Tergantung skala dan kompleksitas proyek. Untuk Landing page/Company profile umumnya 1-2 minggu, sedangkan Web App kompleks atau E-Commerce berkisar antara 3-6 minggu."
    },
    {
      q: "Apakah website yang dibuat sudah mobile-friendly dan SEO-ready?",
      a: "Pasti! Semua website dibangun dengan prinsip Mobile-First Responsive Design, struktur kode semantik, meta tag SEO lengkap, serta optimasi kecepatan agar peringkat Google maksimal."
    },
    {
      q: "Bagaimana alur kerja sama proyek?",
      a: "Alur kerja terstruktur: (1) Diskusi Kebutuhan & Brief -> (2) Estimasi Biaya & Jadwal -> (3) UI/UX Wireframe & Mockup -> (4) Tahap Coding & Integrasi -> (5) Testing & Feedback -> (6) Deployment ke Hosting & Serah Terima."
    }
  ]
};

// Export to window
if (typeof window !== "undefined") {
  window.PORTFOLIO_DATA = PORTFOLIO_DATA;
}
