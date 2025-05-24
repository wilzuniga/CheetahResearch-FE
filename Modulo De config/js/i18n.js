const translations = {
  es: {
    brand: "Cheetah Research",
    registered: "es una marca registrada de",
    company: "Marketing Total S.A.",
    rights: "Todos los derechos reservados.",
    navbar: {
      create_study: "CREACION DE ESTUDIO",
      pollster: "ENCUESTADOR",
      survey: "ENCUESTA",
      launch_study: "LANZAR ESTUDIO",
      study_info: "INFORMACION DE ESTUDIO",
      results: "VISUALIZACION DE RESULTADOS",
      admin_tools: "HERRAMIENTAS DEL ADMINISTRADOR"
    },
    PaginaPrincipal: {
      title: "Seleccionar Estudio",
      searchBar: "Buscar Estudio",
      btCreate: "Crear Estudio",
      btLogOff: "Cerrar Sesión"
    }
  },
  en: {
    brand: "Cheetah Research",
    registered: "is a registered trademark of",
    company: "Marketing Total S.A.",
    rights: "All rights reserved.",
    navbar: {
      create_study: "CREATE STUDY",
      pollster: "INTERVIEWER",
      survey: "SURVEY",
      launch_study: "LAUNCH STUDY",
      study_info: "STUDY INFO",
      results: "RESULTS VIEW",
      admin_tools: "ADMIN TOOLS"
    },
    PaginaPrincipal: {
      title: "Select Study",
      searchBar: "Search Study",
      btCreate: "Create Study",
      btLogOff: "Log Off"
    }
  },
  pt: {
    brand: "Cheetah Research",
    registered: "é uma marca registrada de",
    company: "Marketing Total S.A.",
    rights: "Todos os direitos reservados.",
    navbar: {
      create_study: "CRIAÇÃO DE ESTUDO",
      pollster: "ENTREVISTADOR",
      survey: "PESQUISA",
      launch_study: "LANÇAR ESTUDO",
      study_info: "INFORMAÇÕES DO ESTUDO",
      results: "VISUALIZAÇÃO DE RESULTADOS",
      admin_tools: "FERRAMENTAS DO ADMINISTRADOR"
    },
    PaginaPrincipal: {
      title: "Selecionar Estudo",
      searchBar: "Buscar Estudo",
      btCreate: "Criar Estudo",
      btLogOff: "Sair"
    }
  }
};

// Para hacer referencia a sub-elementos (Ej: navbar.results.title...)
function getNestedTranslation(obj, key) {
  return key.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
}

// Setea el idioma en el DOM
function setLanguage(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = getNestedTranslation(translations[lang], key);
    if (translation) {
      el.textContent = translation;
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const switcher = document.getElementById('languageSwitcher');
  if (switcher) {
    switcher.addEventListener('change', function() {
      setLanguage(this.value);
    });
    setLanguage(switcher.value || 'es');
  }
});