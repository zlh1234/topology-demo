import {
  FC,
  useState,
  useEffect,
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
} from 'react';
import { Form, InputNumber, Input, Select, Button } from 'antd';
import { history } from 'umi';
import styles from './index.less';

interface Props {
  clearSelect: any;
  canvas: any;
  ref: any;
  data: {
    node?: any;
    line?: any;
    multi?: any;
    [key: string]: any;
  };
  onValuesChange?: (changedValues: any) => void;
}
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};
const CanvasProps: ForwardRefRenderFunction<any, Props> = (props, ref) => {
  let { onValuesChange, data, canvas, clearSelect } = props;
  const [form] = Form.useForm();

  const [node, setNode] = useState<any>(null);
  const [line, setLine] = useState<any>(null);
  const [multi, setMulti] = useState<any>(null);
  const [locked, setLocked] = useState<'yes' | 'no'>('no');

  useImperativeHandle(ref, () => {
    return {
      locked,
    };
  });

  useEffect(() => {
    setNode(data.node);
    if (data.node) {
      form.setFieldsValue({
        node: {
          rect: {
            x: data.node.rect.x,
            y: data.node.rect.y,
            width: data.node.rect.width,
            height: data.node.rect.height,
          },
          text: data.node.text,
          fillStyle: data.node.fillStyle,
          strokeStyle: data.node.strokeStyle,
        },
      });
    }
    setLine(data.line);
    if (data.line) {
      form.setFieldsValue({
        line: {
          lineWidth: data.line.lineWidth,
          text: data.line.text,
          strokeStyle: data.line.strokeStyle,
          name: data.line.name,
          fromArrow: data.line.fromArrow,
          toArrow: data.line.toArrow,
          dash: data.line.dash,
        },
      });
    }
    setMulti(data.multi);
  }, [data]);

  /**
   * 值修改改变时
   */
  const onFormValuesChange = (e: any) => {
    if (e.canvasBgColor) {
      canvas.options.bkColor = e.canvasBgColor;
      canvas.render();
      return;
    }
    if (e.canvasScale !== undefined) {
      canvas.scaleTo(e.canvasScale);
      return;
    }
    onValuesChange && onValuesChange(e);
  };

  /**
   * base64转为file
   */
  const base64toFile = (dataurl: string, filename: string = 'file') => {
    let arr: any = dataurl.split(',');

    let mime = arr[0].match(/:(.*?);/).length
      ? arr[0].match(/:(.*?);/)[1]
      : null;

    let suffix = mime.split('/')[1];

    let bstr = atob(arr[1]);

    let n = bstr.length;

    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], `${filename}.${suffix}`, {
      type: mime,
    });
  };

  /**
   * 导出PNG
   */
  const handleOperate = (type: string) => () => {
    switch (type) {
      case 'export':
        //导出图片
        canvas.saveAsImage('canvas.png', 20);
        break;
      case 'undo':
        //撤销
        canvas.undo();
        break;
      case 'redo':
        //恢复
        canvas.redo();
        break;
      case 'lock':
        //锁定/解锁
        if (locked === 'no') {
          setLocked('yes');
          canvas.lock(2);
        } else {
          setLocked('no');
          canvas.lock(0);
        }
        break;
      case 'pureData':
        //显示数据
        let res = canvas.pureData();
        console.log(JSON.stringify(res));
        break;
      case 'exportBlobImg':
        //导出base64
        let blobRes = canvas.toImage();
        let file = base64toFile(blobRes);
        console.log(file);
        break;
      case 'preview':
        // history.push({
        //   pathname: '/preview',
        //   state: {
        //     data: canvas.pureData(),
        //   },
        // });
        console.log('preview');
        break;
    }
  };

  /**
   * 删除所选区域内的节点
   */
  const handleDel = () => {
    if (data.node) {
      canvas.delete([data.node]);
      return;
    }
    if (data.line) {
      canvas.delete([data.line]);
      return;
    }
    canvas.delete(data.nodes);
    clearSelect();
  };

  /**
   * 删除操作el
   */
  const commonOperate = (
    <>
      <div className={styles.title}>操作</div>
      <div className={styles.padding}>
        <Button type="primary" block onClick={handleDel}>
          删除
        </Button>
      </div>
    </>
  );
  //选择颜色
  const colorEl = (
    <Select>
      <Select.Option value="#FFFFFF">白色</Select.Option>
      <Select.Option value="#222222">黑色</Select.Option>
      <Select.Option value="#FE0000">红色</Select.Option>
      <Select.Option value="#FFA900">橙色</Select.Option>
      <Select.Option value="#06A51C">绿色</Select.Option>
    </Select>
  );

  //节点
  if (node) {
    return (
      <Form {...layout} form={form} onValuesChange={onFormValuesChange}>
        <div className={styles.title}>坐标</div>
        <Form.Item label="X（px）" name={['node', 'rect', 'x']}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="Y（px）" name={['node', 'rect', 'y']}>
          <InputNumber />
        </Form.Item>
        <div className={styles.title}>大小</div>
        <Form.Item label="宽（px）" name={['node', 'rect', 'width']}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="高（px）" name={['node', 'rect', 'height']}>
          <InputNumber />
        </Form.Item>
        <div className={styles.title}>文字</div>
        <Form.Item label="内容" name={['node', 'text']}>
          <Input />
        </Form.Item>
        <div className={styles.title}>样式</div>
        <Form.Item label="背景颜色" name={['node', 'fillStyle']}>
          {colorEl}
        </Form.Item>
        <Form.Item label="线条颜色" name={['node', 'strokeStyle']}>
          {colorEl}
        </Form.Item>
        {commonOperate}
      </Form>
    );
  }

  //线条
  if (line) {
    const ARROW = (
      <Select>
        <Select.Option value="">无箭头</Select.Option>
        <Select.Option value="triangleSolid">实心三角形</Select.Option>
        <Select.Option value="triangle">空心三角形</Select.Option>
        <Select.Option value="diamondSolid">实心菱形</Select.Option>
        <Select.Option value="diamond">空心菱形</Select.Option>
        <Select.Option value="circleSolid">实心圆</Select.Option>
        <Select.Option value="circle">空心圆</Select.Option>
        <Select.Option value="line">线型箭头</Select.Option>
      </Select>
    );
    return (
      <Form {...layout} form={form} onValuesChange={onFormValuesChange}>
        <div className={styles.title}>样式</div>
        <Form.Item label="类型" name={['line', 'name']}>
          <Select>
            <Select.Option value="curve">贝塞尔曲线</Select.Option>
            <Select.Option value="polyline">折线</Select.Option>
            <Select.Option value="line">直线</Select.Option>
            <Select.Option value="mind">脑图曲线</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="线宽" name={['line', 'lineWidth']}>
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item label="颜色" name={['line', 'strokeStyle']}>
          {colorEl}
        </Form.Item>
        <Form.Item label="线类型" name={['line', 'dash']}>
          <Select>
            <Select.Option value={0}>实线</Select.Option>
            <Select.Option value={1}>虚线</Select.Option>
            <Select.Option value={2}>宽虚线</Select.Option>
            <Select.Option value={3}>点虚线</Select.Option>
          </Select>
        </Form.Item>
        <div className={styles.title}>箭头</div>
        <Form.Item label="起点" name={['line', 'fromArrow']}>
          {ARROW}
        </Form.Item>
        <Form.Item label="终点" name={['line', 'toArrow']}>
          {ARROW}
        </Form.Item>
        <div className={styles.title}>文字</div>
        <Form.Item label="内容" name={['line', 'text']}>
          <Input placeholder="请输入内容" />
        </Form.Item>
        {commonOperate}
      </Form>
    );
  }

  //多选
  if (multi) {
    return commonOperate;
  }

  //画布
  return (
    <Form {...layout} form={form} onValuesChange={onFormValuesChange}>
      <div className={styles.title}>样式</div>
      <Form.Item
        label="背景颜色"
        name="canvasBgColor"
        initialValue={canvas?.options.bkColor || '#FFFFFF'}
      >
        {colorEl}
      </Form.Item>
      <Form.Item
        label="缩放"
        name="canvasScale"
        initialValue={canvas?.data.scale || 1}
      >
        <InputNumber step={0.1} min={0.5} max={3} />
      </Form.Item>
      <div className={styles.title}>操作</div>
      <div className={styles.padding}>
        <Button
          disabled={canvas?.caches?.index == 0}
          type="primary"
          block
          onClick={handleOperate('undo')}
        >
          撤销
        </Button>
        <Button type="primary" block onClick={handleOperate('redo')}>
          恢复
        </Button>
        <Button type="primary" block onClick={handleOperate('lock')}>
          {locked === 'no' ? '锁定画布' : '解锁画布'}
        </Button>
        <Button type="primary" block onClick={handleOperate('export')}>
          导出PNG
        </Button>
        <Button type="primary" block onClick={handleOperate('exportBlobImg')}>
          导出PNG BASE64
        </Button>
        <Button type="primary" block onClick={handleOperate('pureData')}>
          显示数据
        </Button>
        <Button type="primary" block onClick={handleOperate('preview')}>
          预览
        </Button>
      </div>
    </Form>
  );
};

export default forwardRef(CanvasProps);
