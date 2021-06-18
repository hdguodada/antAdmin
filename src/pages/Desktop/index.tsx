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
import { Divider, Space, Typography } from 'antd';
import GlobalWrapper from '@/components/GlobalWrapper';
import Avatar from 'antd/lib/avatar/avatar';
import { history, useModel } from 'umi';
import { BussTypeComponentUrl } from '../Purchase/components';
import {
  BankFilled,
  BankOutlined,
  PayCircleFilled,
  PropertySafetyFilled,
  RocketFilled,
} from '@ant-design/icons';

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
      icon: <BankFilled style={{ fontSize: '32px' }} />,
      title: '客户',
      href: '/bas/customer',
    },
    {
      icon: <PayCircleFilled style={{ fontSize: '32px' }} />,
      title: '供应商',
      href: '/bas/supplier',
    },
    {
      icon: <RocketFilled style={{ fontSize: '32px' }} />,
      title: '代办任务/行动',
      href: '/bas/action',
    },
    {
      icon: <PropertySafetyFilled style={{ fontSize: '32px' }} />,
      title: '销售报表',
      href: '/sales/Reports',
    },
  ];
  return (
    <ProCard colSpan={24}>
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

export function Todo() {
  return (
    <ProCard colSpan={24} tabs={{}}>
      <ProCard.TabPane tab="销售待办" key="销售待办">
        <StatisticCard.Group>
          <StatisticCard
            statistic={{
              title: '销售订单/待审核',
              value: 1,
            }}
          />
          <StatisticCard
            statistic={{
              title: '销售出库/待审核',
              value: 1,
            }}
          />
          <StatisticCard
            statistic={{
              title: '销售退货/待审核',
              value: 1,
            }}
          />
          <StatisticCard
            statistic={{
              title: '待出库/待审核',
              value: 1,
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
            }}
          />
          <StatisticCard
            statistic={{
              title: '采购入库单/待审核',
              value: 1,
            }}
          />
          <StatisticCard
            statistic={{
              title: '采购退货单/待审核',
              value: 1,
            }}
          />
          <StatisticCard
            statistic={{
              title: '订单在途',
              value: 1,
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
            }}
          />
          <StatisticCard
            statistic={{
              title: '其他入库单/待审核',
              value: 1,
            }}
          />
          <StatisticCard
            statistic={{
              title: '调拨出库单/待审核',
              value: 1,
            }}
          />
          <StatisticCard
            statistic={{
              title: '调拨入库单',
              value: 1,
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
            }}
          />
          <StatisticCard
            statistic={{
              title: '付款单/待审核',
              value: 1,
            }}
          />
          <StatisticCard
            statistic={{
              title: '预收款单/待审核',
              value: 1,
            }}
          />
          <StatisticCard
            statistic={{
              title: '预付款单/待审核',
              value: 1,
            }}
          />
        </StatisticCard.Group>
      </ProCard.TabPane>
    </ProCard>
  );
}

export function SaleData() {
  const [responsive, setResponsive] = useState(false);
  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <StatisticCard.Group title="核心指标" direction={responsive ? 'column' : 'row'}>
        <StatisticCard
          statistic={{
            title: '销售订单',
            value: 79,
            suffix: '单',
            icon: <Avatar icon="销" />,
          }}
        />
        <Divider type={responsive ? 'horizontal' : 'vertical'} />
        <StatisticCard
          statistic={{
            title: '销售出库',
            value: 112893,
            suffix: '单',
            icon: <Avatar icon="出" />,
          }}
        />
        <Divider type={responsive ? 'horizontal' : 'vertical'} />
        <StatisticCard
          statistic={{
            title: '销售退货',
            value: 112893,
            suffix: '单',
            icon: <Avatar icon="退" />,
          }}
        />
        <StatisticCard
          statistic={{
            title: '新增客户',
            value: 112893,
            icon: <Avatar icon="客" />,
          }}
        />
      </StatisticCard.Group>
    </RcResizeObserver>
  );
}
export default function Desktop() {
  return (
    <GlobalWrapper type="descriptions">
      <PageContainer title={false}>
        <ProCard ghost>
          <QuickGo />
          <div style={{ height: '20px' }}></div>
          <QuickUse />
          <div style={{ height: '20px' }}></div>
          <Todo />
          <div style={{ height: '20px' }}></div>
          <SaleData />
        </ProCard>
      </PageContainer>
    </GlobalWrapper>
  );
}
