class FeaturedSection extends HTMLElement {
  static observedAttributes = ["navigating", "disabled"];

  template = () => {
    return `
      <div class="slider">
        <div class="slides"></div>
        <div class="indicators"></div>
      </div>
    `
  }
  constructor() {
    super();
    document.addEventListener('keyup', this.isNavigating.bind(this));
    this.itemsLength = 5;
    this.currentPosition = 0;
    this.entities = [];
    this.preventAllNavigation = false;
  }

  render() {
    this.innerHTML = `
      ${this.template().trim()}
    `;
  }

  setEntities(value) {
    this.entities = value.set.items;
    const slides = this.querySelector(".slider .slides");
    const indicators = this.querySelector(".slider .indicators");

    this?.entities.forEach((item, index) => {
      const isFull = item.contentType === "full";
      const div = document.createElement("div");
      const img = document.createElement("img");
      const indicator = document.createElement("div");

      if(isFull) {
        div.style.backgroundImage = `url('${item.image.hero_collection["1.78"].program.default.url.replace('=500', '=900')}')`;
        img.src = item.image.title_treatment["1.78"].program.default.url.replace("=jpeg", '=png');
      } else {
        div.style.backgroundImage = `url('${item.image.hero_collection["1.78"].series.default.url.replace('=500', '=900')}')`;
        img.src = item.image.title_treatment["1.78"].series.default.url.replace("=jpeg", '=png');
      }

      div.setAttribute("id", `slide-${index}`);
      div.append(img);
      indicator.setAttribute("id", `indicator-${index}`);
      if(index === 0) {
        indicator.classList.add("active");
      }
      slides.append(div);
      indicators.append(indicator);
    })
  }

  setDisabled(value) {
    this.preventAllNavigation = value;
    this.setAttribute("disabled", value);
  }

  isNavigating(value) {
    if(this.preventAllNavigation) return;
    this.setAttribute("navigating", value.code);
  }

  scrollToItem(position) {
    const slider = this.querySelector(".slider .slides");
    const slides = this.querySelectorAll(".slider .slides div");
    const indicators = this.querySelectorAll(".slider .indicators div");
    indicators.forEach((element) => {
      element.classList.remove("active");
    })

    slides.forEach((element) => {
      element.classList.remove("active");
    })

    this.querySelector(`#slide-${position}`).classList.add("active");
    this.querySelector(`#indicator-${position}`).classList.add("active");

    const cardLength = slider.querySelector("div").offsetWidth;
    slider.scrollTo(cardLength * position, 0);
  }

  left() {
    if(this.currentPosition === 0) return;
    this.currentPosition--;
    this.scrollToItem(this.currentPosition);
  }

  right() {
    if(this.currentPosition === this?.entities?.length - 1) {
      this.currentPosition = 0;
    } else {
      this.currentPosition++;
    }
    this.scrollToItem(this.currentPosition);
  }

  down(value) {
    const portalSection = document.querySelector("portal-section");
    this.setDisabled(true);
    portalSection.setDisabled(false);
  }

  connectedCallback() {
    this.render();

    const autoScrollRight = () => {
      if(this.preventAllNavigation) {
        this.right();
      }
    }
    setInterval(autoScrollRight, 6000);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if(this.preventAllNavigation) return;

    if (name === 'navigating') {

      if (newValue === "ArrowLeft") {
        this.left();
      }

      if (newValue === "ArrowRight") {
        this.right();
      }

      if(newValue === "ArrowDown") {
        this.down(newValue);
      }
    }
  }
}

customElements.define("featured-section", FeaturedSection);
