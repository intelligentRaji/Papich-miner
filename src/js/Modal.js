import { BaseComponent } from "./components/BaseComponent";
export class Modal extends BaseComponent {
    constructor({ text, callback }) {
        super({ parent: document.body, className: "modal" });
        this.resetAction = () => {
            this.destroy();
            this.callback();
            this.overlay.destroy();
        };
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
}
