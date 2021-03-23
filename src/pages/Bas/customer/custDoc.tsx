import DelPopconfirm from '@/components/DelPopconfirm';
import { delCustDoc, queryCustDoc } from '@/services/Bas';
import { ProFormUploadButton } from '@ant-design/pro-form';
import ProList from '@ant-design/pro-list';
import type { ActionType } from '@ant-design/pro-table';
import { message, Space, Tag } from 'antd';
import React, { useRef } from 'react';
import CustDocForm from './custDocForm';

interface CustDocProps {
  customer: BAS.Customer;
}
export default (props: CustDocProps): React.ReactElement => {
  const { customer } = props;
  const CustRecordActionRef = useRef<ActionType>();
  return (
    <ProList<BAS.CustDoc>
      size="large"
      split
      actionRef={CustRecordActionRef}
      rowKey="docId"
      params={{ custId: customer.custId }}
      toolBarRender={() => {
        return [
          <CustDocForm
            key="uploadDoc"
            initialValues={{ ...customer }}
            actionRef={CustRecordActionRef}
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
            return <a>{record.docName}</a>;
          },
        },
        subTitle: {
          render: (_, record) => {
            return (
              <Space size={0}>
                <Tag color="#5BD8A6">{record.docTypeName}</Tag>
              </Space>
            );
          },
        },
        actions: {
          render: (_, record, _index, action) => {
            return [
              <a
                key="invite"
                href={`https://erp.zjqsa.com${record.docPath}`}
                download={record.docName}
              >
                下载附件
              </a>,
              <DelPopconfirm
                key="del"
                onConfirm={async () => {
                  await delCustDoc([record.docId]);
                  action.reload();
                  message.success('删除附件成功');
                }}
              />,
            ];
          },
        },
      }}
      request={async (params) => {
        const response = await queryCustDoc({
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
