import { useState } from 'react';
import styles from './Settings.module.css'
import { CgClose } from "react-icons/cg";
import { Icon } from '@iconify/react';
function Settings({ setSettingsVisible }) {
  const [selectedOption, setSelectedOption] = useState(1);
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
              }} onClick={()=>setSelectedOption(0)}><h2 style={{
                    color: selectedOption == 0 ? "black" : "white"
                }}><Icon icon="mingcute:plugin-2-fill" width="30" height="30" className={styles.pluginIcon} />Plugins</h2></span>
                <span style={{
                          background: selectedOption == 1 ? "white" : "transparent"
                    }} onClick={()=>setSelectedOption(1)}><h2 style={{
                              color: selectedOption == 1 ? "black" : "white"
                        }}><Icon icon="mingcute:settings-6-fill" width="24" height="24" />Settings</h2></span>
              <span style={{
                        background: selectedOption == 2 ? "white" : "transparent"
                  }} onClick={()=>setSelectedOption(2)}><h2 style={{
                      color: selectedOption == 2 ? "black" : "white"
                    }}><Icon icon="mdi:about" width="24" height="24" />About</h2></span>
              <CgClose className={styles.closeIcon} onClick={() => setSettingsVisible(false)} />
          </div>
          
        
        {selectedOption == 0 && <section className={styles.pluginPage}>
          <div className={styles.installArea}>
            <p>Click the button below to install or update a plugin</p>
            <button onClick={handleInstallPlugin} className={styles.installButton}><Icon icon="grommet-icons:install-option" className={styles.installIcon} width="24" height="24" />Install</button>
          </div>
        </section>}
        { selectedOption == 1 &&
          <div className={styles.mainSettings}>
            <div className={styles.modularOption}>
              <p className={styles.optionName}>Enable NSFW</p>
              <input type="checkbox"></input>
              <span className={styles.indicator}></span>
            </div>
          </div>
        }
        { selectedOption == 2 &&
          <div className={styles.about}>
            <div className={styles.cardGit}>
              <Icon icon="fe:git" width="60" height="60" className={styles.gitIcon} />
              <h1>Open-Source</h1>
              <p>AniHub is 100% made by the open-source community.</p>
            </div>
            <div className={styles.cardGit}>
              <Icon icon="fe:git" width="60" height="60" className={styles.gitIcon} />
              <h1>Open-Source</h1>
              <p>AniHub is 100% made by the open-source community.</p>
            </div>
          </div>
        }
        </section>
    </div>
}
export default Settings;