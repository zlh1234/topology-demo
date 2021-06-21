import { FC, useEffect } from 'react';
import { Topology, Options } from '@topology/core';
//图形节点
import { register as registerFlow } from '@topology/flow-diagram';
import { register as registerActivity } from '@topology/activity-diagram';
import { register as registerClass } from '@topology/class-diagram';
import { register as registerSequence } from '@topology/sequence-diagram';
import { register as registerChart } from '@topology/chart-diagram';
import { registerCustomNodes } from '@/components/customNode';
import { Button } from 'antd';
//样式
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
const Preview: FC<any> = ({ location, history }) => {
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

    let { data } = location.state;
    canvas = new Topology('previewEl', canvasOptions);
    canvas?.open(data as any);
    canvas.lock(2);
    canvas.centerView(20);
    setTimeout(() => {
      canvas?.translate(0, 1);
      canvas?.translate(0, 0);
    }, 20);
  }, []);
  return (
    <>
      <div className={styles.fixDiv}>
        <Button
          className={styles.backBtn}
          type="primary"
          onClick={() => {
            history.goBack();
          }}
        >
          返回
        </Button>
        <Button
          className={styles.backBtn}
          type="primary"
          onClick={() => {
            canvas?.saveAsImage('canvas.png', 20);
          }}
        >
          下载PNG
        </Button>
      </div>
      <div id="previewEl" className={styles.wrapper}></div>
    </>
  );
};
export default Preview;
