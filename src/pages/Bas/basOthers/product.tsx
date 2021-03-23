import React from 'react';
import ProCard from '@ant-design/pro-card';
import Type from '@/pages/Bas/productType';
import Attr from '@/pages/Bas/attr';
import Brand from '@/pages/Bas/brand';

import { Tabs } from 'antd';

const { TabPane } = Tabs;
export default () => {
  return (
    <ProCard>
      <Tabs defaultActiveKey="1">
        <TabPane tab="品牌" key="1">
          <Brand />
        </TabPane>
        <TabPane tab="属性" key="2">
          <Attr />
        </TabPane>
        <TabPane tab="类别" key="3">
          <Type />
        </TabPane>
      </Tabs>
    </ProCard>
  );
};
