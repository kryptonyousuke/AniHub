import { useEffect, useState } from "react";
import styles from "./AnimeEpisodesReleaseList.module.css";
import Episode from "./Episode";
function AnimeEpisodesReleaseList() {
  const [recentEpisodes, setRecentEpisodes] = useState({});
  useEffect(() => {
    async function loadData() {
      let data = await (await fetch("https://api.jikan.moe/v4/watch/episodes")).json();
      setRecentEpisodes(data);
    }
    loadData();
  }, []);
  return <section className={styles.episodesList}>
    {recentEpisodes?.data?.map((episode, i) => <Episode imageSrc={episode.entry.images.webp.large_image_url} title={episode.entry.title + " " + episode.episodes[0].title} />)}
  </section>
}
export default AnimeEpisodesReleaseList;