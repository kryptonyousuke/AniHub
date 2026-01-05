import { useState } from "react";
import AnihubHeader from "../Utilities/AnihubHeader"
import styles from "./Manga.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegStar } from "react-icons/fa";
function Manga(){
    const [isMangaMode, setIsMangaMode] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const animeData = location.state?.animeData;
    
    if (!animeData) {
        return <div>Dados do mangá não encontrados.</div>;
    }

    const [pages, setPages] = useState(animeData.pages || []);
    return <div className={styles.manga}>
        <AnihubHeader />

        <img src={animeData.keyvisual} className={styles.mangaImage}></img>
        <h1 className={styles.mangaTitle}>{animeData.title}</h1>
        <p className={styles.mangaDescription}>{animeData.description}</p>
        <div className={styles.mangaInfo}>
            <section className={styles.tagsArea}>
                <FaRegStar className={styles.favorite}/>
                <h3>Tags:</h3>
                <div className={styles.tags}>
                    {animeData.tags.map((tag) => <p>{tag}</p>)}
                </div>
            </section>
        </div>
        <section className={styles.mangaPages}>
            {
                pages.map((pageURL, index) => <img src={pageURL} className={styles.mangaPage} onClick={ () => { navigate("/mangareader", { state: { animeData: animeData, pages: pages, selectedPage: index} }) } }></img>)
            }
        </section>
    </div>
}
export default Manga;