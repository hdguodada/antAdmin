import { CustomerTable } from './index';
import { ClearOutlined } from '@ant-design/icons';
import { Input, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

export type CustomerSelectProps = {
  value?: BAS.Customer[] | BAS.Customer | K[] | K;
  custName?: string;
  disabled?: boolean;
  onChange?: (value: BAS.Customer[] | BAS.Customer | K[] | K | undefined) => void;
  multiple?: boolean;
  labelInValue?: boolean;
  renderName?: 'custName' | 'custCd';
};
const CustomerSelect: React.FC<CustomerSelectProps> = ({
  value,
  onChange,
  disabled,
  custName,
  labelInValue,
  multiple = true,
  renderName = 'custName',
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const customerTableRef = useRef();
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
  const handleChange = (ttt?: BAS.Customer[]) => {
    if (labelInValue) {
      if (multiple) {
        onChange?.(ttt);
      } else {
        onChange?.(ttt?.[0]);
      }
    } else if (multiple) {
      onChange?.(ttt?.map((i) => i.custId));
    } else {
      onChange?.(ttt?.[0].custId);
    }
    setInputValue(ttt?.map((i) => i[renderName]).join(','));
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
        placeholder={`请选择客户${multiple ? '(多选)' : ''}`}
        disabled={disabled}
        suffix={
          <ClearOutlined
            onClick={() => {
              setInputValue(undefined);
              handleChange(undefined);
            }}
          />
        }
      />
      <Modal visible={visible} width={1000} onOk={handleOk} onCancel={handleCancel} footer={false}>
        <CustomerTable
          selectParams={{
            state: 1,
          }}
          ref={customerTableRef}
          select
          multiple={multiple}
          onChange={handleChange}
        />
      </Modal>
    </>
  );
};

export default CustomerSelect;
