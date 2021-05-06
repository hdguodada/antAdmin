import { delCustRecord, queryCustRecord } from '@/services/Bas';
import type { ActionType } from '@ant-design/pro-table';
import React, { useRef, useState } from 'react';
import CustRecordForm from './cusRecordForm';
import ProTable from '@ant-design/pro-table';
import { dateColumns, indexColumns, optionColumns, refreshAndNew } from '@/utils/columns';
import { useRequest } from '@/.umi/plugin-request/request';

interface CustRecordProps {
  customer: BAS.Customer;
  custRel?: BAS.Rel[];
}
export default (props: CustRecordProps): React.ReactElement => {
  const { customer, custRel } = props;
  const CustRecordActionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<BAS.CustRecord>();
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const { data, loading, refresh } = useRequest(async () => {
    const response = await queryCustRecord({
      pageNumber: -1,
      queryFilter: {
        custId: customer.custId,
      },
    });
    return {
      data: response.data.rows,
      success: response.code === 0,
      total: response.data.total,
    };
  });
  return (
    <>
      <CustRecordForm
        actionRef={CustRecordActionRef}
        visible={modalVisit}
        action={formAction}
        setVisible={setModalVisit}
        initialValues={modalFormInit}
        custRel={custRel}
        customer={customer}
        refresh={refresh}
      />
      <ProTable<BAS.CustRecord>
        actionRef={CustRecordActionRef}
        rowKey="recordId"
        options={false}
        toolBarRender={() =>
          refreshAndNew({
            fn: async () => {
              setModalFormInit(undefined);
              setFormAction('add');
              setModalVisit(true);
            },
            refresh,
          })
        }
        search={false}
        columns={[
          indexColumns,
          dateColumns({ title: '执行日期', dataIndex: 'exeDate' }),
          {
            dataIndex: 'recordTypeName',
            title: '行动类型',
            search: false,
          },
          {
            dataIndex: 'relName',
            title: '联系对象',
            search: false,
          },
          {
            dataIndex: 'content',
            title: '行动内容',
            search: false,
          },
          {
            dataIndex: 'realName',
            title: '行动人',
            search: false,
          },
          optionColumns({
            modify: async ({ record }) => {
              setFormAction('upd');
              setModalFormInit(record);
              setModalVisit(true);
            },
            del: async ({ record }) => {
              await delCustRecord([record.recordId]);
              refresh();
            },
          }),
        ]}
        pagination={false}
        dataSource={data}
        loading={loading}
      />
    </>
  );
};
