import React from 'react';
import ProCard from '@ant-design/pro-card';
import CustLevel from '../custLevel';
import CustArea from '../custArea';
import CustType from '../custType';
import { Tabs } from 'antd';

const { TabPane } = Tabs;
export default () => {
  return (
    <ProCard>
      <Tabs defaultActiveKey="1">
        <TabPane tab="等级" key="1">
          <CustLevel />
        </TabPane>
        <TabPane tab="区域" key="2">
          <CustArea />
        </TabPane>
        <TabPane tab="类别" key="3">
          <CustType />
        </TabPane>
      </Tabs>
    </ProCard>
  );
};
