import React from 'react';
import { BussType } from '@/pages/Purchase/components';
import { StoreTable } from '../components';
import GlobalWrapper from '@/components/GlobalWrapper';

export default () => {
  return (
    <GlobalWrapper type="list">
      <StoreTable
        initSearch={{ bussType: [BussType.其他出库单, BussType.盘亏] }}
        bussType={BussType.其他出库单}
      />
    </GlobalWrapper>
  );
};
