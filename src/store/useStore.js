import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // Motif data
      motifs: [],
      selectedMotif: null,
      favorites: [], // Array of motif IDs

      // User data
      user: null,
      isAuthenticated: false,

      // Loading states
      isLoading: false,
      error: null,

      // Filters untuk explore page
      filters: {
        daerah: '',
        warna: '',
        kategori: '',
        searchQuery: ''
      },

      // Actions untuk motifs
      setMotifs: (motifs) => set({ motifs }),

      addMotif: (motif) => set((state) => ({
        motifs: [...state.motifs, { ...motif, id: Date.now() }]
      })),

      updateMotif: (id, updatedMotif) => set((state) => ({
        motifs: state.motifs.map(m =>
          m.id === id ? { ...m, ...updatedMotif } : m
        )
      })),

      deleteMotif: (id) => set((state) => ({
        motifs: state.motifs.filter(m => m.id !== id)
      })),

      setSelectedMotif: (motif) => set({ selectedMotif: motif }),

      // Actions untuk favorites
      addToFavorites: (motifId) => set((state) => {
        if (state.favorites.includes(motifId)) {
          return state; // Already in favorites
        }
        return { favorites: [...state.favorites, motifId] };
      }),

      removeFromFavorites: (motifId) => set((state) => ({
        favorites: state.favorites.filter(id => id !== motifId)
      })),

      toggleFavorite: (motifId) => set((state) => {
        if (state.favorites.includes(motifId)) {
          return { favorites: state.favorites.filter(id => id !== motifId) };
        }
        return { favorites: [...state.favorites, motifId] };
      }),

      isFavorite: (motifId) => {
        const { favorites } = get();
        return favorites.includes(motifId);
      },

      // Actions untuk filters
      setFilters: (filters) => set({ filters }),

      resetFilters: () => set({
        filters: {
          daerah: '',
          warna: '',
          kategori: '',
          searchQuery: ''
        }
      }),

      // Actions untuk user
      login: (userData) => set({
        user: userData,
        isAuthenticated: true
      }),

      logout: () => set({
        user: null,
        isAuthenticated: false
      }),

      // Actions untuk loading & error
      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      // Get filtered motifs
      getFilteredMotifs: () => {
        const { motifs, filters } = get();
        let filtered = [...motifs];

        if (filters.searchQuery) {
          filtered = filtered.filter(m =>
            m.nama_motif?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
            m.daerah_asal?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
            m.deskripsi?.toLowerCase().includes(filters.searchQuery.toLowerCase())
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
      }
    }),
    {
      name: 'kriya-storage',
      partialize: (state) => ({
        motifs: state.motifs,
        favorites: state.favorites,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useStore;
