import AnihubHeader from "../Utilities/AnihubHeader";
import styles from "./MangaReader.module.css";
function MangaReader(){
    return <div className={styles.mangaReader}>
        <div className={styles.reader}>
            <div className={styles.topBar}></div>
            <img src="image.png" alt="" className={styles.page} />
            <div className={styles.bottomBar}></div>
        </div>
    </div>;
}
export default MangaReader;
