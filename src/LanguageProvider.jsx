import React, { createContext, useContext, useEffect, useState } from 'react';

const LanguageCtx = createContext();

const dict = {
  'en-US': { Dashboard: 'My Dashboard', Team: 'Team', Email: 'Email', Chat: 'Chat', Settings: 'Settings', Employees: 'Employees', Git: 'Git', Calendar: 'Calendar', Provision: 'Provision' },
  'es-ES': { Dashboard: 'Mi Tablero', Team: 'Equipo', Email: 'Correo', Chat: 'Chat', Settings: 'Configuración', Employees: 'Empleados', Git: 'Git', Calendar: 'Calendario', Provision: 'Provisión' },
  'fr-FR': { Dashboard: 'Mon Tableau', Team: 'Équipe', Email: 'Courriel', Chat: 'Chat', Settings: 'Paramètres', Employees: 'Employés', Git: 'Git', Calendar: 'Calendrier', Provision: 'Provision' }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('provision_lang') || 'en-US');

  useEffect(() => {
    localStorage.setItem('provision_lang', lang);
  }, [lang]);

  const t = (key) => dict[lang]?.[key] || dict['en-US'][key] || key;

  return (
    <LanguageCtx.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageCtx.Provider>
  );
}

export const useLanguage = () => useContext(LanguageCtx);
