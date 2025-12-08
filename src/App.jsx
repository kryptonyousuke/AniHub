import { HashRouter as Router, Routes, Route } from "react-router-dom";
import TitleBar from "./TitleBar";
import Home from "./GUI/Home/Home";
import AnimeInfo from "./GUI/AnimeInfo/AnimeInfo"
import VideoPlayer from "./GUI/VideoPlayer/VideoPlayer";
import { useState } from "react";
import Manga from "./GUI/Manga/Manga";
import MangaReader from "./GUI/Manga/MangaReader";
function App() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  return (
    <>
      {!isFullscreen && <TitleBar />}
      <Router>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/animeinfo" element={<AnimeInfo />} />
              <Route path="/player" element={<VideoPlayer onFullscreenChange={setIsFullscreen}/>} />
              <Route path="/mangapage" element={<Manga />} />
              <Route path="/mangareader" element={<MangaReader />} />
          </Routes>
      </Router>
    </>
  );
}
export default App;