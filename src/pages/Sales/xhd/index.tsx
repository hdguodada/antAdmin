import React from 'react';
import { BussType } from '@/pages/Purchase/components';
import { XhTable } from '../components';
import GlobalWrapper from '@/components/GlobalWrapper';

export default () => {
  return (
    <GlobalWrapper type="list">
      <XhTable bussType={BussType.销售单} />
    </GlobalWrapper>
  );
};
