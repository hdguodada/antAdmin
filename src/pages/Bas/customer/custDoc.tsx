import { queryCustDoc } from '@/services/Bas';
import type { ActionType } from '@ant-design/pro-table';
import React, { useRef, useState } from 'react';
import CustDocForm from './custDocForm';
import ProTable from '@ant-design/pro-table';
import { dateColumns, indexColumns, refreshAndNew } from '@/utils/columns';
import { useRequest } from 'umi';

interface CustDocProps {
  customer: BAS.Customer;
}
export default (props: CustDocProps): React.ReactElement => {
  const { customer } = props;
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<BAS.CustDoc>();
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const CustRecordActionRef = useRef<ActionType>();
  const { data, loading, refresh } = useRequest(async () => {
    const response = await queryCustDoc({
      pageNumber: -1,
      queryFilter: {
        custId: customer.custId,
      },
    });
    return {
      data: response.data.rows,
      success: response.code === 0,
    };
  });
  return (
    <>
      <CustDocForm
        initialValues={modalFormInit}
        visible={modalVisit}
        setVisible={setModalVisit}
        refresh={refresh}
        action={formAction}
        customer={customer}
      />
      <ProTable<BAS.CustDoc>
        actionRef={CustRecordActionRef}
        rowKey="docId"
        params={{ custId: customer.custId }}
        columns={[
          indexColumns,
          dateColumns({ title: '上传日期', dataIndex: 'crtDate' }),
          {
            dataIndex: 'docName',
            title: '文件名称',
            search: false,
          },
          {
            dataIndex: 'docTypeName',
            title: '文件类型',
            search: false,
          },
          {
            title: '操作',
            valueType: 'option',
            render: (_, record) => {
              return [
                <a
                  key="invite"
                  href={`https://erp.zjqsa.com${record.docPath}`}
                  download={record.docName}
                >
                  下载附件
                </a>,
              ];
            },
          },
        ]}
        pagination={false}
        loading={loading}
        options={false}
        dataSource={data}
        search={false}
        toolBarRender={() =>
          refreshAndNew({
            fn: async () => {
              setFormAction('add');
              setModalFormInit(undefined);
              setModalVisit(true);
            },
            refresh,
          })
        }
      />
    </>
  );
};
