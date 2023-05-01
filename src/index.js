import Keyboard from './components/Keyboard/Keyboard';
import { keyboardLayout } from './utills/constants';
import createElement from './utills/utills';
import './styles/index.scss';

const heading = createElement('h1', {
  classNames: ['heading'],
  children: 'RSS Virtual Keyboard',
});
document.body.append(heading);

const textarea = createElement('textarea', {
  classNames: ['textarea'],
  attributes: {
    cols: 50,
    placeholder: 'Please start input...',
  },
});
document.body.append(textarea);

const keyboard = new Keyboard(keyboardLayout, textarea);
keyboard.render(document.body);

const sysmemParagraph = createElement('p', {
  classNames: ['paragraph'],
  children: 'the keyboard was created in Windows, LeftShift + LeftAlt (LeftAlt + LeftShift too) to change the language',
});
document.body.append(sysmemParagraph);
