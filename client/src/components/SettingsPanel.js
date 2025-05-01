import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const SettingsPanel = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={`settings-panel ${darkMode ? 'dark' : 'light'}`}>
      <div className="language-selector">
        <select 
          onChange={(e) => changeLanguage(e.target.value)}
          value={i18n.language}
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
        </select>
      </div>
      <button onClick={toggleDarkMode}>
        {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
    </div>
  );
};

export default SettingsPanel;