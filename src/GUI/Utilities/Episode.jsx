import styles from "./Episode.module.css";
function Episode({title}){
    return (
        <div className={styles.episode}>
            <img src="image.png" className={styles.image} alt="keyVisual"></img>
            <p className={styles.contentTitle}>{title}</p>
        </div>
    );
}
export default Episode;