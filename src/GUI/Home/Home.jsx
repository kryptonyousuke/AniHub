import KeyVisual from "../Utilities/KeyVisual";
import styles from "./Home.module.css";
import AnimeEpisodesReleaseList from "../Utilities/AnimeEpisodesReleaseList"
import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import releaseListStyles from "../Utilities/AnimeEpisodesReleaseList.module.css";
import { useNavigate } from "react-router-dom";
import AnihubHeader from "../Utilities/AnihubHeader";
import Footer from "../Utilities/Footer";
function Home(){
    const navigate = useNavigate();
    return <div className={styles.home}>

        <AnihubHeader/>

        <img className={styles.banner} src="banner3.jpg" alt="banner"></img>
        <div className={styles.windowShadow}></div>
        <section className={styles.popularContentSection}>
            <h1 className={styles.titlePopularContent}>Popular Content</h1>
            <div className={styles.popularContent}>
                <KeyVisual onClick={() => navigate("/mangapage", {
                        state: {
                            animeData: {
                                title: "Sakamoto Days",
                                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                                tags: ["Action", "Adventure"],
                                keyvisual: "image.png",
                                pages: ["image.png", "image.png", "image.png", "image.png", "image.png", "image.png", "image.png", "image.png",],
                            }
                        }
                    }
                )}/>
                <KeyVisual />
                <KeyVisual />
                <KeyVisual />
                <KeyVisual />
            </div>
        </section>
        <h1 className={styles.whatIsNew}>What is new today</h1>
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
        <AnimeEpisodesReleaseList />
        <Footer />
    </div>
}
export default Home;