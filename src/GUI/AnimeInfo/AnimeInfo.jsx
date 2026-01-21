import AnihubHeader from "../Utilities/AnihubHeader";
import FadeLoading from "../../AnimComponents/FadeLoading";
import styles from "./AnimeInfo.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import EpisodesList from "./EpisodesList";
import { useEffect, useState , useRef } from "react";
function AnimeInfo(){
    const location = useLocation();
    const { isReload, animeName, animeID, plugin, animeData} = location.state;
    const [ description, setDescription ] = useState("");
    const episodes = useRef({});
    const [episodesState, setEpisodesState] = useState({});
    const [ selectedEpisodes, setSelectedEpisodes ] = useState([]);
    const [ keyVisual, setKeyVisual ] = useState("");
    const [ isDubbedSelected, setIsDubbedSelected ] = useState(false);
    const [ isSubbedOrDubbedSelectorActive, setIsSubbedOrDubbedSelectorActive ] = useState(false);
    const [ episodesLoaded, setEpisodesLoaded ] = useState(false);
    const effectRan = useRef(false);
    useEffect(() => {
        if (effectRan.current === false && isReload) {
            setDescription(animeData.description);
            setKeyVisual(animeData.keyVisual);
            setSelectedEpisodes(animeData.episodes.subbed);
            setEpisodesState(animeData.episodes);
            episodes.current = animeData.episodes;

            setEpisodesLoaded(true);
        }
        if (effectRan.current === false && isReload === false) {
            let result = window.electronAPI.runSpecificPlugin(plugin, {
                "action": "animeInfo",
                "anime_id": animeID
            });
            result.then((data) => {
                data = JSON.parse(data);
                setDescription(data.anime_info.anime_details.anime_description);
                setKeyVisual(data.anime_info.anime_details.anime_cape_url);
                episodes.current = data.episodes_list;
                setEpisodesState(data.episodes_list);
                setSelectedEpisodes(data.episodes_list.subbed);
                setEpisodesLoaded(true);
            });
            effectRan.current = true;
        }
    }, []);
    return <div className={styles.animeInfo}>
        <AnihubHeader/>
        {!episodesLoaded && <FadeLoading />}
        <div className={styles.animeInfoContainer}>
            <img src={keyVisual} alt="" className={styles.animeKeyVisual}/>
            <div className={styles.infoContainer}>
                <div className={styles.description}>
                    <h1 className={styles.animeName}>{animeName}</h1>
                    <p className={styles.sinopse}>{description}</p>
                    <button className={styles.watchButton}> <FaEye className={styles.eyeIcon}/> <span>Watch</span></button>
                    <div className={styles.dubbedOrSubbedContainer}>
                        { isSubbedOrDubbedSelectorActive &&
                            <div className={styles.dubbedOrSubbedSelector}>
                                <button onClick={() => {setIsDubbedSelected(false); setSelectedEpisodes(episodes.current.subbed); setIsSubbedOrDubbedSelectorActive(false)}}>Subbed</button>
                                <button onClick={() => {setIsDubbedSelected(true); setSelectedEpisodes(episodes.current.dubbed); setIsSubbedOrDubbedSelectorActive(false)}}>Dubbed</button>
                            </div>
                        }
                        <button className={styles.btnSelectDubbedOrSubbed} onClick={() => {setIsSubbedOrDubbedSelectorActive(!isSubbedOrDubbedSelectorActive)}}>{isDubbedSelected ? "Dubbed" : "Subbed"}</button>
                    </div>
                </div>
                {
                    episodesLoaded &&
                    <EpisodesList animeName={animeName} animeID={animeID} description={description} keyVisual={keyVisual} episodes={episodesState} selectedEpisodes={selectedEpisodes} plugin={plugin}/>
                }
            </div>
        </div>
    </div>
}
export default AnimeInfo;