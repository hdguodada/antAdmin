import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import { delUnit } from '@/services/Bas';
import UnitForm from './form';
import { indexColumns, optionColumns, refreshAndNew, stateColumns } from '@/utils/columns';

export default () => {
  const { list, query } = useModel('unit', (model) => ({
    list: model.list,
    query: model.query,
  }));
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<BAS.Unit>();
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumns<BAS.Unit>[] = [
    indexColumns,
    {
      title: '计量单位',
      dataIndex: 'unitName',
      search: false,
    },
    stateColumns,
    optionColumns({
      del: async ({ record }) => {
        await delUnit([record.unitId]);
      },
    }),
  ];
  return (
    <>
      <ProTable<BAS.Unit>
        pagination={false}
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
        search={false}
        rowKey="unitId"
        actionRef={actionRef}
        options={false}
        columns={columns}
        dataSource={list}
      />
      <UnitForm
        action={formAction}
        visible={modalVisit}
        actionRef={actionRef}
        setVisible={setModalVisit}
        initialValues={modalFormInit}
        refresh={query}
      />
    </>
  );
};
