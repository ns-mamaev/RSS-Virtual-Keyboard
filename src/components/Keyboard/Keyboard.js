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
    this._currentLang = Number(localStorage.getItem('lang')) || 0;
    this._textarea.value = '123456789';
  }

  _createKeyElement(keyData) {
    const keyEl = document.createElement('button');
    const [keyCode, options] = keyData;

    keyEl.classList.add('keyboard__key', `keyboard__key_color_${options.color}`);
    if (options.widthType) {
      keyEl.classList.add(`keyboard__key_type_${options.widthType}`, 'keyboard__key_type_grow');
    }

    keyEl.setAttribute('data-code', keyCode);

    this._keysElements[keyCode] = keyEl;
  }

  _updateLayout() {
    const isUpperCase = (this._shift && !this._caps) || (this._caps && !this._shift);
    const lang = this._langs[this._currentLang];
    Object.entries(this._keysElements).forEach(([code, keyEl]) => {
      const functionalKey = keysMap.functional[code];
      if (functionalKey) {
        keyEl.textContent = functionalKey;
      } else {
        const { main, shift } = keysMap.symbols[lang][code];
        let symbol;
        if (shift.toLowerCase() === main) {
          symbol = isUpperCase ? shift : main;
          keyEl.textContent = symbol;
          keyEl.setAttribute('data-symbol', symbol);
        } else {
          symbol = this._shift ? shift : main;
          keyEl.innerHTML = `
            <span class=${this._shift ? 'keyboard__key-secondary' : ''}>${main}</span>
            <span class=${this._shift ? '' : 'keyboard__key-secondary'}>${shift}</span>`;
        }
        keyEl.setAttribute('data-symbol', symbol);
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

  _toggleCaps() {
    this._caps = !this._caps;
    this._updateLayout();
    this._keysElements.CapsLock.classList.toggle('keyboard__key_active');
  }

  _changeLang() {
    const nextLang = this._currentLang + 1;
    this._currentLang = nextLang < this._langs.length ? nextLang : 0;
    localStorage.setItem('lang', this._currentLang);
  }

  handleKeyAction(e) {
    this._textarea.focus();
    const {
      code,
      type,
      shiftKey,
      altKey,
    } = e;
    const keyEl = this._keysElements[e.code];
    if (!keyEl) {
      return;
    }
    if (keyEl.dataset.symbol && e.type === 'keydown') {
      e.preventDefault();
      this._keysElements[e.code].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
    if (code === 'CapsLock') {
      if (type === 'keyup') {
        this._toggleCaps();
      }
      return;
    }
    // fix missing focus after press alt
    if (code.match(/alt/i)) {
      e.preventDefault();
    }
    if (altKey && shiftKey) {
      this._changeLang();
      this._updateLayout();
    }
    if (type === 'keydown') {
      keyEl.classList.add('keyboard__key_active');
    } else {
      keyEl.classList.remove('keyboard__key_active');
    }
    if (code === 'Tab' && type === 'keydown') {
      e.preventDefault();
      this._keysElements.Tab.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return;
    }
    if (code.match(/shift/i)) {
      const newShiftState = type === 'keydown';
      if (this._shift !== newShiftState) {
        this._shift = newShiftState;
        this._updateLayout();
      }
    }
  }

  _moveSelection(position) {
    let newPosition = position;
    if (newPosition < 0) {
      newPosition = 0;
    }
    if (newPosition > this._textarea.value.length) {
      newPosition = this._textarea.value;
    }
    this._textarea.selectionStart = newPosition;
    this._textarea.selectionEnd = newPosition;
  }

  handleMouseDown(e) {
    const key = e.target.closest('.keyboard__key');
    if (!key) {
      return;
    }
    this._textarea.focus();
    const { code, symbol } = key.dataset;
    if (code === 'CapsLock') {
      this._toggleCaps();
      return;
    }
    if (code.match(/shift/i)) {
      console.log(this._shift);
      if (this._shift) {
        this._keysElements.ShiftLeft.classList.remove('keyboard__key_active');
        this._keysElements.ShiftRight.classList.remove('keyboard__key_active');
        this._shift = false;
      } else {
        this._keysElements.ShiftLeft.classList.add('keyboard__key_active');
        this._keysElements.ShiftRight.classList.add('keyboard__key_active');
        this._shift = true;
      }
      this._updateLayout();
    }
    const { selectionStart, value, cols } = this._textarea;
    if (symbol || code === 'Space') {
      let input = symbol;
      if (!symbol) {
        input = ' ';
      }
      this._textarea.value = value.slice(0, selectionStart)
      + input + value.slice(selectionStart);
      this._moveSelection(selectionStart + 1);
      return;
    }
    if (code === 'Backspace' && value.length > 0) {
      this._textarea.value = value.slice(0, Math.max(selectionStart - 1, 0))
       + value.slice(selectionStart);
      this._moveSelection(selectionStart - 1);
      return;
    }
    if (code.match(/del/i) && value.length > 0 && selectionStart < value.length) {
      this._textarea.value = value.slice(0, selectionStart) + value.slice(selectionStart + 1);
      this._moveSelection(selectionStart);
      return;
    }
    if (code.match(/enter/i) && value.length > 0) {
      this._textarea.value = `${value.slice(0, selectionStart)}\n${value.slice(selectionStart)}`;
      this._moveSelection(selectionStart + 1);
      return;
    }
    if (code === 'Tab') {
      this._textarea.value = `${value.slice(0, selectionStart)}  ${value.slice(selectionStart)}`;
      this._moveSelection(selectionStart + 2);
      return;
    }
    if (code === 'ArrowLeft' && selectionStart > 0) {
      this._moveSelection(selectionStart - 1);
      return;
    }
    if (code === 'ArrowRight' && selectionStart < value.length) {
      this._moveSelection(selectionStart + 1);
      return;
    }
    if (code === 'ArrowUp' && selectionStart > 0) {
      this._moveSelection(selectionStart - cols);
      return;
    }
    if (code === 'ArrowDown' && selectionStart < value.length) {
      this._moveSelection(selectionStart + cols);
      return;
    }
    if (code === 'PageUp' && selectionStart > 0) {
      this._moveSelection(0);
      return;
    }
    if (code === 'PageDown' && selectionStart < value.length) {
      this._moveSelection(value.length);
      return;
    }
    // TODO: home btn
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
