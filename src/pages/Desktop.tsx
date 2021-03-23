import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';

export default (): React.ReactNode => {
  return (
    <PageContainer
      tabList={[
        {
          tab: '开发配置',
          key: 'base',
        },
        {
          tab: '系统管理',
          key: 'info',
        },
      ]}
    ></PageContainer>
  );
};
