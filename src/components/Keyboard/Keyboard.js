import { keysMap, langs } from '../../utills/constants';
import './Keyboard.scss';

export default class Keyboard {
  constructor(layout, textarea) {
    this._textarea = textarea;
    this._layout = layout;
    this._keysElements = {};
    this._caps = false;
    this._shift = false;
    this._langs = langs;
    this._currentLang = localStorage.getItem('lang') || 0;
  }

  _createKeyElement(keyData) {
    const keyEl = document.createElement('button');
    const [keyCode, options] = keyData;

    keyEl.classList.add('keyboard__key', `keyboard__key_color_${options.color}`);
    if (options.widthType) {
      keyEl.classList.add(`keyboard__key_type_${options.widthType}`, 'keyboard__key_type_grow');
    }

    this._keysElements[keyCode] = keyEl;
  }

  _updateLayout() {
    const isUpperCase = (this._shift && !this._caps) || (this._caps && !this._shift);
    const lang = this._langs[this._currentLang]
    Object.entries(this._keysElements).forEach(([code, keyEl]) => {
      const functionalKey = keysMap.functional[code];
      if (functionalKey) {
        keyEl.textContent = functionalKey;
      } else {
        const { main, shift } = keysMap.symbols[lang][code];
        if (shift.toLowerCase() === main) {
          keyEl.textContent = isUpperCase ? shift : main;
        } else {
          keyEl.innerHTML = `
            <span class=${this._shift ? 'keyboard__key-secondary' : ''}>${main}</span>
            <span class=${this._shift ? '' : 'keyboard__key-secondary'}>${shift}</span>`;
        }
      }
    });
  }

  _init() {
    const element = document.createElement('ul');
    element.classList.add('keyboard');

    this._layout.forEach((keyData) => this._createKeyElement(keyData));
    element.append(...Object.values(this._keysElements));
    this._updateLayout();

    this._element = element;
  }

  handleKeyAction(e) {
    this._textarea.focus();
    const keyEl = this._keysElements[e.code];
    if (!keyEl) {
      return;
    }
    if (e.code === 'CapsLock') {
      if (e.type === 'keyup') {
        this._caps = !this._caps;
        this._updateLayout();
        this._keysElements.CapsLock.classList.toggle('keyboard__key_active');
      }
      return;
    }
    if (e.code.match(/shift/i)) {
      const newShiftState = e.type === 'keydown';
      if (this._shift !== newShiftState) {
        this._shift = newShiftState;
        this._updateLayout();
      }
    }
    if (e.altKey && e.shiftKey) {
      this._currentLang = this._currentLang + 1 < this._langs.length ? this._currentLang + 1 : 0;
      this._updateLayout();
    }
    if (e.type === 'keydown') {
      keyEl.classList.add('keyboard__key_active');
    } else {
      keyEl.classList.remove('keyboard__key_active');
    }
  }

  handleMouseDown(e) {
    this._textarea.focus();
  }

  _addListeners() {
    window.addEventListener('keydown', (e) => this.handleKeyAction(e));
    window.addEventListener('keyup', (e) => this.handleKeyAction(e));
    this._element.addEventListener('click', (e) => this.handleMouseDown(e));
  }

  render(container) {
    this._init();
    container.append(this._element);
    this._addListeners();
  }

  show() {
    this.element.classList.remove('keyboard_hidden');
  }

  hide() {
    this.element.classList.add('keyboard_hidden');
  }
}
