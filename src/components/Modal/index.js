class Modal extends HTMLElement {
  static observedAttributes = ["details", "navigating"];

  template = () => {
    return `
      <div class="modal">
        <article
          class="modal-container"
          style="background-image: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2)), url(${this.currentDetails.background});"
        >
          <section class="modal-container-body details">
            ${!this.currentDetails.titleLayered ? '<div></div>' : `<img src=${this.currentDetails.titleLayered} />`}
            <h2 class="${!this.currentDetails.titleLayered ? 'd-block' : 'd-none'}">${this.currentDetails.title}</h2>
            ${this.currentDetails.isCollection
              ? '<div></div>'
              : `<div class="badge-container">
                  <span>${this.currentDetails.releaseYear}</span>
                  <span class="badge">${this.currentDetails.badge}</span>
                </div>`
            }
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Unum nescio, quo modo possit, si luxuriosus sit,
              finitas cupiditates habere.
            </p>
            <div class="button-container">
              <button id="play" class="button focused">
                <svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17.804 17.804" xml:space="preserve">
                  <g>
                    <g id="c98_play">
                      <path d="M2.067,0.043C2.21-0.028,2.372-0.008,2.493,0.085l13.312,8.503c0.094,0.078,0.154,0.191,0.154,0.313
                      c0,0.12-0.061,0.237-0.154,0.314L2.492,17.717c-0.07,0.057-0.162,0.087-0.25,0.087l-0.176-0.04
                      c-0.136-0.065-0.222-0.207-0.222-0.361V0.402C1.844,0.25,1.93,0.107,2.067,0.043z" />
                    </g>
                    <g id="Capa_1_78_">
                    </g>
                  </g>
                </svg>
                Play</button>
              <button id="trailer" class="button">Trailer</button>
            </div>
          </section>
        </article>
      </div>
    `
  }
  constructor() {
    super();
    this.currentDetails = null;
    this.currentButtons = [];
  }

  render() {
    this.innerHTML = `
      ${this.template().trim()}
    `;
  }

  isNavigating(value) {
    this.setAttribute("navigating", value);
  }

  setDetails(value) {
    this.currentDetails = value;
  }

  connectedCallback() {
    this.render();
    document.body.classList.add("modal-opened");
    this.querySelectorAll('img').forEach(function (img) {
      img.onerror = function () {
        this.style.display = "none";
        this.closest("section").querySelector("h2").style.display = "block";
      };
    });
  }

  disconnectedCallback() {
    document.body.classList.remove("modal-opened");
  }

  setDetails(value) {
    this.currentDetails = value;
  }

  right() {
    const focused = this.querySelector(".focused");
    if (focused.id === "play") {
      focused.classList.remove("focused");
      this.querySelector("#trailer").classList.add("focused");
    }
  }

  left() {
    const focused = this.querySelector(".focused");
    if (focused.id === "trailer") {
      focused.classList.remove("focused");
      this.querySelector("#play").classList.add("focused");
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "navigating") {
      this.currentButtons = this.querySelectorAll("button");

      if (newValue === "ArrowLeft") {
        this.left();
      }

      if (newValue === "ArrowRight") {
        this.right();
      }
    }
  }
}

customElements.define("portal-modal", Modal);
