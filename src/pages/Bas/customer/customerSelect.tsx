import { CustomerTable } from './index';
import { DashOutlined } from '@ant-design/icons';
import { Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';

const CustomerSelect: React.FC<{
  value?: React.Key;
  custName?: string;
  disabled?: boolean;
  onChange?: (value: React.Key | BAS.Customer) => void;
  labelInValue?: boolean;
}> = ({ value, onChange, disabled, custName, labelInValue }) => {
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
  const handleChange = (ttt: BAS.Customer) => {
    if (labelInValue) {
      onChange?.(ttt);
    } else {
      onChange?.(ttt.custId);
    }
    setInputValue(ttt.custName);
    handleCancel();
  };
  useEffect(() => {
    setInputValue(custName || '');
  }, [custName]);
  return (
    <>
      <Input
        value={inputValue}
        style={{ width: '328px' }}
        onClick={() => {
          setVisible(true);
        }}
        placeholder={'(空)'}
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
        <CustomerTable
          select={{
            state: 1,
          }}
          onChange={handleChange}
        />
      </Modal>
    </>
  );
};

export default CustomerSelect;
