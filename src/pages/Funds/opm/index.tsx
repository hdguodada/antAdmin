import GlobalWrapper from '@/components/GlobalWrapper';
import { BussType } from '@/pages/Purchase/components';
import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import { FundsTable } from '../components';

export default () => {
  return (
    <GlobalWrapper type="list">
      <PageContainer content={<FundsTable bussType={BussType.其他支出单} />} />
    </GlobalWrapper>
  );
};
