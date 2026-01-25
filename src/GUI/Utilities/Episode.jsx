import styles from "./Episode.module.css";
import { Icon } from "@iconify/react";
function Episode({title}){
  return (
    <div className={styles.episode}>
      <img src="image.png" className={styles.image} alt="keyVisual"></img>
      <Icon icon="material-symbols:fiber-new" className={styles.newIcon} width="28" height="28" />
      <p className={styles.contentTitle}>{title}</p>
    </div>
  );
}
export default Episode;