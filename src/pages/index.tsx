import { FC, useState, useEffect, CSSProperties, useMemo } from 'react';
import { Tools } from '@/config/tools';
import { Topology, Options } from '@topology/core';
import { register as registerFlow } from '@topology/flow-diagram';
import { register as registerActivity } from '@topology/activity-diagram';
import { register as registerClass } from '@topology/class-diagram';
import { register as registerSequence } from '@topology/sequence-diagram';
import { register as registerChart } from '@topology/chart-diagram';
import { registerCustomNodes } from '@/components/customNode';
import CanvasProps from '../components/canvasProps';
import ContentMenu from '../components/contentMenu';

import styles from './index.less';

export let canvas:Topology|undefined = undefined;
let canvasOptions:Options = {
  bkColor: '#FFFFFF',
  hideInput: true,
  disableEmptyLine: true,
};
const Index:FC = () => {
  const [tools, setTools ] = useState(Tools);
  const [iconfont, setIconfont] = useState({ fontSize: '24px' });
  const [selected, setSelect] = useState<any>({
    node: null,
    line: null,
    multi: false,
    nodes: null,
    locked: false
  });
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({
    position: 'fixed',
    zIndex: 10,
    display: 'none',
    left: '',
    top: '',
    bottom: ''
  })

  /**
   * 获取是否锁定
   */
  const getLocked = (data: any) => {
    let locked = true
    if (data.nodes && data.nodes.length) {
      for (const item of data.nodes) {
        if (!item.locked) {
          locked = false
          break
        }
      }
    }
    if (locked && data.lines) {
      for (const item of data.lines) {
        if (!item.locked) {
          locked = false
          break
        }
      }
    }
    return locked
  }
  /**
   * 监听节点事件
   */
  const onMessage = (event: string, data: any) => {
    switch (event) {
      case 'node':
      case 'addNode':
        setSelect({
            node: data,
            line: null,
            multi: false,
            nodes: null,
            locked: data.locked
        });
        break;
      case 'line':
      case 'addLine':
        setSelect({
            node: null,
            line: data,
            multi: false,
            nodes: null,
            locked: data.locked
        });
        break;
      case 'multi':
        setSelect({
            node: null,
            line: null,
            multi: true,
            nodes: data.length > 1 ? data : null,
            locked: getLocked(data)
        });
        break;
      case 'space':
        setSelect({
            node: null,
            line: null,
            multi: false,
            nodes: null,
            locked: false
        });
        break;
      case 'move':
      case 'resizePens':
        if (data.length === 1) {
          setSelect({
              node: data[0],
              line: null,
              multi: true,
              nodes: data,
              locked: false
          });
        }
        break;
    }
  }

  //初始化
  useEffect(() => {
    //注册

    //流程图
    registerFlow();
    //活动图
    registerActivity();
    //类图
    registerClass();
    //时序图
    registerSequence();
    //基本形状
    registerChart();

    //注册自定义图形
    registerCustomNodes();
    
    document.onclick = event => {
      setMenuStyle({
        display: 'none',
        left: '',
        top: '',
        bottom: ''
      });
    }

    
    canvasOptions.on = onMessage;
    canvas = new Topology('workspace', canvasOptions);
  }, []);

  /**
   * 节点移动事件
   */
  const onDrag = (event: React.DragEvent<HTMLAnchorElement>, node: any) => {
    event.dataTransfer.setData('Text', JSON.stringify(node.data));
  }
  /**
   * 右边属性改变
   */
  const handlePropsChange = (changedValues: any) => {
    if (changedValues.node) {
      for (let key in changedValues.node) {
        if (Array.isArray(changedValues.node[key])) {
        } else if (typeof changedValues.node[key] === 'object') {
          for (let k in changedValues.node[key]) {
            selected.node[key][k] = changedValues.node[key][k]
          }
        } else {
          selected.node[key] = changedValues.node[key];
        }
      }
      // 通知属性更新，刷新
      canvas?.updateProps(selected.node);
    }
    if (changedValues.line) {
      for (let key in changedValues.line) {
        if (Array.isArray(changedValues.line[key])) {
        } else if (typeof changedValues.line[key] === 'object') {
          for (let k in changedValues.line[key]) {
            selected.line[key][k] = changedValues.line[key][k]
          }
        } else {
          selected.line[key] = changedValues.line[key];
        }
      }
      console.log(changedValues);
      console.log(selected.line);
      // 通知属性更新，刷新
      canvas?.updateProps(selected.line);
    }
  }
  /**
   * 右击菜单
   */
  const handleContextMenu = (event:any) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.clientY + 360 < document.body.clientHeight) {
      setMenuStyle({
          position: 'fixed',
          zIndex: 10,
          display: 'block',
          left: event.clientX + 'px',
          top: event.clientY + 'px',
          bottom: ''
      });
    } else {
      setMenuStyle({
          position: 'fixed',
          zIndex: 10,
          display: 'block',
          left: event.clientX + 'px',
          top: '',
          bottom: document.body.clientHeight - event.clientY + 'px'
      });
    }
  }

  return (
    <div className={styles.page}>
    <div className={styles.tools}>
    {
            tools.map((item, index) => {
              return (
                <div key={index}>
                  <div className={styles.title}>{item.group}</div>
                  <div className={styles.buttons}>
                    {
                      item.children.map((btn: any, i: number) => {
                        return (
                          <a key={i} title={btn.name} draggable={true} onDragStart={(ev) => { onDrag(ev, btn) }}>
                            {btn.image ? <img src={btn.image} /> : <i className={'iconfont ' + btn.icon} style={iconfont} />}
                          </a>
                        )
                      })
                    }
                  </div>
                </div>
              )
            })
          }
    </div>
    <div id="workspace" className={styles.full} onContextMenu={handleContextMenu} />
    <div className={styles.props}>
      {useMemo(() => {
        return <CanvasProps canvas={canvas} data={selected} onValuesChange={handlePropsChange} />;
      }, [canvas, selected])}
    </div>
    <div style={menuStyle}>
      <ContentMenu setSelect={setSelect} data={selected} canvas={canvas} />;
    </div>
  </div>
  );
}
export default Index;