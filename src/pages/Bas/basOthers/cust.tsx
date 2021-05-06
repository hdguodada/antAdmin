import React from 'react';
import ProCard from '@ant-design/pro-card';
import CustLevel from '../custLevel';
import CustArea from '../custArea';
import CustType from '../custType';

export default () => {
  return (
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
  );
};
