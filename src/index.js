import Keyboard from './components/Keyboard/Keyboard';
import { keyboardLayout } from './utills/constants';
import './styles/index.scss';

const keyboard = new Keyboard(keyboardLayout);
keyboard.render(document.body);
