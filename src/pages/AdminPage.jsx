import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const AdminPage = () => {
  const navigate = useNavigate();
  const {
    motifs,
    user,
    isAuthenticated,
    updateMotif,
    deleteMotif,
    setSelectedMotif
  } = useStore();

  const [activeTab, setActiveTab] = useState('motifs');
  const [editingMotif, setEditingMotif] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleEditMotif = (motif) => {
    setEditingMotif({ ...motif });
  };

  const handleSaveMotif = () => {
    if (editingMotif) {
      updateMotif(editingMotif.id, editingMotif);
      setEditingMotif(null);
      alert('Motif berhasil diupdate!');
    }
  };

  const handleDeleteMotif = (id) => {
    if (window.confirm('Yakin ingin menghapus motif ini?')) {
      deleteMotif(id);
      alert('Motif berhasil dihapus!');
    }
  };

  const handleVerifyMotif = (motif) => {
    updateMotif(motif.id, { ...motif, verified: true });
    alert('Motif berhasil diverifikasi!');
  };

  // Sample data untuk demo
  const sampleMotifs = motifs.length > 0 ? motifs : [
    {
      id: 1,
      nama_motif: 'Tenun Ikat Sumba',
      daerah_asal: 'Sumba, NTT',
      harga: 750000,
      uploadedBy: 'Pengrajin A',
      createdAt: '2024-01-15',
      verified: true,
      views: 245
    },
    {
      id: 2,
      nama_motif: 'Batik Parang',
      daerah_asal: 'Yogyakarta',
      harga: 500000,
      uploadedBy: 'Pengrajin B',
      createdAt: '2024-01-20',
      verified: false,
      views: 189
    },
    {
      id: 3,
      nama_motif: 'Songket Palembang',
      daerah_asal: 'Palembang',
      harga: 1200000,
      uploadedBy: 'Pengrajin C',
      createdAt: '2024-01-22',
      verified: true,
      views: 312
    }
  ];

  const stats = {
    totalMotifs: sampleMotifs.length,
    verifiedMotifs: sampleMotifs.filter(m => m.verified).length,
    pendingMotifs: sampleMotifs.filter(m => !m.verified).length,
    totalViews: sampleMotifs.reduce((sum, m) => sum + (m.views || 0), 0),
    totalRevenue: sampleMotifs.reduce((sum, m) => sum + (m.harga || 0), 0)
  };

  const filteredMotifs = sampleMotifs.filter(motif => {
    const matchesSearch = motif.nama_motif.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         motif.daerah_asal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'verified' && motif.verified) ||
                         (filterStatus === 'pending' && !motif.verified);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF5] py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl font-bold text-[#403F2E] mb-2"
            style={{ fontFamily: 'Merriweather, serif' }}
          >
            Dashboard Admin
          </h1>
          <p className="text-gray-600">Kelola motif, verifikasi pengrajin, dan monitoring traffic</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl">📊</div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <div className="text-2xl font-bold text-[#403F2E]">{stats.totalMotifs}</div>
            <div className="text-sm text-gray-600">Total Motif</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl">✅</div>
              <span className="text-sm text-gray-500">Verified</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.verifiedMotifs}</div>
            <div className="text-sm text-gray-600">Terverifikasi</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl">⏳</div>
              <span className="text-sm text-gray-500">Pending</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingMotifs}</div>
            <div className="text-sm text-gray-600">Menunggu Verifikasi</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl">👁️</div>
              <span className="text-sm text-gray-500">Views</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalViews}</div>
            <div className="text-sm text-gray-600">Total Kunjungan</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl">💰</div>
              <span className="text-sm text-gray-500">Revenue</span>
            </div>
            <div className="text-lg font-bold text-[#403F2E]">
              Rp {(stats.totalRevenue / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Total Nilai</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('motifs')}
              className={`pb-3 px-4 font-semibold transition-colors ${
                activeTab === 'motifs'
                  ? 'border-b-2 border-[#F8C471] text-[#403F2E]'
                  : 'text-gray-500 hover:text-[#403F2E]'
              }`}
            >
              Kelola Motif
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-3 px-4 font-semibold transition-colors ${
                activeTab === 'analytics'
                  ? 'border-b-2 border-[#F8C471] text-[#403F2E]'
                  : 'text-gray-500 hover:text-[#403F2E]'
              }`}
            >
              Statistik
            </button>
          </div>

          {/* Motifs Management Tab */}
          {activeTab === 'motifs' && (
            <div>
              {/* Search & Filter */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Cari nama motif atau daerah..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C471]"
                  />
                </div>
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C471]"
                  >
                    <option value="all">Semua Status</option>
                    <option value="verified">Terverifikasi</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Motifs Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama Motif</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Daerah</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Harga</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pengrajin</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Views</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredMotifs.map((motif) => (
                      <tr key={motif.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{motif.nama_motif}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{motif.daerah_asal}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          Rp {motif.harga?.toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{motif.uploadedBy}</td>
                        <td className="px-4 py-3">
                          {motif.verified ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Verified
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{motif.views || 0}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditMotif(motif)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            {!motif.verified && (
                              <button
                                onClick={() => handleVerifyMotif(motif)}
                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                                title="Verify"
                              >
                                ✅
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteMotif(motif.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredMotifs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Tidak ada motif ditemukan</p>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Popular Motifs */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-[#403F2E] mb-4">Motif Populer</h3>
                  <div className="space-y-3">
                    {sampleMotifs
                      .sort((a, b) => (b.views || 0) - (a.views || 0))
                      .slice(0, 5)
                      .map((motif, idx) => (
                        <div key={motif.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-800">
                              {idx + 1}. {motif.nama_motif}
                            </div>
                            <div className="text-sm text-gray-600">{motif.daerah_asal}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-[#403F2E]">{motif.views || 0}</div>
                            <div className="text-xs text-gray-500">views</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Recent Uploads */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-[#403F2E] mb-4">Upload Terbaru</h3>
                  <div className="space-y-3">
                    {sampleMotifs
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .slice(0, 5)
                      .map((motif) => (
                        <div key={motif.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-800">{motif.nama_motif}</div>
                            <div className="text-sm text-gray-600">oleh {motif.uploadedBy}</div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(motif.createdAt).toLocaleDateString('id-ID')}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Top Daerah */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-[#403F2E] mb-4">Top Daerah</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Sumba, NTT</span>
                      <span className="font-bold text-[#403F2E]">12 motif</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Yogyakarta</span>
                      <span className="font-bold text-[#403F2E]">8 motif</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Palembang</span>
                      <span className="font-bold text-[#403F2E]">6 motif</span>
                    </div>
                  </div>
                </div>

                {/* Platform Health */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-[#403F2E] mb-4">Kesehatan Platform</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">Tingkat Verifikasi</span>
                        <span className="font-semibold">
                          {Math.round((stats.verifiedMotifs / stats.totalMotifs) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(stats.verifiedMotifs / stats.totalMotifs) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">Engagement Rate</span>
                        <span className="font-semibold">87%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingMotif && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-[#403F2E] mb-6">Edit Motif</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Motif
                  </label>
                  <input
                    type="text"
                    value={editingMotif.nama_motif}
                    onChange={(e) => setEditingMotif({ ...editingMotif, nama_motif: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C471]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Daerah Asal
                  </label>
                  <input
                    type="text"
                    value={editingMotif.daerah_asal}
                    onChange={(e) => setEditingMotif({ ...editingMotif, daerah_asal: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C471]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    value={editingMotif.harga}
                    onChange={(e) => setEditingMotif({ ...editingMotif, harga: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C471]"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSaveMotif}
                  className="flex-1 px-6 py-3 bg-[#403F2E] text-white rounded-lg font-semibold hover:bg-[#5a5847] transition-colors"
                >
                  Simpan
                </button>
                <button
                  onClick={() => setEditingMotif(null)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
