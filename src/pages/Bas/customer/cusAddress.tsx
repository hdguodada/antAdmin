import { delCustomerAddress, queryCustomerAddress } from '@/services/Bas';
import { EditFilled, PlusOutlined } from '@ant-design/icons';
import ProList from '@ant-design/pro-list';
import type { FormInstance } from 'antd';
import { Button, Cascader, Space, Tag, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import Style from '@/global.less';
import DelButton from '@/components/DelPopconfirm/next';
import ProForm, {
  ModalForm,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { useRequest } from '@/.umi/plugin-request/request';
import { queryRegionTree } from '@/services/Sys';
import { transformRegionCd } from '@/utils/utils';
import type { ActionType } from '@ant-design/pro-table';

export const CustAddressForm: React.FC<{ custId: K } & FormProps<BAS.CustAddress>> = ({
  custId,
  action,
  visible,
  initialValues,
  setVisible,
  refresh,
}) => {
  const RegionTree = useRequest(queryRegionTree);
  const saveCustAddress = useRequest(
    (data: BAS.CustAddress) => {
      return {
        url: action === 'add' ? '/bas/custAddress/add' : '/bas/custAddress/upd',
        method: 'POST',
        data,
      };
    },
    {
      manual: true,
    },
  );
  const formRef = useRef<FormInstance>();
  return (
    <ModalForm<BAS.CustAddress>
      title={<div>收货地址</div>}
      visible={visible}
      initialValues={{
        state: 1,
      }}
      onValuesChange={(v) => {
        if (v.regioncdMid) {
          formRef.current?.setFieldsValue({
            regioncd: v.regioncdMid.slice(-1)[0],
          });
        }
      }}
      formRef={formRef}
      onFinish={async (v) => {
        await saveCustAddress.run(v);
        refresh?.();
        return true;
      }}
      onVisibleChange={(v) => {
        if (v) {
          formRef.current?.setFieldsValue(initialValues);
        } else {
          formRef.current?.resetFields();
        }
        setVisible?.(v);
      }}
    >
      <ProFormText initialValue={custId} name="custId" hidden />
      <ProFormText name="regioncd" hidden />
      <ProForm.Group>
        <ProFormText name="linkman" label="联系人" width="md" />
        <ProFormText name="mobile" label="联系电话" width="md" />
        <ProForm.Item name="regioncdMid" label="地区" style={{ width: '328px' }}>
          <Cascader
            options={RegionTree.data?.rows}
            fieldNames={{
              label: 'label',
              value: 'id',
            }}
          />
        </ProForm.Item>
        <ProFormRadio.Group
          name="isDefault"
          label="默认收货地址"
          initialValue={0}
          options={[
            {
              label: '否',
              value: 0,
            },
            {
              label: '是',
              value: 1,
            },
          ]}
        />
      </ProForm.Group>
      <ProFormTextArea name="address" label="详细地址" width="lg" />
    </ModalForm>
  );
};

export const CustAddressTable: React.FC<{
  custId: K;
}> = ({ custId }) => {
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<BAS.CustAddress>();
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const actionRef = useRef<ActionType>();
  return (
    <>
      <CustAddressForm
        custId={custId}
        visible={modalVisit}
        setVisible={setModalVisit}
        initialValues={modalFormInit}
        action={formAction}
        refresh={actionRef?.current?.reload}
      />
      <ProList<BAS.CustAddress>
        params={{ custId }}
        request={async (params) => {
          const res = await queryCustomerAddress({
            ...params,
            queryFilter: params,
          });
          return {
            data: res.data.rows,
            success: res.code === 0,
          };
        }}
        actionRef={actionRef}
        bordered
        metas={{
          title: {
            dataIndex: 'linkman',
          },
          content: {
            dataIndex: 'fullAddress',
            // @ts-ignore
            copyable: true,
            ellipsis: true,
          },
          subTitle: {
            render: (_, record) => {
              return (
                <Space size={0}>
                  <Tag color="blue">{record.mobile}</Tag>
                </Space>
              );
            },
          },
          actions: {
            render: (_, record, _index, action) => [
              <div key="modify">
                <Tooltip title="修改" key="modify">
                  <EditFilled
                    key="edit"
                    style={{ cursor: 'pointer' }}
                    className={Style.myLink}
                    onClickCapture={() => {
                      setFormAction('upd');
                      setModalFormInit({
                        ...record,
                        regioncdMid: transformRegionCd(record.regioncd),
                      });
                      setModalVisit(true);
                    }}
                  />
                </Tooltip>
              </div>,
              <div key="del">
                <DelButton
                  onConfirm={async () => {
                    await delCustomerAddress([record.addressId]);
                    action.reload();
                  }}
                />
              </div>,
            ],
          },
        }}
        toolBarRender={() => {
          return [
            <Button
              type={'primary'}
              onClick={() => {
                setFormAction('add');
                setModalVisit(true);
              }}
            >
              <PlusOutlined />
              新建
            </Button>,
          ];
        }}
        search={false}
      />
    </>
  );
};
