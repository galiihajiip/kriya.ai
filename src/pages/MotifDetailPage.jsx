import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useStore from '../store/useStore';
import { generateCulturalNarrative, searchSimilarMotifs } from '../services/geminiService';

const MotifDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { motifs, selectedMotif, setSelectedMotif } = useStore();

  const [narrative, setNarrative] = useState('');
  const [similarMotifs, setSimilarMotifs] = useState([]);
  const [isLoadingNarrative, setIsLoadingNarrative] = useState(false);
  const [activeTab, setActiveTab] = useState('detail');

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
                <button className="text-red-500 hover:text-red-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <button className="w-full px-6 py-3 bg-[#403F2E] text-white rounded-lg font-semibold hover:bg-[#5a5847] transition-colors">
                  Hubungi Pengrajin
                </button>
                <button className="w-full px-6 py-3 border-2 border-[#403F2E] text-[#403F2E] rounded-lg font-semibold hover:bg-[#403F2E] hover:text-white transition-colors">
                  Tambah ke Favorit
                </button>
              </div>

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
