import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React from 'react';
import { useParams, useRequest } from 'umi';
import {
  BussType,
  BussTypeApiUrl,
  calAmountTitle,
  calPriceTitle,
  getOrderType,
  OrderType,
} from '@/pages/Purchase/components';
import { Button, Table, Typography } from 'antd';
import ProCard from '@ant-design/pro-card';
import PrintProvider, { Print } from 'react-easy-print';
import './print.less';
import { indexColumns, qtyColumns, skuIdColumns, unitIdColumns } from '@/utils/columns';

const { Text } = Typography;

export class PrintClassDom extends React.PureComponent<{
  initialValues: PUR.Purchase;
  bussType: BussType;
}> {
  render() {
    const { initialValues, bussType } = this.props;
    const dataSource = initialValues.entries
      ?.map((item) => ({
        ...item,
        autoId: +(Math.random() * 1000000).toFixed(0),
      }))
      .concat(
        // @ts-ignore
        new Array(10 - initialValues.entries.length).fill({}).map(() => ({
          autoId: +(Math.random() * 1000000).toFixed(0),
        })),
      );
    const columns: ProColumns<PUR.Entries>[] = [
      indexColumns,
      skuIdColumns({ search: false }),
      unitIdColumns,
      qtyColumns({
        dataIndex: 'qty',
      }),
      {
        dataIndex: 'price',
        title: calPriceTitle(bussType),
        width: 65,
      },
      {
        dataIndex: 'discountRate',
        title: '折扣率',
        width: 65,
        valueType: 'percent',
        hideInTable: getOrderType(OrderType.其他出入库).indexOf(bussType) > -1,
      },
      {
        dataIndex: 'deduction',
        title: '折扣额',
        width: 65,
        hideInTable: getOrderType(OrderType.其他出入库).indexOf(bussType) > -1,
      },
      {
        dataIndex: 'amount',
        title: calAmountTitle(bussType),
        width: 65,
      },
      {
        dataIndex: 'taxRate',
        title: '税率',
        width: 50,
        hideInTable: getOrderType(OrderType.其他出入库).indexOf(bussType) > -1,
      },
      {
        dataIndex: 'tax',
        title: '税额',
        width: 50,
        valueType: 'percent',
        hideInTable: getOrderType(OrderType.其他出入库).indexOf(bussType) > -1,
      },
      {
        dataIndex: 'taxAmount',
        title: '价税合计',
        width: 65,
        hideInTable: getOrderType(OrderType.其他出入库).indexOf(bussType) > -1,
      },
      {
        dataIndex: 'storeName',
        title: '仓库',
        width: 50,
      },
    ];
    const summary = () => {
      if (getOrderType(OrderType.购货).indexOf(bussType) > -1) {
        return (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={3} index={0}>
                统计
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Text type="danger">{this.props.initialValues.printInfo?.totalQty}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell colSpan={3} index={3}></Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                <Text type="danger">{this.props.initialValues.printInfo?.totalAmount}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}></Table.Summary.Cell>
              <Table.Summary.Cell index={5}>
                {this.props.initialValues.printInfo?.totalTax}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6}>
                {this.props.initialValues.printInfo?.totalTaxAmount}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={7}></Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={12} index={0}>
                合计 金额大写: {initialValues.printInfo?.chineseTaxAmount}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        );
      }
      if (getOrderType(OrderType.其他出入库).indexOf(bussType) > -1) {
        return (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={3} index={0}>
                统计
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Text type="danger">{this.props.initialValues.printInfo?.totalQty}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell colSpan={1} index={3}></Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                <Text type="danger">{this.props.initialValues.printInfo?.totalAmount}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}></Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={7} index={0}>
                合计 金额大写: {initialValues.printInfo?.chineseTaxAmount}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        );
      }
      return null;
    };
    return (
      <>
        <div style={{ width: '794px', fontSize: '12px' }}>
          <ProCard style={{ fontWeight: 600 }}>
            <ProCard colSpan={6} ghost>
              <div>单位: {initialValues.contactName}</div>
            </ProCard>
            <ProCard colSpan={6} ghost>
              <div>单据日期: {initialValues.date.split(' ')[0]}</div>
            </ProCard>
            <ProCard colSpan={6} ghost>
              <div>单据编号: {initialValues.billNo}</div>
            </ProCard>
            <ProCard colSpan={6} ghost>
              <div>业务类型: {BussType[initialValues.bussType]}</div>
            </ProCard>
          </ProCard>
          <ProTable
            rowKey="autoId"
            style={{ width: '794px' }}
            bordered
            search={false}
            options={false}
            pagination={false}
            columns={columns}
            dataSource={dataSource}
            summary={summary}
          />
          <ProCard>备注: {initialValues.memo}</ProCard>
          <ProCard ghost>
            <ProCard>制单人: {initialValues.crtName}</ProCard>
            <ProCard>收货人签名: __________</ProCard>
            <ProCard>供应商签名: __________</ProCard>
          </ProCard>
        </div>
      </>
    );
  }
}

export default () => {
  const { id, bussType } = useParams<{ id: string; bussType: string }>();
  const { data, loading } = useRequest({
    url: `${BussTypeApiUrl[BussType[+bussType]]}/info?id=${id}`,
    method: 'GET',
  });
  return (
    <PrintProvider>
      <PageContainer
        loading={loading}
        title={false}
        extra={[
          <Button
            key="print"
            onClick={() => {
              window.print();
            }}
          >
            打印
          </Button>,
        ]}
        content={
          <>
            <Print single name="foo">
              {data ? (
                <PrintClassDom initialValues={data} bussType={+bussType} />
              ) : (
                <div>此表单暂无数据</div>
              )}
            </Print>
          </>
        }
      />
    </PrintProvider>
  );
};
