import { BaseComponent } from "./BaseComponent";

interface IOption {
  parent: HTMLElement;
  value: string;
  text: string;
  selected?: boolean;
}

export class Option extends BaseComponent<HTMLOptionElement> {
  constructor({ parent, value, text, selected }: IOption) {
    super({ tag: "option", className: "option", text, parent });
    this.setValue(value);
    if (selected) {
      this.element.selected = true;
    }
  }

  private setValue(value: string): void {
    this.element.value = value;
  }
}
