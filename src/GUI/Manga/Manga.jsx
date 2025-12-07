import { useState } from "react";
import AnihubHeader from "../Utilities/AnihubHeader"
import styles from "./Manga.module.css";
function Manga(){
    const [isMangaMode, setIsMangaMode] = useState(true);    

    return <div className={styles.manga}>
        <AnihubHeader />
        <img src="image.png" className={styles.mangaImage}></img>
        <h1 className={styles.mangaTitle}>Title</h1>
        <p className={styles.mangaDescription}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi nulla doloribus eius libero cumque quas ex hic! Quas, libero sit vitae, iusto voluptas saepe facere, quibusdam ducimus itaque perferendis quis!</p>
        <section className={styles.mangaPages}>

        </section>
    </div>
}
export default Manga;