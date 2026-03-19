import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PuzzlePage = () => {
  const navigate = useNavigate();
  
  // GRID SIZE - Ubah jadi 16 atau 25 kalau mau lebih susah!
  const GRID_SIZE = 4; // 4x4 = 16 kotak (medium)
  const TOTAL_TILES = GRID_SIZE * GRID_SIZE;
  
  const puzzles = [
    {
      id: 1,
      name: "Oppaa Egaaa💗",
      image: "https://res.cloudinary.com/birthday-dyva/image/upload/v1768242063/WhatsApp_Image_2026-01-12_at_13.48.50_fylwfu.jpg",
      description: "Kamuu pilihh aku yaaa, jangan yang lainn🫶🏻"
    },
    {
      id: 2,
      name: "Oppaa Jeonghann😡",
      image: "https://res.cloudinary.com/birthday-dyva/image/upload/v1768242063/jeoghannn_n8bauc.jpg",
      description: "Jangan pilihh abang dekk, adek gakan kuatt🙄"
    }
  ];

  const [selectedPuzzle, setSelectedPuzzle] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showFlowers, setShowFlowers] = useState(false);

  const initPuzzle = (puzzle) => {
    setSelectedPuzzle(puzzle);
    const initialTiles = Array.from({ length: TOTAL_TILES }, (_, i) => i);
    const shuffled = shuffleArray([...initialTiles]);
    setTiles(shuffled);
    setMoves(0);
    setTime(0);
    setIsRunning(true);
    setIsComplete(false);
    setShowFlowers(false);
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return isSolvable(shuffled) ? shuffled : shuffleArray(array);
  };

  const isSolvable = (tiles) => {
    let inversions = 0;
    const emptyPos = tiles.indexOf(TOTAL_TILES - 1);
    const emptyRow = Math.floor(emptyPos / GRID_SIZE);

    for (let i = 0; i < tiles.length - 1; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
        if (tiles[i] > tiles[j] && tiles[i] !== TOTAL_TILES - 1 && tiles[j] !== TOTAL_TILES - 1) {
          inversions++;
        }
      }
    }

    if (GRID_SIZE % 2 === 1) {
      return inversions % 2 === 0;
    } else {
      return (inversions + emptyRow) % 2 === 1;
    }
  };

  useEffect(() => {
    let interval;
    if (isRunning && !isComplete) {
      interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isComplete]);

  useEffect(() => {
    if (tiles.length > 0) {
      const isWin = tiles.every((tile, index) => tile === index);
      if (isWin && moves > 0) {
        setIsComplete(true);
        setIsRunning(false);
        setShowFlowers(true);
      }
    }
  }, [tiles, moves]);

  const handleTileClick = (index) => {
    if (isComplete) return;

    const emptyIndex = tiles.indexOf(TOTAL_TILES - 1);
    const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
    const emptyCol = emptyIndex % GRID_SIZE;
    const clickRow = Math.floor(index / GRID_SIZE);
    const clickCol = index % GRID_SIZE;

    const isAdjacent = 
      (emptyRow === clickRow && Math.abs(emptyCol - clickCol) === 1) ||
      (emptyCol === clickCol && Math.abs(emptyRow - clickRow) === 1);

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(m => m + 1);
    }
  };

  const resetGame = () => {
    if (selectedPuzzle) {
      initPuzzle(selectedPuzzle);
    }
  };

  const backToSelection = () => {
    setSelectedPuzzle(null);
    setTiles([]);
    setMoves(0);
    setTime(0);
    setIsRunning(false);
    setIsComplete(false);
    setShowFlowers(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8 transition-colors font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Puzzle Challenge 🧩
          </h1>
          <p className="text-gray-600 text-lg">
            Susun puzzle {GRID_SIZE}x{GRID_SIZE} ({TOTAL_TILES} kotak) - Level Medium!
          </p>
        </div>

        {!selectedPuzzle && (
          <div className="grid md:grid-cols-2 gap-6">
            {puzzles.map(puzzle => (
              <div key={puzzle.id} onClick={() => initPuzzle(puzzle)} className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105">
                <div className="aspect-square overflow-hidden">
                  <img src={puzzle.image} alt={puzzle.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{puzzle.name}</h3>
                  <p className="text-gray-600 mb-4">{puzzle.description}</p>
                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                    Mulai Puzzle 🎮
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedPuzzle && (
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedPuzzle.name}</h2>
                  <p className="text-gray-600">{selectedPuzzle.description}</p>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{formatTime(time)}</div>
                    <div className="text-sm text-gray-600">Waktu</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-600">{moves}</div>
                    <div className="text-sm text-gray-600">Gerakan</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-4 mb-6">
              <div 
                className="grid gap-1 max-w-lg mx-auto aspect-square"
                style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
              >
                {tiles.map((tile, index) => (
                  <div 
                    key={index} 
                    onClick={() => handleTileClick(index)} 
                    className={`relative rounded-lg overflow-hidden transition-all ${
                      tile === TOTAL_TILES - 1 
                        ? 'bg-gray-100 cursor-default' 
                        : 'bg-white shadow-md hover:shadow-xl cursor-pointer active:scale-95'
                    }`}
                  >
                    {tile !== TOTAL_TILES - 1 && (
                      <div 
                        className="absolute inset-0" 
                        style={{
                          backgroundImage: `url(${selectedPuzzle.image})`,
                          backgroundSize: `${GRID_SIZE * 100}%`,
                          backgroundPosition: `${(tile % GRID_SIZE) * (100 / (GRID_SIZE - 1))}% ${Math.floor(tile / GRID_SIZE) * (100 / (GRID_SIZE - 1))}%`
                        }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={resetGame} className="bg-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors shadow-lg">
                🔄 Ulang
              </button>
              <button onClick={backToSelection} className="bg-gray-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors shadow-lg">
                ← Pilih Puzzle Lain
              </button>
            </div>
          </div>
        )}

        {isComplete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
              {showFlowers && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(30)].map((_, i) => (
                    <div key={i} className="flower" style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${2 + Math.random() * 3}s`
                    }}>
                      {['🌸', '🌺', '🌼', '🌻', '🌷', '💐', '🌹'][Math.floor(Math.random() * 7)]}
                    </div>
                  ))}
                </div>
              )}

              <div className="relative z-10">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                  Selamat! 🌸
                </h2>
                <p className="text-gray-700 text-lg mb-6">
                  Kamu berhasil menyelesaikan puzzle {GRID_SIZE}x{GRID_SIZE}<br />
                  <strong>"{selectedPuzzle.name}"</strong>
                </p>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{formatTime(time)}</div>
                      <div className="text-sm text-gray-600">Waktu</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-pink-600">{moves}</div>
                      <div className="text-sm text-gray-600">Gerakan</div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 italic">
                  "Seperti puzzle ini, setiap bagian dari kita melengkapi satu sama lain. Terima kasih sudah menjadi bagian sempurna dalam hidupku!" 💕
                </p>

                <div className="flex gap-3">
                  <button onClick={resetGame} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                    Main Lagi 🎮
                  </button>
                  <button onClick={backToSelection} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all">
                    Puzzle Lain
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0.3;
          }
        }
        .flower {
          position: absolute;
          font-size: 2rem;
          animation: fall linear infinite;
          top: -100px;
        }
      `}</style>
    </div>
  );
};

export default PuzzlePage;