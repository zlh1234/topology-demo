import React from 'react';
import styles from './index.less';

const IndexLayout: React.FC = props => {
  return (
    <div className={styles.page}>
      <div className={styles.body}>{props.children}</div>
    </div>
  );
};

export default IndexLayout;