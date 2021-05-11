import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import { StatisticCard } from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';
import { Carousel } from 'antd';

export default (): React.ReactNode => {
  return (
    <PageContainer
      content={
        <Carousel draggable>
          <div>
            <RcResizeObserver key="resize-observer">
              <StatisticCard.Group direction={'column'}>
                <StatisticCard
                  statistic={{
                    title: '库存预警1',
                    value: 2176,
                  }}
                />
                <StatisticCard
                  statistic={{
                    title: '未发货销货订单2',
                    value: 475,
                  }}
                />
                <StatisticCard
                  statistic={{
                    title: '未审核购货单3',
                    value: 87,
                  }}
                />
                <StatisticCard
                  statistic={{
                    title: '未审核调拨单4',
                    value: 1754,
                  }}
                />
              </StatisticCard.Group>
            </RcResizeObserver>
          </div>
          <div>
            <RcResizeObserver key="resize-observer">
              <StatisticCard.Group>
                <StatisticCard
                  statistic={{
                    title: '库存预警',
                    value: 2176,
                  }}
                />
                <StatisticCard
                  statistic={{
                    title: '未发货销货订单',
                    value: 475,
                  }}
                />
                <StatisticCard
                  statistic={{
                    title: '未审核购货单',
                    value: 87,
                  }}
                />
                <StatisticCard
                  statistic={{
                    title: '未审核调拨单',
                    value: 1754,
                  }}
                />
              </StatisticCard.Group>
            </RcResizeObserver>
          </div>
        </Carousel>
      }
    >
      ,
    </PageContainer>
  );
};
