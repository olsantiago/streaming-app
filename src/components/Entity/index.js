class Entity extends HTMLElement {
  static observedAttributes = ["entered", "entityFocused", "play"];

  template = () => {
    return `
      <div class="card">
        <img src="${this.entityItem?.background}" alt="${this.entityItem?.title}"/>
        <h3 class="title">${this.entityItem?.title}</h3>
        <video src="${this.entityItem.videoArtUrl}" type="video/mp4" muted loop playsinline></video>
      </div>
    `
  }
  constructor() {
    super();
    this.entityItem = null;
    this.playVideo = false;
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
    this.playVideo = value;
    this.controlVideoElement();
  }

  controlVideoElement() {
    const video = this.querySelector('video');
    if(video) {
      const isSrcAvailable = video.getAttribute("src");
      if(isSrcAvailable) {
        if(this.playVideo) {
          video.play();
        } else {
          video.pause();
        }
      } else {
        // prevent from hiding image if video src is NOT available
        video.style.display = 'none';
        video.closest("div").querySelector("img").classList.add("static");
      }
    }
  }

  connectedCallback() {
    // prevent broken image icon
    document.querySelectorAll('img').forEach(function (img) {
      img.onerror = function () {
        this.src = 'https://olsantiago.github.io/streaming-app/img/home/generic.png';
      };
    });

    this.render();
    this.controlVideoElement();
  }

}

customElements.define("portal-entity", Entity);
