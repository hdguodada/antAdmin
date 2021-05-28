import { delProductType, queryProductTypesInfo } from '@/services/Bas';
import { optionColumns, refreshAndNew } from '@/utils/columns';
import type { ActionType, ProColumns, ProTableProps } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { useModel } from 'umi';
import ProductTypeForm from './form';
import styles from './index.less';

type ProductTypeTableProps = {
  inSpuPage?: boolean;
  cateId?: K;
  setcateId?: any;
} & ProTableProps<BAS.ProductType, any>;
export default function ProdcutTypeTable(props: ProductTypeTableProps) {
  const { inSpuPage, cateId, setcateId, ...rest } = props;
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
      hideInTable: inSpuPage,
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
              if (record.cateId && record.isLeaf) {
                setcateId?.(record.cateId);
              }
            },
          };
        }}
        rowKey="cateId"
        rowClassName={(record) => {
          return record.cateId === cateId ? styles['split-row-select-active'] : '';
        }}
        actionRef={actionRef}
        options={false}
        dataSource={tree[0].children}
        columns={columns}
        {...rest}
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
}
