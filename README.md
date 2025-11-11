# KRIYA.AI - Platform Marketplace dan Katalog Digital Kriya Tradisional Indonesia

<div align="center">
  <h3>🎨 Melestarikan Warisan Budaya Nusantara dengan Teknologi AI 🤖</h3>
  <p>Platform berbasis AI untuk eksplorasi, edukasi, dan perdagangan kriya tradisional Indonesia</p>
</div>

---

## 🌟 Tentang KRIYA.AI

KRIYA.AI adalah platform marketplace dan katalog digital yang memanfaatkan kekuatan Visual AI untuk melestarikan dan mempromosikan motif tenun serta kriya daerah tradisional Indonesia. Platform ini menghubungkan pengrajin lokal dengan pecinta budaya dari seluruh nusantara.

### Visi & Misi

- **Visi**: Menjadi platform terdepan dalam pelestarian dan digitalisasi kriya tradisional Indonesia
- **Misi**:
  - Memfasilitasi pengrajin lokal untuk menjangkau pasar yang lebih luas
  - Mendokumentasikan dan mengklasifikasikan motif tradisional dengan teknologi AI
  - Mengedukasi generasi muda tentang warisan budaya melalui narasi interaktif

---

## ✨ Fitur Utama

### 🏠 Homepage (Landing Page)
- Hero section dengan visual menarik dari Tenun Ikat Sumba
- Call-to-action untuk eksplorasi dan upload produk
- Statistik platform real-time
- Testimoni pengguna
- Desain responsif dengan warna budaya Indonesia

### 🔍 Jelajah Motif (Explore Page)
- **Visual AI Search**: Upload foto untuk pencarian motif dengan teknologi Gemini Vision AI
- Grid galeri motif dengan informasi lengkap
- Filter berdasarkan:
  - Daerah asal
  - Warna dominan
  - Kategori motif (geometris, flora, fauna, dll)
- Search bar untuk pencarian teks
- Auto-classification menggunakan AI

### 📤 Unggah Produk (Upload Form)
- Form upload dengan drag & drop support
- **AI Auto-Classification**:
  - Gemini AI menganalisis gambar secara otomatis
  - Mengidentifikasi nama motif, daerah asal, warna dominan
  - Generate deskripsi produk otomatis
- Staging ke local storage atau Firebase
- Validasi input dengan feedback real-time

### 📚 Edukasi Motif (Education Page)
- **Narasi Budaya AI-Generated**:
  - Cerita sejarah dan filosofi motif
  - Proses pembuatan tradisional
  - Legenda dan cerita rakyat terkait
- **Quiz Interaktif**:
  - Pertanyaan dinamis dari AI
  - Scoring dan leaderboard
  - Penjelasan jawaban edukatif
- Modul pembelajaran bertingkat

### 👤 Admin Dashboard
- CRUD motif lengkap (Create, Read, Update, Delete)
- Verifikasi pengrajin dan produk
- Monitoring traffic dan statistik:
  - Total motif dan views
  - Motif populer
  - Upload terbaru
  - Revenue tracking
- Analytics dashboard dengan visualisasi data

---

## 🛠️ Teknologi Stack

### Frontend
- **React.js** - Library UI modern
- **Tailwind CSS v4** - Styling utility-first
- **React Router v6** - Client-side routing
- **Zustand** - State management yang lightweight

### AI & Backend
- **Google Gemini AI** (Pro & Vision):
  - `gemini-1.5-flash` - Analisis gambar motif
  - `gemini-pro` - Generate narasi budaya & quiz
- **Gemini API Key**: `AIzaSyA04psV-26TvZv0qPFbLMdxCJYfTF4SdIU`

### Development Tools
- **Vite** - Build tool super cepat
- **Axios** - HTTP client
- **Firebase** (Optional) - Storage dan database

---

## 🚀 Cara Menjalankan Project

### Prerequisites
- Node.js v18+
- npm atau yarn
- Git

### Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd kriya.ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Jalankan development server**
   ```bash
   npm run dev
   ```

4. **Buka browser**
   ```
   http://localhost:5173
   ```

### Build untuk Production

```bash
npm run build
```

File production akan ada di folder `dist/`

### Preview Build

```bash
npm run preview
```

---

## 📂 Struktur Project

```
kriya.ai/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   └── common/
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ExplorePage.jsx
│   │   ├── UploadPage.jsx
│   │   ├── EducationPage.jsx
│   │   ├── AdminPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── MotifDetailPage.jsx
│   ├── services/
│   │   └── geminiService.js         # Integrasi Gemini AI
│   ├── store/
│   │   └── useStore.js               # Zustand state management
│   ├── utils/
│   ├── assets/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── vite.config.js
└── README.md
```

---

## 🎨 Design System

### Color Palette
- **Primary**: `#403F2E` - Coklat tanah budaya
- **Accent**: `#F8C471` - Kuning emas
- **Background**: `#FDFBF5` - Putih hangat
- **Text**: `#2C2C2C` - Hitam lembut

### Typography
- **Body Text**: Inter (Google Fonts)
- **Headings**: Merriweather (Google Fonts)

---

## 🤖 Integrasi Gemini AI

### Use Cases AI

1. **Image Classification** (`analyzeMotifImage`)
   - Input: File gambar motif
   - Output: JSON dengan nama motif, daerah asal, warna dominan, kategori, filosofi
   - Confidence score untuk akurasi

2. **Cultural Narrative Generation** (`generateCulturalNarrative`)
   - Input: Nama motif + daerah asal
   - Output: Narasi budaya 3-4 paragraf
   - Mencakup sejarah, filosofi, proses pembuatan

3. **Similar Motif Search** (`searchSimilarMotifs`)
   - Input: Deskripsi motif
   - Output: Array motif serupa dengan alasan similarity

4. **Product Description Generator** (`generateProductDescription`)
   - Input: Data produk (nama, daerah, jenis, warna)
   - Output: Deskripsi e-commerce yang menarik

5. **Quiz Generator** (`generateQuizQuestions`)
   - Input: Nama motif
   - Output: Array 5 pertanyaan multiple choice dengan penjelasan

### API Endpoints
```javascript
// Gemini API Base URL
https://generativelanguage.googleapis.com/v1beta/models/

// Models Used
- gemini-1.5-flash (Vision)
- gemini-pro (Text)
```

---

## 🔐 Authentication & Authorization

Sistem demo menggunakan role-based access:
- **User/Pengrajin**: Upload produk, browse katalog
- **Admin**: Kelola motif, verifikasi, lihat analytics

### Quick Login Demo
- User: Klik "Login sebagai User" di halaman login
- Admin: Klik "Login sebagai Admin" di halaman login

---

## 📱 Responsive Design

Aplikasi fully responsive untuk:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

---

## 🎯 MVP Features (Demo Kompetisi)

✅ Upload gambar → AI klasifikasi motif
✅ Hasil AI → deskripsi otomatis + listing katalog
✅ Halaman edukasi → narasi sejarah AI-generated
✅ Quiz interaktif dengan scoring
✅ Responsive web design
✅ Dashboard admin dasar
✅ Visual search dengan drag & drop

---

## 🚧 Roadmap & Future Features

### Phase 2
- [ ] Firebase Authentication integration
- [ ] Firebase Storage untuk upload gambar
- [ ] Firebase Realtime Database
- [ ] Payment gateway integration
- [ ] Chat antara pembeli & pengrajin
- [ ] Wishlist & cart functionality

### Phase 3
- [ ] Mobile app (React Native)
- [ ] AR try-on untuk produk
- [ ] Blockchain untuk certificate of authenticity
- [ ] Machine learning model custom-trained
- [ ] Multi-language support

---

## 👥 Tim Pengembang

- **Developer**: AI Assistant
- **AI Integration**: Google Gemini API
- **Design System**: Material Design + Indonesian Culture

---

## 📄 License

Copyright © 2024 KRIYA.AI
All rights reserved.

---

## 🙏 Acknowledgments

- Google Generative AI (Gemini) untuk teknologi AI
- Unsplash untuk placeholder images
- Komunitas pengrajin Indonesia
- Kementerian Pendidikan dan Kebudayaan RI

---

## 📞 Contact & Support

- **Email**: info@kriya.ai
- **Website**: https://kriya.ai
- **Instagram**: @kriya.ai
- **Location**: Jakarta, Indonesia

---

<div align="center">
  <p><strong>Mari bersama lestarikan warisan budaya Nusantara! 🇮🇩</strong></p>
  <p>Made with ❤️ for Indonesia</p>
</div>
