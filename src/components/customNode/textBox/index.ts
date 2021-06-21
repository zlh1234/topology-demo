import { registerNode } from '@topology/core';
import { Node, Rect, Point, Direction } from '@topology/core';

export function textBoxNode(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.beginPath();
  ctx.moveTo(node.rect.x, node.rect.y);

  ctx.lineTo(node.rect.ex, node.rect.y);
  ctx.lineTo(node.rect.ex, node.rect.ey);
  ctx.lineTo(node.rect.x, node.rect.ey);
  ctx.closePath();
  (node.fillStyle || node.bkType) && ctx.fill();
  ctx.stroke();
}

export function textBoxNodeIconRect(node: Node) {
  node.iconRect = new Rect(0, 0, 0, 0);
  node.fullIconRect = node.iconRect;
}

export function textBoxNodeTextRect(node: Node) {
  node.textRect = new Rect(
    node.rect.x,
    node.rect.y,
    node.rect.width,
    node.rect.height,
  );
  node.fullTextRect = node.textRect;
}

export function textBoxNodeAnchors(node: Node) {
  node.anchors.push(
    new Point(node.rect.x, node.rect.y + node.rect.height / 2, Direction.Left),
  );
  node.anchors.push(
    new Point(node.rect.x + node.rect.width / 2, node.rect.y, Direction.Up),
  );
  node.anchors.push(
    new Point(
      node.rect.x + node.rect.width,
      node.rect.y + node.rect.height / 2,
      Direction.Right,
    ),
  );
  node.anchors.push(
    new Point(
      node.rect.x + node.rect.width / 2,
      node.rect.ey,
      Direction.Bottom,
    ),
  );
}

export const registerTextBoxNode = () => {
  registerNode(
    'textBoxNode',
    textBoxNode,
    textBoxNodeAnchors,
    textBoxNodeIconRect,
    textBoxNodeTextRect,
  );
};
