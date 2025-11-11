import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      icon: '🔍',
      title: 'Visual AI Search',
      description: 'Cari motif dengan upload foto. AI kami akan mengidentifikasi pola dan memberikan informasi detail.'
    },
    {
      icon: '📚',
      title: 'Edukasi Budaya',
      description: 'Pelajari filosofi dan sejarah di balik setiap motif tenun dan kriya tradisional Indonesia.'
    },
    {
      icon: '🏪',
      title: 'Marketplace Lokal',
      description: 'Dukung pengrajin lokal dengan membeli langsung produk kriya autentik berkualitas tinggi.'
    },
    {
      icon: '🤖',
      title: 'AI-Powered Catalog',
      description: 'Katalog digital pintar yang mengklasifikasi dan mendeskripsikan produk secara otomatis.'
    }
  ];

  const testimonials = [
    {
      name: 'Ibu Siti',
      role: 'Pengrajin Tenun Sumba',
      text: 'KRIYA.AI membantu saya menjangkau pembeli dari seluruh Indonesia. Sangat mudah digunakan!',
      location: 'Sumba, NTT'
    },
    {
      name: 'Andi Pratama',
      role: 'Kolektor Kriya',
      text: 'Fitur pencarian visual sangat membantu saya menemukan motif yang saya cari dengan cepat.',
      location: 'Jakarta'
    },
    {
      name: 'Sarah Wijaya',
      role: 'Mahasiswa Desain',
      text: 'Platform edukasi yang luar biasa! Saya belajar banyak tentang filosofi motif tradisional.',
      location: 'Bandung'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1609127102567-8a9a21dc27d8?q=80&w=2070)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'Merriweather, serif' }}
          >
            Warisan Budaya Nusantara<br />
            <span className="text-[#F8C471]">Dipelihara dengan AI</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">
            Jelajahi, pelajari, dan lestarikan motif tenun serta kriya tradisional Indonesia
            dengan teknologi Visual AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/explore"
              className="px-8 py-4 bg-[#F8C471] text-[#403F2E] rounded-lg font-semibold text-lg hover:bg-[#f0b854] transition-all transform hover:scale-105 shadow-lg"
            >
              Jelajahi Motif Nusantara
            </Link>
            <Link
              to="/upload"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-[#403F2E] transition-all transform hover:scale-105"
            >
              Unggah Kriya Anda
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold mb-4 text-[#403F2E]"
              style={{ fontFamily: 'Merriweather, serif' }}
            >
              Fitur Unggulan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Teknologi AI untuk melestarikan dan mempromosikan kriya tradisional Indonesia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-[#FDFBF5] rounded-lg border border-gray-200 hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-[#403F2E]">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#403F2E] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-[#F8C471] mb-2">500+</div>
              <div className="text-lg">Motif Terdaftar</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#F8C471] mb-2">34</div>
              <div className="text-lg">Provinsi</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#F8C471] mb-2">1000+</div>
              <div className="text-lg">Pengrajin</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#F8C471] mb-2">98%</div>
              <div className="text-lg">Akurasi AI</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold mb-4 text-[#403F2E]"
              style={{ fontFamily: 'Merriweather, serif' }}
            >
              Cara Kerja
            </h2>
            <p className="text-lg text-gray-600">Mudah dan cepat dengan bantuan AI</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#F8C471] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-[#403F2E]">
                1
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#403F2E]">Upload Foto</h3>
              <p className="text-gray-600">
                Unggah foto motif kain atau kriya yang ingin Anda identifikasi atau jual
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#F8C471] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-[#403F2E]">
                2
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#403F2E]">AI Menganalisis</h3>
              <p className="text-gray-600">
                Gemini AI mengidentifikasi motif, daerah asal, dan menghasilkan deskripsi budaya
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#F8C471] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-[#403F2E]">
                3
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#403F2E]">Jelajahi & Beli</h3>
              <p className="text-gray-600">
                Temukan produk serupa atau tambahkan ke katalog untuk dijual
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#FDFBF5]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold mb-4 text-[#403F2E]"
              style={{ fontFamily: 'Merriweather, serif' }}
            >
              Apa Kata Mereka
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
              <div className="text-6xl text-[#F8C471] mb-4">"</div>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                {testimonials[currentSlide].text}
              </p>
              <div className="flex items-center">
                <div className="w-16 h-16 bg-[#F8C471] rounded-full flex items-center justify-center text-2xl font-bold text-[#403F2E] mr-4">
                  {testimonials[currentSlide].name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-[#403F2E]">{testimonials[currentSlide].name}</div>
                  <div className="text-gray-600">{testimonials[currentSlide].role}</div>
                  <div className="text-sm text-gray-500">{testimonials[currentSlide].location}</div>
                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentSlide === index ? 'bg-[#F8C471] w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#403F2E] to-[#5a5847] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2
            className="text-4xl font-bold mb-6"
            style={{ fontFamily: 'Merriweather, serif' }}
          >
            Mulai Jelajahi Warisan Budaya Indonesia
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-200">
            Bergabunglah dengan ribuan pecinta budaya dan pengrajin dalam melestarikan
            kriya tradisional Nusantara
          </p>
          <Link
            to="/explore"
            className="inline-block px-8 py-4 bg-[#F8C471] text-[#403F2E] rounded-lg font-semibold text-lg hover:bg-[#f0b854] transition-all transform hover:scale-105 shadow-lg"
          >
            Mulai Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
