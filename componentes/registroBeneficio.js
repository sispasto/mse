class RegistroBeneficioComponent extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const containerSelector = this.getAttribute('container');
    const container = document.querySelector(containerSelector);
    if (!container) return;

    try {
      const response = await fetch('view/registroBeneficio.html');
      const htmlText = await response.text();

      const template = document.createElement('template');
      template.innerHTML = htmlText;

      const scripts = template.content.querySelectorAll('script');
      scripts.forEach(script => script.remove());

      this.innerHTML = '';
      this.appendChild(template.content.cloneNode(true));

      container.querySelectorAll('script[data-dynamic="true"]').forEach(s => s.remove());

      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        if (oldScript.src) { newScript.src = oldScript.src; } 
        else { newScript.textContent = oldScript.textContent; }
        newScript.setAttribute('data-dynamic', 'true');
        container.appendChild(newScript);
      });

      // INICIALIZACIÓN: Esperar un breve momento a que el script se evalúe y cargar redes
      setTimeout(() => {
        if (typeof nsRegistroBeneficio !== 'undefined') {
          nsRegistroBeneficio.cargarRedes();
        }
      }, 100);

    } catch (error) {
      console.error('Error al cargar:', error);
    }
  }
}

customElements.define('registro-beneficio-component', RegistroBeneficioComponent);