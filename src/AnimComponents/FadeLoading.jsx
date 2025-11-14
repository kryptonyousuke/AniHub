function FadeLoading({component: Component, isLoading}){
    return (
        <div className="fade-loading">
            <Component />
            <div className="loader-animation-itself" style={{opacity: isLoading ? 1 : 0}}></div>
        </div>
    )
}
export default FadeLoading;