/* eslint-disable no-console */
import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import DelPopconfirm from '@/components/DelPopconfirm';
import { Button, Input } from 'antd';
import { DashOutlined, EditFilled, PlusOutlined } from '@ant-design/icons';
import { delCusttype, querySuppliers } from '@/services/Bas';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ProForm, { ProFormDatePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { patternMsg } from '@/utils/validator';
import Modal from 'antd/lib/modal/Modal';
import { Supplier } from '@/pages/Bas/supplier';

const SupplierModal: React.FC<{
  value?: React.Key;
  onChange?: (value: React.Key) => void;
}> = ({ value, onChange }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const handleOk = () => {
    setVisible(false);
  };
  const handleCancel = () => {
    setVisible(false);
  };
  const [inputValue, setInputValue] = useState<string>();
  const handleChange = (ttt: { label: string; value: React.Key }) => {
    onChange?.(ttt.value);
    setInputValue(ttt.label);
    handleCancel();
  };

  return (
    <>
      <Input
        value={inputValue}
        onClick={() => {
          setVisible(true);
        }}
        suffix={
          <DashOutlined
            onClick={() => {
              setVisible(true);
            }}
          />
        }
      />
      <Modal visible={visible} width={1000} onOk={handleOk} onCancel={handleCancel}>
        <Supplier select={true} onChange={handleChange} />
      </Modal>
    </>
  );
};
export default () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<BAS.purchase>[] = [
    {
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '商品',
      dataIndex: 'spuId',
      width: 300,
    },
    {
      title: 'skuId',
      dataIndex: 'skuId',
      hideInTable: true,
    },
    {
      title: '属性',
      dataIndex: 'skuName',
    },
    {
      title: '单位',
      dataIndex: 'unitId',
    },
    {
      title: '仓库',
      dataIndex: 'storeCd',
    },
    {
      title: '可用库存',
      dataIndex: 'minQty',
    },
    {
      title: '数量',
      dataIndex: 'qty',
    },
    {
      title: '基本单位',
      dataIndex: 'basUnitId',
    },
    {
      title: '购货单价',
      dataIndex: 'price',
    },
    {
      title: '折扣率(%)',
      dataIndex: 'discountRate',
    },
    {
      title: '折扣额',
      dataIndex: 'deduction',
    },
    {
      title: '购货金额',
      dataIndex: 'amount',
    },
    {
      title: '备注',
      dataIndex: 'description',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      fixed: 'left',
      render: (text, record, _index, action) => [
        <EditFilled
          key="editable"
          onClick={() => {
            action.startEditable?.(record.autoId);
          }}
        />,
      ],
    },
  ];

  const initialValues = {
    entries: [1, 2, 3, 4, 5].map((i) => ({
      autoId: i,
      spuId: '',
      spuName: '',
      spec: '', // 规格
      skuId: '',
      skuName: '',
      unitId: '',
      unitName: '',
      qty: '', // 数量
      price: '', // 价格
      discountRate: '', // 折扣率
      deduction: '', // 折扣额
      amount: '', // 购货金额
      description: '', // 备注
      locationId: '', // 仓库id
      locationName: '',
    })),
  };
  const [editKey, setEditKey] = useState<number[]>([1, 2, 3, 4, 5]);
  return (
    <PageContainer
      title="购货订单"
      extra={[
        <Button key="1">历史单据</Button>,
        <Button key="2" type={'dashed'}>
          保存并新增
        </Button>,
        <Button key="3" type={'primary'}>
          保存
        </Button>,
      ]}
      content={
        <ProForm
          onFinish={async (values) => {
            console.log(values);
          }}
          initialValues={initialValues}
        >
          <ProForm.Group>
            <ProForm.Item name="suppId" label="供应商" rules={patternMsg.text('供应商')}>
              <SupplierModal />
            </ProForm.Item>
            <ProFormDatePicker width="md" name="date" label="单据日期"></ProFormDatePicker>
            <ProFormDatePicker width="md" name="deliveryDate" label="交货日期"></ProFormDatePicker>
            <ProFormText
              width="md"
              name="billNo"
              label="单据编号"
              rules={patternMsg.text('单据编号')}
            ></ProFormText>
          </ProForm.Group>
          <ProForm.Item name="entries">
            <EditableProTable<BAS.purchase>
              rowKey="autoId"
              actionRef={actionRef}
              bordered
              columns={columns}
              editable={{
                editableKeys: editKey,
              }}
            />
          </ProForm.Item>
        </ProForm>
      }
    ></PageContainer>
  );
};
