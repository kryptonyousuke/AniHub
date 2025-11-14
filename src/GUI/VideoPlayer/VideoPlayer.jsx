import styles from "./VideoPlayer.module.css";
import Hls from "hls.js";
import { MediaPlayer } from "dashjs";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { TbArrowsMaximize } from "react-icons/tb";
import { FiMinimize2 } from "react-icons/fi";
function VideoPlayer({ onFullscreenChange }){
    const location = useLocation();
    const { episode, plugin, animeData } = location.state;
    const effectRan = useRef(false);
    const mouseMoveTimeout = useRef(null);
    const player = useRef(null);
    const [levels, setLevels] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(-1);
    const hlsRef = useRef(null);
    const dashRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [volume, setVolume] = useState(1);
    const [progress, setProgress] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMouseActive, setIsMouseActive] = useState(true);
    const [isQualitySelectorActive, setIsQualitySelectorActive] = useState(false);
    const [src, setSrc] = useState("");
    const isManualResolution = useRef(null);
    const navigate = useNavigate();
    useEffect(()=>{
        if (player.current) {
            if (src.includes(".m3u8")) {
                if (player.current.canPlayType("application/vnd.apple.mpegurl")) {
                    player.current.src = src;
                    return;
                }
                const hls = new Hls();
                hlsRef.current = hls;
                hls.loadSource(src);
                hls.attachMedia(player.current);
                hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
                    if (data.levels && data.levels.length > 0 && !isManualResolution.current) {
                        setLevels(data.levels);
                    }
                    else {
                        if (!isManualResolution.current){
                            setLevels([{ height: player.current.videoHeight}]);
                        }
                    }
                });
                hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
                    if (!isManualResolution.current){
                        setCurrentLevel(data.level);
                    }
                });
            } else if (src.includes(".mpd")){
                const dash = MediaPlayer().create();
                dash.initialize(player.current, src, true);
                dashRef.current = dash;
                dash.on(MediaPlayer.events.STREAM_INITIALIZED, () => {
                    const quals = dash.getRepresentationsByType("video");
                    setLevels(quals);
                    setCurrentLevel(dash.getQualityFor("video"));
                });
            } else {
                player.current.src = src;
            }
        }

        return () => {
            if (hlsRef.current) hlsRef.current.destroy();
            if (dashRef.current) dashRef.current.reset();
        };
    }, [src]);
    const handleChange = (e) => {
        const level = parseInt(e.target.value, 10);
        setCurrentLevel(level);
        if (!isManualResolution.current){
            if (hlsRef.current) {
                hlsRef.current.currentLevel = level;
            } else if (dashRef.current) {
                dashRef.current.setRepresentationForTypeByIndex('video', level);
            }
        }
        else {
            setSrc(levels[level].src);
        }
    };
    // loading screen
    useEffect(() => {
        player.current.addEventListener('waiting', () => {
            setIsLoading(true);
        });
        player.current.addEventListener('playing', () => {
            setIsLoading(false);
        });
        player.current.addEventListener('ended', () => {
            setIsLoading(false);
        });
    }, [player.current]);

    // volume
    useEffect(() => {
        player.current.volume = volume;
    }, [volume]);
    
    useEffect (() => {
        if (!effectRan.current){
            window.electronAPI.runSpecificPlugin(plugin, {
                action: "episodeInfo",
                episode_id: episode.ep_id
            }).then((data) => {
                data = JSON.parse(data);

                if (data.manualResolution === true) {
                    setLevels(data.streams);
                    isManualResolution.current = true;
                    setSrc(data.streams[data.streams.length - 1].src);
                    setCurrentLevel(data.streams.length - 1);
                } else {
                }
            });
            effectRan.current = true;
        }
        player.current.addEventListener("timeupdate", () => {
            if (player.current.currentTime / player.current.duration >= 0){
                setProgress(player.current.currentTime / player.current.duration)
            }
        }) 
        const handleKeyDown = (e) => {
            if (e.key === "F11") {
                setIsFullscreen((prev) => {
                    console.log("Estado anterior de tela cheia:", prev);
                    const newState = !prev;
                    onFullscreenChange(newState);
                    return newState;
                });
            }
        };
    
        window.addEventListener("keydown", handleKeyDown);
    }, [])
    const handleMouseMove = () => {
        setIsMouseActive(true);
        clearTimeout(mouseMoveTimeout.current);
        mouseMoveTimeout.current = setTimeout(() => {
            setIsMouseActive(false);
        }, 3000);
    };




    /*
        Component itself starts here.
    */




    return <div className={styles.videoPlayerContainer} onMouseMove={handleMouseMove} onClick={handleMouseMove} style={{
        cursor: isMouseActive ? "default" : "none"
    }}>
        <div className={styles.topControls} style={{
                "--topDistance": !isFullscreen ? "35px" : "0px",
                opacity: isMouseActive ? 1 : 0
            }}>
            <FaArrowLeftLong className={styles.backArrow} onClick={()=>{
                if (isFullscreen){
                    window.electronAPI.windowAction("toggle-fullscreen");
                }
                onFullscreenChange(false);
                setIsFullscreen(false);
                navigate("/animeinfo", {
                        state: {
                            isReload: true,
                            animeName: animeData.animeName,
                            animeID: animeData.animeID,
                            plugin: plugin,
                            animeData: animeData
                        }})
            }} />
            <h1>{episode.ep_name
                }</h1>
            {
                !isFullscreen ?
            <TbArrowsMaximize className={styles.enterFullscreen} onClick={() => {
                window.electronAPI.windowAction("toggle-fullscreen")
                onFullscreenChange(true);
                setIsFullscreen(!isFullscreen);
            }} /> :
            <FiMinimize2 className={styles.exitFullscreen} onClick={() => {
                window.electronAPI.windowAction("toggle-fullscreen");
                onFullscreenChange(false);
                setIsFullscreen(!isFullscreen);
            }} />
            }
        </div>
        <video ref={player} src={src} className={styles.videoPlayer} autoPlay={true} onClick={()=> {
            setIsPaused(!isPaused);
            !isPaused ? player.current.pause() : player.current.play()
            }} onDoubleClick={() => {

                setIsFullscreen(!isFullscreen);
                onFullscreenChange(!isFullscreen);
                window.electronAPI.windowAction("toggle-fullscreen");

            }} />
        {isLoading && <div className={styles.loadingOverlay}>
                <img src="AniHub_transparent.svg" className={styles.anihubIcon} />
            </div>}
        <div className={styles.controls} style={{
            opacity: isMouseActive ? 1 : 0
        }}>
        
            {isPaused ? <FaPlay className={styles.playPause} onClick={() => {player.current.play(); setIsPaused(false);}} /> : <FaPause className={styles.playPause} onClick={() => {player.current.pause(); setIsPaused(true)}} />}
            <input type="range"
                min="0"
                max="1"
                value={progress}
                step="0.00000000000001"
                className={styles.timeSlider}
                onChange={(e) => {
                    player.current.currentTime = e.target.value * player.current.duration;
                    setProgress(e.target.value);
                }}
                style={{ "--progress": `${progress * 100}%` }}
                />


        
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                onWheel={(e) => {
                    const step = 0.05;
                    if (e.deltaY < 0) {
                        setVolume((prevVolume) => Math.min(prevVolume + step, 1));
                    } else {
                        setVolume((prevVolume) => Math.max(prevVolume - step, 0));
                    }
                    e.preventDefault()
                }}
                className={styles.soundSlider}
                style={{ "--vol": `${volume * 100}%` }}
            />
            {isQualitySelectorActive && <div className={styles.qualitySelectorValuesContainer}>
                {levels.length > 0 && levels.map((l, i) => (
                    <div onClick={() => {
                        setCurrentLevel(i);
                        handleChange({
                            target: {
                                value: i
                            }
                        });
                        setIsQualitySelectorActive(false);
                    }}>
                        {l.height}p
                    </div>
                ))}
            </div>
            }
            <div className={styles.qualitySelector} onClick={() => {
                setIsQualitySelectorActive(!isQualitySelectorActive)}
                } style={{
                    borderColor: isQualitySelectorActive ? "white" : "transparent"
                }}>
                {levels[currentLevel] ? `${levels[currentLevel].height}p` : 'Auto'}
            </div>
        </div>
    </div>
}
export default VideoPlayer;