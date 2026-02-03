import styles from "./AnihubHeader.module.css"
import SearchResults from "./SearchResults";
import { FaBook } from "react-icons/fa6";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Settings from "../Settings/Settings";
import { Icon } from "@iconify/react";

function AnihubHeader(){
    const [search, setSearch] = useState("");
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [animeList, setAnimeList] = useState([]);
    const [isMangaMode, setIsMangaMode] = useState(false);
    const searchTimeoutRef = useRef(null);
    const navigate = useNavigate();
    return  <header className={styles.anihubHeader}>
        <img className={styles.logo} src="AniHub_transparent.svg" onClick={() => navigate("/")} alt="logo"></img>
        <h1 className={styles.anihub} onClick={() => navigate("/")}>AniHub</h1>
        <input className={styles.search} type="text" placeholder="Naruto Shippuden" onChange={async (e) => {
            if (e.target.value === "") {
                return;
            }
            setSearch(e.target.value);
            if (searchTimeoutRef.current) {
              clearTimeout(searchTimeoutRef.current);
            }
            searchTimeoutRef.current = setTimeout(async () => {
              const searchData = { action: isMangaMode ? "searchManga" : "searchAnime", query: e.target.value };
              console.log(searchData);
              const pluginNames = await window.electronAPI.getAllPlugins();
              for (const pluginName of pluginNames) {
                window.electronAPI.runSpecificPlugin(pluginName, searchData).then((result) => {
                  let searchResultList = JSON.parse(result);
                  const resultsWithPlugin = searchResultList.map(anime => ({
                      ...anime,
                      plugin: pluginName
                  }));
                  console.log(resultsWithPlugin);
                  setAnimeList(prevState => [...prevState, ...resultsWithPlugin]);
                })
              }
            }, 1500);
        }} />
        <FaBook className={styles.mangaModeIcon} onClick={()=>{setIsMangaMode(!isMangaMode)}} style={isMangaMode && {
            backgroundColor: "#ffffffbb",
            
            color: "black",
            fill: "black",

        }}/>
        {
            (search !== "" && animeList.length > 0) &&
            <SearchResults isMangaMode={isMangaMode} results={animeList} />
        }
        {
            settingsVisible &&
            <Settings setSettingsVisible={setSettingsVisible} />
      }
        <Icon icon="basil:settings-solid" width="70" height="70" className={styles.settingsIcon} onClick={() => setSettingsVisible(!settingsVisible)} />
    </header>
}
export default AnihubHeader;