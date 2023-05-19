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

  public addClass(...classes: string[]): void {
    this.element.classList.add(...classes);
  }

  public removeClass(...classes: string[]): void {
    this.element.classList.remove(...classes);
  }

  public setTextContent(text: string): void {
    this.element.textContent = text;
  }

  public stylize<K extends keyof CSSStyleDeclaration>(
    prop: K,
    value: CSSStyleDeclaration[K]
  ): void {
    this.element.style[prop] = value;
  }

  public addEvent(event: string, func: (e: Event) => void): void {
    this.element.addEventListener(event, func);
  }

  public removeEvent(event: string, func: (e: Event) => void): void {
    this.element.removeEventListener(event, func);
  }

  public destroy(): void {
    this.element.remove();
  }
}
