import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('projectnest_theme') || 'system');

  useEffect(() => {
    const applyTheme = (selected) => {
      if (selected === 'light') {
        document.body.classList.add('light');
      } else {
        document.body.classList.remove('light');
      }
    };

    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(systemPrefersDark ? 'dark' : 'light');
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  const changeTheme = (value) => {
    setTheme(value);
    localStorage.setItem('projectnest_theme', value);
  };

  return <ThemeContext.Provider value={{ theme, changeTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
