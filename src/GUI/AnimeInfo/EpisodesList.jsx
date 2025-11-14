import { useNavigate } from "react-router-dom";
import styles from "./EpisodesList.module.css"
function EpisodesList( { animeName, animeID, description, keyVisual, episodes, selectedEpisodes, plugin } ){
    const navigate = useNavigate();
    if (selectedEpisodes === undefined) {
        return <></>
    }
    return <div className={styles.episodesList}>
        {selectedEpisodes.map((season) => {
            return season.map((episode)=>{

                    return <div className={styles.episode} onClick={()=>{navigate("/player", {
                        state: {
                            episode: episode,
                            plugin: plugin,
                            animeData: {
                                animeName: animeName,
                                description: description,
                                keyVisual: keyVisual,
                                animeID: animeID,
                                episodes: episodes
                            }
                        }
                    })}}>
                            <img src={episode.ep_thumbnail} alt="" className={styles.episodeThumbnail}/>
                            <h3> {episode.ep_name} - Episode {episode.ep_number}</h3>
                    </div>
                })
        })})
    </div>
}
export default EpisodesList;