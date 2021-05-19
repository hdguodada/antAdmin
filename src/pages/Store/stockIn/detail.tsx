import React from 'react';
import { BussType } from '@/pages/Purchase/components';
import { StoreForm } from '../components';
import GlobalWrapper from '@/components/GlobalWrapper';

export default () => {
  return (
    <GlobalWrapper type="descriptions">
      <StoreForm bussType={BussType.其他入库单} />
    </GlobalWrapper>
  );
};
