import SearchedAnime from "./SearchedAnime";
import styles from "./SearchResults.module.css"
function SearchResults({ results }){
    
    return <section className={styles.searchResults}>
        {
            results.map((anime, i) => {
                return <SearchedAnime animeName={anime.name} episodes={anime.episodes} keyVisual={anime.image} plugin={results.plugin} key={i} animeID={anime.id} />
            })
        }
    </section>
}
export default SearchResults;