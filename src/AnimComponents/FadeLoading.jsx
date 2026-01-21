import styles from "./FadeLoading.module.css";
function FadeLoading({ component: Component, isLoading }) {
    return (
      <div className={styles.loadingOverlay}>
              <img src="AniHub_transparent.svg" className={styles.anihubIcon} />
      </div>
    )
}
export default FadeLoading;