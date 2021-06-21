import { registerNode } from '@topology/core';
import { Node, Rect, Point, Direction } from '@topology/core';

export function appleNode(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.beginPath();
  //   ctx.moveTo(node.rect.x, node.rect.y);

  //   ctx.lineTo(node.rect.ex, node.rect.y);
  //   ctx.lineTo(node.rect.ex, node.rect.ey);
  //   ctx.lineTo(node.rect.x, node.rect.ey);
  //   ctx.closePath();
  (node.fillStyle || node.bkType) && ctx.fill();
  ctx.stroke();
}

export function appleNodeIconRect(node: Node) {
  node.iconRect = new Rect(
    node.rect.x,
    node.rect.y,
    node.rect.width,
    node.rect.height,
  );
  node.fullIconRect = new Rect(
    node.rect.x,
    node.rect.y,
    node.rect.width,
    node.rect.height,
  );
}

export function appleNodeTextRect(node: Node) {
  //   node.textRect = new Rect(
  //     node.rect.x,
  //     node.rect.y - 20,
  //     node.rect.width,
  //     node.rect.height - (node.rect.height - 20),
  //   );
  node.textRect = new Rect(node.rect.x, node.rect.y, 0, 0);
  node.fullTextRect = node.textRect;
}

export function appleNodeAnchors(node: Node) {
  //   node.anchors.push(
  //     new Point(node.rect.x, node.rect.y + node.rect.height / 2, Direction.Left),
  //   );
  node.anchors.push(
    new Point(
      node.rect.x + node.rect.width / 1.25,
      node.rect.y + node.rect.height / 1.9,
      Direction.Up,
    ),
  );
  //   node.anchors.push(
  //     new Point(
  //       node.rect.x + node.rect.width,
  //       node.rect.y + node.rect.height / 2,
  //       Direction.Right,
  //     ),
  //   );
  //   node.anchors.push(
  //     new Point(
  //       node.rect.x + node.rect.width / 2,
  //       node.rect.ey,
  //       Direction.Bottom,
  //     ),
  //   );
}

export const registerAppleNode = () => {
  registerNode(
    'appleNode',
    appleNode,
    appleNodeAnchors,
    appleNodeIconRect,
    appleNodeTextRect,
  );
};
