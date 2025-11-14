import styles from "./KeyVisual.module.css";
function KeyVisual({ onClick }){
    return (
        <div className={styles.keyVisual} onClick={onClick}>
            <img src="image.png" className={styles.image} alt="keyVisual"></img>
            <p className={styles.contentTitle}>Sakamoto Days</p>
        </div>
    );
}
export default KeyVisual;