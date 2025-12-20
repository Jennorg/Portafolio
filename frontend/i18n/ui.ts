export const Languages = {
  es: 'Español',
  en: 'English',
};

export const ui = {
  en: {
    //Header_Naviagtion
    home: 'Home',
    about: 'About',
    contact: 'Contact',
    projects: 'Projects',
  },
  es: {
    //Header_Naviagtion
    home: 'Inicio',
    about: 'Sobre mí',
    contact: 'Contacto',
    projects: 'Proyectos',
  },
};

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)['es']) {
    return ui[lang][key];
  };
}
