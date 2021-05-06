import { check } from '@/services';
import { mapModId } from '@/utils/utils';
import { showSysInfo } from '@/components/SysInfo';
import { Button, Dropdown, Menu } from 'antd';
import React from 'react';

type CheckButtonProps = {
  url: string;
  selectedRowKeys: React.Key[];
  actionRef?: any;
  refresh?: any;
  checkStatus?: number;
};
export const CheckButton = ({ url, selectedRowKeys, actionRef, refresh }: CheckButtonProps) => {
  return (
    <Dropdown.Button
      onClick={async () => {
        const res = await check({
          url,
          data: {
            ids: selectedRowKeys,
            checkStatus: 2,
          },
          headers: { modId: mapModId.ghdd },
        });
        showSysInfo(res);
        actionRef?.current?.reload();
        refresh?.();
      }}
      overlay={
        <Menu>
          <Menu.Item key={'uncheck'}>
            <Button
              type={'dashed'}
              onClick={async () => {
                const res = await check({
                  url,
                  data: {
                    ids: selectedRowKeys,
                    checkStatus: 1,
                  },
                  headers: { modId: mapModId.ghdd },
                });
                showSysInfo(res);
                actionRef?.current?.reload();
                refresh?.();
              }}
            >
              反审核
            </Button>
          </Menu.Item>
        </Menu>
      }
    >
      审核
    </Dropdown.Button>
  );
};

export const CheckTwoButton = ({
  url,
  selectedRowKeys,
  actionRef,
  refresh,
  checkStatus = 1,
}: CheckButtonProps) => {
  return (
    <Button
      onClick={async () => {
        const res = await check({
          url,
          data: {
            ids: selectedRowKeys,
            checkStatus,
          },
          headers: { modId: mapModId.ghdd },
        });
        showSysInfo(res);
        actionRef?.current?.reload();
        refresh?.();
      }}
    >
      {checkStatus === 2 ? '审核' : '反审核'}
    </Button>
  );
};
type OpenButtonProps = {
  selectedRowKeys: React.Key[];
  actionRef?: any;
  fn: any;
};
export const OpenButton = ({ selectedRowKeys, actionRef, fn }: OpenButtonProps) => (
  <Dropdown.Button
    onClick={async () => {
      const res = await fn(selectedRowKeys, 'close');
      showSysInfo(res);
      actionRef.current?.reload();
    }}
    overlay={
      <Menu>
        <Menu.Item key={'uncheck'}>
          <Button
            type={'dashed'}
            onClick={async () => {
              const res = await fn(selectedRowKeys, 'open');
              showSysInfo(res);
              actionRef.current?.reload();
            }}
          >
            开启
          </Button>
        </Menu.Item>
      </Menu>
    }
  >
    关闭
  </Dropdown.Button>
);
