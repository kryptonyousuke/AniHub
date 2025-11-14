import { useEffect, useState } from "react";
import { TbMaximize } from "react-icons/tb";
import { FaWindowMinimize } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";
import { TbArrowsMinimize } from "react-icons/tb";
import styles from "./TitleBar.module.css"
function TitleBar() {
  const handleAction = (action) => {
    window.electronAPI.windowAction(action);
  };
  const [windowState, setWindowState] = useState("maximized"); // restored | maximized | fullscreen
  useEffect(() => {
    window.electronAPI.onWindowStateChange((state) => {
      setWindowState(state);
    });
  }, []);
  return (
    <div className={styles.titleBar}>
      <button className={`${styles.btnWindow} ${styles.btnMinimize}`} onClick={() => handleAction("minimize")}><FaWindowMinimize /></button>
      <button className={`${styles.btnWindow} ${styles.btnMaximize}`} onClick={() => {
            handleAction("maximize")
      }}>{windowState === "maximized" || windowState === "fullscreen" ? <TbArrowsMinimize /> : <TbMaximize />}</button>
      <button className={`${styles.btnWindow} ${styles.btnClose}`} onClick={() => handleAction("close")}><IoIosClose /></button>
    </div>
  );
}

export default TitleBar;