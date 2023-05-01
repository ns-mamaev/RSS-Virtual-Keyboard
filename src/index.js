import Keyboard from './components/Keyboard/Keyboard';
import { keyboardLayout } from './utills/constants';
import './styles/index.scss';

const textarea = document.createElement('textarea');
document.body.append(textarea);

const keyboard = new Keyboard(keyboardLayout, textarea);
keyboard.render(document.body);
