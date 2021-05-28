import ProForm, { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Form } from 'antd';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { history, useModel } from 'umi';
import React, { useRef } from 'react';
import { newCustomer } from '@/services/Bas';
import { queryUsers } from '@/services/Sys';
import { patternMsg } from '@/utils/validator';
import type { ActionType } from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import { CustomerFinanceFormFields } from './custFinanceForm';
import { CustAreaSelect, CustTypeSelect, DepSelect, OptionSelect } from '@/utils/form';

type FormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};
const CustomerForm: React.FC<FormProps> = (props) => {
  const { visible, setVisible } = props;
  const formRef = useRef<
    FormInstance<{
      basCustomer: BAS.Customer;
      basCustRelLists: [BAS.Rel];
      basCustFinance: BAS.CustomerFinance;
    }>
  >();
  const { levelOptions } = useModel('custLevel');
  return (
    <>
      <ModalForm<{
        basCustomer: BAS.Customer;
        basCustRelLists: [BAS.Rel];
        basCustFinance: BAS.CustomerFinance;
      }>
        onFinish={async (values) => {
          await newCustomer(values);
          return true;
        }}
        width={1200}
        visible={visible}
        title="新建客户"
        onVisibleChange={async (v) => {
          if (v) {
            formRef.current?.setFieldsValue({
              basCustomer: { state: 1 },
            });
          } else {
            formRef.current?.resetFields();
          }
          setVisible(v);
        }}
      >
        <ProCard collapsible title="基本信息">
          <ProForm.Group>
            <ProFormText
              name={['basCustomer', 'custName']}
              label="公司"
              tooltip="最长为 24 位"
              placeholder="公司名称"
              width="md"
              rules={patternMsg.text('')}
            />
            <ProFormText name={['basCustomer', 'custShort']} label="简称" width="md" />
            <Form.Item
              name={['basCustomer', 'custTypeId']}
              label="客户类别"
              style={{ width: '328px' }}
              rules={patternMsg.select('')}
            >
              <CustTypeSelect showNew isLeaf />
            </Form.Item>
            <ProFormText
              width="md"
              name={['basCustomer', 'custCd']}
              label="编号"
              rules={patternMsg.text('')}
            />
            <ProFormSelect
              width="md"
              name={['basCustomer', 'custLevelId']}
              label="客户等级"
              rules={patternMsg.select('')}
              options={levelOptions}
              tooltip="数据字典"
              fieldProps={{
                dropdownRender: (menu) => (
                  <>
                    {menu}
                    <Button
                      type="dashed"
                      block
                      onClick={() => {
                        history.push('/init/dictDef');
                      }}
                    >
                      <PlusOutlined />
                      新建字典
                    </Button>
                  </>
                ),
              }}
            />

            <OptionSelect
              showNew
              option="CustSource"
              width="md"
              label="客户来源"
              name={['basCustomer', 'SourceId']}
            />
            <ProFormSelect
              showSearch
              fieldProps={{
                optionFilterProp: 'label',
              }}
              width="md"
              name={['basCustomer', 'salesmanId']}
              label={'营销员'}
              rules={patternMsg.select('')}
              request={async () => {
                return (await queryUsers({ pageNumber: -1 })).data.rows.map((item) => ({
                  label: item.realName,
                  value: item.userId,
                }));
              }}
            />
            <Form.Item
              name={['basCustomer', 'custAreaId']}
              label="所属区域"
              style={{ width: '328px' }}
              rules={patternMsg.select('')}
            >
              <CustAreaSelect isLeaf showNew />
            </Form.Item>
            <ProForm.Item
              name={['basCustomer', 'depId']}
              label={'所属部门'}
              style={{ width: '328px' }}
            >
              <DepSelect showNew />
            </ProForm.Item>
          </ProForm.Group>
        </ProCard>
        <ProCard collapsible title="财务信息">
          <CustomerFinanceFormFields simple={true} action="add" />
        </ProCard>
        <ProCard collapsible title="联系人信息">
          <ProForm.Group>
            <ProFormText
              name={['basCustRelLists', 0, 'relName']}
              label="姓名"
              rules={patternMsg.text('')}
              width="md"
            />
            <ProFormText width="md" name={['basCustRelLists', 0, 'relMobile']} label="手机" />
            <ProFormText width="md" name={['basCustRelLists', 0, 'relWeiXin']} label="微信" />
            <ProFormText
              width="md"
              name={['basCustRelLists', 0, 'isMain']}
              hidden
              initialValue={1}
            />
          </ProForm.Group>
        </ProCard>
      </ModalForm>
    </>
  );
};

export default CustomerForm;
