export const Languages = {
  es: 'Español',
  en: 'English',
};

export const ui = {
  en: {
    //Header_Navigation
    home: 'Home',
    projects: 'Projects',
    stack: 'Stack',

    // Hero
    hero_role: 'FullStack Developer',
    hero_description:
      "I'm passionate crafting robust web applications with Python and TypeScript. Dedicated to creating responsive, user-centric interfaces and efficient backend systems",
    hero_cta_projects: 'View Projects',
    hero_cta_contact: 'Contact Me',

    // Stack
    stack_title: 'Tech Stack',
    stack_error: 'There was a problem loading the data.',
    stack_empty: 'No technologies to show.',

    // Projects
    projects_title: 'Featured Projects',
    projects_error: 'Sorry, we could not load the projects.',
    projects_empty: 'No projects to show.',
    projects_live: 'Live Demo',
    projects_repo: 'GitHub',
    projects_read_more: 'Read more',
    projects_show_less: 'Show less',
  },
  es: {
    //Header_Navigation
    home: 'Inicio',
    projects: 'Proyectos',
    stack: 'Stack',

    // Hero
    hero_role: 'FullStack Developer',
    hero_description:
      'Me considero apasionado por crear aplicaciones web robustas con Python y TypeScript. Dedicado a desarrollar interfaces responsivas centradas en el usuario y sistemas backend eficientes',
    hero_cta_projects: 'Ver Proyectos',
    hero_cta_contact: 'Contactar',

    // Stack
    stack_title: 'Stack Tecnológico',
    stack_error: 'Hubo un problema cargando los datos.',
    stack_empty: 'No hay tecnologías para mostrar.',

    // Projects
    projects_title: 'Proyectos Destacados',
    projects_error: 'Lo sentimos, no pudimos cargar los proyectos.',
    projects_empty: 'No hay proyectos para mostrar.',
    projects_live: 'Demo en Vivo',
    projects_repo: 'GitHub',
    projects_read_more: 'Leer más',
    projects_show_less: 'Leer menos',
  },
};

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)['es']) {
    return ui[lang][key];
  };
}
