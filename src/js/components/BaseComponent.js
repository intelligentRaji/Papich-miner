import { EventEmitter } from "../behavioral/EventEmitter";
export class BaseComponent extends EventEmitter {
    constructor({ tag = "div", parent, className, text, type }) {
        super();
        this.element = document.createElement(tag);
        if (className) {
            this.element.className = className;
        }
        if (parent) {
            parent.append(this.element);
        }
        if (text) {
            this.element.innerHTML = text;
        }
        if (type) {
            if (this.element instanceof HTMLInputElement) {
                this.element.type = type;
            }
        }
    }
    addClass(...classes) {
        this.element.classList.add(...classes);
    }
    removeClass(...classes) {
        this.element.classList.remove(...classes);
    }
    getClassName() {
        return this.element.className;
    }
    setTextContent(text) {
        this.element.textContent = text;
    }
    stylize(prop, value) {
        this.element.style[prop] = value;
    }
    addEvent(event, func) {
        this.element.addEventListener(event, func);
    }
    removeEvent(event, func) {
        this.element.removeEventListener(event, func);
    }
    destroy() {
        this.element.remove();
    }
}
