import { CustomerTable } from './index';
import { DashOutlined } from '@ant-design/icons';
import { Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';

const CustomerSelect: React.FC<{
  value?: BAS.Customer[] | BAS.Customer | K[] | K;
  custName?: string;
  disabled?: boolean;
  onChange?: (value: BAS.Customer[] | BAS.Customer | K[] | K) => void;
  multiple?: boolean;
  labelInValue?: boolean;
}> = ({ value, onChange, disabled, custName, labelInValue, multiple }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const handleOk = () => {
    setVisible(false);
  };
  const handleCancel = () => {
    setVisible(false);
  };
  const [inputValue, setInputValue] = useState<string | undefined>(() => {
    if (custName) {
      return custName;
    }
    if (value) {
      if (labelInValue) {
        if (multiple) {
          return (value as BAS.Customer[])?.map((i) => i.custCd).join(',');
        }
        return (value as BAS.Customer).custCd;
      }
      if (multiple) {
        return (value as K[])?.join(',');
      }
      return value?.toString();
    }
    return undefined;
  });
  const handleChange = (ttt: BAS.Customer[]) => {
    if (labelInValue) {
      if (multiple) {
        onChange?.(ttt);
      } else {
        onChange?.(ttt[0]);
      }
    } else if (multiple) {
      onChange?.(ttt.map((i) => i.custId));
    } else {
      onChange?.(ttt[0].custId);
    }
    setInputValue(ttt.map((i) => i.custCd).join(','));
    handleCancel();
  };
  useEffect(() => {
    setInputValue(custName || '');
  }, [custName]);
  return (
    <>
      <Input
        value={inputValue}
        style={{ width: '100%' }}
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
      <Modal visible={visible} width={1000} onOk={handleOk} onCancel={handleCancel} footer={false}>
        <CustomerTable
          selectParams={{
            state: 1,
          }}
          select
          multiple={multiple}
          onChange={handleChange}
        />
      </Modal>
    </>
  );
};

export default CustomerSelect;
