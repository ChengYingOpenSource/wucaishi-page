import React, { forwardRef } from 'react';
import { Tooltip, Divider } from 'antd';
import { ZoomOutOutlined, DeleteOutlined, ZoomInOutlined, RedoOutlined, UndoOutlined,
  CopyOutlined, FormatPainterOutlined, ExpandOutlined, CompressOutlined, BulbOutlined } from '@ant-design/icons';
import styles from './index.less';

const ToolbarPanel = forwardRef((props, ref) => {
  return (
    <div className={styles.toolbar} ref={ref}>
      <div className={styles.command} data-command="undo">
        <Tooltip title={'撤销'}><UndoOutlined /></Tooltip>
      </div>
      <div className={styles.command} data-command="redo">
        <Tooltip title={'重复'}><RedoOutlined /></Tooltip>
      </div>
      <Divider type="vertical" />
      <div className={styles.command} data-command="copy">
        <Tooltip title={'复制'}><CopyOutlined /></Tooltip>
      </div>
      <div className={styles.command} data-command="paste">
        <Tooltip title={'粘贴'}><FormatPainterOutlined /></Tooltip>
      </div>
      <div className={styles.command} data-command="delete">
        <Tooltip title={'删除'}><DeleteOutlined /></Tooltip>
      </div>
      <div className={styles.command} data-command="zoomIn">
        <Tooltip title={'放大'}><ZoomInOutlined /></Tooltip>
      </div>
      <div className={styles.command} data-command="zoomOut">
        <Tooltip title={'缩小'}><ZoomOutOutlined /></Tooltip>
      </div>
      <Divider type="vertical" />
      <div className={styles.command} data-command="resetZoom">
        <Tooltip title={'实际大小'}><CompressOutlined /></Tooltip>
      </div>
      <div className={styles.command} data-command="autoFit">
        <Tooltip title={'适应屏幕'}><ExpandOutlined /></Tooltip>
      </div>
      {/* <Divider type="vertical" />
      <div className={styles.command} data-command="yamlSql">
        <Tooltip title={'转化yamlSql'}><BulbOutlined /></Tooltip>
      </div> */}
    </div>
  );
});

export default ToolbarPanel;
