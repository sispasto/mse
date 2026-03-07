class RegistroBeneficioComponent extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const containerSelector = this.getAttribute('container'); // ej: #App
    const container = document.querySelector(containerSelector);

    if (!container) {
      console.error(`Contenedor no encontrado: ${containerSelector}`);
      return;
    }

    try {
      // 1. Cargamos el HTML de beneficios
      const response = await fetch('view/registroBeneficio.html');
      if (!response.ok) throw new Error("No se pudo cargar el archivo HTML");
      
      const htmlText = await response.text();

      // 2. Crear template para manipular el contenido
      const template = document.createElement('template');
      template.innerHTML = htmlText;

      // 3. Extraer scripts del HTML para ejecutarlos manualmente
      const scripts = template.content.querySelectorAll('script');
      scripts.forEach(script => script.remove());

      // 4. Limpiar el componente e insertar el nuevo HTML
      this.innerHTML = '';
      this.appendChild(template.content.cloneNode(true));

      // 5. Limpiar scripts dinámicos previos en el contenedor principal
      container
        .querySelectorAll('script[data-dynamic="true"]')
        .forEach(s => s.remove());

      // 6. Reinyectar los scripts (donde vive nsRegistroBeneficio)
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');

        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.textContent;
        }

        newScript.setAttribute('data-dynamic', 'true');
        container.appendChild(newScript);
      });

    } catch (error) {
      console.error('Error al cargar registroBeneficio.html:', error);
      this.innerHTML = `<div class="alert alert-danger">Error al cargar la vista de beneficios.</div>`;
    }
  }
}

// Definimos el nuevo tag personalizado
customElements.define('registro-beneficio-component', RegistroBeneficioComponent);