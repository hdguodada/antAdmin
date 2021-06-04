import ProCard from '@ant-design/pro-card';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import ProDescriptions from '@ant-design/pro-descriptions';
import React from 'react';
import { queryCompanyInfo, saveParams, updCompanyInfo } from '@/services/Sys';
import type { ProColumnType } from '@ant-design/pro-table';
import { Avatar, Button, message } from 'antd';
import ProForm, { ProFormCheckbox, ProFormDependency, ProFormDigit } from '@ant-design/pro-form';
import GlobalWrapper from '@/components/GlobalWrapper';
import { useModel } from 'umi';
import { sleep } from '@/utils/utils';
import { ProFormCheckBoxZeroAndOne } from '@/utils/form';

const columns: ProColumnType<SYS.Company>[] = [
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
export function SysParams() {
  const { params, query } = useModel('params', (model) => ({
    params: model.sysParams,
    query: model.query,
  }));
  return (
    <ProCard>
      <ProForm
        initialValues={params}
        layout="horizontal"
        labelCol={{ span: 2 }}
        labelAlign="left"
        onFinish={async (v) => {
          await saveParams({
            ...params,
            ...v,
          });
          message.success('更新系统参数成功, 系统将重新刷新');
          await sleep(3);
          window.location.reload();
        }}
        submitter={{
          render: ({ form }) => {
            return (
              <FooterToolbar>
                {[
                  <Button
                    key="save"
                    type={'primary'}
                    onClick={async () => {
                      form?.submit();
                    }}
                    children={'保存'}
                  />,
                  <Button
                    key="refresh"
                    type={'dashed'}
                    onClick={() => {
                      query();
                    }}
                    children={'刷新'}
                  />,
                ]}
              </FooterToolbar>
            );
          },
        }}
      >
        <ProForm.Item name="useCheck" label="开启审核" style={{ width: '100%' }}>
          <ProFormCheckBoxZeroAndOne />
        </ProForm.Item>
        <ProForm.Item name="useTax" label="启用税金" style={{ width: '100%' }}>
          <ProFormCheckBoxZeroAndOne />
        </ProForm.Item>
        <ProFormDependency name={['useTax']}>
          {({ useTax }) => {
            return (
              <ProFormDigit
                disabled={useTax === 0}
                max={100}
                min={0}
                name="tax"
                label="增值税税率"
                width="md"
              />
            );
          }}
        </ProFormDependency>
      </ProForm>
    </ProCard>
  );
}
export default (): React.ReactNode => {
  return (
    <GlobalWrapper
      type="descriptions"
      children={
        <PageContainer
          title={false}
          tabProps={{
            defaultActiveKey: 'sysParams',
          }}
          tabList={[
            {
              tabKey: 'base',
              tab: '基本信息',
              children: (
                <ProCard
                  children={
                    <ProDescriptions
                      bordered
                      request={async () => {
                        return queryCompanyInfo();
                      }}
                      editable={{
                        onSave: (k, r) => updCompanyInfo(r),
                      }}
                      columns={columns}
                      column={{ xl: 2, sm: 1, xs: 1 }}
                    />
                  }
                />
              ),
            },
            {
              tab: '功能参数',
              key: 'sysParams',
              children: <SysParams />,
            },
          ]}
        />
      }
    />
  );
};
