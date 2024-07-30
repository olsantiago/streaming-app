function activateRemote() {
  const rowItems = document.querySelectorAll("portal-section");

  document.onkeydown = function (e) {
    const isModalOpened = document.body.classList.contains("modal-opened");
    const portalModal = document.querySelector("portal-modal");

    e.preventDefault();
    e.stopPropagation();
    const currentRowItems = rowItems[0];
    currentRowItems.isNavigating(e.key);

    if(isModalOpened) {
      portalModal.isNavigating(e.key);
    }
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", activateRemote);
} else {
  activateRemote();
}
