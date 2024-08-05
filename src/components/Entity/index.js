class Entity extends HTMLElement {
  static observedAttributes = ["data", "entered", "entityFocused"];

  template = () => {
    return `
      <div class="card">
        <img src="${this.entityItem?.background}" alt="${this.entityItem?.title}"/>
        <h3 class="title">${this.entityItem?.title}</h3>
        <video src="${this.entityItem.videoArtUrl}" type="video/mp4" autoplay muted loop playsinline></video>
      </div>
    `
  }
  constructor() {
    super();
    this.entityItem = null;
    this.unParsedEntityItem = "";
  }

  render() {
    this.innerHTML = `
      ${this.template().trim()}
    `;
  }

  setEntityData(value) {
    this.entityItem = value;
  }

  entered() {
    this.setAttribute("entered", true);
    const portalModal = document.createElement("portal-modal");
    portalModal.setDetails(this.entityItem);
    document.body.append(portalModal);
  }

  exited() {
    this.setAttribute("entered", false);
  }

  // set focused on entity
  isFocused(value) {
    this.setAttribute("entityFocused", value);
  }

  connectedCallback() {
    // prevent broken image icon
    document.querySelectorAll('img').forEach(function (img) {
      img.onerror = function () {
        this.src = 'https://olsantiago.github.io/streaming-app/img/home/generic.png';
      };
    });

    // prevent from hiding image if video src is NOT available
    document.querySelectorAll('video').forEach(function (vid) {
      const isSrcAvailable = vid.getAttribute("src");
      if(!isSrcAvailable) {
        vid.style.display = 'none';
        vid.closest("div").querySelector("img").classList.add("static");
      }
    });
    this.render();
  }

}

customElements.define("portal-entity", Entity);
