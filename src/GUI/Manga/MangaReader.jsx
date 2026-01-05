import { useState } from "react";
import AnihubHeader from "../Utilities/AnihubHeader";
import styles from "./MangaReader.module.css";
import { MdArrowBackIos } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { IoChevronBackSharp } from "react-icons/io5";
function MangaReader(){
    const navigate = useNavigate();
    const location = useLocation();
    const pages = location.state.pages;
    const [selectedPage, setSelectedPage] = useState(location.state.selectedPage);
    return <div className={styles.mangaReader}>
        <IoChevronBackSharp className={styles.backBtn} onClick={() => navigate("/mangapage", { state: { animeData: location.state.animeData} })}/>
        <div className={styles.simpleAniHubHeader}>
            <img className={styles.logo} src="AniHub_transparent.svg" onClick={() => navigate("/")} alt="logo"></img>
            <h1 className={styles.anihub} onClick={() => navigate("/")}>AniHub</h1>
        </div>
        <div className={styles.reader} onClick={(e) => {
            if (e.clientX <= e.currentTarget.offsetWidth/2) {
                selectedPage != 0 && setSelectedPage(selectedPage-1);
            }
            else {
                selectedPage != pages.length-1 && setSelectedPage(selectedPage+1);
            }
        }}>
            <div className={styles.topBar}>
                <p className={styles.pageNumber}>{selectedPage+1}</p>
            </div>
            {
                pages.map((src, index) => <img src={src} alt="" loading="lazy" decoding="async" className={index === selectedPage ? styles.page : styles.hiddenPage} />)
            }
            <div className={styles.bottomBar}>
                 <MdArrowBackIos className={styles.btnBar} onClick={() => {
                    selectedPage != 0 && setSelectedPage(selectedPage-1);
                 }}/>
                <p className={styles.pageNumber}>{selectedPage+1}</p>
                 <MdArrowForwardIos className={`${styles.btnBar} ${styles.btnNext}`} onClick={() => 
                        selectedPage != pages.length-1 && setSelectedPage(selectedPage+1)
                    }/>
            </div>
        </div>
    </div>;
}
export default MangaReader;
