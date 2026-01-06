import styles from "./AnihubHeader.module.css"
import SearchResults from "./SearchResults";
import { FaBook } from "react-icons/fa6";
import { RiSettingsFill } from "react-icons/ri";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Settings from "../Settings/Settings";

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
        <input className={styles.search} type="text" placeholder="Search" onChange={async (e) => {
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
                const results = await window.electronAPI.runPlugins(searchData);
                console.log(results)
                let data = JSON.parse(results[0].result);
                data.plugin = results[0].plugin;
                setAnimeList(data);
            }, 1500);
        }} />
        <FaBook className={styles.mangaModeIcon} onClick={()=>{setIsMangaMode(!isMangaMode)}} style={isMangaMode && {
            backgroundColor: "white",
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
        <RiSettingsFill className={styles.settingsIcon} onClick={() => setSettingsVisible(!settingsVisible)} />
    </header>
}
export default AnihubHeader;