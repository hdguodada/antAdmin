import { Tag, Space, Menu, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { useModel, SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
import HeaderDropdown from '../HeaderDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import { quickList, quickMap } from '@/pages/Desktop';
import { history } from 'umi';

export type SiderTheme = 'light' | 'dark';

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <Space className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        options={quickList.map((item) => ({
          label: (
            <Button
              type="link"
              onClick={() => {
                history.push(`${quickMap[item].componentUrl}/new`);
              }}
            >
              {quickMap[item].title}
            </Button>
          ),
          value: quickMap[item].title,
        }))}
        // onSearch={value => {
        //   console.log('input', value);
        // }}
      />
      {/* <HeaderDropdown
        overlay={
          <Menu>
            <Menu.Item
              onClick={() => {
                window.open('/~docs');
              }}
            >
              组件文档
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                window.open('https://pro.ant.design/docs/getting-started');
              }}
            >
              Ant Design Pro 文档
            </Menu.Item>
          </Menu>
        }
      >
        <span className={styles.action}>
          <QuestionCircleOutlined />
        </span>
      </HeaderDropdown> */}
      <Avatar />
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
      <SelectLang className={styles.action} />
    </Space>
  );
};
export default GlobalHeaderRight;
