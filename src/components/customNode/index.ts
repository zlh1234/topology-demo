import { registerMusicNode } from './music';
import { registerPcNode } from './pc';
import { registerTextBoxNode } from './textBox';
import { registerAppleNode } from './apple';
export const registerCustomNodes = () => {
  //音乐
  registerMusicNode();
  //PC
  registerPcNode();
  //文字块
  registerTextBoxNode();
  //apple
  registerAppleNode();
};
