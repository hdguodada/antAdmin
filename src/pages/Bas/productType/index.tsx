import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import { Tag } from 'antd';
import { delProductType, queryProductTypesInfo } from '@/services/Bas';
import ProductTypeForm from './form';
import { optionColumns, refreshAndNew } from '@/utils/columns';
import Style from '@/global.less';

export const ProdcutTypeTable: React.FC<{
  inSpuPage?: boolean;
  cateId?: K;
  onChange?: (id: K) => void;
}> = ({ inSpuPage, cateId, onChange }) => {
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
      title: '商品类别',
      dataIndex: 'cateId',
      search: false,
      fixed: 'left',
      render: (_, record) => <div>{record.cateName}</div>,
    },
    {
      title: '图标',
      dataIndex: 'iconUrl',
      search: false,
      hideInTable: inSpuPage,
    },
    {
      title: '属性',
      dataIndex: 'attrList',
      search: false,
      render: (_, record) => {
        return record.attrList.map((item) => <Tag key={item.attrId}>{item.attrName}</Tag>);
      },
      hideInTable: inSpuPage,
    },
    optionColumns({
      modify: async ({ record }) => {
        setFormAction('upd');
        const res = (await queryProductTypesInfo(record.cateId)).data;
        if (res.attrList.length > 0) {
          res.attrList.forEach((item, index) => {
            res.attrList[index].autoId = Date.now() + index;
          });
        }
        setModalFormInit(res);
        setModalVisit(true);
      },
      del: async ({ record }) => {
        await delProductType([record.cateId]).then(() => {
          queryProductType();
        });
      },
      fixed: 'right',
    }),
  ];
  return (
    <>
      <ProTable<BAS.ProductType>
        expandable={{
          defaultExpandedRowKeys: tree[0].children.map((i) => i.cateId),
        }}
        pagination={false}
        search={false}
        toolBarRender={() =>
          refreshAndNew({
            fn: () => {
              setFormAction('add');
              setModalFormInit(undefined);
              setModalVisit(true);
            },
            refresh: queryProductType,
          })
        }
        onRow={(record) => {
          return {
            onClick: () => {
              if (record.cateId) {
                onChange?.(record.cateId);
              }
            },
          };
        }}
        rowKey="cateId"
        rowClassName={(record) => {
          return record.cateId === cateId ? Style.myLink : '';
        }}
        actionRef={actionRef}
        options={false}
        columns={columns}
        postData={(v) => v[0].children}
        request={async (params) => {
          return queryProductType(params);
        }}
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
export default () => {
  return <ProdcutTypeTable />;
};
