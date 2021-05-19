import React from 'react';
import { BussType } from '@/pages/Purchase/components';
import { StoreTable } from '../components';
import GlobalWrapper from '@/components/GlobalWrapper';

export default () => {
  return (
    <GlobalWrapper type="list">
      <StoreTable bussType={BussType.调拨单} />
    </GlobalWrapper>
  );
};
