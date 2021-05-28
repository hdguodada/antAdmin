import GlobalWrapper from '@/components/GlobalWrapper';
import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import { FundsTable } from '@/pages/Funds/components';
import { BussType } from '@/pages/Purchase/components';

export default () => {
  return (
    <GlobalWrapper type="list">
      <PageContainer title={false} content={<FundsTable bussType={BussType.核销单} />} />
    </GlobalWrapper>
  );
};
