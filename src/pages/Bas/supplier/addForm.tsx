import { addSupplier } from '@/services/Bas';
import { getCode } from '@/services/Sys';
import { patternMsg } from '@/utils/validator';
import React, { useRef } from 'react';
import type { FormInstance } from 'antd';
import { Form } from 'antd';
import ProForm, { ModalForm, ProFormRadio, ProFormText } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { DepSelect, SuppTreeSelect, UserSelect } from '@/utils/form';

export const BaseSupplierFormGroup = ({ action }: { action: 'add' | 'upd' }) => {
  return (
    <>
      <ProForm.Group>
        <ProFormText
          width="md"
          name={action === 'add' ? ['basSupplier', 'suppCd'] : 'suppCd'}
          label="供应商编号"
          rules={patternMsg.text('供应商编号')}
        />
        <ProFormText
          width="md"
          label="供应商名称"
          name={action === 'add' ? ['basSupplier', 'suppName'] : 'suppName'}
          rules={patternMsg.text('供应商名称')}
        />
        <Form.Item
          label="供应商类别"
          name={action === 'add' ? ['basSupplier', 'suppTypeId'] : 'suppTypeId'}
          style={{ width: '328px' }}
          rules={patternMsg.select('')}
        >
          <SuppTreeSelect showNew isLeaf />
        </Form.Item>

        <UserSelect
          width="md"
          label="采购员"
          name={action === 'add' ? ['basSupplier', 'buyerId'] : 'buyerId'}
          showSearch
          showNew
          rules={patternMsg.select('')}
        />
        <ProForm.Item
          name={action === 'add' ? ['basSupplier', 'depId'] : 'depId'}
          style={{ width: '328px' }}
          label={'所属部门'}
        >
          <DepSelect showNew />
        </ProForm.Item>
        <ProFormText
          width="md"
          label="Email"
          name={action === 'add' ? ['basSupplier', 'email'] : 'email'}
        />
        <ProFormText
          width="md"
          label="详细地址"
          name={action === 'add' ? ['basSupplier', 'address'] : 'address'}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormRadio.Group
          width="md"
          name={action === 'add' ? ['basSupplier', 'checkStatus'] : 'checkStatus'}
          label="审核状态"
          options={[
            {
              label: '未审核',
              value: 0,
            },
            {
              label: '审核通过',
              value: 1,
            },
            {
              label: '审核未通过',
              value: 2,
            },
          ]}
        />
        <ProFormRadio.Group
          width="md"
          name={action === 'add' ? ['basSupplier', 'state'] : 'state'}
          label="状态"
          options={[
            {
              label: '禁用',
              value: 0,
            },
            {
              label: '正常',
              value: 1,
            },
          ]}
        />
      </ProForm.Group>
    </>
  );
};

export const SupplierFinanceGroup = ({ action }: { action: 'add' | 'upd' }) => {
  return (
    <>
      <ProFormText
        width="md"
        label="供应商"
        hidden
        name={action === 'add' ? ['basSuppFinance', 'suppId'] : 'suppId'}
      />
      <ProForm.Group>
        <ProFormText
          width="md"
          name={action === 'add' ? ['basSuppFinance', 'taxInvoice'] : 'taxInvoice'}
          label="开票名称"
          rules={patternMsg.text('')}
        />
        <ProFormText
          width="md"
          label="开票税号"
          rules={patternMsg.text('')}
          name={action === 'add' ? ['basSuppFinance', 'taxPayerNo'] : 'taxPayerNo'}
        />
        <ProFormText
          width="md"
          label="开户银行"
          rules={patternMsg.text('')}
          name={action === 'add' ? ['basSuppFinance', 'taxBank'] : 'taxBank'}
        />
        <ProFormText
          width="md"
          label="银行账号"
          rules={patternMsg.text('')}
          name={action === 'add' ? ['basSuppFinance', 'taxBankAccount'] : 'taxBankAccount'}
        />
        <ProFormText
          width="md"
          label="开户地址"
          rules={patternMsg.text('')}
          name={action === 'add' ? ['basSuppFinance', 'taxAddress'] : 'taxAddress'}
        />
        <ProFormText
          width="md"
          label="开户电话"
          name={action === 'add' ? ['basSuppFinance', 'taxTel'] : 'taxTel'}
        />
        <ProFormText
          width="md"
          label="发票邮箱"
          name={action === 'add' ? ['basSuppFinance', 'taxEmail'] : 'taxEmail'}
        />
        <ProFormText
          width="md"
          label="期初应付款"
          name={action === 'add' ? ['basSuppFinance', 'initPayable'] : 'initPayable'}
        />
        <ProFormText
          width="md"
          label="期初预付款"
          name={action === 'add' ? ['basSuppFinance', 'initPerPayable'] : 'initPerPayable'}
        />
      </ProForm.Group>
    </>
  );
};

export default (props: FormProps<BAS.Supplier>) => {
  const { action, actionRef, visible, setVisible, initialValues, refresh } = props;
  const formRef = useRef<FormInstance>();
  return (
    <>
      <ModalForm<{
        basSupplier: BAS.Supplier;
        basSuppRelLists: BAS.Rel[];
        basSuppFinance: BAS.Finance;
      }>
        initialValues={{
          basSupplier: { state: 1, checkStatus: 0 },
          basSuppRelLists: [{ isMain: 1 }],
        }}
        width={1200}
        formRef={formRef}
        title="新建供应商"
        visible={visible}
        onFinish={async (values) => {
          await addSupplier(values);
          actionRef?.current?.reload();
          refresh?.();
          return true;
        }}
        onVisibleChange={(v) => {
          if (v) {
            formRef.current?.setFieldsValue(initialValues);
            if (action === 'add') {
              getCode('BasSupplier').then((res) => {
                formRef.current?.setFieldsValue({
                  basSupplier: { suppCd: res.data },
                });
              });
            }
          } else {
            formRef.current?.resetFields();
          }
          setVisible?.(v);
        }}
      >
        <ProCard collapsible title="基本信息">
          <BaseSupplierFormGroup action={'add'} />
        </ProCard>
        <ProCard collapsible title="财务信心">
          <SupplierFinanceGroup action={'add'} />
        </ProCard>
        <ProCard collapsible title="联系人信息">
          <ProForm.Group>
            <ProFormText
              name={['basSuppRelLists', 0, 'relName']}
              label="姓名"
              rules={patternMsg.text('')}
              width="md"
            />
            <ProFormText width="md" name={['basSuppRelLists', 0, 'relMobile']} label="手机" />
            <ProFormText width="md" name={['basSuppRelLists', 0, 'relEmail']} label="邮箱" />
            <ProFormText width="md" name={['basSuppRelLists', 0, 'relWeiXin']} label="微信" />
            <ProFormText
              width="md"
              name={['basSuppRelLists', 0, 'isMain']}
              hidden
              initialValue={1}
            />
          </ProForm.Group>
        </ProCard>
      </ModalForm>
    </>
  );
};
