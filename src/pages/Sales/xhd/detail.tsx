/* eslint-disable no-console */
import React from 'react';
import { BussType } from '@/pages/Purchase/components';
import { XhForm } from '../components';
import GlobalWrapper from '@/components/GlobalWrapper';

export default () => {
  return <GlobalWrapper type="descriptions" children={<XhForm bussType={BussType.销售单} />} />;
};
