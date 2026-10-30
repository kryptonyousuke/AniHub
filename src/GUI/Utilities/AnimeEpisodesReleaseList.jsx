import { useEffect, useState } from "react";
import styles from "./AnimeEpisodesReleaseList.module.css";
import Episode from "./Episode";
function AnimeEpisodesReleaseList() {
  const [recentEpisodes, setRecentEpisodes] = useState({});
  useEffect(() => {
    async function loadData() {
      let data = await (await fetch('https://api.tenrai.org/v1/top/episodes?limit=20')).json();
      setRecentEpisodes(data);
    }
    loadData();
  }, []);
  return <section className={styles.episodesList}>
    {recentEpisodes.data?.map((episode, i) => {
      let preview = "";
      if (episode.images.jpg){
        preview = episode.images.jpg.image_url;
      } else if (episode.images.webp) {
        preview = episode.images.webp.image_url;
      } else {
        return;
      }
      return <Episode key={i} imageSrc={preview} title={episode.entry.title + "  " + episode.title} />
    })}
  </section>
}
export default AnimeEpisodesReleaseList;
