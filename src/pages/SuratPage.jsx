import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SuratPage = () => {
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  // ISI SURAT - EDIT SESUAI KEINGINAN ANDA!
  const letterContent = `Buatkamuuu yaa dipaaaaa🫶🏻🫶🏻,

Alooo Hepibesdeyyy yaaa sayanggg!!! 🎂🥳

😝Cieee sekarang dah bertambah aja usia nyaa yaaa, Wishh u all the bestt yaaa sayangggg🥳, semogaaa apa yang kamu harapkannn semuanya terwujud yaaawww, panjang umurrr sehatt selaluu dannn selalu berbakti ke orang tua kamu yaa yanggg aamiin🤲🏻

💪🏻Semangattttt terus yaaa kamuu buat kejar apa yang kamu impikannn, jangan pernah putus asaa, cape bolehh kokk tapi ingett yaaa jangan sampai nyerahhh, 👩🏻‍❤️‍👨🏻disini aku bakal nemenein kamuu teruss kok yanggg, aku juga bakall bantu kamuuu sebisakuu semampukuu apapun ituu buat kamuuu

⭐🎉Semoga di umur kamuuuu yg sekarangg ini di berii banyak keberkahannn yaaa jangan lupa selalu bersyukurrr,👩🏻‍🤝‍👨🏼apapun rintangnyaa kedepanyaa di hadepinn bareng barengg yaa yangg, jangan pernah merasa kamu sendiriann, aku bakal siap jadi support kamuu yangggg👩🏻‍🤝‍👨🏼

Makasihh yaa kamu dah sabarrr bangett buat hadepinn aku selamaa iniii🫶🏻🥰, makasihh juga yaaaa kamu dah sayangg ke akuu sampai saat inii, kita memang banyakk bangett berantem nya yangg, cuma aku gamauu kalau kita pisahh itu ajaaa, pokoknya kalau ada masalah apapun itu kitaa selesaiin masalahnyaaa yaaa yangg jangann sampai hubungan nya yang selesaii🫶🏻🫶🏻🫶🏻Loveee youuu!!!

😇🙏🏻Semogaa tahunn inii kita sama sama menjadi pribadi yang lebihh baikk lagi yaaa, semogaa juga kitaa bisa sama sama suksess dan membanggakan orang tua kitaa yaa yanggg, pokoknyaaa aku bakal selalu doainn kamuuu yangg terbaikkk untuk kedepannnyaaaa🙏🏻🙏🏻

Hepiibesdeyyy yaaawww yanggg, im so proud of youuuuu💗💗

Semangatt terusss yaa kamu jalani hari harinyaaa, aku bakal selalu support kamuuuu.....🫶🏻🫶🏻🫶🏻

Semogaaa aku bisa nemenin kamu terus selama kamu berprosesss buat menjadi suksesss, semogaaa akuu jugaa bisaaa nemeninn di hari ulangg tahunn kamuu kedepannyaa yawww yanggg.... 🥳🥳🥳

Dengan cintaaa,
Pacarmu yang paling gantenggg iniii 💕`;

  // Typing effect
  useEffect(() => {
    if (currentIndex < letterContent.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + letterContent[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30);

      return () => clearTimeout(timeout);
    } else {
      setIsTypingComplete(true);
    }
  }, [currentIndex, letterContent]);

  // Show skip button after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkip(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Skip animation
  const handleSkip = () => {
    setDisplayedText(letterContent);
    setCurrentIndex(letterContent.length);
    setIsTypingComplete(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 mb-8 transition-colors font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali
        </button>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl transform -rotate-1"></div>

          <div className="relative bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-2 border-gray-100">
            <div className="flex items-center justify-center mb-8">
              <div className="flex gap-2">
                <span className="text-4xl">💌</span>
                <span className="text-4xl">💝</span>
                <span className="text-4xl">💖</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap font-serif text-lg">
                {displayedText}
                {!isTypingComplete && (
                  <span className="inline-block w-1 h-6 bg-rose-500 ml-1 animate-pulse"></span>
                )}
              </div>
            </div>

            {isTypingComplete && (
              <div className="mt-12 flex justify-center animate-fade-in">
                <div className="text-center">
                  <div className="flex gap-2 justify-center mb-4">
                    <span className="text-3xl">❤️</span>
                    <span className="text-3xl">💕</span>
                    <span className="text-3xl">💖</span>
                    <span className="text-3xl">💝</span>
                    <span className="text-3xl">❤️</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {showSkip && !isTypingComplete && (
            <button onClick={handleSkip} className="absolute bottom-4 right-4 bg-rose-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-rose-600 transition-colors shadow-lg animate-fade-in">
              Skip Animation →
            </button>
          )}
        </div>

        {isTypingComplete && (
          <div className="mt-8 text-center animate-fade-in">
            <p className="text-gray-600 text-lg font-medium">
              Semoga di hari ulang tahun mu ini bakal menjadikan kamu lebihh hebattt🥰💪🏻
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SuratPage;