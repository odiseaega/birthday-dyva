import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WishPage = () => {
  const [wish, setWish] = useState('');
  const [savedWishes, setSavedWishes] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  // Load wishes dari localStorage saat component mount
  useEffect(() => {
    const stored = localStorage.getItem('birthdayWishes');
    if (stored) {
      setSavedWishes(JSON.parse(stored));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (wish.trim()) {
      let updatedWishes;
      
      if (editingId !== null) {
        // Update existing wish
        updatedWishes = savedWishes.map(w => 
          w.id === editingId ? { ...w, text: wish, updatedAt: new Date().toISOString() } : w
        );
        setEditingId(null);
      } else {
        // Add new wish
        const newWish = {
          id: Date.now(),
          text: wish,
          createdAt: new Date().toISOString()
        };
        updatedWishes = [...savedWishes, newWish];
      }
      
      setSavedWishes(updatedWishes);
      localStorage.setItem('birthdayWishes', JSON.stringify(updatedWishes));
      setWish('');
      setIsSaved(true);
      
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    }
  };

  const handleEdit = (wishItem) => {
    setWish(wishItem.text);
    setEditingId(wishItem.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus harapan ini?')) {
      const updatedWishes = savedWishes.filter(w => w.id !== id);
      setSavedWishes(updatedWishes);
      localStorage.setItem('birthdayWishes', JSON.stringify(updatedWishes));
    }
  };

  const handleCancel = () => {
    setWish('');
    setEditingId(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-3">
            Make a Wish
          </h1>
          <p className="text-gray-600 text-lg">
            Tuliskan harapan dan impianmu di hari ulang tahun mu ini ✨
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-blue-100 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="wish" className="block text-gray-700 font-semibold mb-3 text-lg">
                {editingId ? 'Edit Harapanmu:' : 'Harapanmu untuk tahun ini:'}
              </label>
              <textarea
                id="wish"
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                placeholder="Tuliskan harapan dan impianmu di sini..."
                className="w-full h-48 px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none text-gray-700"
                required
              />
            </div>

            <div className="flex gap-3">
              <button 
                type="submit" 
                className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {editingId ? 'Update Harapan' : 'Simpan Harapan'}
              </button>
              
              {editingId && (
                <button 
                  type="button"
                  onClick={handleCancel}
                  className="px-6 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-300 transition-all duration-300"
                >
                  Batal
                </button>
              )}
            </div>
          </form>

          {isSaved && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-700 text-center font-semibold">
                ✓ Harapanmu telah tersimpan!
              </p>
            </div>
          )}
        </div>

        {/* Saved Wishes List */}
        {savedWishes.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Harapan yang Tersimpan ({savedWishes.length})
            </h2>
            <div className="space-y-4">
              {savedWishes.map((wishItem) => (
                <div 
                  key={wishItem.id}
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <p className="text-gray-700 mb-3 whitespace-pre-wrap">{wishItem.text}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {formatDate(wishItem.createdAt)}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(wishItem)}
                        className="px-4 py-2 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(wishItem.id)}
                        className="px-4 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {savedWishes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-500 text-lg">
              Belum ada harapan yang tersimpan.
              <br />
              Tuliskan harapan pertamamu di atas!
            </p>
          </div>
        )}

        {/* Footer Message */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Semoga semua harapanmu tercapai di tahun ini 🎂
          </p>
        </div>
      </div>
    </div>
  );
};

export default WishPage;