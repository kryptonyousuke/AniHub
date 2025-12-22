import { useState } from "react";
import AnihubHeader from "../Utilities/AnihubHeader"
import styles from "./Manga.module.css";
import { useNavigate } from "react-router-dom";
import { FaRegStar } from "react-icons/fa";
function Manga(){
    const [isMangaMode, setIsMangaMode] = useState(true);    
    const [pages, setPages] = useState(["image.png", "banner1.jpg", "image.png", "image.png", "image.png", "image.png", "image.png", "image.png", ]);
    const navigate = useNavigate();
    return <div className={styles.manga}>
        <AnihubHeader />
        <img src="image.png" className={styles.mangaImage}></img>
        <h1 className={styles.mangaTitle}>Title</h1>
        <p className={styles.mangaDescription}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi nulla doloribus eius libero cumque quas ex hic! Quas, libero sit vitae, iusto voluptas saepe facere, quibusdam ducimus itaque perferendis quis!</p>
        <div className={styles.mangaInfo}>
            <section className={styles.tagsArea}>
                <FaRegStar className={styles.favorite}/>
                <h3>Tags:</h3>
                <div className={styles.tags}>
                    <p>Drama</p>
                    <p>Ação</p>
                    <p>Comédia</p>
                </div>
            </section>
        </div>
        <section className={styles.mangaPages}>
            {
                pages.map((pageURL, index) => <img src={pageURL} className={styles.mangaPage} onClick={ () => { navigate("/mangareader", { state: { pages: pages, selectedPage: index} }) } }></img>)
            }
        </section>
    </div>
}
export default Manga;