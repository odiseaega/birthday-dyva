import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import WelcomePage from './pages/WelcomePage';
import WishPage from './pages/WishPage';
import TimelinePage from './pages/TimelinePage';
import GalleryPage from './pages/GalleryPage';
import SuratPage from './pages/SuratPage';
import PuzzlePage from './pages/PuzzlePage';
import MusicPlayer from './MusicPlayer';

function App() {
  const [musicAutoPlay, setMusicAutoPlay] = useState(false);

  const handleUserInteraction = () => {
    if (!musicAutoPlay) {
      setMusicAutoPlay(true);
    }
  };

  return (
    <Router>
      <div onClick={handleUserInteraction}>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/wish" element={<WishPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/surat" element={<SuratPage />} />
          <Route path="/puzzle" element={<PuzzlePage />} />
        </Routes>
        
        {/* Floating Music Player */}
        <MusicPlayer autoPlayTrigger={musicAutoPlay} />
      </div>
    </Router>
  );
}

export default App;