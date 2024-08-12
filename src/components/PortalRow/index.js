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
        modalBackground: null,
        videoArtUrl: "",
        titleLayered: null,
        badge: null,
        releaseYear: null,
        isCollection: false
      }

      // add distinction for each entity and set specific values available
      const isFull = item.contentType === "full";
      const isSeries = item.seriesId;
      const collection = item.collectionId;

      if (isFull) {
        entity.title = item.text.title.full.program.default.content;
        entity.background = item.image.tile["1.78"].program.default.url;
        entity.titleLayered = item.image.title_treatment["1.78"].program.default.url.replace("=jpeg", '=png');
        entity.badge = item.mediaMetadata.format;
        entity.releaseYear = item.releases[0].releaseYear;
        entity.modalBackground = item.image.hero_collection["1.78"].program.default.url;
      }
      if (isSeries) {
        entity.title = item.text.title.full.series.default.content;
        entity.background = item.image.tile["1.78"].series.default.url;
        entity.titleLayered = item.image.title_treatment["1.78"].series.default.url.replace("=jpeg", '=png');
        entity.badge = item.ratings[0].value;
        entity.releaseYear = item.releases[0].releaseYear;
        entity.modalBackground = item.image.hero_collection["1.78"].series.default.url;
      }

      if (collection) {
        entity.title = item.text.title.full.collection.default.content;
        entity.background = item.image.tile["1.78"].default.default.url;
        entity.isCollection = true;
        entity.modalBackground = item.image.hero_collection["1.78"].default.default.url;
      }

      if(item.videoArt.length > 0) {
        entity.videoArtUrl = item.videoArt[0].mediaMetadata.urls[0].url;
      }
      const portalEntity = document.createElement("portal-entity");
      portalEntity.setEntityData(entity);
      portalEntity.style.animationDelay = `${index / 8}s`;
      portalEntity.isFocused(index === 0);
      this.append(portalEntity);
    })
  }

  setEntities(value) {
    this.#createEntities(value);
  }
}

customElements.define("portal-row", PortalRow);
