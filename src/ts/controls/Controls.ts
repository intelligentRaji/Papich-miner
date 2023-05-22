import { BombsControler } from "./BombsControler";
import { BaseComponent } from "../components/BaseComponent";
import { VolumeControler } from "./VolumeControler";
import { ModeController } from "./ModeController";
import { LightMode, Mode } from "../Settings";
import { LightModeButton } from "./LightModeButton";

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

export class Controls extends BaseComponent {
  public readonly container: BaseComponent;
  public readonly bombsControler: BombsControler;
  public readonly ostVolumeController: VolumeControler;
  public readonly effectsVolumeController: VolumeControler;
  public readonly modeController: ModeController;
  public readonly lightModeButton: LightModeButton;
  public readonly resetButton: BaseComponent;
  public readonly bombsWrapper: BaseComponent;
  public readonly bombsText: BaseComponent;

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
  }: ContolsConstructor) {
    super({ parent, className: "controls" });
    this.container = new BaseComponent({
      className: "container",
      parent: this.element,
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
    this.modeController.subscribe("changeBombs", (value: number) => {
      this.bombsControler.change(value);
    });
    this.lightModeButton = new LightModeButton(
      this.container.element,
      lightMode
    );
    this.resetButton = new BaseComponent({
      parent: this.container.element,
      tag: "button",
      text: "Начать заново",
      className: "reset-button",
    });
    this.resetButton.addEvent("click", reset);
  }

  public getBombs(): number {
    return this.bombsControler.getValue();
  }

  public toLocalStorage(): void {
    this.ostVolumeController.toLocalStorage();
    this.effectsVolumeController.toLocalStorage();
  }
}
