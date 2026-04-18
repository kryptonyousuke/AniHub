import AnihubHeader from "../Utilities/AnihubHeader";
import FadeLoading from "../../AnimComponents/FadeLoading";
import styles from "./AnimeInfo.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import EpisodesList from "./EpisodesList";
import { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react";


function AnimeInfo(){
    const location = useLocation();
    const { isReload, animeName, animeID, plugin, animeData} = location.state;
    const [ description, setDescription ] = useState("");
    // const [ episodesState, setEpisodesState ] = useState({});
    const [ selectedEpisodes, setSelectedEpisodes ] = useState([]);
    const [ keyVisual, setKeyVisual ] = useState("");
    const [ isDubbedSelected, setIsDubbedSelected ] = useState(false);
    const [ isSubbedOrDubbedSelectorActive, setIsSubbedOrDubbedSelectorActive ] = useState(false);
    const [ dubbedSeasons, setDubbedSeasons] = useState([]);
    const [ subbedSeasons, setSubbedSeasons ] = useState([]);
    const [ isSeasonSelectorActive, setIsSeasonSelectorActive ] = useState(false);
    const [ episodesLoaded, setEpisodesLoaded ] = useState(false);
    const [isStarred, setIsStarred] = useState(false);

    const [ selectedSeasonName, setSelectedSeasonName ] = useState("Season 1");
    const effectRan = useRef(false);
    const episodesGetter = (seasonId, dubSeasonsArg = dubbedSeasons, subSeasonsArg = subbedSeasons) => {
      let subResult = subbedSeasons.find(s => s.season_id === seasonId);
      let dubResult = dubSeasonsArg.find(s => s.season_id === seasonId);
      let sub = subResult?.episodes_list;
      let dub = dubResult?.episodes_list;
      if (sub && sub.length > 0) {
        setSelectedEpisodes(sub);
        return;
      }
      if (dub && dub.length > 0) {
        setSelectedEpisodes(dub);
        return;
      }
      setEpisodesLoaded(false);
      window.electronAPI.runSpecificPlugin(plugin, { "action": "seasonInfo", "season_id": seasonId }).then((data) => {
        let allEpisodes = JSON.parse(data).episodes_list;
        setSelectedEpisodes(allEpisodes);
        if (subResult) {
          setSubbedSeasons(prev =>
            prev.map(s =>
              s.season_id === seasonId
                ? { ...s, episodes_list: allEpisodes }
                : s
            )
          );
        }
        else if (dubResult) {
          setDubbedSeasons(prev => 
            prev.map(s =>
              s.season_id === seasonId
                ? { ...s, episodes_list: allEpisodes }
                : s
            )
          );
        }
        setEpisodesLoaded(true);
      });
    }
    useEffect(() => {
        if (effectRan.current === false && isReload) {
            setDescription(animeData.description);
            setKeyVisual(animeData.keyVisual);
            // setSelectedEpisodes(animeData.episodes.subbed);
            // setEpisodesState(animeData.episodes);
            setEpisodesLoaded(true);
        }
        if (effectRan.current === false) {
            let result = window.electronAPI.runSpecificPlugin(plugin, {
                "action": "animeInfo",
                "anime_id": animeID
            });
            result.then((data) => {
              data = JSON.parse(data);
              let subSeasons = data.anime_seasons.filter((season) => season.season_dubbed == 0);
              let dubSeasons = data.anime_seasons.filter((season) => season.season_dubbed == 1);
              setDescription(data.anime_details.anime_description);
              setKeyVisual(data.anime_details.anime_cape_url);
              setSubbedSeasons(subSeasons);
              setDubbedSeasons(dubSeasons);
              if (dubSeasons.length > 0) {
                setIsDubbedSelected(true);
                setSelectedSeasonName(dubSeasons[0].season_name);
                episodesGetter(dubSeasons[0].season_id, dubSeasons, subSeasons);
              }
              else if (subSeasons.length > 0) {
                setSelectedSeasonName(subSeasons[0].season_name);
                episodesGetter(subSeasons[0].season_id, dubSeasons, subSeasons);
              }
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
                    <div className={styles.lowerInfoContainer}>
                      { isSeasonSelectorActive && // season picker
                          <div className={styles.seasonSelector}>
                            {isDubbedSelected ? dubbedSeasons.map((season) => <button key={season.season_id} onClick={() => { // dubbed seasons
                              setIsSeasonSelectorActive(false);
                              setSelectedSeasonName(season.season_name);
                              episodesGetter(season.season_id);
                            }}>{season.season_name}</button>) :
                            subbedSeasons.map((season) => <button key={season.season_id} onClick={() => { // subbed seasons
                              setIsSeasonSelectorActive(false);
                              setSelectedSeasonName(season.season_name);
                              episodesGetter(season.season_id);
                              
                            }}>{season.season_name}</button>)
                            }
                          </div>
                      }

                      <button className={styles.btnSelectSeason} onClick={() => {setIsSeasonSelectorActive(!isSeasonSelectorActive)}}>{selectedSeasonName}</button>
                        { isSubbedOrDubbedSelectorActive &&
                            <div className={styles.dubbedOrSubbedSelector}>
                              {subbedSeasons.length > 0 && <button onClick={() => { setIsDubbedSelected(false); setIsSubbedOrDubbedSelectorActive(false); episodesGetter(subbedSeasons[0].season_id); setSelectedSeasonName(subbedSeasons[0].season_name); }}>Subbed</button>}
                              {dubbedSeasons.length > 0 && <button onClick={() => { setIsDubbedSelected(true); setIsSubbedOrDubbedSelectorActive(false); episodesGetter(dubbedSeasons[0].season_id); setSelectedSeasonName(dubbedSeasons[0].season_name); }}>Dubbed</button>}
                            </div>
                        }
                      <button className={styles.btnSelectDubbedOrSubbed} onClick={() => { setIsSubbedOrDubbedSelectorActive(!isSubbedOrDubbedSelectorActive) }}>{isDubbedSelected ? "Dubbed" : "Subbed"}</button>
                      {!isStarred ? <Icon icon="line-md:star" width="50" height="50" className={styles.star} onClick={() => {
                        setIsStarred(prevState => !prevState);
                        window.electronAPI.storeFavorite(JSON.stringify({
                            animeName: animeName,
                            description: description,
                            keyVisual: keyVisual,
                            animeID: animeID,
                        }), animeName, keyVisual, 0, "anime").then((result) => {
                          if (result) {
                            alert("Saved.");
                            return;
                          }
                          alert("Failed.")
                        });
                      }
                      } /> : <Icon icon="line-md:star-filled" width="50" height="50" className={styles.star} onClick={() => setIsStarred(prevState => !prevState)} />}
                    </div>
                </div>
                {
                    episodesLoaded &&
                    <EpisodesList animeName={animeName} animeID={animeID} description={description} keyVisual={keyVisual} episodes={selectedEpisodes} selectedEpisodes={selectedEpisodes} plugin={plugin}/>
                }
            </div>
        </div>
    </div>
}
export default AnimeInfo;