import KeyVisual from "../Utilities/KeyVisual";
import styles from "./Home.module.css";
import AnimeEpisodesReleaseList from "../Utilities/AnimeEpisodesReleaseList";
import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import releaseListStyles from "../Utilities/AnimeEpisodesReleaseList.module.css";
import { useNavigate } from "react-router-dom";
import AnihubHeader from "../Utilities/AnihubHeader";
import Footer from "../Utilities/Footer";
import { Icon } from "@iconify/react";
function Home() {
  const navigate = useNavigate();
  const [popularContent, setPopularContent] = useState({});
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("https://api.jikan.moe/v4/seasons/now?sfw");
        
        if (!response.ok) {
          console.log("Jikan api failed.");
          return;
        }
        const data = await response.json();
        
        setPopularContent(data);
        console.log(data);
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    };
  
    loadData();
  }, []);
  return <div className={styles.home}>
        <AnihubHeader/>

        <img className={styles.banner} src="banner3.jpg" alt="banner"></img>
        <div className={styles.windowShadow}></div>
        <section className={styles.popularContentSection}>
            <h1 className={styles.titlePopularContent}><Icon icon="tabler:chart-bar-popular" width="40" height="40" /> Popular Content</h1>
            <div className={styles.popularContent}>
            {popularContent?.data?.slice(0, 5).map((anime, i) => (
                <KeyVisual 
                  key={anime.mal_id || i}
                  imageSrc={anime.images.webp.large_image_url} 
                  animeTitle={anime.titles[0].title} 
              />
            ))}
            </div>
        </section>
        <h1 className={styles.whatIsNew}><Icon icon="solar:graph-new-up-bold" width="35" height="35" /> What is new today</h1>
        <div className={styles.arrowBack} onClick={() => {
            let e = document.getElementsByClassName(releaseListStyles.episodesList)[0]
            if ((e.scrollLeft - 400) >= 0){
                e.scrollLeft = e.scrollLeft - 400;
            }
            else {
                e.scrollLeft = 0;
            }
        }}>
            <IoIosArrowBack />
        </div>
        <div className={styles.arrowForward} onClick={() => {
            let e = document.getElementsByClassName(releaseListStyles.episodesList)[0]
            if ((e.scrollLeft + 400) <= e.scrollWidth){
                e.scrollLeft += 400;
            }
        }}>
            <IoIosArrowForward />
        </div>
        <AnimeEpisodesReleaseList/>
        <Footer />
    </div>
}
export default Home;
