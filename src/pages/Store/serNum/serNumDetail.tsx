import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable, { EditableProTable } from '@ant-design/pro-table';
import React, { useEffect, useRef, useState } from 'react';
import { serNumDetail, serNumFindList } from '@/services/Store';
import { prefixInteger } from '@/utils/utils';
import type { FormInstance } from 'antd';
import { Button, Input, Modal, Space } from 'antd';
import ProCard from '@ant-design/pro-card';
import ProForm, {
  ModalForm,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import Style from '@/global.less';
import { baseSearch, indexColumns, memoColumns, statusColumns } from '@/utils/columns';
import { StockType } from '@/pages/Purchase/components';
import { useModel } from '@/.umi/plugin-model/useModel';
import { InputNumber, Transfer } from 'antd';
import { useRequest } from 'umi';
import lodash from 'lodash';

/**
 * 盘点时序列号穿梭框
 * @param value
 * @param onChange
 * @param isSerNum
 * @param storeCd
 * @param skuId
 * @param qty
 * @constructor
 */

export const SNTransfer: React.FC<{
  value?: STORE.SerNumValue;
  onChange?: (value?: STORE.SerNumValue) => void;
  storeCd: K;
  skuId: K;
  isSerNum: number;
  qty: number; // 系统库存数量
}> = ({ value, onChange, isSerNum, storeCd, skuId, qty }) => {
  const [inputValue, setInputValue] = useState<number | undefined>(value?.checkInventoryQty);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>();
  const onTransferChange = (nextTargetKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
  };
  const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };
  const { data, run, error } = useRequest(
    async () => {
      if (isSerNum) {
        const res = await serNumFindList({
          queryFilter: {
            storeCd,
            skuId,
            status: 1,
          },
        });

        return {
          data: res.data.rows.map((item) => ({
            ...item,
            key: item.serId,
            title: item.serNum,
          })),
          success: true,
        };
      }
      return {
        success: true,
      };
    },
    {
      manual: true,
    },
  );
  if (!error) {
    return isSerNum ? (
      <ModalForm
        title="实际库存序列号"
        onFinish={async (v) => {
          let temp: string[] = [];
          if (v.newSerNum) {
            temp = v.newSerNum.split(/[\n\s+,]/g).filter((i: string) => i);
          }

          const sourceSelectedKeys = data?.map((i) => i.key) || [];
          const diffArr = lodash.difference(sourceSelectedKeys, targetKeys || []); // create an array with targetKeys - sourceSelectedKeys
          const checkInventoryQty = temp.length + (targetKeys?.length || 0);
          setInputValue(checkInventoryQty);
          onChange?.({
            newSerNum: temp.map((i) => ({
              serNum: i,
            })),
            delSerNum: data?.filter((i) => diffArr.indexOf(i.serId) > -1) || [],
            checkInventoryQty,
          });
          return true;
        }}
        onVisibleChange={(v) => {
          if (v) {
            run();
          }
        }}
        trigger={
          <Input
            value={inputValue}
            suffix={
              <div
                style={{ padding: '3px' }}
                className={inputValue ? Style.successBgColor : Style.errorBgColor}
              >
                SN
              </div>
            }
          />
        }
      >
        <ProCard split="vertical" ghost>
          <ProCard>
            <Transfer
              dataSource={data}
              titles={['系统在库序列号', '实际在库序列号']}
              selectedKeys={selectedKeys}
              targetKeys={targetKeys}
              onChange={onTransferChange}
              onSelectChange={onSelectChange}
              render={(item) => item.title}
            />
          </ProCard>
          <ProCard>
            <ProFormTextArea
              placeholder="请在此处输入未在系统的序列号，一行一个序列号"
              name="newSerNum"
              fieldProps={{
                autoSize: { minRows: 20 },
              }}
            />
          </ProCard>
        </ProCard>
      </ModalForm>
    ) : (
      <InputNumber
        value={inputValue}
        onChange={(e) => {
          setInputValue(e);
          onChange?.({
            length: e - qty,
            checkInventoryQty: e,
            newSerNum: [],
            delSerNum: [],
          });
        }}
        style={{ width: '100%' }}
      />
    );
  }
  return <div />;
};

/**
 * 出库时在库序列号选择器
 * @param onChange
 * @param storeCd
 * @param skuId
 * @param skuName
 * @param visible
 * @param setVisible
 * @param handleOk
 * @constructor
 */
export const SNSelect: React.FC<{
  value?: STORE.SN[];
  onChange?: (value: STORE.SN[]) => void;
  skuId?: K;
  storeCd?: K;
  skuName?: K;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  handleOk: () => void;
}> = ({ onChange, storeCd, skuId, skuName, visible, setVisible, handleOk, value }) => {
  const { storeOptions } = useModel('store', (model) => ({ storeOptions: model.options }));
  const [srks, setSrks] = useState<K[]>(value?.map((i) => i.serNum) || []);
  const columns: ProColumns<STORE.SN>[] = [
    {
      title: '商品',
      dataIndex: 'skuId',
      hideInTable: true,
      search: false,
      renderFormItem: () => <div>{skuName}</div>,
    },
    {
      title: '序列号',
      dataIndex: 'serNum',
      order: 5,
    },
    {
      title: '仓库',
      dataIndex: 'storeCd',
      render: (_, record) => <div>{record.storeName}</div>,
      valueType: 'select',
      initialValue: storeCd,
      request: async () => {
        return storeOptions;
      },
    },
    memoColumns(),
    statusColumns(),
  ];
  const { data, error, loading, run } = useRequest(
    async (params) => {
      const res = await serNumFindList({
        queryFilter: {
          ...params,
          skuId,
          status: 1,
        },
      });
      return {
        data: res.data.rows,
        success: res.code === 0,
      };
    },
    { manual: true },
  );
  useEffect(() => {
    run({ storeCd });
  }, [storeCd]);
  return (
    <Modal width={'1000px'} visible={visible} onCancel={() => setVisible(false)} onOk={handleOk}>
      {data && !error && (
        <ProTable<STORE.SN>
          rowKey="serNum"
          columns={columns}
          loading={loading}
          params={{ skuId }}
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              setSrks(selectedRowKeys);
              onChange?.(selectedRows || []);
            },
            selectedRowKeys: srks,
          }}
          search={baseSearch({
            submit: run,
          })}
          options={false}
          dataSource={data}
        />
      )}
    </Modal>
  );
};

/**
 * 入库时序列号批量输入组件
 * @param value
 * @param onChange
 * @param formRef
 * @param index
 * @param entries
 * @param stockType
 * @constructor
 */
export const SN: React.FC<{
  initValue?: { qty: number; serNumList: STORE.SN[] };
  onChange?: (value: { qty: number; serNumList: STORE.SN[] }) => void;
  stockType: StockType;
  sku: PUR.Entries;
  disabled?: boolean;
}> = ({ initValue: value, onChange, stockType = StockType.入库, sku, ...rest }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [initValues, setInitValues] = useState<STORE.SN[]>(value?.serNumList || []);
  const [editKeys, setEditKeys] = useState<K[]>();
  const { serNumList, skuName } = sku;
  const [inputValue, setInputValue] = useState<number | undefined>(value?.qty);
  const inFormRef = useRef<FormInstance>();
  const handleOk = () => {
    onChange?.({
      qty: inputValue || 0,
      serNumList: initValues || [],
    });
    setVisible(false);
  };
  const handleCancel = () => {
    setVisible(false);
  };
  const columns: ProColumns<STORE.SN>[] = [
    indexColumns,
    {
      title: '操作',
      valueType: 'option',
      width: 50,
      fixed: 'left',
    },
    {
      dataIndex: 'serNum',
      title: '序列号',
    },
    {
      dataIndex: 'desc',
      title: '备注',
    },
  ];
  const handleGetFinalSerNumList = (recordList: STORE.SN[]) => {
    const v = recordList.filter((i) => i.serNum).length;
    setInitValues(recordList);
    setInputValue(v);
  };
  useEffect(() => {
    if (sku.isSerNum) {
      const a = Array.from({ length: 5 }, () => ({
        autoId: +(Math.random() * 1000000).toFixed(0),
        serNum: '',
        memo: '',
      }));
      const serNumListF = serNumList || a;
      setInitValues(() => {
        return serNumListF;
      });
      setEditKeys(() => {
        return serNumListF.map((i) => i.autoId);
      });
    }
  }, [serNumList, sku.isSerNum]);
  return (
    <>
      <Input
        {...rest}
        value={inputValue}
        onClick={() => {
          if (sku.isSerNum) {
            setVisible(true);
          }
        }}
        type="number"
        onChange={(e) => {
          if (!sku.isSerNum) {
            setInputValue(+e.target.value);
            onChange?.({ qty: +e.target.value, serNumList: [] });
          }
        }}
        suffix={
          sku.isSerNum && (
            <div
              style={{ padding: '3px' }}
              className={inputValue ? Style.successBgColor : Style.errorBgColor}
            >
              SN
            </div>
          )
        }
      />
      {sku.isSerNum && (
        <>
          {stockType === StockType.出库 && (
            <SNSelect
              visible={visible}
              setVisible={setVisible}
              skuId={sku.skuId}
              skuName={sku.skuName}
              storeCd={sku.storeCd}
              value={initValues}
              handleOk={handleOk}
              onChange={handleGetFinalSerNumList}
            />
          )}
          {stockType === StockType.入库 && (
            <Modal
              visible={visible}
              width={1000}
              onOk={handleOk}
              onCancel={handleCancel}
              title={stockType === StockType.入库 ? `录入${skuName}的序列号` : '请选择序列号'}
            >
              <ProCard ghost>
                <Space direction={'vertical'}>
                  <ProCard>
                    <ProForm<{
                      prefix: string;
                      startNo: string;
                      creater: number;
                      num: number;
                      serNumInput: string;
                    }>
                      layout={'horizontal'}
                      initialValues={{ startNo: '001', creater: 1 }}
                      submitter={false}
                      formRef={inFormRef}
                      onFinish={async (values) => {
                        let temp = [];
                        if (stockType === StockType.入库) {
                          if (values.serNumInput) {
                            temp = values.serNumInput.split(/[\n\s+,]/g).filter((i) => i);
                          } else {
                            const { prefix, startNo, creater, num } = values;
                            temp = Array.from({ length: num }, (_, i) => {
                              return (
                                prefix +
                                prefixInteger((+startNo + i * creater).toString(), startNo.length)
                              );
                            });
                          }
                          const recordList = temp.map((item) => ({
                            autoId: +(Math.random() * 1000000).toFixed(0),
                            serNum: item,
                            desc: '',
                          }));
                          setEditKeys(recordList.map((i) => i.autoId));
                          setInitValues(recordList);
                          handleGetFinalSerNumList(recordList);
                        }
                      }}
                    >
                      <ProCard ghost>
                        <ProCard colSpan={22} ghost>
                          <ProForm.Group>
                            <ProFormText
                              placeholder={'输入前缀,可以为空'}
                              name={'prefix'}
                              width={'sm'}
                            />
                            <ProFormText name={'startNo'} label={'起始号'} width={'xs'} />
                            <ProFormDigit
                              name={'creater'}
                              width={'xs'}
                              label={'递增量'}
                              fieldProps={{ precision: 0 }}
                            />
                            <ProFormDigit
                              name={'num'}
                              width={'xs'}
                              label={'个数'}
                              fieldProps={{ precision: 0 }}
                            />
                          </ProForm.Group>
                        </ProCard>
                        <ProCard colSpan={2} ghost>
                          <Button
                            type="primary"
                            className={Style.buttonColorSunset}
                            onClick={() => {
                              inFormRef.current?.submit();
                            }}
                          >
                            添加
                          </Button>
                        </ProCard>
                      </ProCard>
                      <ProCard ghost>
                        <ProCard colSpan={22} ghost>
                          <ProFormTextArea
                            name={'serNumInput'}
                            placeholder={
                              '将word excel txt文档中的序列号复制粘贴到此处，支持以【空格、逗号、分号(英文格式)】分隔'
                            }
                          />
                        </ProCard>
                        <ProCard colSpan={2} ghost>
                          <Button
                            type="primary"
                            className={Style.buttonColorSunset}
                            onClick={() => {
                              inFormRef.current?.submit();
                            }}
                          >
                            添加
                          </Button>
                        </ProCard>
                      </ProCard>
                    </ProForm>
                  </ProCard>
                  <EditableProTable
                    rowKey="autoId"
                    columns={columns}
                    bordered
                    value={initValues}
                    recordCreatorProps={{
                      newRecordType: 'dataSource',
                      record: () => ({
                        autoId: +(Math.random() * 1000000).toFixed(0),
                        serNum: '',
                        desc: '',
                        serId: '',
                      }),
                    }}
                    editable={{
                      editableKeys: editKeys,
                      type: 'multiple',
                      onValuesChange: (record, recordList) => {
                        handleGetFinalSerNumList(recordList);
                      },
                      onChange: setEditKeys,
                      actionRender: (row, config, defaultDom) => [defaultDom.delete],
                    }}
                    rowSelection={false}
                    scroll={{ x: 900 }}
                  />
                </Space>
              </ProCard>
            </Modal>
          )}
        </>
      )}
    </>
  );
};

export default () => {
  const columns: ProColumns<STORE.SN>[] = [
    {
      title: '单据日期',
      dataIndex: 'date',
      valueType: 'dateRange',
      render: (_, record) => <div>{record.date}</div>,
    },
    {
      title: '商品编号',
      dataIndex: 'code',
      search: false,
    },
    {
      title: '商品',
      dataIndex: 'spuName',
    },
    {
      title: '规格型号',
      dataIndex: 'skuName',
      search: false,
    },
    {
      title: '序列号',
      dataIndex: 'serNum',
    },
    {
      title: '仓库',
      dataIndex: 'storeCd',
      search: false,
      render: (_, record) => <div>{record.storeName}</div>,
    },
    {
      title: '单据编号',
      dataIndex: 'billNo',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: new Map([
        [0, { text: '出库', status: 'Processing' }],
        [1, { text: '在库', status: 'Success' }],
      ]),
    },
    memoColumns(),
  ];
  const actionRef = useRef<ActionType>();
  return (
    <PageContainer
      content={
        <ProTable<STORE.SN>
          rowKey="serNum"
          pagination={{
            total: 10,
          }}
          actionRef={actionRef}
          columns={columns}
          request={async (params) => {
            const response = await serNumDetail(params);
            return {
              data: response.data.rows,
              success: response.code === 0,
              total: response.data.total,
            };
          }}
        />
      }
    />
  );
};
