import { DashOutlined } from '@ant-design/icons';
import { Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { CustomerTable } from '@/pages/Bas/customer';
import { useRequest } from 'umi';
import { getSnapshotQty } from '@/services/Purchase';

export const CustSelect: React.FC<{
  value?: React.Key;
  suppName?: string;
  disabled?: boolean;
  onChange?: (value: React.Key) => void;
}> = ({ value, onChange, disabled, suppName }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const handleCancel = () => {
    setVisible(false);
  };
  const [inputValue, setInputValue] = useState<string>(() => {
    if (value && suppName) {
      return suppName;
    }
    return '';
  });
  const handleChange = (ttt: { label: string; value: React.Key }) => {
    onChange?.(ttt.value);
    setInputValue(ttt.label);
    handleCancel();
  };
  useEffect(() => {
    setInputValue(suppName || '');
  }, [suppName]);
  return (
    <>
      <Input
        value={inputValue}
        onClick={() => {
          setVisible(true);
        }}
        style={{ width: '328px' }}
        disabled={disabled}
        suffix={
          <DashOutlined
            onClick={() => {
              setVisible(true);
            }}
          />
        }
      />
      <Modal visible={visible} width={1000} footer={false} onCancel={handleCancel}>
        <CustomerTable select={{ state: 1 }} onChange={handleChange} />
      </Modal>
    </>
  );
};

export type SnapshotQtyProps = {
  skuId: React.Key;
  unitId: React.Key;
  storeCd: React.Key;
  qty?: number;
};
export const SnapshotQty: React.FC<SnapshotQtyProps> = (props) => {
  const { data } = useRequest(async () => {
    return getSnapshotQty(props);
  });
  return <div>{data}</div>;
};
