import { EventEmitter } from "../EventEmitter";

export interface BaseObject {
  tag?: keyof HTMLElementTagNameMap;
  parent: HTMLElement;
  className?: string;
  text?: string;
}

export class BaseComponent<
  T extends HTMLElement = HTMLElement
> extends EventEmitter {
  public readonly element: T;

  constructor({ tag = "div", parent, className, text }: BaseObject) {
    super();
    this.element = document.createElement(tag) as T;
    if (className) {
      this.element.className = className;
    }
    if (parent) {
      parent.append(this.element);
    }
    if (text) {
      this.element.innerHTML = text;
    }
  }
}
