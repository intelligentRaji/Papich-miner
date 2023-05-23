import { BaseComponent } from "./BaseComponent.js";
export class ModalComponent extends BaseComponent {
  constructor({ parent, className }) {
    super({ tag: "div", parent, className });
    this.showElement = (e) => {
      this.addClass("open");
      document.addEventListener("click", this.closeElementOnDocumentClick);
      e.stopPropagation();
    };
    this.closeElement = (e) => {
      this.removeClass("open");
      document.removeEventListener("click", this.closeElementOnDocumentClick);
    };
    this.closeElementOnDocumentClick = (e) => {
      if (!e.composedPath().includes(this.element)) {
        this.removeClass("open");
      }
    };
    this.visibilityMechanic = (e) => {
      if (this.element.classList.contains("open")) {
        this.closeElement(e);
      } else {
        this.showElement(e);
      }
    };
  }
}
