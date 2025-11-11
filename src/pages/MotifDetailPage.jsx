import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useStore from '../store/useStore';
import { generateCulturalNarrative, searchSimilarMotifs } from '../services/geminiService';

const MotifDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { motifs, selectedMotif, setSelectedMotif, toggleFavorite, isFavorite } = useStore();

  const [narrative, setNarrative] = useState('');
  const [similarMotifs, setSimilarMotifs] = useState([]);
  const [isLoadingNarrative, setIsLoadingNarrative] = useState(false);
  const [activeTab, setActiveTab] = useState('detail');
  const [showContactSuccess, setShowContactSuccess] = useState(false);

  // Sample data for demo
  const sampleMotifs = {
    1: {
      id: 1,
      nama_motif: 'Tenun Ikat Sumba',
      daerah_asal: 'Sumba, NTT',
      warna_dominan: ['Merah', 'Hitam', 'Putih'],
      kategori: 'Geometris',
      image: 'https://images.unsplash.com/photo-1609127102567-8a9a21dc27d8?w=800',
      filosofi: 'Motif yang melambangkan keberanian dan kekuatan spiritual masyarakat Sumba.',
      harga: 750000,
      jenis_produk: 'Kain',
      stok: 15,
      deskripsi: 'Tenun Ikat Sumba adalah warisan budaya yang telah diwariskan turun-temurun. Setiap motif memiliki makna filosofis yang mendalam, mencerminkan kepercayaan dan pandangan hidup masyarakat Sumba.',
      kontak_pengrajin: '+62 821 xxxx xxxx'
    },
    2: {
      id: 2,
      nama_motif: 'Batik Parang',
      daerah_asal: 'Yogyakarta',
      warna_dominan: ['Coklat', 'Putih'],
      kategori: 'Geometris',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
      filosofi: 'Melambangkan kekuatan dan keteguhan hati, motif parang adalah motif klasik Jawa.',
      harga: 500000,
      jenis_produk: 'Kain',
      stok: 20,
      deskripsi: 'Batik Parang merupakan salah satu motif batik klasik yang berasal dari Keraton Yogyakarta.',
      kontak_pengrajin: '+62 812 xxxx xxxx'
    }
  };

  const motif = selectedMotif || sampleMotifs[id] || motifs.find(m => m.id === parseInt(id));

  useEffect(() => {
    if (motif) {
      setSelectedMotif(motif);
      loadNarrative();
      loadSimilarMotifs();
    }
  }, [id, motif]);

  const loadNarrative = async () => {
    if (!motif) return;

    setIsLoadingNarrative(true);
    try {
      const story = await generateCulturalNarrative(motif.nama_motif, motif.daerah_asal);
      setNarrative(story);
    } catch (error) {
      console.error('Error loading narrative:', error);
      setNarrative(motif.filosofi || 'Narasi budaya sedang dimuat...');
    } finally {
      setIsLoadingNarrative(false);
    }
  };

  const loadSimilarMotifs = async () => {
    if (!motif) return;

    try {
      const description = `${motif.kategori} dari ${motif.daerah_asal} dengan warna ${motif.warna_dominan?.join(', ')}`;
      const similar = await searchSimilarMotifs(description);
      setSimilarMotifs(similar.slice(0, 3));
    } catch (error) {
      console.error('Error loading similar motifs:', error);
    }
  };

  const handleContactCrafter = () => {
    if (!motif.kontak_pengrajin) {
      alert('Nomor kontak pengrajin tidak tersedia');
      return;
    }

    // Format nomor untuk WhatsApp (hapus +, -, spasi)
    const phoneNumber = motif.kontak_pengrajin.replace(/[\s\-\+]/g, '');

    // Pesan default
    const message = encodeURIComponent(
      `Halo, saya tertarik dengan produk ${motif.nama_motif} dari ${motif.daerah_asal}. Apakah masih tersedia?`
    );

    // Buka WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');

    // Show success feedback
    setShowContactSuccess(true);
    setTimeout(() => setShowContactSuccess(false), 3000);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(motif.id);
  };

  const isInFavorites = isFavorite(motif?.id);

  if (!motif) {
    return (
      <div className="min-h-screen bg-[#FDFBF5] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#403F2E] mb-4">Motif tidak ditemukan</h2>
          <Link
            to="/explore"
            className="px-6 py-3 bg-[#403F2E] text-white rounded-lg hover:bg-[#5a5847] transition-colors inline-block"
          >
            Kembali ke Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF5] py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-[#403F2E]">Home</Link>
          {' / '}
          <Link to="/explore" className="hover:text-[#403F2E]">Explore</Link>
          {' / '}
          <span className="text-[#403F2E] font-semibold">{motif.nama_motif}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={motif.image}
                alt={motif.nama_motif}
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1
                    className="text-3xl font-bold text-[#403F2E] mb-2"
                    style={{ fontFamily: 'Merriweather, serif' }}
                  >
                    {motif.nama_motif}
                  </h1>
                  <p className="text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {motif.daerah_asal}
                  </p>
                </div>
                <button
                  onClick={handleToggleFavorite}
                  className={`transition-all ${
                    isInFavorites
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                  title={isInFavorites ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                >
                  <svg
                    className="w-6 h-6"
                    fill={isInFavorites ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="text-3xl font-bold text-[#403F2E]">
                  Rp {motif.harga?.toLocaleString('id-ID')}
                </div>
                {motif.stok && (
                  <p className="text-sm text-gray-600 mt-2">
                    Stok tersedia: <span className="font-semibold">{motif.stok} unit</span>
                  </p>
                )}
              </div>

              {/* Warna Dominan */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Warna Dominan:</h3>
                <div className="flex flex-wrap gap-2">
                  {motif.warna_dominan?.map((warna, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#F8C471] text-[#403F2E] text-sm rounded-full font-medium"
                    >
                      {warna}
                    </span>
                  ))}
                </div>
              </div>

              {/* Kategori & Jenis */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Kategori:</h3>
                  <p className="text-gray-800">{motif.kategori}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Jenis Produk:</h3>
                  <p className="text-gray-800">{motif.jenis_produk}</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleContactCrafter}
                  className="w-full px-6 py-3 bg-[#403F2E] text-white rounded-lg font-semibold hover:bg-[#5a5847] transition-all flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>Hubungi via WhatsApp</span>
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                    isInFavorites
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'border-2 border-[#403F2E] text-[#403F2E] hover:bg-[#403F2E] hover:text-white'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={isInFavorites ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                  <span>{isInFavorites ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}</span>
                </button>
              </div>

              {/* Success Message */}
              {showContactSuccess && (
                <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-800 text-sm">
                  ✓ WhatsApp dibuka! Silakan lanjutkan percakapan dengan pengrajin.
                </div>
              )}

              {/* Kontak */}
              {motif.kontak_pengrajin && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Kontak:</strong> {motif.kontak_pengrajin}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('detail')}
              className={`pb-3 px-4 font-semibold transition-colors ${
                activeTab === 'detail'
                  ? 'border-b-2 border-[#F8C471] text-[#403F2E]'
                  : 'text-gray-500 hover:text-[#403F2E]'
              }`}
            >
              Deskripsi Produk
            </button>
            <button
              onClick={() => setActiveTab('culture')}
              className={`pb-3 px-4 font-semibold transition-colors ${
                activeTab === 'culture'
                  ? 'border-b-2 border-[#F8C471] text-[#403F2E]'
                  : 'text-gray-500 hover:text-[#403F2E]'
              }`}
            >
              Narasi Budaya
            </button>
          </div>

          {activeTab === 'detail' ? (
            <div>
              <h3 className="text-xl font-bold text-[#403F2E] mb-4">Tentang Produk</h3>
              <p className="text-gray-700 leading-relaxed mb-6">{motif.deskripsi}</p>

              <h3 className="text-xl font-bold text-[#403F2E] mb-4">Filosofi Motif</h3>
              <p className="text-gray-700 leading-relaxed">{motif.filosofi}</p>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold text-[#403F2E] mb-4">Cerita Budaya</h3>
              {isLoadingNarrative ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#403F2E] mr-3"></div>
                  <span className="text-gray-600">AI sedang menyusun narasi budaya...</span>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{narrative}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Similar Motifs */}
        {similarMotifs.length > 0 && (
          <div className="mt-8">
            <h2
              className="text-2xl font-bold text-[#403F2E] mb-6"
              style={{ fontFamily: 'Merriweather, serif' }}
            >
              Motif Serupa yang Mungkin Anda Suka
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarMotifs.map((similar, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-bold text-[#403F2E] mb-2">
                    {similar.nama_motif}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{similar.daerah_asal}</p>
                  <p className="text-sm text-gray-700 mb-3">{similar.similarity_reason}</p>
                  <p className="text-xs text-gray-500">{similar.characteristics}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MotifDetailPage;
