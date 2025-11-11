import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import { analyzeMotifImage } from '../services/geminiService';

const ExplorePage = () => {
  const {
    motifs,
    filters,
    setFilters,
    resetFilters,
    getFilteredMotifs,
    setSelectedMotif,
    setLoading,
    isLoading
  } = useStore();

  const [filteredMotifs, setFilteredMotifs] = useState([]);
  const [showVisualSearch, setShowVisualSearch] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    setFilteredMotifs(getFilteredMotifs());
  }, [motifs, filters]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploadedImage(URL.createObjectURL(file));
    setLoading(true);

    try {
      const result = await analyzeMotifImage(file);
      setSearchResult(result);

      // Auto-apply filters based on AI result
      if (result.daerah_asal) {
        handleFilterChange('daerah', result.daerah_asal);
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Gagal menganalisis gambar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  const clearVisualSearch = () => {
    setUploadedImage(null);
    setSearchResult(null);
    resetFilters();
  };

  // Sample data untuk demo - dengan gambar batik yang relevan
  const sampleMotifs = [
    {
      id: 1,
      nama_motif: 'Tenun Ikat Sumba',
      daerah_asal: 'Sumba, NTT',
      warna_dominan: ['Merah', 'Hitam', 'Putih'],
      kategori: 'Geometris',
      image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80',
      deskripsi: 'Tenun ikat khas Sumba dengan motif tradisional yang kaya akan makna budaya',
      filosofi: 'Motif yang melambangkan keberanian dan kekuatan',
      harga: 750000,
      jenis_produk: 'Tenun Ikat',
      stok: 15,
      kontak_pengrajin: '+6282145678901'
    },
    {
      id: 2,
      nama_motif: 'Batik Parang Rusak',
      daerah_asal: 'Yogyakarta',
      warna_dominan: ['Coklat', 'Putih'],
      kategori: 'Geometris',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80',
      deskripsi: 'Batik Parang adalah motif batik yang melambangkan kekuatan',
      filosofi: 'Melambangkan kekuatan dan keteguhan hati',
      harga: 500000,
      jenis_produk: 'Batik Tulis',
      stok: 20,
      kontak_pengrajin: '+6281234567890'
    },
    {
      id: 3,
      nama_motif: 'Songket Palembang',
      daerah_asal: 'Palembang, Sumatera Selatan',
      warna_dominan: ['Emas', 'Merah', 'Hijau'],
      kategori: 'Flora',
      image: 'https://images.unsplash.com/photo-1610349656925-0ec921557c70?w=800&q=80',
      deskripsi: 'Kain songket dengan benang emas khas Palembang',
      filosofi: 'Simbol kemewahan dan keanggunan',
      harga: 1200000,
      jenis_produk: 'Songket',
      stok: 10,
      kontak_pengrajin: '+6281398765432'
    },
    {
      id: 4,
      nama_motif: 'Ulos Batak',
      daerah_asal: 'Sumatera Utara',
      warna_dominan: ['Merah', 'Hitam', 'Putih'],
      kategori: 'Geometris',
      image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800&q=80',
      deskripsi: 'Kain ulos tradisional Batak dengan motif geometris khas',
      filosofi: 'Melambangkan kehangatan dan kasih sayang',
      harga: 850000,
      jenis_produk: 'Kain Ulos',
      stok: 12,
      kontak_pengrajin: '+6285267891234'
    },
    {
      id: 5,
      nama_motif: 'Tenun Toraja',
      daerah_asal: 'Tana Toraja, Sulawesi Selatan',
      warna_dominan: ['Merah', 'Kuning', 'Hitam'],
      kategori: 'Geometris',
      image: 'https://images.unsplash.com/photo-1609127102567-8a9a21dc27d8?w=800&q=80',
      deskripsi: 'Tenun khas Toraja dengan pola geometris yang indah',
      filosofi: 'Merepresentasikan status sosial dan kehormatan',
      harga: 950000,
      jenis_produk: 'Tenun Tradisional',
      stok: 8,
      kontak_pengrajin: '+6281456789012'
    },
    {
      id: 6,
      nama_motif: 'Batik Mega Mendung',
      daerah_asal: 'Cirebon, Jawa Barat',
      warna_dominan: ['Biru', 'Putih'],
      kategori: 'Awan',
      image: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=800&q=80',
      deskripsi: 'Batik Mega Mendung dengan motif awan khas Cirebon',
      filosofi: 'Melambangkan kesabaran dan keteduhan',
      harga: 650000,
      jenis_produk: 'Batik Cap',
      stok: 18,
      kontak_pengrajin: '+6285789123456'
    },
    {
      id: 7,
      nama_motif: 'Batik Kawung',
      daerah_asal: 'Yogyakarta',
      warna_dominan: ['Coklat', 'Hitam'],
      kategori: 'Geometris',
      image: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&q=80',
      deskripsi: 'Motif batik kawung yang melambangkan kesucian dan umur panjang',
      filosofi: 'Melambangkan kesempurnaan dan kesucian',
      harga: 550000,
      jenis_produk: 'Batik Tulis',
      stok: 22,
      kontak_pengrajin: '+6281267894561'
    },
    {
      id: 8,
      nama_motif: 'Tenun Gringsing Bali',
      daerah_asal: 'Bali',
      warna_dominan: ['Merah', 'Kuning', 'Hitam'],
      kategori: 'Geometris',
      image: 'https://images.unsplash.com/photo-1606217290941-e9162bd0a8fd?w=800&q=80',
      deskripsi: 'Tenun gringsing langka dari Bali dengan teknik double ikat',
      filosofi: 'Melindungi dari bahaya dan memberikan keberuntungan',
      harga: 2500000,
      jenis_produk: 'Tenun Double Ikat',
      stok: 3,
      kontak_pengrajin: '+6281345789123'
    }
  ];

  // Helper function untuk filter motifs (works with any array)
  const filterMotifs = (motifsArray) => {
    let filtered = [...motifsArray];

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.nama_motif?.toLowerCase().includes(query) ||
        m.daerah_asal?.toLowerCase().includes(query) ||
        m.deskripsi?.toLowerCase().includes(query) ||
        m.filosofi?.toLowerCase().includes(query)
      );
    }

    if (filters.daerah) {
      filtered = filtered.filter(m =>
        m.daerah_asal?.toLowerCase().includes(filters.daerah.toLowerCase())
      );
    }

    if (filters.warna) {
      filtered = filtered.filter(m =>
        m.warna_dominan?.some(w =>
          w.toLowerCase().includes(filters.warna.toLowerCase())
        )
      );
    }

    if (filters.kategori) {
      filtered = filtered.filter(m =>
        m.kategori?.toLowerCase() === filters.kategori.toLowerCase()
      );
    }

    return filtered;
  };

  // Use filtered motifs from store if available, otherwise filter sample data
  const displayMotifs = motifs.length > 0 ? filteredMotifs : filterMotifs(sampleMotifs);

  return (
    <div className="min-h-screen bg-[#FDFBF5] py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold text-[#403F2E] mb-4"
            style={{ fontFamily: 'Merriweather, serif' }}
          >
            Jelajahi Motif Nusantara
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan keindahan kriya tradisional Indonesia dengan teknologi Visual AI
          </p>
        </div>

        {/* Visual Search Toggle */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setShowVisualSearch(!showVisualSearch)}
            className="px-6 py-3 bg-[#F8C471] text-[#403F2E] rounded-lg font-semibold hover:bg-[#f0b854] transition-all inline-flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <span>{showVisualSearch ? 'Tutup' : 'Cari dengan'} Visual AI</span>
          </button>
        </div>

        {/* Visual Search Section */}
        {showVisualSearch && (
          <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-[#403F2E] mb-4">
              Upload Foto untuk Pencarian Visual
            </h3>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-[#F8C471] bg-yellow-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploadedImage ? (
                <div>
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="max-w-xs mx-auto rounded-lg mb-4"
                  />
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#403F2E]"></div>
                      <span>Menganalisis gambar...</span>
                    </div>
                  ) : searchResult ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <h4 className="font-bold text-green-800 mb-2">Hasil Analisis AI:</h4>
                      <p className="text-sm text-gray-700">
                        <strong>Motif:</strong> {searchResult.nama_motif}<br/>
                        <strong>Daerah:</strong> {searchResult.daerah_asal}<br/>
                        <strong>Kategori:</strong> {searchResult.kategori}<br/>
                        <strong>Confidence:</strong> {searchResult.confidence}%
                      </p>
                    </div>
                  ) : null}
                  <button
                    onClick={clearVisualSearch}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Hapus & Cari Lagi
                  </button>
                </div>
              ) : (
                <>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mb-4 text-gray-600">
                    Drag & drop foto di sini atau klik untuk upload
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer px-4 py-2 bg-[#403F2E] text-white rounded-lg hover:bg-[#5a5847] transition-colors inline-block"
                  >
                    Pilih File
                  </label>
                </>
              )}
            </div>
          </div>
        )}

        {/* Filters & Search */}
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-4">
              <input
                type="text"
                placeholder="Cari motif, daerah, atau deskripsi..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C471]"
              />
            </div>

            {/* Daerah Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daerah Asal
              </label>
              <select
                value={filters.daerah}
                onChange={(e) => handleFilterChange('daerah', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C471]"
              >
                <option value="">Semua Daerah</option>
                <option value="Sumba">Sumba, NTT</option>
                <option value="Yogyakarta">Yogyakarta</option>
                <option value="Palembang">Palembang</option>
                <option value="Sumatera Utara">Sumatera Utara</option>
                <option value="Toraja">Tana Toraja</option>
                <option value="Cirebon">Cirebon</option>
                <option value="Bali">Bali</option>
              </select>
            </div>

            {/* Warna Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warna Dominan
              </label>
              <select
                value={filters.warna}
                onChange={(e) => handleFilterChange('warna', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C471]"
              >
                <option value="">Semua Warna</option>
                <option value="Merah">Merah</option>
                <option value="Biru">Biru</option>
                <option value="Hijau">Hijau</option>
                <option value="Kuning">Kuning</option>
                <option value="Hitam">Hitam</option>
                <option value="Putih">Putih</option>
                <option value="Coklat">Coklat</option>
                <option value="Emas">Emas</option>
              </select>
            </div>

            {/* Kategori Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori Motif
              </label>
              <select
                value={filters.kategori}
                onChange={(e) => handleFilterChange('kategori', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C471]"
              >
                <option value="">Semua Kategori</option>
                <option value="Geometris">Geometris</option>
                <option value="Flora">Flora</option>
                <option value="Fauna">Fauna</option>
                <option value="Awan">Awan</option>
                <option value="Abstrak">Abstrak</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Menampilkan <strong>{displayMotifs.length}</strong> motif
          </p>
        </div>

        {/* Motif Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayMotifs.map((motif) => (
            <Link
              key={motif.id}
              to={`/motif/${motif.id}`}
              onClick={() => setSelectedMotif(motif)}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-2"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={motif.image}
                  alt={motif.nama_motif}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#403F2E] mb-2">
                  {motif.nama_motif}
                </h3>
                <p className="text-gray-600 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {motif.daerah_asal}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {motif.warna_dominan?.map((warna, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-[#F8C471] text-[#403F2E] text-xs rounded-full"
                    >
                      {warna}
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                  {motif.filosofi}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#403F2E]">
                    Rp {motif.harga?.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[#F8C471] font-medium hover:underline">
                    Lihat Detail →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {displayMotifs.length === 0 && (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Tidak ada motif ditemukan
            </h3>
            <p className="text-gray-500 mb-4">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-[#F8C471] text-[#403F2E] rounded-lg hover:bg-[#f0b854] transition-colors"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
