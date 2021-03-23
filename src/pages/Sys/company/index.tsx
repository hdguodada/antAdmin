import ProCard from '@ant-design/pro-card';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProDescriptions from '@ant-design/pro-descriptions';
import React from 'react';
import { queryCompanyInfo, updCompanyInfo } from '@/services/Sys';
import type { ProColumnType } from '@ant-design/pro-table';
import { Avatar } from 'antd';

const columns: ProColumnType<API.Company>[] = [
  {
    title: '公司名称',
    dataIndex: 'cmpName',
  },
  {
    title: '公司LOGO',
    dataIndex: 'logo',
    render: (_) => <Avatar size={64} src={_} />,
  },
  {
    title: '公司类型Id',
    dataIndex: 'bisTypeId',
    hideInDescriptions: true,
  },
  {
    title: '行业类别',
    dataIndex: 'bisTypeName',
  },
  {
    title: '区域',
    dataIndex: 'areaName',
  },
  {
    title: '区域编号',
    dataIndex: 'areaCd',
  },
  {
    title: '地址',
    dataIndex: 'address',
  },
  {
    title: '电话',
    dataIndex: 'tel',
  },
  {
    title: '邮编',
    dataIndex: 'zipcode',
  },
  {
    title: '网址',
    dataIndex: 'www',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '联系人',
    dataIndex: 'linkman',
  },
  {
    title: '手机',
    dataIndex: 'mobile',
  },
  {
    title: '公司简介',
    dataIndex: 'intro',
  },
  {
    title: '发票抬头',
    dataIndex: 'invoice',
  },
  {
    title: '纳税人识别号',
    dataIndex: 'taxPayerNo',
  },
];
export default (): React.ReactNode => {
  return (
    <PageHeaderWrapper>
      <ProCard split="vertical">
        <ProDescriptions
          bordered={true}
          request={async () => {
            return queryCompanyInfo();
          }}
          editable={{
            onSave: (k, r) => updCompanyInfo(r),
          }}
          columns={columns}
          column={{ xl: 2, sm: 1, xs: 1 }}
        />
      </ProCard>
    </PageHeaderWrapper>
  );
};
