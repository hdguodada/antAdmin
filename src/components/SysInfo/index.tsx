import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { List, Modal } from 'antd';
import React from 'react';

const { confirm } = Modal;

export type SysInfoProps = {
  details: {
    code: number;
    msg: string;
    data: {
      Text: string;
      Other?: any;
    };
  }[];
  failNum: number;
  successNum: number;
  totalNum: number;
};

export const showSysInfo = (props: SysInfoProps) => {
  const { details } = props;
  confirm({
    title: '系统信息',
    content: (
      <List
        itemLayout="horizontal"
        dataSource={details}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={item.code === 0 ? <CheckOutlined /> : <CloseOutlined />}
              title={<a>{`${item.data.Text} ${item.msg}`}</a>}
            />
          </List.Item>
        )}
      />
    ),
  });
};
