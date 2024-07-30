class PortalHeader extends HTMLElement {
  static observedAttributes = ["title"];

  template = () => {
    return `
      <h2>
        ${this.getAttribute("title")}
      </h2>
    `
  }
  constructor() {
    super();
  }

  render() {
    this.innerHTML = `
      ${this.template().trim()}
    `;
  }

  connectedCallback() {
    this.render();
  }

  setTitle(value) {
    this.setAttribute("title", value);
  }

}

customElements.define("portal-header", PortalHeader);
