import React from 'react';
import ProCard from '@ant-design/pro-card';
import CustLevel from '../custLevel';
import CustArea from '../custArea';
import CustType from '../custType';
import GlobalWrapper from '@/components/GlobalWrapper';

export default () => {
  return (
    <GlobalWrapper type={'list'}>
      <ProCard split={'vertical'}>
        <ProCard>
          <CustLevel />
        </ProCard>
        <ProCard>
          <CustArea />
        </ProCard>
        <ProCard>
          <CustType />
        </ProCard>
      </ProCard>
    </GlobalWrapper>
  );
};
