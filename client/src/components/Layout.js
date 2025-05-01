import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Layout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <div className={theme}>
      <button onClick={toggleTheme}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
      </select>
      {children}
    </div>
  );
}
