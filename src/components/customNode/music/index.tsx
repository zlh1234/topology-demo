import { registerNode } from '@topology/core';
import { Node, Rect, Point, Direction } from '@topology/core';
import MUSICPNG from './music.png';

export function musicNode(ctx: CanvasRenderingContext2D, node: Node) {
    ctx.beginPath();
    // ctx.moveTo(node.rect.x, node.rect.y);

    // ctx.lineTo(node.rect.ex, node.rect.y);
    // ctx.lineTo(node.rect.ex, node.rect.ey);
    // ctx.lineTo(node.rect.x, node.rect.ey);
    // ctx.closePath();
    let img = new Image();
    img.src = MUSICPNG;
    img.onload = function() {
        return null;
    };
    ctx.drawImage(img, node.rect.x + ((node.rect.width - (node.rect.width - 20)) / 2), node.rect.y, node.rect.width - 20, node.rect.height - 20);
    (node.fillStyle || node.bkType) && ctx.fill();
    ctx.stroke();
}


export function musicNodeIconRect(node: Node) {
    node.iconRect = new Rect(node.rect.x, node.rect.y, node.rect.width, node.rect.height - 20);
    node.fullIconRect = new Rect(node.rect.x, node.rect.y, node.rect.width, node.rect.height);
  }
  
export function musicNodeTextRect(node: Node) {
    node.textRect = new Rect(
        node.rect.x,
        node.rect.ey - 20,
        node.rect.width,
        node.rect.height - (node.rect.height - 20),
    );
    node.fullTextRect = node.textRect;
}

export function musicNodeAnchors(node: Node) {
    // node.anchors.push(new Point(node.rect.x, node.rect.y + node.rect.height / 2, Direction.Left));
    // node.anchors.push(new Point(node.rect.x + (node.rect.width / 2), node.rect.y, Direction.Up));
    // node.anchors.push(
    //   new Point(node.rect.x + node.rect.width, node.rect.y + (node.rect.height / 2), Direction.Right)
    // );
    node.anchors.push(new Point(node.rect.x + (node.rect.width / 2), node.rect.ey, Direction.Bottom));
}


export const registerMusicNode = () => {
    registerNode('musicNode', musicNode, musicNodeAnchors, musicNodeIconRect, musicNodeTextRect);
}