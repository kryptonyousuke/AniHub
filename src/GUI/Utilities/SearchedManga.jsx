import styles from "./SearchedAnime.module.css"
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
function SearchedManga({ mangaName, mangaID, episodes, plugin, keyVisual, tags }){
  const navigate = useNavigate();
  return <div className={styles.searchedAnime} onClick={() => navigate("/mangapage", {
                        state: {
                            animeData:{
                                title: mangaName,
                                mangaID: mangaID,
                                plugin: plugin,
                                tags: tags,
                                keyvisual: keyVisual,
                                mangaData: null
                            }
                        }})}>
        <img src={keyVisual} className={styles.image} alt="keyVisual"></img>
        <div className={styles.animeInfo}>
            <p className={styles.animeName}>{mangaName}</p>
            <p className={styles.animeEpisodesNumber}>{episodes} Episodes</p>
            <h3>Read
                <svg width="25" height="30" className={styles.arrowIconContainer} viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FE5F55" />
                      <stop offset="100%" stopColor="#ff00d4" />
                    </linearGradient>
                  </defs>
                  <FaArrowRightLong fill="url(#grad1)" />
                </svg>
            </h3>
        </div>
    </div>
}
export default SearchedManga;