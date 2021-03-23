import React, { useEffect, useState, useRef } from 'react';
import ProCard from '@ant-design/pro-card';
import type { ActionType, ColumnsState, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryCustomers } from '@/services/Bas';
import { Space, Table } from 'antd';
import { history, useModel } from 'umi';
import CustomerForm from './form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const CustomerTable: React.FC<{
  columns?: ProColumns<BAS.Customer>[];
}> = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<BAS.Customer>[] = [
    {
      width: 150,
      dataIndex: 'custShort',
      title: '客户',
      search: false,
      key: 'custShort',
      render: (_) => <a>{_}</a>,
    },
    {
      dataIndex: 'custName',
      title: '客户名称',
      ellipsis: true,
      copyable: true,
      key: 'custName',
    },
    {
      dataIndex: 'custCd',
      title: '编号',
      key: 'custId',
      search: false,
      width: 100,
    },
    {
      key: 'isPerson',
      dataIndex: 'isPerson',
      title: '个人/公司',
      search: false,
      valueType: 'select',
      valueEnum: new Map([
        [0, '公司'],
        [1, '个人'],
      ]),
    },
    {
      key: 'spell',
      dataIndex: 'spell',
      title: '助记码',
      search: false,
    },
    {
      key: 'custLevelId',
      dataIndex: 'custLevelId',
      title: '客户等级',
      search: false,
    },
    {
      key: 'custTypeId',
      dataIndex: 'custTypeId',
      title: '客户类别',
      valueType: 'select',
      search: false,
    },
    {
      key: 'custTypeName',
      dataIndex: 'custTypeName',
      title: '客户类别',
      search: false,
    },
    {
      key: 'custTags',
      dataIndex: 'custTags',
      title: '客户标签',
      search: false,
    },
    {
      key: 'depId',
      dataIndex: 'depId',
      title: '所属部门Id',
      search: false,
    },
    {
      key: 'salesmanId',
      dataIndex: 'salesmanId',
      title: '所有者',
      search: false,
      hideInTable: true,
    },
    {
      key: 'salesman',
      dataIndex: 'salesman',
      title: '所有者',
      search: false,
      width: 100,
    },
    {
      key: 'custAreaId',
      dataIndex: 'custAreaId',
      title: '所属区域Id',
      search: false,
    },
    {
      key: 'share',
      dataIndex: 'share',
      title: '共享给',
      search: false,
    },
    {
      key: 'sourceId',
      dataIndex: 'sourceId',
      title: '客户来源',
      search: false,
    },
    {
      key: 'creditLevelId',
      dataIndex: 'creditLevelId',
      title: '信用等级',
      search: false,
    },
    {
      key: 'relLevelId',
      dataIndex: 'relLevelId',
      title: '关系等级',
      search: false,
    },
    {
      key: 'tel',
      dataIndex: 'tel',
      title: '公司电话',
      search: false,
    },
    {
      key: 'fax',
      dataIndex: 'fax',
      title: '公司传真',
      search: false,
    },
    {
      key: 'regioncd',
      dataIndex: 'regioncd',
      title: '所在地区',
      search: false,
    },
    {
      key: 'address',
      dataIndex: 'address',
      title: '详细地址',
      search: false,
      copyable: true,
      ellipsis: true,
    },
    {
      key: 'zipCode',
      dataIndex: 'zipCode',
      title: '邮政编码',
      search: false,
    },
    {
      key: 'www',
      dataIndex: 'www',
      title: '公司网址',
      search: false,
    },
    {
      key: 'email',
      dataIndex: 'email',
      title: '公司邮箱',
      search: false,
    },
    {
      key: 'industryId',
      dataIndex: 'industryId',
      title: '所属行业',
      search: false,
    },
    {
      key: 'intro',
      dataIndex: 'intro',
      title: '公司简介',
      search: false,
    },
    {
      key: 'isHot',
      dataIndex: 'isHot',
      title: '热点客户',
      search: false,
    },
    {
      key: 'hotTypeId',
      dataIndex: 'hotTypeId',
      title: '热点分类',
      search: false,
    },
    {
      key: 'hotDesc',
      dataIndex: 'hotDesc',
      title: '热点说明',
      search: false,
    },
    {
      key: 'mainRelId',
      dataIndex: 'mainRelId',
      title: '主联系人Id',
      search: false,
    },
    {
      key: 'sortNum',
      dataIndex: 'sortNum',
      title: '显示顺序',
      search: false,
    },
    {
      key: 'seaId',
      dataIndex: 'seaId',
      title: '所属公海',
      search: false,
    },
    {
      key: 'memo',
      dataIndex: 'memo',
      title: '备注',
      search: false,
    },
    {
      key: 'isHot',
      dataIndex: 'isHot',
      title: '热点客户',
      search: false,
    },
    {
      key: 'state',
      dataIndex: 'state',
      title: '状态',
      search: false,
    },
    {
      key: 'crtDate',
      dataIndex: 'crtDate',
      title: '创建日期',
      search: false,
      valueType: 'date',
    },
    {
      key: 'crtName',
      dataIndex: 'crtName',
      title: '添加人',
      search: false,
    },
    {
      key: 'updDate',
      dataIndex: 'updDate',
      title: '更新日期',
      search: false,
      valueType: 'date',
    },
    {
      key: 'updName',
      dataIndex: 'updName',
      title: '修改人',
      search: false,
    },
  ];
  columns.push({
    title: '操作',
    key: 'action',
    valueType: 'option',
    width: 150,
    render: (_, entity) => {
      return [
        <a
          key="editable"
          onClick={() => {
            history.push(`/bas/customer/${entity.custId}`);
          }}
        >
          视图
        </a>,
        <a key="editable" className="error-color">
          删除
        </a>,
      ];
    },
  });
  const { queryCustType } = useModel('custType');
  const { queryCustLevel } = useModel('custLevel');
  const { queryDepList } = useModel('dep', (model) => ({ queryDepList: model.queryDepList }));
  const { queryOptions } = useModel('options', (module) => ({ queryOptions: module.queryOptions }));
  const { queryArea } = useModel('custArea', (model) => ({ queryArea: model.queryCustArea }));
  useEffect(() => {
    queryCustType({ pageNumber: -1 });
    queryCustLevel({ pageNumber: -1 });
    queryDepList({ pageNumber: -1 });
    queryArea({ pageNumber: -1 });
    queryOptions();
  }, [queryCustType, queryCustLevel, queryDepList, queryOptions, queryArea]);
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, ColumnsState>>(() => {
    const showColumns = [
      'custId',
      'custCd',
      'custShort',
      'custName',
      'crtDate',
      'updDate',
      'salesman',
      'address',
    ];
    const Obj = {};
    columns?.forEach((item) => {
      if (showColumns.indexOf(item.dataIndex as string) === -1) {
        Obj[item.dataIndex as string] = { show: false };
      }
    });
    return Obj;
  });
  return (
    <ProTable<BAS.Customer>
      size="small"
      pagination={{
        pageSize: 10,
      }}
      rowKey="custId"
      rowSelection={{
        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        columnWidth: 75,
      }}
      actionRef={actionRef}
      bordered
      tableAlertOptionRender={() => {
        return (
          <Space size={16}>
            <a>批量删除</a>
            <a>导出数据</a>
          </Space>
        );
      }}
      toolBarRender={() => [
        <CustomerForm
          onSubmit={() => {
            actionRef?.current?.reload();
          }}
        />,
      ]}
      columns={columns}
      request={async (params) => {
        const response = await queryCustomers({
          ...params,
          pageNumber: params.current,
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
      columnsStateMap={columnsStateMap}
      onColumnsStateChange={(map) => setColumnsStateMap(map)}
    />
  );
};

export default () => {
  return (
    <PageHeaderWrapper title={false}>
      <ProCard split="vertical">
        <CustomerTable />
      </ProCard>
    </PageHeaderWrapper>
  );
};
