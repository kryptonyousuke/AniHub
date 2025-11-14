import styles from './Settings.module.css'
import { CgClose } from "react-icons/cg";
function Settings( { setSettingsVisible } ){
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
                <span><h2>Appearence</h2></span>
                <span><h2>Plugins</h2></span>
                <CgClose className={styles.closeIcon} onClick={() => setSettingsVisible(false)} />
            </div>
            <button onClick={handleInstallPlugin} className={styles.installButton}>Install</button>
        </section>
    </div>
}
export default Settings;