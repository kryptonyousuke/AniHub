import SearchedAnime from "./SearchedAnime";
import SearchedManga from "./SearchedManga";
import styles from "./SearchResults.module.css"
function SearchResults({ isMangaMode, results }){
    
    return <section className={styles.searchResults}>
        {
            results.map((anime, i) => {
                return !isMangaMode ? <SearchedAnime animeName={anime.name} episodes={anime.episodes} keyVisual={anime.image} plugin={anime.plugin} key={i} animeID={anime.id} /> : <SearchedManga mangaName={anime.name} episodes={anime.episodes} keyVisual={anime.image} plugin={anime.plugin} key={i} mangaID={anime.id} tags={anime.tags} />;
            })
        }
    </section>
}
export default SearchResults;