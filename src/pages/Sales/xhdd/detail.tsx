/* eslint-disable no-console */
import React from 'react';
import { BussType, StockType } from '@/pages/Purchase/components';
import { XhForm } from '../components';
import GlobalWrapper from '@/components/GlobalWrapper';

export default () => {
  return (
    <GlobalWrapper type="descriptions">
      <XhForm bussType={BussType.销售订单} stockType={StockType.出库} />
    </GlobalWrapper>
  );
};
