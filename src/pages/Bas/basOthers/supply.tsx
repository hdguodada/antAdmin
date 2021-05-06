import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import ProCard from '@ant-design/pro-card';
import SuppType from '../suppType';

export default () => {
  return (
    <ProCard>
      <PageContainer
        tabList={[
          {
            tab: '分类',
            key: 'brand',
            children: <SuppType />,
          },
        ]}
        tabProps={{
          defaultActiveKey: 'type',
        }}
      />
    </ProCard>
  );
};
