import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { analyzeMotifImage, generateProductDescription } from '../services/geminiService';

const UploadPage = () => {
  const navigate = useNavigate();
  const { addMotif, isAuthenticated, setLoading, isLoading } = useStore();

  const [formData, setFormData] = useState({
    nama_motif: '',
    daerah_asal: '',
    jenis_produk: '',
    warna_dominan: [],
    kategori: '',
    filosofi: '',
    deskripsi: '',
    harga: '',
    stok: '',
    kontak_pengrajin: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    // Auto-analyze with AI
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeMotifImage(file);
      setAiAnalysis(analysis);

      // Auto-fill form dengan hasil AI
      setFormData({
        ...formData,
        nama_motif: analysis.nama_motif || '',
        daerah_asal: analysis.daerah_asal || '',
        jenis_produk: analysis.jenis_produk || '',
        warna_dominan: analysis.warna_dominan || [],
        kategori: analysis.kategori || '',
        filosofi: analysis.filosofi || '',
        deskripsi: analysis.deskripsi || ''
      });

      // Generate product description
      const description = await generateProductDescription(analysis);
      setFormData(prev => ({ ...prev, deskripsi: description }));
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Gagal menganalisis gambar. Anda bisa melanjutkan mengisi form secara manual.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleWarnaDominanChange = (warna) => {
    const updatedWarna = formData.warna_dominan.includes(warna)
      ? formData.warna_dominan.filter(w => w !== warna)
      : [...formData.warna_dominan, warna];

    setFormData({ ...formData, warna_dominan: updatedWarna });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert('Mohon upload foto produk');
      return;
    }

    if (!formData.nama_motif || !formData.daerah_asal || !formData.harga) {
      alert('Mohon lengkapi field yang wajib diisi');
      return;
    }

    setLoading(true);

    try {
      // Simulate upload - in production, upload to Firebase Storage
      const newMotif = {
        ...formData,
        image: imagePreview,
        createdAt: new Date().toISOString(),
        uploadedBy: 'current_user', // Replace with actual user
        confidence: aiAnalysis?.confidence || 0
      };

      addMotif(newMotif);

      alert('Produk berhasil ditambahkan! Menunggu verifikasi admin.');
      navigate('/explore');
    } catch (error) {
      console.error('Error uploading product:', error);
      alert('Gagal menambahkan produk. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const warnaOptions = ['Merah', 'Biru', 'Hijau', 'Kuning', 'Hitam', 'Putih', 'Coklat', 'Emas', 'Oranye', 'Ungu'];

  return (
    <div className="min-h-screen bg-[#FDFBF5] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold text-[#403F2E] mb-4"
            style={{ fontFamily: 'Merriweather, serif' }}
          >
            Unggah Kriya Anda
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bagikan karya kriya tradisional Anda dengan dunia. AI kami akan membantu
            mengklasifikasi dan mendeskripsikan produk secara otomatis.
          </p>
        </div>

        {/* AI Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-blue-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Bantuan AI Otomatis</h3>
              <p className="text-sm text-blue-800">
                Setelah Anda upload foto, Gemini AI akan menganalisis motif dan mengisi form secara otomatis.
                Anda tetap bisa mengedit hasilnya sebelum submit.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          {/* Image Upload */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-[#403F2E] mb-3">
              Foto Produk <span className="text-red-500">*</span>
            </label>

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-96 object-contain rounded-lg mb-4"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    setAiAnalysis(null);
                  }}
                  className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Hapus
                </button>

                {isAnalyzing && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#403F2E]"></div>
                      <span className="text-yellow-800">AI sedang menganalisis gambar...</span>
                    </div>
                  </div>
                )}

                {aiAnalysis && !isAnalyzing && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h4 className="font-bold text-green-800 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Analisis AI Selesai
                    </h4>
                    <p className="text-sm text-green-700">
                      Confidence Score: <strong>{aiAnalysis.confidence}%</strong><br/>
                      Form telah diisi otomatis berdasarkan hasil analisis. Silakan review dan edit jika perlu.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
                <p className="mb-4 text-gray-600">Upload foto produk kriya Anda</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="product-image"
                  required
                />
                <label
                  htmlFor="product-image"
                  className="cursor-pointer px-4 py-2 bg-[#403F2E] text-white rounded-lg hover:bg-[#5a5847] transition-colors inline-block"
                >
                  Pilih File
                </label>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Motif */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Motif <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama_motif"
                value={formData.nama_motif}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C471]"
                required
              />
            </div>

            {/* Daerah Asal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Daerah Asal <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="daerah_asal"
                value={formData.daerah_asal}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C471]"
                placeholder="Contoh: Sumba, NTT"
                required
              />
            </div>

            {/* Jenis Produk */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jenis Produk
              </label>
              <select
                name="jenis_produk"
                value={formData.jenis_produk}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C471]"
              >
                <option value="">Pilih Jenis</option>
                <option value="Kain">Kain</option>
                <option value="Sarung">Sarung</option>
                <option value="Selendang">Selendang</option>
                <option value="Tas">Tas</option>
                <option value="Pakaian">Pakaian</option>
                <option value="Aksesoris">Aksesoris</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kategori Motif
              </label>
              <select
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C471]"
              >
                <option value="">Pilih Kategori</option>
                <option value="Geometris">Geometris</option>
                <option value="Flora">Flora</option>
                <option value="Fauna">Fauna</option>
                <option value="Awan">Awan</option>
                <option value="Abstrak">Abstrak</option>
                <option value="Campuran">Campuran</option>
              </select>
            </div>

            {/* Harga */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Harga (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="harga"
                value={formData.harga}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C471]"
                min="0"
                required
              />
            </div>

            {/* Stok */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stok Tersedia
              </label>
              <input
                type="number"
                name="stok"
                value={formData.stok}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C471]"
                min="0"
              />
            </div>
          </div>

          {/* Warna Dominan */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Warna Dominan (Pilih hingga 3)
            </label>
            <div className="flex flex-wrap gap-2">
              {warnaOptions.map((warna) => (
                <button
                  key={warna}
                  type="button"
                  onClick={() => handleWarnaDominanChange(warna)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    formData.warna_dominan.includes(warna)
                      ? 'bg-[#F8C471] text-[#403F2E] font-semibold'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {warna}
                </button>
              ))}
            </div>
          </div>

          {/* Filosofi */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filosofi & Makna
            </label>
            <textarea
              name="filosofi"
              value={formData.filosofi}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C471]"
              placeholder="Jelaskan makna dan filosofi di balik motif ini..."
            />
          </div>

          {/* Deskripsi */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deskripsi Produk
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C471]"
              placeholder="Deskripsi detail tentang produk, bahan, ukuran, cara perawatan, dll..."
            />
          </div>

          {/* Kontak */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kontak Pengrajin
            </label>
            <input
              type="text"
              name="kontak_pengrajin"
              value={formData.kontak_pengrajin}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C471]"
              placeholder="WhatsApp, Email, atau nomor telepon"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={isLoading || isAnalyzing}
              className="flex-1 px-6 py-3 bg-[#403F2E] text-white rounded-lg font-semibold hover:bg-[#5a5847] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Mengunggah...' : 'Unggah Produk'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/explore')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
