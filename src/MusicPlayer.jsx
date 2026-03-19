import { useState, useRef, useEffect } from 'react';

const MusicPlayer = ({ autoPlayTrigger }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef(null);

  // PLAYLIST - Tambahkan 3 lagu di sini!
  const playlist = [
    {
      title: "Run to You",
      url: "https://res.cloudinary.com/birthday-dyva/video/upload/v1768318745/Run_to_you_%EC%A7%80%EA%B8%88_%EB%84%90_%EC%B0%BE%EC%95%84%EA%B0%80%EA%B3%A0_%EC%9E%88%EC%96%B4_bxt46h.mp4"
    },
    {
      title: "Kidult", // GANTI dengan judul lagu kedua
      url: "https://res.cloudinary.com/birthday-dyva/video/upload/v1768563417/LYRICS_%EA%B0%80%EC%82%AC_SEVENTEEN_%EC%84%B8%EB%B8%90%ED%8B%B4_-_Kidult_%EC%96%B4%EB%A5%B8_%EC%95%84%EC%9D%B4_7th_Mini_Album_Heng_garae_nsbups.mp4" // GANTI dengan URL dari Cloudinary
    },
    {
      title: "Shadow", // GANTI dengan judul lagu ketiga
      url: "https://res.cloudinary.com/birthday-dyva/video/upload/v1768563437/SEVENTEEN_SHADOW_Lyrics_%EC%84%B8%EB%B8%90%ED%8B%B4_SHADOW_%EA%B0%80%EC%82%AC_Color_Coded_Lyrics_sftc9r.mp4" // GANTI dengan URL dari Cloudinary
    }
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.5; // Volume 50%
      
      // Event listener untuk auto next track saat lagu selesai
      const handleEnded = () => {
        const nextTrack = (currentTrack + 1) % playlist.length;
        setCurrentTrack(nextTrack);
        audio.play().catch(err => console.log('Auto next error:', err));
      };
      
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, [currentTrack]);

  // Auto play saat user klik sesuatu
  useEffect(() => {
    if (autoPlayTrigger && !hasStarted) {
      const audio = audioRef.current;
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch(err => console.log('Autoplay blocked:', err));
    }
  }, [autoPlayTrigger, hasStarted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log('Audio play error:', err));
    }
  };

  const nextTrack = () => {
    const audio = audioRef.current;
    const next = (currentTrack + 1) % playlist.length;
    setCurrentTrack(next);
    if (isPlaying) {
      setTimeout(() => {
        audio.play().catch(err => console.log('Play error:', err));
      }, 100);
    }
  };

  const prevTrack = () => {
    const audio = audioRef.current;
    const prev = currentTrack === 0 ? playlist.length - 1 : currentTrack - 1;
    setCurrentTrack(prev);
    if (isPlaying) {
      setTimeout(() => {
        audio.play().catch(err => console.log('Play error:', err));
      }, 100);
    }
  };

  if (!showPlayer) {
    return (
      <button
        onClick={() => setShowPlayer(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
      >
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"/>
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Music Player Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-4 border-2 border-pink-200 backdrop-blur-lg animate-fade-in">
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
          >
            {isPlaying ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Music Info */}
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">🎵 {playlist[currentTrack].title}</p>
            <p className="text-xs text-gray-500">{isPlaying ? 'Now Playing...' : 'Paused'} • Track {currentTrack + 1}/{playlist.length}</p>
          </div>

          {/* Minimize Button */}
          <button
            onClick={() => setShowPlayer(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Minimize"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Animated Bars */}
        {isPlaying && (
          <div className="flex gap-1 mt-3 justify-center">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-pink-500 to-rose-500 rounded-full animate-music-bar"
                style={{
                  height: '20px',
                  animationDelay: `${i * 0.1}s`
                }}
              ></div>
            ))}
          </div>
        )}

        {/* Previous / Next Controls */}
        <div className="flex gap-2 mt-3 justify-center">
          <button
            onClick={prevTrack}
            className="px-3 py-1 bg-pink-100 hover:bg-pink-200 rounded-lg transition-colors text-sm font-medium text-pink-700"
          >
            ⏮ Prev
          </button>
          <button
            onClick={nextTrack}
            className="px-3 py-1 bg-pink-100 hover:bg-pink-200 rounded-lg transition-colors text-sm font-medium text-pink-700"
          >
            Next ⏭
          </button>
        </div>

        {/* Hint text saat pertama kali */}
        {!hasStarted && (
          <p className="text-xs text-center text-gray-400 mt-2">
            Klik tombol apapun untuk mulai musik 🎵
          </p>
        )}
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={playlist[currentTrack].url} />

      {/* Animation CSS */}
      <style>{`
        @keyframes music-bar {
          0%, 100% { height: 8px; }
          50% { height: 24px; }
        }
        .animate-music-bar {
          animation: music-bar 0.8s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MusicPlayer;