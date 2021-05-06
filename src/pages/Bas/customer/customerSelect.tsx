import { CustomerTable } from './index';
import { DashOutlined } from '@ant-design/icons';
import { Input, Modal } from 'antd';
import React, { useState } from 'react';

const CustomerSelect: React.FC<{
  value?: React.Key;
  custName?: string;
  disabled?: boolean;
  onChange?: (value: React.Key) => void;
}> = ({ value, onChange, disabled, custName }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const handleOk = () => {
    setVisible(false);
  };
  const handleCancel = () => {
    setVisible(false);
  };
  const [inputValue, setInputValue] = useState<string>(() => {
    if (value && custName) {
      return custName;
    }
    return '';
  });
  const handleChange = (ttt: { label: string; value: React.Key }) => {
    onChange?.(ttt.value);
    setInputValue(ttt.label);
    handleCancel();
  };

  return (
    <>
      <Input
        value={inputValue}
        style={{ width: '328px' }}
        onClick={() => {
          setVisible(true);
        }}
        disabled={disabled}
        suffix={
          <DashOutlined
            onClick={() => {
              setVisible(true);
            }}
          />
        }
      />
      <Modal visible={visible} width={1000} onOk={handleOk} onCancel={handleCancel}>
        <CustomerTable select={true} onChange={handleChange} />
      </Modal>
    </>
  );
};

export default CustomerSelect;
