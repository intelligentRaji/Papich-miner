import { BaseComponent } from "./components/BaseComponent";

interface IModal {
  text: string;
  callback: () => void;
}

export class Modal extends BaseComponent {
  private readonly text: BaseComponent;
  private readonly reset: BaseComponent;
  private readonly overlay: BaseComponent;
  private readonly callback: () => void;

  constructor({ text, callback }: IModal) {
    super({ parent: document.body, className: "modal" });
    this.callback = callback;
    this.text = new BaseComponent({
      tag: "span",
      className: "modal-text",
      parent: this.element,
      text,
    });
    this.reset = new BaseComponent({
      parent: this.element,
      tag: "button",
      text: "НАЧАТЬ ЗАНОВО",
      className: "modal-button",
    });
    this.overlay = new BaseComponent({
      className: "overlay",
      parent: document.body,
    });
    this.reset.addEvent("click", this.resetAction);
  }

  private resetAction = (): void => {
    this.destroy();
    this.callback();
    this.overlay.destroy();
  };
}
