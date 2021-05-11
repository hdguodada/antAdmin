import { ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Avatar } from 'antd';
import { Button, Divider } from 'antd';
import React, { useRef, useState } from 'react';
import { getCode } from '@/services/Sys';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { useParams } from 'umi';
import {
  delSuppRel,
  querySuppFinanceInfo,
  querySuppliersInfo,
  querySuppRel,
  saveSupplier,
  saveSuppRel,
  saveSuppFinance,
} from '@/services/Bas';
import type { ActionType } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { useRequest } from 'umi';
import ProDescriptions from '@ant-design/pro-descriptions';
import { relColumns } from '@/pages/Bas/customer/detail';
import { BaseSupplierFormGroup, SupplierFinanceGroup } from './addForm';
import { checkStatus } from '@/utils/columns';
import { UserOutlined } from '@ant-design/icons';
import { BussType, BussTypeApiUrl, BussTypeComponentUrl } from '@/pages/Purchase/components';
import { StatisticCard } from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';
import OrderTable from '@/pages/Purchase/components/OrderTable';
import { delPurchase, openClosePurchase, queryPurchase } from '@/services/Purchase';
import GlobalWrapper from '@/components/GlobalWrapper';

export const SaveSuppForm = (props: FormProps<BAS.Supplier>) => {
  const { action, actionRef, visible, setVisible, initialValues, refresh } = props;
  const formRef = useRef<FormInstance>();
  return (
    <>
      <ModalForm<BAS.Supplier>
        initialValues={{ state: 1, checkStatus: 0 }}
        formRef={formRef}
        title={action === 'add' ? '新建供应商' : `修改供应商(${initialValues?.suppName})`}
        visible={visible}
        onFinish={async (values) => {
          await saveSupplier({ ...initialValues, ...values }, undefined, action);
          actionRef?.current?.reload();
          refresh?.();
          return true;
        }}
        onVisibleChange={(v) => {
          if (v) {
            formRef.current?.setFieldsValue(initialValues);
            if (action === 'add') {
              getCode('BasSupplier').then((res) => {
                formRef.current?.setFieldsValue({
                  suppCd: res.data,
                });
              });
            }
          } else {
            formRef.current?.resetFields();
          }
          setVisible?.(v);
        }}
      >
        <BaseSupplierFormGroup action={'upd'} />
      </ModalForm>
    </>
  );
};

export const SaveSuppFinanceForm = (props: FormProps<BAS.Finance>) => {
  const { action, actionRef, visible, setVisible, initialValues, refresh } = props;
  const formRef = useRef<FormInstance>();
  return (
    <>
      <ModalForm<BAS.Finance>
        initialValues={{ state: 1 }}
        formRef={formRef}
        visible={visible}
        onFinish={async (values) => {
          await saveSuppFinance({ ...initialValues, ...values }, undefined, action);
          actionRef?.current?.reload();
          refresh?.();
          return true;
        }}
        onVisibleChange={(v) => {
          if (v) {
            formRef.current?.setFieldsValue(initialValues);
          } else {
            formRef.current?.resetFields();
          }
          setVisible?.(v);
        }}
      >
        <SupplierFinanceGroup action={'upd'} />
      </ModalForm>
    </>
  );
};

const imgStyle = {
  display: 'block',
  width: 42,
  height: 42,
};

export default () => {
  const { id } = useParams<{ id: string }>();
  const actionRef = useRef<ActionType>();
  const { data, loading, refresh } = useRequest(async () => {
    const supplier = await querySuppliersInfo(id);
    const supplierFinance = await querySuppFinanceInfo(id);
    return Promise.resolve({
      data: {
        supplier: supplier.data,
        finance: supplierFinance.data,
      },
      success: supplier.code === 0,
    });
  });
  const [visible, setVisible] = useState<boolean>(false);
  const [visible1, setVisible1] = useState<boolean>(false);
  const [responsive, setResponsive] = useState(false);
  return (
    <GlobalWrapper type="descriptions">
      <PageContainer
        title={false}
        loading={loading}
        extra={[
          <Button
            loading={loading}
            type="primary"
            key="new"
            onClick={() => {
              refresh();
            }}
          >
            刷新
          </Button>,
        ]}
        content={
          !loading && (
            <>
              <SaveSuppForm
                action="upd"
                visible={visible}
                setVisible={setVisible}
                initialValues={data?.supplier as BAS.Supplier}
                refresh={refresh}
              />
              <SaveSuppFinanceForm
                action="upd"
                visible={visible1}
                setVisible={setVisible1}
                initialValues={data?.finance}
                refresh={refresh}
              />
              <ProCard direction="column" ghost>
                {/* 头部 */}
                <ProCard ghost>
                  <RcResizeObserver
                    key="resize-observer"
                    onResize={(offset) => {
                      setResponsive(offset.width < 596);
                    }}
                  >
                    <StatisticCard.Group direction={responsive ? 'column' : 'row'}>
                      <StatisticCard
                        statistic={{
                          title: '待审核采购订单',
                          value: 2176,
                          icon: (
                            <img
                              style={imgStyle}
                              src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*dr_0RKvVzVwAAAAAAAAAAABkARQnAQ"
                              alt="icon"
                            />
                          ),
                        }}
                      />
                      <StatisticCard
                        statistic={{
                          title: '待审核采购单',
                          value: 475,
                          icon: (
                            <img
                              style={imgStyle}
                              src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*-jVKQJgA1UgAAAAAAAAAAABkARQnAQ"
                              alt="icon"
                            />
                          ),
                        }}
                      />
                      <StatisticCard
                        statistic={{
                          title: '待审核采购退货单',
                          value: 87,
                          icon: (
                            <img
                              style={imgStyle}
                              src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*FPlYQoTNlBEAAAAAAAAAAABkARQnAQ"
                              alt="icon"
                            />
                          ),
                        }}
                      />
                      <StatisticCard
                        statistic={{
                          title: '待审核其他入库单',
                          value: 1754,
                          icon: (
                            <img
                              style={imgStyle}
                              src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*pUkAQpefcx8AAAAAAAAAAABkARQnAQ"
                              alt="icon"
                            />
                          ),
                        }}
                      />
                    </StatisticCard.Group>
                  </RcResizeObserver>
                </ProCard>
                <ProCard ghost split="vertical">
                  <ProCard colSpan={16} direction="column" ghost>
                    {/* 供应商关联的表单 Start */}
                    <ProCard collapsible title={<span>关联单据</span>} tabs={{ type: 'card' }}>
                      <ProCard.TabPane key="采购订单" tab="采购订单">
                        <OrderTable<PUR.Purchase>
                          url={BussTypeApiUrl.采购订单}
                          checkUrl={`${BussTypeApiUrl.采购订单}/check`}
                          componentUrl={BussTypeComponentUrl.采购订单}
                          openCloseFn={openClosePurchase}
                          del={delPurchase}
                          queryList={queryPurchase}
                          bussType={BussType.采购订单}
                          initSearch={{
                            suppId: data?.supplier.suppId,
                            contactName: data?.supplier.suppName,
                          }}
                        />
                      </ProCard.TabPane>
                      <ProCard.TabPane key="采购单" tab="采购单">
                        <OrderTable<PUR.Purchase>
                          url={BussTypeApiUrl.采购单}
                          checkUrl={`${BussTypeApiUrl.采购单}/check`}
                          componentUrl={BussTypeComponentUrl.采购单}
                          openCloseFn={openClosePurchase}
                          del={delPurchase}
                          queryList={queryPurchase}
                          bussType={BussType.采购单}
                          initSearch={{
                            suppId: data?.supplier.suppId,
                            contactName: data?.supplier.suppName,
                          }}
                        />
                      </ProCard.TabPane>
                      <ProCard.TabPane key="采购退货单" tab="采购退货单">
                        <OrderTable<PUR.Purchase>
                          url={BussTypeApiUrl.采购退货单}
                          checkUrl={`${BussTypeApiUrl.采购退货单}/check`}
                          componentUrl={BussTypeComponentUrl.采购退货单}
                          openCloseFn={openClosePurchase}
                          del={delPurchase}
                          queryList={queryPurchase}
                          bussType={BussType.采购退货单}
                          initSearch={{
                            suppId: data?.supplier.suppId,
                            contactName: data?.supplier.suppName,
                          }}
                        />
                      </ProCard.TabPane>
                      <ProCard.TabPane key="其他入库单" tab="其他入库单">
                        <OrderTable<PUR.Purchase>
                          url={BussTypeApiUrl.其他入库单}
                          checkUrl={`${BussTypeApiUrl.其他入库单}/check`}
                          componentUrl={BussTypeComponentUrl.其他入库单}
                          openCloseFn={openClosePurchase}
                          del={delPurchase}
                          queryList={queryPurchase}
                          bussType={BussType.其他入库单}
                          initSearch={{
                            suppId: data?.supplier.suppId,
                            contactName: data?.supplier.suppName,
                          }}
                        />
                      </ProCard.TabPane>
                    </ProCard>
                    {/* 供应商关联的表单 End */}
                    {/* 供应商联系人 Start */}
                    <ProCard
                      collapsible
                      title={
                        <span>
                          <Avatar
                            shape="square"
                            style={{ backgroundColor: '#7766CC', marginRight: '12px' }}
                            icon={<UserOutlined />}
                          />
                          联系人
                        </span>
                      }
                    >
                      <EditableProTable<BAS.Rel>
                        rowKey="relId"
                        bordered
                        columns={relColumns}
                        actionRef={actionRef}
                        params={{ suppId: id }}
                        recordCreatorProps={{
                          record: {
                            relId: (Math.random() * 1000000).toFixed(0),
                            action: 'add',
                          } as BAS.Rel,
                        }}
                        editable={{
                          onSave: async (key, values) => {
                            await saveSuppRel({
                              ...values,
                              suppId: id,
                              action: values.action || 'upd',
                            });
                            actionRef?.current?.reload();
                          },
                          onDelete: async (key) => {
                            await delSuppRel([+key]);
                            actionRef?.current?.reload();
                          },
                        }}
                        request={async (params) => {
                          const response = await querySuppRel({
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
                      />
                    </ProCard>
                    {/* 供应商联系人 End */}
                  </ProCard>
                  <ProCard colSpan={8} direction="column">
                    {/* 供应商基本信息 */}
                    <ProCard
                      collapsible
                      title="基本信息"
                      extra={
                        <Button
                          onClick={() => {
                            setVisible(true);
                          }}
                        >
                          修改
                        </Button>
                      }
                    >
                      <ProDescriptions<BAS.Supplier>
                        column={2}
                        columns={[
                          {
                            dataIndex: 'suppTypeName',
                            title: '供应商类别',
                          },
                          {
                            dataIndex: 'suppCd',
                            title: '供应商编号',
                            copyable: true,
                          },
                          {
                            dataIndex: 'suppName',
                            title: '供应商名称',
                          },
                          {
                            dataIndex: 'address',
                            title: '联系地址',
                          },
                          {
                            dataIndex: 'memo',
                            title: '备注',
                          },
                          checkStatus(undefined),
                        ]}
                        dataSource={data?.supplier}
                      />
                    </ProCard>
                    <Divider />
                    {/* 工商应财务信息 */}
                    <ProCard
                      collapsible
                      title="财务信息"
                      extra={
                        <Button
                          onClick={() => {
                            setVisible1(true);
                          }}
                        >
                          修改
                        </Button>
                      }
                    >
                      <ProDescriptions<BAS.Finance>
                        column={2}
                        columns={[
                          {
                            dataIndex: 'taxInvoice',
                            title: '开票名称',
                          },
                          {
                            dataIndex: 'taxPayerNo',
                            title: '开票税号',
                          },
                          {
                            dataIndex: 'taxBank',
                            title: '开户银行',
                          },
                          {
                            dataIndex: 'taxBankAccount',
                            title: '银行账号',
                          },
                          {
                            dataIndex: 'taxAddress',
                            title: '开户地址',
                          },
                          {
                            dataIndex: 'taxTel',
                            title: '开户电话',
                          },
                          {
                            dataIndex: 'taxEmail',
                            title: '发票邮箱',
                          },
                          {
                            dataIndex: 'debtTypeId',
                            title: '账期类型',
                          },
                          {
                            dataIndex: 'initPayable',
                            title: '期初应付款',
                          },
                          {
                            dataIndex: 'initPerPayable',
                            title: '期初预付款',
                          },
                        ]}
                        dataSource={data?.finance}
                      />
                    </ProCard>
                    <Divider />
                  </ProCard>
                </ProCard>
              </ProCard>
            </>
          )
        }
      />
    </GlobalWrapper>
  );
};
