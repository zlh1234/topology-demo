import { registerMusicNode } from './music';
import { registerPcNode } from './pc';

export const registerCustomNodes = () => {
    registerMusicNode();
    registerPcNode();
}