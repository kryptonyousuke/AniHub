import { useState } from "react";
import FadeLoading from "../../AnimComponents/FadeLoading";
import AnihubHeader from "../Utilities/AnihubHeader"
import styles from "./Manga.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
function Manga(){
  const [isMangaMode, setIsMangaMode] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const animeData = location.state?.animeData;
  const searchData = { action: "mangaInfo", id: animeData.mangaID };
  console.log(searchData);
  if (!animeData) {
      return <div>Dados do mangá não encontrados.</div>;
  }
  const [pages, setPages] = useState(animeData.pages || []);
  window.electronAPI.runSpecificPlugin(animeData.plugin, searchData).then((data)=>{
      data = JSON.parse(data);
      setPages(data.pages);
      setDescription(data.description);
      setIsLoaded(true);
  })
  return <div className={styles.manga}>
      <AnihubHeader />
      {!isLoaded && <FadeLoading />}
      
      <img src={animeData.keyvisual} className={styles.mangaImage}></img>
      <h1 className={styles.mangaTitle}>{animeData.title}</h1>
      <p className={styles.mangaDescription}>{description}</p>
      <div className={styles.mangaInfo}>
          <section className={styles.tagsArea}>
        {!isStarred ? <Icon icon="line-md:star" width="50" height="50" className={styles.star} onClick={()=>setIsStarred(prevState=>!prevState)}/> : <Icon icon="line-md:star-filled" width="50" height="50" className={styles.star} onClick={()=>setIsStarred(prevState=>!prevState)}/>}
              <h3>Tags:</h3>
              <div className={styles.tags}>
                  {animeData.tags.map((tag) => <p>{tag}</p>)}
              </div>
          </section>
      </div>
      <section className={styles.mangaPages}>
          {
              pages.map((pageURL, index) => <img src={pageURL} className={styles.mangaPage} onClick={ () => { navigate("/mangareader", { state: { animeData: animeData, pages: pages, selectedPage: index} }) } }></img>)
          }
      </section>
  </div>
}
export default Manga;