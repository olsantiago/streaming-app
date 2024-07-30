import { getData, getItems } from "../../js/api.js";

class PortalSection extends HTMLElement {
  static observedAttributes = ["navigating"];

  constructor() {
    super();
    this.rows = [];
    this.currentRow = 0;
    this.rowCount = 0;
    this.currentRowItems = [];
    this.currentEntity = 0;
    this.maxEntities = 0;
    this.currentEntityItems = [];
    this.cardLength = 320;
    this.rowHeight = 280;
    this.currentEntitySelected = null;
    this.isModalOpened = false;
    this.#fetchAndSetData();
  }

  render() {
    this.currentRowItems?.forEach((item, index) => {
      if (item?.set?.items) {
        this.createRows(item, index);
      } else {
        this.#setDynamicData(item.set.refId, index);
      }
    });
  }

  // initial fetch of data
  #fetchAndSetData() {
    getData().then((data) => {
      data?.forEach((item, index) => {
        this.currentRowItems.push(item);
      })
      this.render();
    })
  }

  #setDynamicData(refId, index) {
    getItems(refId).then((data) => {
      if(!data) return;
      const type = Object.keys(data)[0];
      const set = data[type];
      const style = set.contentClass;
      const dataSet = {
        set: set,
        type: type,
        style: style
      };
      this.createRows(dataSet, index);
    });
  }

  // creates the row that hold the items
  createRows(item, index) {
    this.rowCount++;
    const section = document.createElement("section");
    section.setAttribute("id", `section${index}`);
    section.setAttribute("class", `entity-section`);
    section.setAttribute("focused", index === 0);

    const portalHeader = document.createElement("portal-header");
    const rowTitle = item.set.text.title.full.set.default.content;
    portalHeader.setTitle(rowTitle);

    const portalRow = document.createElement("portal-row");
    const entities = encodeURIComponent(JSON.stringify(item.set.items));
    portalRow.setEntities(entities);

    section.append(portalHeader);
    section.append(portalRow);
    this.rows.push(section);
    this.append(section);
  }

  isNavigating(value) {
    this.setAttribute("navigating", value);
  }

  up() {
    if(this.isModalOpened) return;
    if (!this.currentRow <= 0) {
      this.currentRow--;
    }
    window.scrollTo(0, this.rowHeight * this.currentRow - 1);
  }

  down() {
    if(this.isModalOpened) return;
    if (this.rowCount > 0 && this.currentRow === (this.rowCount - 1)) {
      return;
    }
    this.currentRow++;
    window.scrollTo(0, this.rowHeight * this.currentRow - 1);
  }

  right() {
    if(this.isModalOpened) return;
    if(this.currentEntityItems.length > 0 && this.currentEntity === (this.currentEntityItems.length - 1)) {
      return;
    }
    this.currentEntity++;
    this.rows[this.currentRow]?.querySelector("portal-row").scrollBy(this.cardLength, 0);
  }

  left() {
    if(this.isModalOpened) return;
    if (!this.currentEntity <= 0) {
      this.currentEntity--;
    }
    this.rows[this.currentRow]?.querySelector("portal-row").scrollBy(-this.cardLength, 0);
  }

  enter() {
    if(this.isModalOpened) return;
    this.currentEntitySelected = document.querySelectorAll("portal-row")[this.currentRow]?.querySelectorAll("portal-entity")[this.currentEntity];
    this.currentEntitySelected.entered();
  }

  // remove modal when closed
  back() {
    if(this.isModalOpened) {
      document.querySelector("portal-modal").remove();
      this.currentEntitySelected.exited();
    }
  }

  // set the current entitiy that is being focused
  setCurrentEntityView() {
    const entityItems = [...this.rows[this.currentRow].querySelectorAll("portal-entity")];

    entityItems.forEach((item, index) => {
      item.isFocused(false);
      if(this.currentEntity === index) {
        item.isFocused(true);
      }
    });
  }

  // set the current row that is being focusd
  setCurrentRowView() {
    this.currentEntityItems = [...this.rows[this.currentRow].querySelectorAll("portal-entity")];

    const currentEntityFocused = this.currentEntityItems.findIndex(
      (element) => element.getAttribute("entityFocused") === "true"
    );

    this.currentEntity = currentEntityFocused;

    this.rows?.forEach((item) => {
      item.setAttribute('focused', false);
      if (item.id === `section${this.currentRow}`) {
        item.setAttribute('focused', true);
      }
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'navigating') {
      // this will be checked to prevent navigating when modal-opened
      this.isModalOpened = document.body.classList.contains("modal-opened");

      if (newValue === "ArrowUp") {
        this.up();
      }

      if (newValue === "ArrowDown") {
        this.down();
      }

      if (newValue === "ArrowLeft") {
        this.left();
        this.setCurrentEntityView();
      }

      if (newValue === "ArrowRight") {
        this.right();
        this.setCurrentEntityView();
      }

      if (newValue === "Enter") {
        this.enter();
      }

      if(newValue === "Backspace" || newValue === "Escape") {
        this.back();
      }

      this.setCurrentRowView();
    }
  }
}

customElements.define("portal-section", PortalSection);
