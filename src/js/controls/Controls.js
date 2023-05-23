<<<<<<< HEAD:src/js/controls/Controls.js
import { BombsControler } from "./BombsControler.js";
import { BaseComponent } from "../components/BaseComponent.js";
import { VolumeControler } from "./VolumeControler.js";
import { ModeController } from "./ModeController.js";
import { LightModeButton } from "./LightModeButton.js";
export class Controls extends BaseComponent {
=======
import { BombsControler } from "./BombsControler";
import { BaseComponent } from "../components/BaseComponent";
import { VolumeControler } from "./VolumeControler";
import { ModeController } from "./ModeController";
import { LightMode, Mode } from "../Settings";
import { LightModeButton } from "./LightModeButton";
import { ModalComponent } from "../components/ModalComponent";
import { ButtonComponent } from "../components/ButtonComponent";

export type Notify = (params: number) => void;

interface ContolsConstructor {
  parent: HTMLElement;
  ostCallback: Notify;
  effectsCallback: Notify;
  ostValue: string;
  effectsValue: string;
  mode: Mode;
  lightMode: LightMode;
  reset: () => void;
  numberOfBombs: number;
}

export class Controls extends ModalComponent {
  public readonly container: BaseComponent;
  public readonly bombsControler: BombsControler;
  public readonly ostVolumeController: VolumeControler;
  public readonly effectsVolumeController: VolumeControler;
  public readonly modeController: ModeController;
  public readonly lightModeButton: LightModeButton;
  public readonly resetButton: BaseComponent;
  public readonly bombsWrapper: BaseComponent;
  public readonly bombsText: BaseComponent;
  public readonly burgerButton: BaseComponent;

>>>>>>> fixOpenMechanic:src/ts/controls/Controls.ts
  constructor({
    parent,
    ostCallback,
    effectsCallback,
    ostValue,
    effectsValue,
    mode,
    lightMode,
    reset,
    numberOfBombs,
  }) {
    super({ parent, className: "controls" });
    this.container = new BaseComponent({
      className: "container",
      parent: this.element,
    });
    this.burgerButton = new ButtonComponent({
      className: "controls-burger-button",
      parent: document.body,
      callback: this.visibilityMechanic,
    });
    this.bombsWrapper = new BaseComponent({
      className: "bombs-wrapper",
      parent: this.container.element,
    });
    this.bombsText = new BaseComponent({
      tag: "span",
      className: "bombs-text",
      parent: this.bombsWrapper.element,
      text: "Бомбы",
    });
    this.bombsControler = new BombsControler({
      parent: this.bombsWrapper.element,
      reset,
      numberOfBombs,
    });
    this.ostVolumeController = new VolumeControler({
      parent: this.container.element,
      className: "ost-volume",
      callback: ostCallback,
      value: ostValue,
      type: "ost",
    });
    this.effectsVolumeController = new VolumeControler({
      parent: this.container.element,
      className: "effects-volume",
      callback: effectsCallback,
      value: effectsValue,
      type: "effects",
    });
    this.modeController = new ModeController({
      parent: this.container.element,
      mode,
      reset,
    });
    this.modeController.subscribe("changeBombs", (value) => {
      this.bombsControler.change(value);
    });
    this.lightModeButton = new LightModeButton(
      this.container.element,
      lightMode
    );
    this.resetButton = new ButtonComponent({
      parent: this.container.element,
      text: "Начать заново",
      className: "reset-button",
      callback: reset,
    });
  }
  getBombs() {
    return this.bombsControler.getValue();
  }
  toLocalStorage() {
    this.ostVolumeController.toLocalStorage();
    this.effectsVolumeController.toLocalStorage();
  }
}
