import { useRequest } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Calendar, Badge, Modal, Space, Tag, Empty } from 'antd';
import React from 'react';
import { queryCustRecord } from '@/services/Bas';
import { useState } from 'react';
import moment from 'moment';
import CustomerSelect from '../Bas/customer/customerSelect';
import ProCard from '@ant-design/pro-card';
import { useEffect } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default (): React.ReactNode => {
  const [custId, setCustId] = useState<K>(-1);
  const { data, loading, run } = useRequest(
    async () => {
      const response = await queryCustRecord({
        pageNumber: -1,
        queryFilter: {
          custId,
        },
      });
      return {
        data: response.data.rows,
        success: response.code === 0,
        total: response.data.total,
      };
    },
    {
      manual: true,
    },
  );
  function dateCellRender(value: moment.Moment): React.ReactNode {
    const listData = data?.filter((i) => moment(i.exeDate).isSame(value, 'day')) || [];
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.recordId}>
            <Badge status={'success'} text={item.content} />
          </li>
        ))}
      </ul>
    );
  }
  function onSelect(value: moment.Moment) {
    const listData = data?.filter((i) => moment(i.exeDate).isSame(value, 'day')) || [];
    Modal.confirm({
      title: value.format('YYYY-MM-DD'),
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          {listData.length > 0 ? (
            listData.map((item) => (
              <Space key={item.recordId}>
                <Tag color="magenta">{item.custName}</Tag>
                <Tag color="orange">{item.realName}:</Tag>
                <p>{item.content}</p>
              </Space>
            ))
          ) : (
            <Empty />
          )}
        </>
      ),
      okText: '确认',
      cancelText: '关闭',
    });
  }
  useEffect(() => {
    run();
  }, [custId]);
  return (
    <PageContainer
      title={false}
      loading={loading}
      content={
        <>
          <ProCard colSpan={6}>
            <CustomerSelect
              multiple={false}
              onChange={(v) => {
                if (typeof v === 'number') {
                  setCustId(v);
                }
              }}
            />
          </ProCard>
          <Calendar dateCellRender={dateCellRender} onSelect={onSelect} />
        </>
      }
    />
  );
};
