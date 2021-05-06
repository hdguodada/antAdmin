import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import { Col, Input, message, Row, Tag } from 'antd';
import { addAttrValue, delAttr, delAttrValue } from '@/services/Bas';
import ProductTypeForm from './form';
import { indexColumns, optionColumns, refreshAndNew } from '@/utils/columns';

export const AddAttrValueInput: React.FC<{
  attrId: number | string;
  action: any;
}> = (props) => {
  const { attrId, action } = props;
  const [inputValue, setInputValue] = useState<string>();
  const handleInputConfirm = async () => {
    if (inputValue) {
      await addAttrValue({
        attrId,
        attrValueName: inputValue,
      });
      action();
      setInputValue('');
    } else {
      message.warn('请输入规格值');
    }
  };
  return (
    <Input
      type="text"
      value={inputValue}
      onChange={(e) => {
        const { value } = e.target;
        setInputValue(value);
      }}
      className="tag-input"
      onPressEnter={handleInputConfirm}
    />
  );
};
export default () => {
  const { query, list } = useModel('attr', (model) => ({
    query: model.query,
    list: model.list,
  }));
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<BAS.Attr>();
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumns<BAS.Attr>[] = [
    indexColumns,
    {
      title: '属性',
      dataIndex: 'attrName',
      search: false,
    },
    {
      title: '属性值',
      dataIndex: 'attrValues',
      search: false,
      render: (_, record) => {
        return (
          <Row align="middle">
            <Col>
              {(_ as BAS.Attr['attrValues']).map((item) => (
                <Tag
                  closable
                  key={item.attrValueId}
                  color="cyan"
                  onClose={async (e) => {
                    e.preventDefault();
                    await delAttrValue([item.attrValueId]);
                    query();
                  }}
                >
                  {item.attrValueName}
                </Tag>
              ))}
            </Col>
            <Col flex="auto">
              {record.attrId && <AddAttrValueInput attrId={record.attrId} action={query} />}
            </Col>
          </Row>
        );
      },
    },
    optionColumns({
      modify: async ({ record }) => {
        setFormAction('upd');
        setModalFormInit(record);
        setModalVisit(true);
      },
      del: async ({ record }) => {
        await delAttr([record.attrId]);
        query();
      },
    }),
  ];
  return (
    <>
      <ProTable<BAS.Attr>
        pagination={false}
        search={false}
        toolBarRender={() =>
          refreshAndNew({
            fn: async () => {
              setFormAction('add');
              setModalFormInit(undefined);
              setModalVisit(true);
            },
            refresh: query,
          })
        }
        rowKey="attrId"
        actionRef={actionRef}
        dataSource={list}
        options={false}
        columns={columns}
      />
      <ProductTypeForm
        action={formAction}
        visible={modalVisit}
        actionRef={actionRef}
        setVisible={setModalVisit}
        initialValues={modalFormInit}
      />
    </>
  );
};
