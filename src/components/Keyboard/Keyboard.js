import { keysMap } from '../../utills/constants';
import './Keyboard.scss';

export default class Keyboard {
  constructor(layout) {
    this._layout = layout;
  }

  _createKeyElement(keyData) {
    const keyEl = document.createElement('button');
    const [keyCode, options] = keyData;
    
    keyEl.classList.add('keyboard__key', `keyboard__key_color_${options.color}`);
    if (options.type !== 'symbol') {
      keyEl.classList.add(`keyboard__key_type_${options.type}`, 'keyboard__key_type_grow');
    }

    keyEl.setAttribute('data-code', keyCode);

    return keyEl;
  }

  _init() {
    const element = document.createElement('ul');
    element.classList.add('keyboard');

    this._keysElements = this._layout.map(this._createKeyElement);
    element.append(...this._keysElements);

    this._element = element;
  }

  render(container) {
    this._init();
    container.append(this._element);
  }

  show() {
    this.element.classList.remove('keyboard_hidden');
  }

  hide() {
    this.element.classList.add('keyboard_hidden');
  }
}
