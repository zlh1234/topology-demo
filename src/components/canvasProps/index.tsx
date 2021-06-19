import { FC, useState, useEffect } from 'react';
import { Form, InputNumber, Input, Select, Button } from 'antd';

import styles from './index.less';
// import { canvas as canvasEl } from '../../pages/index';

interface Props {
    canvas: any;
    data: {
        node?: any;
        line?: any;
        multi?: any;
        [key:string]:any;
    },
    onValuesChange?: (changedValues: any) => void;
}
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  };
const CanvasProps:FC<Props> = (props) => {
    let { onValuesChange, data, canvas } = props;
    const [form] = Form.useForm();

    const [node, setNode] = useState<any>(null);
    const [line, setLine] = useState<any>(null);
    const [multi, setMulti] = useState<any>(null);
    const [locked, setLocked] = useState<'yes'|'no'>('no');

    useEffect(() => {
        setNode(data.node);
        if(data.node) {
            form.setFieldsValue({
                node: {
                    rect: {
                        x: data.node.rect.x,
                        y: data.node.rect.y,
                        width: data.node.rect.width,
                        height: data.node.rect.height,
                    },
                    text: data.node.text
                }
            });
        }
        setLine(data.line);
        if(data.line) {
            form.setFieldsValue({
                node: {
                    lineWidth: data.line.lineWidth,
                    text: data.line.text,
                    strokeStyle: data.line.strokeStyle,
                    name: data.line.name
                }
            });
        }
        setMulti(data.multi);
    }, [data]);

    /**
     * 值修改改变时
     */
    const onFormValuesChange = (e:any) => {
        if(e.canvasBgColor) {
            canvas.options.bkColor = e.canvasBgColor;
            canvas.render();
            return;
        }
        onValuesChange && onValuesChange(e);
    }
    /**
     * 导出PNG
     */
    const handleOperate = (type:string) => () => {
        switch(type) {
            case 'export':
                canvas.saveAsImage('canvas.png');
            break;
            case 'undo':
                canvas.undo();
            break;
            case 'redo':
                canvas.redo();
            break;
            case 'lock':
                if(locked === 'no') {
                    setLocked('yes')
                    canvas.lock(2);
                } else {
                    setLocked('no')
                    canvas.lock(0);
                }
            break;
            case 'pureData':
                let res = canvas.pureData();
                console.log(res);
                break;
        }
    }
    if (node) {
        return (
          <Form {...layout} form={form} onValuesChange={onFormValuesChange}>
            <div className={styles.title}>坐标</div>
            <Form.Item label='X（px）' name={['node', 'rect', 'x']} initialValue={node.rect.x}>
                <InputNumber />
            </Form.Item>
            <Form.Item label='Y（px）' name={['node', 'rect', 'y']} initialValue={node.rect.y}>
                <InputNumber />
            </Form.Item>
            <div className={styles.title}>大小</div>
            <Form.Item label='宽（px）' name={['node', 'rect', 'width']} initialValue={node.rect.width}>
                <InputNumber />
            </Form.Item>
            <Form.Item label='高（px）' name={['node', 'rect', 'height']} initialValue={node.rect.height}>
                <InputNumber />
            </Form.Item>
            <div className={styles.title}>文字</div>
            <Form.Item label='内容' name={['node', 'text']} initialValue={node.text}>
                <Input />
            </Form.Item>
          </Form>
        );
      } else if (line) {
        return (
            <Form {...layout} form={form} onValuesChange={onFormValuesChange}>
                <div className={styles.title}>样式</div>
                <Form.Item label='类型' name={['line', 'name']} initialValue={line.name}>
                    <Select>
                        <Select.Option value="curve">贝塞尔曲线</Select.Option>
                        <Select.Option value="polyline">折线</Select.Option>
                        <Select.Option value="line">直线</Select.Option>
                        <Select.Option value="mind">脑图曲线</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label='线宽' name={['line', 'lineWidth']} initialValue={line.lineWidth}>
                    <InputNumber min={1} />
                </Form.Item>
                <Form.Item label='颜色' name={['line', 'strokeStyle']} initialValue={line.strokeStyle}>
                    <Select>
                        <Select.Option value="#222222">黑色</Select.Option>
                        <Select.Option value="#FE0000">红色</Select.Option>
                        <Select.Option value="#FFA900">橙色</Select.Option>
                        <Select.Option value="#06A51C">绿色</Select.Option>
                    </Select>
                </Form.Item>
                <div className={styles.title}>文字</div>
                <Form.Item label='内容' name={['line', 'text']} initialValue={line.text}>
                    <Input placeholder='请输入内容' />
                </Form.Item>
          </Form>
        );
      } else if (multi) {
        return (
          <div className={styles.title}>multi</div>
        );
      }
      return <Form {...layout} form={form} onValuesChange={onFormValuesChange}>
          <div className={styles.title}>样式</div>
          <Form.Item label='背景颜色' name='canvasBgColor' initialValue={canvas?.options.bkColor}>
              <Select>
                  <Select.Option value="#FFFFFF">白色</Select.Option>
                  <Select.Option value="#222222">黑色</Select.Option>
                  <Select.Option value="#FE0000">红色</Select.Option>
                  <Select.Option value="#FFA900">橙色</Select.Option>
                  <Select.Option value="#06A51C">绿色</Select.Option>
              </Select>
          </Form.Item>
          <div className={styles.title}>操作</div>
          <div className={styles.padding}>
            <Button type="primary" block onClick={handleOperate('undo')}>
                    撤销
            </Button>
            <Button type="primary" block onClick={handleOperate('redo')}>
                    恢复
            </Button>
            <Button type="primary" block onClick={handleOperate('lock')}>
                    {locked === 'no' ? '锁定' : '解锁'}
            </Button>
            <Button type="primary" block onClick={handleOperate('export')}>
                    导出PNG
            </Button>
            <Button type="primary" block onClick={handleOperate('pureData')}>
                    显示数据
            </Button>
            
          </div>
    </Form>
}

export default CanvasProps;

