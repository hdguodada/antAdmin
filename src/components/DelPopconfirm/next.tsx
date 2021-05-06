import { DeleteFilled, QuestionCircleOutlined } from '@ant-design/icons';
import { Popconfirm, Tooltip } from 'antd';
import React from 'react';

interface Props {
  onConfirm: () => void;
}
export default (props: Props) => {
  const { onConfirm } = props;
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const showPopconfirm = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    await onConfirm();
    setVisible(false);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Popconfirm
      visible={visible}
      title="确定要删除?"
      onConfirm={handleOk}
      onCancel={handleCancel}
      okButtonProps={{ loading: confirmLoading }}
      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
    >
      <Tooltip title="删除">
        <DeleteFilled onClick={showPopconfirm} className="error-color" />
      </Tooltip>
    </Popconfirm>
  );
};
