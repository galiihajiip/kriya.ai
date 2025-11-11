import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple demo login (in production, use real authentication)
    const userData = {
      name: formData.email.split('@')[0],
      email: formData.email,
      role: formData.role
    };

    login(userData);
    alert('Login berhasil!');

    // Redirect based on role
    if (formData.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const quickLogin = (role) => {
    const userData = {
      name: role === 'admin' ? 'Admin' : 'User Demo',
      email: role === 'admin' ? 'admin@kriya.ai' : 'user@kriya.ai',
      role: role
    };
    login(userData);
    alert(`Login sebagai ${role} berhasil!`);
    navigate(role === 'admin' ? '/admin' : '/');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF5] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold text-[#403F2E] mb-2"
            style={{ fontFamily: 'Merriweather, serif' }}
          >
            KRIYA<span className="text-[#F8C471]">.AI</span>
          </h1>
          <p className="text-gray-600">Masuk ke akun Anda</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C471]"
                placeholder="nama@email.com"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C471]"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Login sebagai
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C471]"
              >
                <option value="user">User / Pengrajin</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#403F2E] text-white rounded-lg font-semibold hover:bg-[#5a5847] transition-colors mb-4"
            >
              Masuk
            </button>

            <div className="text-center">
              <a href="#" className="text-sm text-[#403F2E] hover:text-[#5a5847]">
                Lupa password?
              </a>
            </div>
          </form>

          {/* Demo Quick Login */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 text-center">Demo Quick Login:</p>
            <div className="flex gap-3">
              <button
                onClick={() => quickLogin('user')}
                className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                Login sebagai User
              </button>
              <button
                onClick={() => quickLogin('admin')}
                className="flex-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
              >
                Login sebagai Admin
              </button>
            </div>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Belum punya akun?{' '}
            <a href="#" className="text-[#403F2E] font-semibold hover:text-[#5a5847]">
              Daftar sekarang
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
