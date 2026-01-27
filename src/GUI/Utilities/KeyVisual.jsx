import styles from "./KeyVisual.module.css";
function KeyVisual({ onClick, imageSrc, animeTitle }){
    return (
      <div className={styles.keyVisual} onClick={onClick}>
        <img src={imageSrc} className={styles.image} alt="keyVisual"></img>
        <p className={styles.contentTitle}>{animeTitle}</p>
      </div>
    );
}
export default KeyVisual;