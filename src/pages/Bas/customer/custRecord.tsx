import { queryCustomerRel, queryCustRecord } from '@/services/Bas';
import ProList from '@ant-design/pro-list';
import type { ActionType } from '@ant-design/pro-table';
import { Space, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import CustRecordForm from './cusRecordForm';

interface CustRecordProps {
  customer: BAS.Customer;
}
export default (props: CustRecordProps): React.ReactElement => {
  const { customer } = props;
  const CustRecordActionRef = useRef<ActionType>();
  const { currentUser } = useModel('@@initialState', (model) => ({
    currentUser: model.initialState?.currentUser,
  }));
  const [custRel, setCustRel] = useState<BAS.CustRel[]>();
  useEffect(() => {
    queryCustomerRel({ pageNumber: -1, queryFilter: { custId: customer.custId } }).then((res) => {
      setCustRel(res.data.rows);
    });
  }, [customer.custId]);
  return (
    <ProList<BAS.CustRecord>
      size="large"
      split
      actionRef={CustRecordActionRef}
      rowKey="recordId"
      params={{ custId: customer?.custId }}
      toolBarRender={() => {
        return [
          <CustRecordForm
            actionRef={CustRecordActionRef}
            initialValues={{ ...customer, userId: currentUser?.userId }}
            custRel={custRel}
            key="add"
          />,
        ];
      }}
      metas={{
        title: {
          render: (_, record) => {
            return <Tag color="blue">{record.crtDate}</Tag>;
          },
        },
        content: {
          render: (_, record) => {
            return (
              <div>
                <Tag color="#5BD8A6">{record.recordTypeName}</Tag> -{record.content}
                {record.realName}
              </div>
            );
          },
        },
        subTitle: {
          render: (_, record) => {
            return (
              <Space size={0}>
                <Tag color="#5BD8A6">{record.relName}</Tag>
              </Space>
            );
          },
        },
        actions: {
          render: (_, record) => {
            return <a key="invite">查看</a>;
          },
        },
      }}
      request={async (params) => {
        const response = await queryCustRecord({
          ...params,
          pageNumber: -1,
          queryFilter: {
            ...params,
          },
        });
        return {
          data: response.data.rows,
          success: response.code === 0,
          total: response.data.total,
        };
      }}
    ></ProList>
  );
};
