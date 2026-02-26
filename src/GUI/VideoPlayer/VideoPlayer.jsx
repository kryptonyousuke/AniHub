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
              console.log("Using HLS.");
                // if (player.current.canPlayType("application/vnd.apple.mpegurl")) {
                //     console.log("Hls is supported by default.");
                //     player.current.src = src;
                //     return;
                // }
                console.log("Hls is not supported by default. Using JS module.");
                const hls = new Hls({
                    manifestLoadingMaxRetry: 4,
                    levelLoadingMaxRetry: 4,
                    maxBufferLength: 600,
                    maxMaxBufferLength: 1200
                });

                hlsRef.current = hls;
                hlsRef.current.loadSource(src);
                hlsRef.current.attachMedia(player.current);
                hlsRef.current.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
                    if (data.levels && data.levels.length > 0 && !isManualResolution.current) {
                        setLevels(data.levels);
                    }
                    else {
                        if (!isManualResolution.current){
                            setLevels([{ height: player.current.videoHeight}]);
                        }
                    }
                });
                hlsRef.current.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
                    if (!isManualResolution.current){
                        setCurrentLevel(data.level);
                    }
                });
              console.log({ action: "validateToken", animeId: animeData.animeID, episodeId: episode.ep_id });
                window.electronAPI.runSpecificPlugin(plugin, { action: "validateToken", animeId: animeData.animeID, episodeId: episode.ep_id }).then((data) => {
                  console.log(data);
                });
              hlsRef.current.on(Hls.Events.FRAG_LOADED, (_, data) => {
                console.log("frag")
                window.electronAPI.runSpecificPlugin(plugin, { action: "validateToken", animeId: animeData.animeID, episodeId: episode.ep_id }).then((data) => {
                  data = JSON.parse(data);
                  console.log(data);
                });
              });
              
                hlsRef.current.on(Hls.Events.ERROR, (event, data) => {
                  console.log("Error detected.")
                  if (data.fatal) {
                    switch (data.type) {
                      case Hls.ErrorTypes.NETWORK_ERROR:
                          console.log("Erro de rede fatal, tentando recuperar...");
                          hlsRef.current.startLoad();
                          break;
                      case Hls.ErrorTypes.MEDIA_ERROR:
                          console.log("Erro de mídia fatal, tentando recuperar...");
                          hlsRef.current.recoverMediaError();
                          break;
                      case Hls.ErrorTypes.OTHER_ERROR:
                          console.log("Erro de mídia fatal, tentando recuperar...");
                          hlsRef.current.recoverMediaError();
                          break;
                      default:
                          hlsRef.current.destroy();
                          break;
                    }
                  }
                });
              
            } else if (src.includes(".mpd")) {
                console.log("Using DASH.")
                const dash = MediaPlayer().create();
                dash.initialize(player.current, src, true);
                dashRef.current = dash;
                dashRef.current.on(MediaPlayer.events.STREAM_INITIALIZED, () => {
                    const quals = dashRef.current.dash.getRepresentationsByType("video");
                    setLevels(quals);
                    setCurrentLevel(dashRef.current.dash.getQualityFor("video"));
                });
            } else {
                console.log("Reading a generic video file.")
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
        player.current.addEventListener('waiting', () => {
            setIsLoading(true);
        });
        player.current.addEventListener('playing', () => {
            setIsLoading(false);
        });
        player.current.addEventListener('ended', () => {
            setIsLoading(false);
        });
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
                setIsFullscreen(prev => !prev);
            }} /> :
            <FiMinimize2 className={styles.exitFullscreen} onClick={() => {
                window.electronAPI.windowAction("toggle-fullscreen");
                onFullscreenChange(false);
                setIsFullscreen(prev => !prev);
            }} />
            }
        </div>
        <video ref={player} src={src} className={styles.videoPlayer} autoPlay={true} onClick={()=> {
            setIsPaused(!isPaused);
            !isPaused ? player.current.pause() : player.current.play()
            }} onDoubleClick={() => {

                setIsFullscreen(prev => !prev);
                onFullscreenChange(prev => !prev);
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