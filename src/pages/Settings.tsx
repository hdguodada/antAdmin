import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { useModel, useIntl } from 'umi';

export default (): React.ReactNode => {
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');
  const routers = initialState?.menuData;
  const sysRouters = [];
  const initRouters = [];
  routers?.forEach((item) => {
    if (item.name === 'sys') {
      sysRouters.push(item);
    } else if (item.name === ' init') {
      initRouters.push(item);
    }
  });
  return (
    <PageContainer
      tabList={[
        {
          tab: intl.formatMessage({
            id: 'menu.sys',
          }),
          key: 'sys',
        },
        {
          tab: intl.formatMessage({
            id: 'menu.init',
          }),
          key: 'init',
        },
      ]}
    ></PageContainer>
  );
};
