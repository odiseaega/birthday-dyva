import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const [showText, setShowText] = useState(false);
  const [showGifts, setShowGifts] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showEffects, setShowEffects] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setShowText(true), 500);
    setTimeout(() => setShowGifts(true), 1500);
    setTimeout(() => setShowButton(true), 2500);
    setTimeout(() => setShowEffects(true), 3000);
  }, []);

  const handleNext = () => {
    navigate('/wish');
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Cormorant Garamond', serif"
    }}>
      {/* Animated Background Effects */}
      {showEffects && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Falling Gifts */}
          {[...Array(15)].map((_, i) => (
            <div
              key={`gift-${i}`}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
                fontSize: '2rem',
                top: '-50px'
              }}
            >
              {['🎁', '🎀', '🎈'][Math.floor(Math.random() * 3)]}
            </div>
          ))}
          
          {/* Falling Stars */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                fontSize: '1.5rem'
              }}
            >
              ⭐
            </div>
          ))}
          
          {/* Confetti */}
          {[...Array(30)].map((_, i) => (
            <div
              key={`conf-${i}`}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${5 + Math.random() * 3}s`,
                width: '10px',
                height: '10px',
                backgroundColor: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347'][Math.floor(Math.random() * 4)]
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Title */}
        <div className={`text-center mb-16 transition-all duration-1000 ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl tracking-wide">
            Selamat Ulang Tahun
          </h1>
          <h2 className="text-4xl md:text-6xl font-serif text-blue-100 drop-shadow-xl italic">
            Dyva Rianda Trihapsari
          </h2>
        </div>

        {/* Gift Animation */}
        <div className={`mb-16 transition-all duration-1000 ${showGifts ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
          <div className="flex gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-lg shadow-2xl relative border-2 border-white/30">
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">
                    🎁
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons - NEW LAYOUT! */}
        <div className={`w-full max-w-4xl transition-all duration-1000 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Row 1: Surat & Puzzle */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <button
              onClick={() => navigate('/surat')}
              className="group relative overflow-hidden bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-6xl mb-4">💌</div>
              <h3 className="text-2xl font-bold text-white mb-2">Baca Surat Cinta</h3>
              <p className="text-blue-100 text-sm">Pesan spesial untukmu</p>
            </button>

            <button
              onClick={() => navigate('/puzzle')}
              className="group relative overflow-hidden bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-6xl mb-4">🧩</div>
              <h3 className="text-2xl font-bold text-white mb-2">Main Puzzle</h3>
              <p className="text-blue-100 text-sm">Challenge seru buatmu</p>
            </button>
          </div>

          {/* Row 2: Timeline & Gallery */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <button
              onClick={() => navigate('/timeline')}
              className="group relative overflow-hidden bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-2xl font-bold text-white mb-2">Lihat Perjalanan Kita</h3>
              <p className="text-blue-100 text-sm">Momen indah bersama</p>
            </button>

            <button
              onClick={() => navigate('/gallery')}
              className="group relative overflow-hidden bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-2xl font-bold text-white mb-2">Gallery Foto</h3>
              <p className="text-blue-100 text-sm">Kenangan terindah kita</p>
            </button>
          </div>

          {/* Row 3: Make a Wish (Center) */}
          <div className="flex justify-center">
            <button
              onClick={handleNext}
              className="group relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 px-16 hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-white/50"
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl">✨</div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-white mb-1">Make a Wish</h3>
                  <p className="text-pink-100 text-sm">Tuliskan harapanmu</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap');
        
        @keyframes fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0.5; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes confetti {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-fall { animation: fall linear infinite; }
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
        .animate-confetti { animation: confetti linear infinite; }
      `}</style>
    </div>
  );
};

export default WelcomePage;