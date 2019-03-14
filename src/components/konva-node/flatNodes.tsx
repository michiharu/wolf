import * as React from 'react';
import { useState } from 'react';

import { Layer, Text, Group, Rect } from 'react-konva';

import { TreeNode, TreeViewNode, Type, KNode, Point, Cell } from '../../data-types/tree-node';

import KNodeUtil from '../../func/k-node';
import NodeRect from './node-rect';
import { viewItem, unit } from '../../settings/layout';
import { theme } from '../..';

export interface FlatNodesProps {
  parentType: Type;
  node: TreeNode;
}

const FlatNodes: React.FC<FlatNodesProps> = (props: FlatNodesProps) => {
  const { parentType, node: next } = props;
  const [node, setNode] = useState<KNode | null>(null);
  const [tmp, setTmp] = useState<KNode | null>(null);
  const [map, setMap] = useState<Cell[][] | null>(null);
  const [beforePoint, setBeforePoint] = useState<Point | null>(null);
  const [beforeCell, setBeforeCell] = useState<Cell | null>(null);
  var openTimeId: NodeJS.Timer;

  const point = {
    x: viewItem.spr.w * 2,
    y: viewItem.spr.h * 5,
  };

  if (node === null || node.id !== next.id) {
    const newNode = KNodeUtil.getViewNode(parentType, next);
    const openNode = KNodeUtil.open(point, newNode, newNode.id, true);

    setNode(openNode);
    setTmp(openNode);
    const map = KNodeUtil.makeMap(KNodeUtil.toFlat(openNode));
    setMap(map);
  }

  const changeOpen = (id: string, open: boolean) => {
    const openNode = KNodeUtil.open(point, tmp!, id, open);

    setNode(openNode);
    setTmp(openNode);
    const map = KNodeUtil.makeMap(KNodeUtil.toFlat(openNode));
    setMap(map);
  }

  const dragMove = (selfNode: KNode, p: Point) => {

    if (beforePoint === null || beforePoint.x !== p.x || beforePoint.y !== p.y) {
      setBeforePoint(p);
      if (map !== null && 0 <= p.x && p.x < map.length) {
        const cell = map[p.x][p.y];
        if (cell === undefined || cell.node.id === selfNode.id) { return; }
        console.log(cell.action);

        // if (cell.action === 'open') {
        //   if (beforeCell === null || beforeCell!.node.id !== cell.node.id) {
        //     setBeforeCell(cell);
        //     clearTimeout(openTimeId);
        //     openTimeId = setTimeout(() => changeOpen(cell.node.id, true), 3000);
        //   }
        // } else {
        //   clearTimeout(openTimeId);
        // }

        if (cell.action === 'move') {
          const moveNode = KNodeUtil.move(point, tmp!, selfNode, cell.node);
          setTmp(moveNode);
          const map = KNodeUtil.makeMap(KNodeUtil.toFlat(moveNode));
          setMap(map);
        }

        if (cell.action === 'push') {
          const pushNode = KNodeUtil.push(point, tmp!, selfNode, cell.node);
          setTmp(pushNode);
          const map = KNodeUtil.makeMap(KNodeUtil.toFlat(pushNode));
          setMap(map);
        }
      }
    }
  }

  const dragEnd = () => {
    const deletedNode = KNodeUtil.deleteDummy(point, tmp!);
    setTmp(deletedNode);
    const map = KNodeUtil.makeMap(KNodeUtil.toFlat(deletedNode));
    setMap(map);
  }

  if (node === null || tmp === null) {
    return <p>Now Loading..</p>;
  }

  const nodeActionProps = { changeOpen, dragMove, dragEnd };

  const flatNodes = KNodeUtil.toFlat(tmp);
  // flatNodes.forEach(n => console.log(`label: ${n.label}, depth: {top: ${n.depth.top}, bottom: ${n.depth.bottom}}`));

  return (
    <Layer>
      {/* {map !== null && map.map((_, x) => (
      <Group key={`group-${x}`}>
        {_.map((__, y) => {
          const cell = map[x][y];
          if (cell === undefined) { return <Rect key={`${x}-${y}`}/>; }
          const fill = cell.action === 'push' ? 'yellow' :
                       cell.action === 'move' ? 'blue'   :
                       cell.action === 'open' ? 'green'  : 'grey';
          return <Rect key={`${x}-${y}`} x={x * unit} y={y * unit + 300} width={unit} height={unit} fill={fill}/>;
          })}
      </Group>))} */}

      {flatNodes.map(n => <NodeRect key={n.id} node={n} {...nodeActionProps}/>)}

    </Layer>
  );
};

export default FlatNodes;