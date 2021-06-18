import React from 'react';
import { BussType } from '@/pages/Purchase/components';
import { ProduceTable } from '../components';
import GlobalWrapper from '@/components/GlobalWrapper';

export default () => {
  return (
    <GlobalWrapper type="list">
      <ProduceTable bussType={BussType.生产入库} />
    </GlobalWrapper>
  );
};
