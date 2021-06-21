import { FC, useState, useEffect, CSSProperties, useMemo, useRef } from 'react';
import { Topology, Options } from '@topology/core';
//图形节点
import { register as registerFlow } from '@topology/flow-diagram';
import { register as registerActivity } from '@topology/activity-diagram';
import { register as registerClass } from '@topology/class-diagram';
import { register as registerSequence } from '@topology/sequence-diagram';
import { register as registerChart } from '@topology/chart-diagram';
import { registerCustomNodes } from '@/components/customNode';
//组件
import CanvasProps from '../components/canvasProps';
import ContentMenu from '../components/contentMenu';
import { Modal, Collapse } from 'antd';
//const
import { Tools } from '@/config/tools';
import { INIT_DATA } from '@/const/data';
//style
import styles from './index.less';

//默认配置
let canvasOptions: Options = {
  bkColor: '#FFFFFF',
  hideInput: true,
  disableEmptyLine: true,
  viewPadding: 20,
  grid: true,
  disableScale: true,
};
let canvas: Topology | undefined = undefined;
const Index: FC = () => {
  const [canvasContext, setCanvasContext] = useState<Topology | undefined>(
    undefined,
  );
  const [tools, setTools] = useState(Tools);
  const [selected, setSelect] = useState<any>({
    node: null,
    line: null,
    multi: false,
    nodes: null,
    locked: false,
  });
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({
    position: 'fixed',
    zIndex: 10,
    display: 'none',
    left: '',
    top: '',
    bottom: '',
  });
  const propsRef = useRef<any>();

  /**
   * 清空选择
   */
  const clearSelect = () => {
    setSelect({
      node: null,
      line: null,
      multi: false,
      nodes: null,
      locked: false,
    });
  };

  /**
   * 获取是否锁定
   */
  const getLocked = (data: any) => {
    let locked = true;
    if (data.nodes && data.nodes.length) {
      for (const item of data.nodes) {
        if (!item.locked) {
          locked = false;
          break;
        }
      }
    }
    if (locked && data.lines) {
      for (const item of data.lines) {
        if (!item.locked) {
          locked = false;
          break;
        }
      }
    }
    return locked;
  };

  /**
   * 监听节点事件
   */
  const onMessage = (event: string, data: any) => {
    switch (event) {
      //点击节点
      case 'node':
        //点击时 如果锁定画布了则监听执行函数
        if (propsRef?.current?.locked === 'yes' && data.customClick) {
          if (data.customClick === 'music-1') {
            let node: any = canvas?.find('1d736c0');
            let rect = node.rect;
            canvas?.setValue('1d736c0', {
              name: 'circle',
              text: (Number(node.text) || 0) + 1,
            });
            //更新线连接点
            let line: any = canvas?.find('6d298d9b');
            canvas?.setValue('6d298d9b', {
              to: {
                ...line.to,
                x: rect.x + rect.width / 2,
                y: rect.y,
                hit: () => {},
                anchorIndex: 1,
              },
            });
          }
          if (data.customClick === 'pc-1') {
            Modal.info({
              content: data.customClick,
            });
          }
        } else {
          setSelect({
            node: data,
            line: null,
            multi: false,
            nodes: null,
            locked: data.locked,
          });
        }
        break;
      //添加节点
      case 'addNode':
        setSelect({
          node: data,
          line: null,
          multi: false,
          nodes: null,
          locked: data.locked,
        });
        break;
      //点击线
      case 'line':
      //添加线
      case 'addLine':
        setSelect({
          node: null,
          line: data,
          multi: false,
          nodes: null,
          locked: data.locked,
        });
        break;
      //多选
      case 'multi':
        setSelect({
          node: null,
          line: null,
          multi: true,
          nodes: data.length > 1 ? data : null,
          locked: getLocked(data),
        });
        break;
      //点击空白
      case 'space':
        setSelect({
          node: null,
          line: null,
          multi: false,
          nodes: null,
          locked: false,
        });
        break;
    }
  };

  //初始化
  useEffect(() => {
    //注册图形
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

    document.onclick = () => {
      setMenuStyle({
        display: 'none',
        left: '',
        top: '',
        bottom: '',
      });
    };

    canvasOptions.on = onMessage;
    canvas = new Topology('workspace', canvasOptions);
    setCanvasContext(canvas);
    canvas?.open(INIT_DATA as any);
    setTimeout(() => {
      canvas?.translate(0, 1);
      canvas?.translate(0, 0);
    }, 20);
  }, []);

  /**
   * 节点移动事件
   */
  const onDrag = (event: React.DragEvent<HTMLAnchorElement>, node: any) => {
    event.dataTransfer.setData('Text', JSON.stringify(node.data));
  };

  /**
   * 右边属性改变
   */
  const handlePropsChange = (changedValues: any) => {
    let type = 'node';
    if (changedValues.line) {
      type = 'line';
    }
    for (let key in changedValues[type]) {
      if (Array.isArray(changedValues[type][key])) {
      } else if (typeof changedValues[type][key] === 'object') {
        for (let k in changedValues[type][key]) {
          selected[type][key][k] = changedValues[type][key][k];
        }
      } else {
        selected[type][key] = changedValues[type][key];
      }
    }
    // 通知属性更新，刷新
    canvas?.updateProps(selected[type]);
    // canvas?.setValue(selected[type].id, {
    //   ...selected[type],
    // });
  };

  /**
   * 右击菜单
   */
  const handleContextMenu = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    if (propsRef?.current?.locked === 'yes') return;
    if (event.clientY + 360 < document.body.clientHeight) {
      setMenuStyle({
        position: 'fixed',
        zIndex: 10,
        display: 'block',
        left: event.clientX + 'px',
        top: event.clientY + 'px',
        bottom: '',
      });
    } else {
      setMenuStyle({
        position: 'fixed',
        zIndex: 10,
        display: 'block',
        left: event.clientX + 'px',
        top: '',
        bottom: document.body.clientHeight - event.clientY + 'px',
      });
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.tools}>
        <div className={styles.title}>图形库</div>
        <Collapse bordered={false} defaultActiveKey={['自定义图形']}>
          {tools.map((item) => {
            return (
              <Collapse.Panel key={item.group} header={item.group}>
                <div className={styles.buttons}>
                  {item.children.map((btn: any, i: number) => {
                    return (
                      <a
                        key={i}
                        title={btn.name}
                        draggable={true}
                        onDragStart={(ev) => {
                          onDrag(ev, btn);
                        }}
                      >
                        {btn.image ? (
                          <img src={btn.image} />
                        ) : (
                          <i className={'iconfont ' + btn.icon} />
                        )}
                      </a>
                    );
                  })}
                </div>
              </Collapse.Panel>
            );
          })}
        </Collapse>
      </div>
      <div
        id="workspace"
        className={styles.full}
        onContextMenu={handleContextMenu}
      >
        <div className={styles.locked}>
          {propsRef?.current?.locked === 'yes' ? '已锁定' : '未锁定'}
        </div>
      </div>
      <div className={styles.props}>
        {useMemo(() => {
          return (
            canvasContext && (
              <CanvasProps
                ref={propsRef}
                clearSelect={clearSelect}
                canvas={canvas}
                data={selected}
                onValuesChange={handlePropsChange}
              />
            )
          );
        }, [canvasContext, selected])}
      </div>
      <div style={menuStyle}>
        <ContentMenu
          clearSelect={clearSelect}
          data={selected}
          canvas={canvas}
        />
      </div>
    </div>
  );
};
export default Index;
