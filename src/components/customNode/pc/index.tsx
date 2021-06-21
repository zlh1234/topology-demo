import { registerNode } from '@topology/core';
import { Node, Rect, Point, Direction } from '@topology/core';
import PCPNG from './pc.png';

export function pcNode(ctx: CanvasRenderingContext2D, node: Node) {
  //   ctx.beginPath();
  // ctx.moveTo(node.rect.x, node.rect.y);

  // ctx.lineTo(node.rect.ex, node.rect.y);
  // ctx.lineTo(node.rect.ex, node.rect.ey);
  // ctx.lineTo(node.rect.x, node.rect.ey);
  // ctx.closePath();
  let img = new Image();
  img.src = PCPNG;
  //   (node.fillStyle || node.bkType) && ctx.fill();
  //   ctx.stroke();
  ctx.drawImage(
    img,
    node.rect.x + (node.rect.width - (node.rect.width - 20)) / 2,
    node.rect.y,
    node.rect.width - 20,
    node.rect.height - 20,
  );
}

export function pcNodeIconRect(node: Node) {
  node.iconRect = new Rect(
    node.rect.x,
    node.rect.y,
    node.rect.width,
    node.rect.height - 20,
  );
  node.fullIconRect = new Rect(
    node.rect.x,
    node.rect.y,
    node.rect.width,
    node.rect.height,
  );
}

export function pcNodeTextRect(node: Node) {
  node.textRect = new Rect(
    node.rect.x,
    node.rect.ey - 20,
    node.rect.width,
    node.rect.height - (node.rect.height - 20),
  );
  node.fullTextRect = node.textRect;
}

export function pcNodeAnchors(node: Node) {
  // node.anchors.push(new Point(node.rect.x, node.rect.y + node.rect.height / 2, Direction.Left));
  node.anchors.push(
    new Point(node.rect.x + node.rect.width / 2, node.rect.y, Direction.Up),
  );
  // node.anchors.push(
  //   new Point(node.rect.x + node.rect.width, node.rect.y + (node.rect.height / 2), Direction.Right)
  // );
  node.anchors.push(
    new Point(
      node.rect.x + node.rect.width / 2,
      node.rect.ey,
      Direction.Bottom,
    ),
  );
}

export const registerPcNode = () => {
  registerNode('pcNode', pcNode, pcNodeAnchors, pcNodeIconRect, pcNodeTextRect);
};
