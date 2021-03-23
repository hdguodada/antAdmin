import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import DelPopconfirm from '@/components/DelPopconfirm';
import { Button, Col, Input, message, Row, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { addAttrValue, delAttr, delAttrValue } from '@/services/Bas';
import ProductTypeForm from './form';

export const AddAttrValueInput: React.FC<{
  attrId: number | string;
  query: any;
}> = (props) => {
  const { attrId, query } = props;
  const [inputValue, setInputValue] = useState<string>();
  const handleInputConfirm = async () => {
    if (inputValue) {
      await addAttrValue({
        attrId,
        attrValueName: inputValue,
      });
      message.success('新增规格值成功');
      setInputValue('');
      query({ pageNumber: -1 });
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
  const { list, query } = useModel('attr', (model) => ({
    list: model.list,
    query: model.query,
  }));
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<Partial<BAS.Attr>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumns<BAS.Attr>[] = [
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
                    query({ pageNumber: -1 });
                  }}
                >
                  {item.attrValueName}
                </Tag>
              ))}
            </Col>
            <Col flex="auto">
              {record.attrId && <AddAttrValueInput attrId={record.attrId} query={query} />}
            </Col>
          </Row>
        );
      },
    },
  ];
  columns.push({
    title: '操作',
    key: 'action',
    valueType: 'option',
    render: (_, record) => {
      return [
        <a
          key="editable"
          onClick={() => {
            setFormAction('upd');
            setModalFormInit(record);
            setModalVisit(true);
          }}
        >
          修改
        </a>,
        <DelPopconfirm
          key="del"
          onConfirm={async () => {
            await delAttr([record.attrId]);
            query({ pageNumber: -1 });
            message.success('删除成功');
          }}
        />,
      ];
    },
  });
  return (
    <>
      {list.length > 0 ? (
        <ProTable<BAS.Attr>
          size="small"
          expandable={{
            defaultExpandAllRows: true,
          }}
          pagination={false}
          search={false}
          rowKey="attrId"
          actionRef={actionRef}
          bordered
          options={false}
          toolBarRender={() => [
            <Button
              type="primary"
              onClick={() => {
                setFormAction('add');
                setModalFormInit({});
                setModalVisit(true);
              }}
            >
              <PlusOutlined />
              新建
            </Button>,
          ]}
          columns={columns}
          dataSource={list}
          postData={(values) => values[0].children}
        />
      ) : (
        ''
      )}

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
