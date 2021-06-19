import {FC} from 'react';
import { Menu } from 'antd';
import styles from './index.less';
interface Props {
    data: any;
    canvas: any;
}
const ContentMenu:FC<Props> = ({ data, canvas }) => {
    let nodeDisabled = (data.line || data.node || data.nodes) ? '' : styles.disabled;
    /**
     * 删除节点
     */
    const handleDelNode = () => {
        if(data.node || (data.nodes && data.nodes.length)) {
            canvas.delete(data.node ? [data.node] : data.nodes);
        } else if(data.line || (data.nodes && data.nodes.length)) {
            canvas.delete(data.line ? [data.line] : data.nodes);
        }
    }
    return <div className={styles.menus}>
         <div>
            <a className={nodeDisabled} onClick={handleDelNode}>删除</a>
        </div>
    </div>
}
export default ContentMenu;