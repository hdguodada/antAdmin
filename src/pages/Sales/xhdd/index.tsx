import React from 'react';
import { BussType } from '@/pages/Purchase/components';
import { XhTable } from '../components';
import GlobalWrapper from '@/components/GlobalWrapper';

export default () => {
  return (
    <GlobalWrapper type="list">
      <XhTable openCloseFn={() => {}} bussType={BussType.销售订单} />
    </GlobalWrapper>
  );
};
