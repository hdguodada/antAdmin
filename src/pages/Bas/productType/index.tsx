import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import DelPopconfirm from '@/components/DelPopconfirm';
import { Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { delProductType, queryProductTypesInfo } from '@/services/Bas';
import ProductTypeForm from './form';

const SuppType: React.FC<{
  columns?: ProColumns<BAS.SuppType>[];
}> = () => {
  const { tree, queryProductType } = useModel('productType', (model) => ({
    queryProductType: model.query,
    tree: model.tree,
  }));
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<BAS.ProductType>();
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumns<BAS.ProductType>[] = [
    {
      title: '分类名称',
      dataIndex: 'cateName',
      search: false,
    },
    {
      title: '图标',
      dataIndex: 'iconUrl',
      search: false,
    },
    {
      title: '属性',
      dataIndex: 'attrList',
      search: false,
      render: (_, record) => {
        return record.attrList.map((item) => <Tag key={item.attrId}>{item.attrName}</Tag>);
      },
    },
  ];
  columns.push({
    title: '操作',
    key: 'action',
    valueType: 'option',
    render: (_, entity) => {
      return [
        <a
          key="editable"
          onClick={async () => {
            setFormAction('upd');
            const res = (await queryProductTypesInfo(entity.cateId)).data;
            if (res.attrList.length > 0) {
              res.attrList.forEach((item, index) => {
                res.attrList[index].autoId = Date.now() + index;
              });
            }
            setModalFormInit(res);
            setModalVisit(true);
          }}
        >
          修改
        </a>,
        <DelPopconfirm
          key="del"
          onConfirm={async () => {
            await delProductType([entity.cateId]);
            queryProductType({ pageNumber: -1 });
          }}
        />,
      ];
    },
  });
  return (
    <>
      {tree.length > 0 ? (
        <ProTable<BAS.ProductType>
          size="small"
          expandable={{
            defaultExpandAllRows: true,
          }}
          pagination={false}
          search={false}
          rowKey="cateId"
          actionRef={actionRef}
          bordered
          toolBarRender={() => [
            <Button
              type="primary"
              onClick={() => {
                setFormAction('add');
                setModalFormInit(undefined);
                setModalVisit(true);
              }}
            >
              <PlusOutlined />
              新建
            </Button>,
          ]}
          columns={columns}
          dataSource={tree}
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
export default () => {
  return <SuppType />;
};
