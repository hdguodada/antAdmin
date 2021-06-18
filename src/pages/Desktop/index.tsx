import { PageContainer } from '@ant-design/pro-layout';
import React, { useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { StatisticCard } from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';
import xsck from '@/images/xsck.png';
import xsth from '@/images/xsth.png';
import cgdd from '@/images/cgdd.png';
import cgrk from '@/images/cgrk.png';
import cgth from '@/images/cgth.png';
import sk from '@/images/sk.png';
import fk from '@/images/fk.png';
import tbck from '@/images/tbck.png';
import tbrk from '@/images/tbrk.png';
import { Space, Typography } from 'antd';
import GlobalWrapper from '@/components/GlobalWrapper';
import { history, useModel, useRequest } from 'umi';
import { BussTypeComponentUrl } from '../Purchase/components';
import { BankFilled, PayCircleFilled, PropertySafetyFilled, RocketFilled } from '@ant-design/icons';
import Style from '@/global.less';
import ProList from '@ant-design/pro-list';
import { queryCustRecord } from '@/services/Bas';
import Tag from 'antd/es/tag';
import moment from 'moment';
import { Bar, Line, Pie } from '@ant-design/charts';
/**
 * 商品分类销售情况
 * @returns
 */
export const DemoPie: React.FC = () => {
  const data = [
    {
      cateTypeName: '分类一',
      value: 27,
    },
    {
      cateTypeName: '分类二',
      value: 25,
    },
    {
      cateTypeName: '分类三',
      value: 18,
    },
    {
      cateTypeName: '分类四',
      value: 15,
    },
    {
      cateTypeName: '分类五',
      value: 10,
    },
    {
      cateTypeName: '其他',
      value: 5,
    },
  ];
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'cateTypeName',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: function content(_ref: any) {
        const { percent } = _ref;
        return ''.concat((percent * 100).toFixed(0), '%');
      },
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
  };
  return <Pie {...config} />;
};

export const DemoBar: React.FC = () => {
  const data = [
    {
      skuName: '1951 年',
      value: 38,
    },
    {
      skuName: '1952 年',
      value: 52,
    },
    {
      skuName: '1956 年',
      value: 61,
    },
    {
      skuName: '1957 年',
      value: 145,
    },
    {
      skuName: '1958 年',
      value: 48,
    },
  ];
  const config = {
    data,
    xField: 'value',
    yField: 'skuName',
    seriesField: 'skuName',
  };
  return <Bar {...config} />;
};

const { Statistic } = StatisticCard;
const imgStyle = {
  display: 'block',
  width: 42,
  height: 42,
};
export const quickMap = {
  xsck: { img: xsck, title: '销售出库', componentUrl: BussTypeComponentUrl.销售单 },
  xsth: { img: xsth, title: '销售退货', componentUrl: BussTypeComponentUrl.销售退货单 },
  cgdd: { img: cgdd, title: '采购订单', componentUrl: BussTypeComponentUrl.采购订单 },
  cgrk: { img: cgrk, title: '采购入库', componentUrl: BussTypeComponentUrl.采购单 },
  cgth: { img: cgth, title: '采购退货', componentUrl: BussTypeComponentUrl.采购退货单 },
  sk: { img: sk, title: '收款', componentUrl: BussTypeComponentUrl.收款单 },
  fk: { img: fk, title: '付款', componentUrl: BussTypeComponentUrl.付款单 },
  tbck: { img: tbck, title: '其他入库', componentUrl: BussTypeComponentUrl.其他入库单 },
  tbrk: { img: tbrk, title: '其他出库', componentUrl: BussTypeComponentUrl.其他出库单 },
};

export const quickList = ['xsck', 'xsth', 'cgdd', 'cgrk', 'cgth', 'sk', 'fk', 'tbck', 'tbrk'];
export const CurrentUser: React.FC = () => {
  const { currentUser } = useModel('@@initialState', (model) => ({
    currentUser: model.initialState?.currentUser,
  }));
  return (
    <div>
      工作台
      <Typography.Text children={`欢迎您 ${currentUser?.realName}`} />
    </div>
  );
};
export const QuickGo: React.FC = () => {
  const quickFeatures = [
    {
      icon: <BankFilled style={{ fontSize: '32px' }} className={Style.primaryFontColor} />,
      title: '客户',
      href: '/bas/customer',
    },
    {
      icon: <PayCircleFilled style={{ fontSize: '32px' }} className={Style.primaryFontColor} />,
      title: '供应商',
      href: '/bas/supplier',
    },
    {
      icon: <RocketFilled style={{ fontSize: '32px' }} className={Style.primaryFontColor} />,
      title: '待办任务/行动',
      href: '/Desktop/action',
    },
    {
      icon: (
        <PropertySafetyFilled style={{ fontSize: '32px' }} className={Style.primaryFontColor} />
      ),
      title: '销售报表',
      href: '/sales/Reports',
    },
  ];
  return (
    <ProCard>
      {quickFeatures.map((item) => (
        <ProCard colSpan={2} ghost key={item.href}>
          <div
            onClick={async () => {
              history.push(item.href);
            }}
          >
            <Space direction="vertical" align="center" style={{ cursor: 'pointer' }}>
              {item.icon}
              <div>{item.title}</div>
            </Space>
          </div>
        </ProCard>
      ))}
    </ProCard>
  );
};
export function QuickUse() {
  return (
    <ProCard colSpan={24} title="快速发起">
      {quickList.map((item) => (
        <ProCard colSpan={2} ghost key={item}>
          <Space direction="vertical" align="center" style={{ cursor: 'pointer' }}>
            <img
              style={imgStyle}
              src={quickMap[item].img}
              alt="icon"
              onClick={async () => {
                history.push(`${quickMap[item].componentUrl}/new`);
              }}
            />
            <div
              onClick={async () => {
                history.push(`${quickMap[item].componentUrl}/new`);
              }}
            >
              {quickMap[item].title}
            </div>
          </Space>
        </ProCard>
      ))}
    </ProCard>
  );
}

export const ActionTodo: React.FC = () => {
  const { data, loading } = useRequest(async () => {
    const response = await queryCustRecord({
      pageNumber: -1,
    });
    return {
      data: response.data.rows,
      success: response.code === 0,
      total: response.data.total,
    };
  });
  return (
    <ProCard title="待办任务">
      <ProList
        loading={loading}
        rowKey="recordId"
        showActions="hover"
        showExtra="hover"
        metas={{
          title: {
            dataIndex: 'realName',
          },
          description: {
            dataIndex: 'content',
          },
          subTitle: {
            render: (_, record) => {
              return (
                <Space size={0}>
                  <Tag color="blue">{record.custName}</Tag>
                  <Tag color="#5BD8A6">{record.exeDate}</Tag>
                </Space>
              );
            },
          },
        }}
        dataSource={data?.filter((i) => {
          return moment(i.exeDate).isAfter(moment());
        })}
      />
    </ProCard>
  );
};

export const Remind: React.FC = () => {
  return (
    <ProCard tabs={{}}>
      <ProCard.TabPane tab="销售待办" key="销售待办">
        <StatisticCard.Group>
          <StatisticCard
            statistic={{
              title: '销售订单/待审核',
              value: 1,
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
              title: '销售出库/待审核',
              value: 1,
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
              title: '销售退货/待审核',
              value: 1,
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
              title: '待出库/待审核',
              value: 1,
              icon: (
                <img
                  style={imgStyle}
                  src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*dr_0RKvVzVwAAAAAAAAAAABkARQnAQ"
                  alt="icon"
                />
              ),
            }}
          />
        </StatisticCard.Group>
      </ProCard.TabPane>
      <ProCard.TabPane tab="采购待办" key="采购待办">
        <StatisticCard.Group>
          <StatisticCard
            statistic={{
              title: '采购订单/待审核',
              value: 1,
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
              title: '采购入库单/待审核',
              value: 1,
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
              title: '采购退货单/待审核',
              value: 1,
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
              title: '订单在途',
              value: 1,
              icon: (
                <img
                  style={imgStyle}
                  src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*dr_0RKvVzVwAAAAAAAAAAABkARQnAQ"
                  alt="icon"
                />
              ),
            }}
          />
        </StatisticCard.Group>
      </ProCard.TabPane>
      <ProCard.TabPane tab="仓存待办" key="仓存待办">
        <StatisticCard.Group>
          <StatisticCard
            statistic={{
              title: '其他出库单/待审核',
              value: 1,
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
              title: '其他入库单/待审核',
              value: 1,
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
              title: '调拨出库单/待审核',
              value: 1,
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
              title: '调拨入库单',
              value: 1,
              icon: (
                <img
                  style={imgStyle}
                  src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*dr_0RKvVzVwAAAAAAAAAAABkARQnAQ"
                  alt="icon"
                />
              ),
            }}
          />
        </StatisticCard.Group>
      </ProCard.TabPane>
      <ProCard.TabPane tab="资金待办" key="资金待办">
        <StatisticCard.Group>
          <StatisticCard
            statistic={{
              title: '收款单/待审核',
              value: 1,
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
              title: '付款单/待审核',
              value: 1,
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
              title: '预收款单/待审核',
              value: 1,
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
              title: '预付款单/待审核',
              value: 1,
              icon: (
                <img
                  style={imgStyle}
                  src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*dr_0RKvVzVwAAAAAAAAAAABkARQnAQ"
                  alt="icon"
                />
              ),
            }}
          />
        </StatisticCard.Group>
      </ProCard.TabPane>
    </ProCard>
  );
};

export const XhLine: React.FC = () => {
  const data = [
    { month: '1', value: 3 },
    { month: '2', value: 4 },
    { month: '3', value: 3.5 },
    { month: '4', value: 5 },
    { month: '5', value: 4.9 },
    { month: '6', value: 6 },
    { month: '7', value: 7 },
    { month: '8', value: 9 },
    { month: '9', value: 13 },
  ];

  const config = {
    data,
    height: 500,
    xField: 'month',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
  };
  return <Line {...config} />;
};
export function SaleData() {
  const [responsive, setResponsive] = useState(false);
  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <ProCard
        title="数据概览"
        extra={moment().format('llll')}
        split={responsive ? 'horizontal' : 'vertical'}
        headerBordered
        bordered
      >
        <ProCard split="horizontal">
          <ProCard split="horizontal">
            <ProCard split="vertical">
              <StatisticCard
                statistic={{
                  title: '昨日销售金额',
                  value: 234,
                  description: <Statistic title="较本月平均销售金额" value="8.04%" trend="down" />,
                }}
              />
              <StatisticCard
                statistic={{
                  title: '本月累计销售金额',
                  value: 234,
                  description: <Statistic title="月同比" value="8.04%" trend="up" />,
                }}
              />
            </ProCard>
            <ProCard split="vertical">
              <StatisticCard
                statistic={{
                  title: '销售订单数量',
                  value: '50',
                  description: <Statistic title="较本月平均销售数量" value="8.04%" trend="down" />,
                }}
              />
              <StatisticCard
                statistic={{
                  title: '本月销售订单数量',
                  value: '134',
                  description: <Statistic title="月同比" value="8.04%" trend="up" />,
                }}
              />
            </ProCard>
          </ProCard>
          <StatisticCard title="销售额走势" chart={<XhLine />} />
        </ProCard>
        <ProCard direction="column">
          <StatisticCard title="商品分类销售情况" chart={<DemoPie />} />
          <StatisticCard title="商品销售情况" chart={<DemoBar />} />
        </ProCard>
      </ProCard>
    </RcResizeObserver>
  );
}

export default function Desktop() {
  return (
    <GlobalWrapper type="descriptions">
      <PageContainer title={'工作台'}>
        <ProCard ghost direction="column" gutter={[0, 8]}>
          <ProCard ghost>
            <QuickGo />
          </ProCard>
          <ProCard ghost>
            <QuickUse />
          </ProCard>
          <ProCard ghost direction="row" gutter={[8, 0]}>
            <ProCard colSpan={8}>
              <ActionTodo />
            </ProCard>
            <ProCard colSpan={16}>
              <Remind />
            </ProCard>
          </ProCard>
          <ProCard ghost>
            <SaleData />
          </ProCard>
        </ProCard>
      </PageContainer>
    </GlobalWrapper>
  );
}
