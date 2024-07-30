class PortalRow extends HTMLElement {
  static observedAttributes = ["entities"];

  constructor() {
    super();
  }

  #createEntities(items) {
    items.forEach((item, index) => {
      const entity = {
        title: "",
        background: "",
        videoArtUrl: ""
      }

      // add distinction for each entity and set specific values available
      const isFull = item.contentType === "full";
      const isSeries = item.seriesId;
      const collection = item.collectionId;

      if (isFull) {
        entity.title = item.text.title.full.program.default.content;
        entity.background = item.image.hero_tile["1.78"].program.default.url;
      }

      if (isSeries) {
        entity.title = item.text.title.full.series.default.content;
        entity.background = item.image.hero_tile["1.78"].series.default.url;
      }

      if (collection) {
        entity.title = item.text.title.full.collection.default.content;
        entity.background = item.image.tile["1.78"].default.default.url;
      }

      if(item.videoArt.length > 0) {
        entity.videoArtUrl = item.videoArt[0].mediaMetadata.urls[0].url;
      }

      const portalEntity = document.createElement("portal-entity");
      const data = encodeURIComponent(JSON.stringify(entity));
      portalEntity.style.animationDelay = `${index / 8}s`;
      portalEntity.isFocused(index === 0);
      portalEntity.setEntityData(data);
      this.append(portalEntity);
    })
  }

  setEntities(value) {
    this.setAttribute("entities", value);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if(name === "entities") {
      const items = JSON.parse(decodeURIComponent(newValue));
      this.#createEntities(items);
    }
  }

}

customElements.define("portal-row", PortalRow);
