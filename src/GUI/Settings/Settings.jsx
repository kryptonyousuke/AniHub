import { useState } from 'react';
import styles from './Settings.module.css'
import { CgClose } from "react-icons/cg";
function Settings({ setSettingsVisible }) {
    const [selectedOption, setSelectedOption] = useState(0)
    const handleInstallPlugin = async () => {
        const result = await window.electronAPI.installPlugin();
        if (result.success) {
            alert(`Plugin was installed in: ${result.path}`);
        } else {
            alert(`Error: ${result.message}`);
        }
    };
    return <div className={styles.settings}>
        <section className={styles.settingsSection}>
            <div className={styles.settingsWindowBar}>
          <span style={{
                    background: selectedOption == 0 ? "white" : "transparent"
              }}><h2 style={{
                color: selectedOption == 0 ? "black" : "white"
                }}>Plugins</h2></span>
                <span style={{
                          background: selectedOption == 1 ? "white" : "transparent"
                    }}><h2 style={{
                              color: selectedOption == 1 ? "black" : "white"
                        }}>Settings</h2></span>
          <span><h2>About</h2></span>
          <CgClose className={styles.closeIcon} onClick={() => setSettingsVisible(false)} />
        </div>
        <div className={styles.installArea}>
          <p>Click the button below to install or update a plugin</p>
          <button onClick={handleInstallPlugin} className={styles.installButton}>Install</button>
        </div>
        <div className={styles.mainSettings}>
          <div className={styles.modularOption}>
            <p className={styles.optionName}>Enable NSFW</p>
            <input type="checkbox"></input>
          </div>
        </div>
        </section>
    </div>
}
export default Settings;