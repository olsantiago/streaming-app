class FeaturedSection extends HTMLElement {

  template = () => {
    return `
      <div class="slider">
        <div class="slides"></div>
      </div>
    `
  }
  constructor() {
    super();
    this.itemsLength = 5;
    this.currentPosition = 0;
    this.entities = []
  }

  render() {
    this.innerHTML = `
      ${this.template().trim()}
    `;
  }

  setEntities(value) {
    this.entities = value.set.items;
    const slides = this.querySelector(".slider .slides");

    this?.entities.forEach((item, index) => {
      const isFull = item.contentType === "full";
      const div = document.createElement("div");
      const img = document.createElement('img');

      if(isFull) {
        div.style.backgroundImage = `url('${item.image.hero_collection["1.78"].program.default.url.replace('=500', '=1000')}')`;
        img.src = item.image.title_treatment["1.78"].program.default.url.replace("=jpeg", '=png');
      } else {
        div.style.backgroundImage = `url('${item.image.hero_collection["1.78"].series.default.url.replace('=500', '=1000')}')`;
        img.src = item.image.title_treatment["1.78"].series.default.url.replace("=jpeg", '=png');
      }

      div.setAttribute("id", `slide-${index + 1}`);
      div.append(img);
      slides.append(div);
    })
  }

  scrollToItem() {
    const slider = this.querySelector(".slider .slides");
    const cardLength = slider.querySelector("div").offsetWidth;
    if(this.currentPosition === this?.entities?.length) {
      this.currentPosition = 0;
    } else {
      this.currentPosition++;
    }
    slider.scrollTo(cardLength * this.currentPosition, 0);
  }

  connectedCallback() {
    this.render();

    const autoScroll = () => {
      this.scrollToItem();
    }
    setInterval(autoScroll, 2000);
  }
}

customElements.define("featured-section", FeaturedSection);
