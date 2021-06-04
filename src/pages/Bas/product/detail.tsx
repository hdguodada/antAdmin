import { addProduct, queryProductInfo, queryProductTypesInfo, updProduct } from '@/services/Bas';
import { getCode, getCodeList } from '@/services/Sys';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { patternMsg } from '@/utils/validator';
import ProCard from '@ant-design/pro-card';
import ProForm, {
  ProFormCheckbox,
  ProFormDependency,
  ProFormSelect,
  ProFormSlider,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProFormUploadDragger,
} from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import type { FormInstance } from 'antd';
import { Upload, Tooltip, Space, message, Button, Select, Input, Image } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useModel, useParams, useRequest, history, useLocation } from 'umi';
import Style from '@/global.less';
import GlobalWrapper from '@/components/GlobalWrapper';
import { optionColumns } from '@/utils/columns';
import { ProductBrandSelect, ProductTypeTreeSelect, StoreSelect } from '@/utils/form';

const { Option } = Select;

export const ImageEdit: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
}> = ({ onChange }) => {
  const [inputValue, setInputValue] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <Upload
      listType="picture-card"
      showUploadList={false}
      action={`${BASE_URL}/sys/upload/upload?type=prodImage`}
      headers={{ modId: '92' }}
      onChange={(info) => {
        if (info.file.status === 'uploading') {
          setLoading(true);
        }
        if (info.file.status === 'done') {
          setLoading(false);
          setInputValue(info.file.response.data.path);
          onChange?.(info.file.response.data.path);
        }
      }}
    >
      {inputValue ? (
        <Image src={BASE_URL + inputValue} alt="avatar" width={102} height={102} />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

const PriceEdit: React.FC<{
  value?: BAS.Spu['priceList'];
  onChange?: (value: BAS.Spu['priceList']) => void;
}> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState<BAS.Spu['priceList'] | undefined>(value);
  return (
    <Space direction="vertical">
      {inputValue?.unitPrices ? (
        <>
          {inputValue.unitPrices.map((unit, index) => (
            <Input
              suffix={unit.unitName}
              type="number"
              key={unit.autoId}
              value={unit.price}
              onChange={(e) => {
                const newUnitPrices = inputValue.unitPrices?.map((item, _index) =>
                  _index === index ? { ...item, price: +e.target.value } : item,
                );
                if (newUnitPrices) {
                  setInputValue({
                    ...inputValue,
                    unitPrices: newUnitPrices,
                  });
                  onChange?.({
                    ...inputValue,
                    unitPrices: newUnitPrices,
                  });
                }
              }}
            />
          ))}
        </>
      ) : (
        ''
      )}
    </Space>
  );
};

export const AttrValuesSelect: React.FC<{
  value?: {
    attrValueId: string | number;
    attrValueName: string;
  }[];
  options: any;
  onChange?: (value: { attrValueId: string | number; attrValueName: string }[]) => void;
}> = ({ value, onChange, options }) => {
  const [inputValue, setInputValue] = useState(value?.map((i) => i.attrValueId));
  return options ? (
    <Select
      mode="multiple"
      value={inputValue}
      onChange={(_, option) => {
        setInputValue(_);
        onChange?.(
          option.map((i: any) => ({
            attrValueId: i.value,
            attrValueName: i.children,
          })),
        );
      }}
    >
      {options.map((i: BAS.AttrVaue) => (
        <Option key={i.attrValueId} value={i.attrValueId}>
          {i.attrValueName}
        </Option>
      ))}
    </Select>
  ) : (
    <Input />
  );
};

export const UnitSelect: React.FC<{
  value?: BAS.Unit['unitMid'];
  options: any;
  onChange?: (value: BAS.Unit['unitMid']) => void;
}> = ({ value, onChange, options }) => {
  const [inputValue, setInputValue] = useState(value);
  return (
    <Select
      options={options}
      value={inputValue}
      labelInValue
      onChange={(e) => {
        setInputValue(e);
        onChange?.(e);
      }}
    />
  );
};

export const ProductDetail = () => {
  const formRef = useRef<FormInstance>();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isNew = id === 'new';
  const mulspecListTableRef = useRef<ActionType>();
  // 全局模块的加载 Start

  const { unitOptions } = useModel('unit', (model) => ({
    unitOptions: model.options,
  }));
  const { brandOptions } = useModel('brand', (model) => ({
    brandOptions: model.options,
  }));
  const { typeOption } = useModel('options', (model) => ({
    typeOption: model.typeOption,
  }));
  const { custLevel } = useModel('custLevel', (model) => ({
    custLevel: model.levelFilter(),
  }));
  const { storeOptions } = useModel('store', (model) => ({
    storeOptions: model.options,
  }));
  const { attrListOptions, allAttrList } = useModel('attr', (model) => ({
    attrListOptions: model.options,
    allAttrList: model.list,
  }));

  const initUnitList: BAS.Unit[] = [
    { unitId: '', rate: 1, autoId: +(Math.random() * 1000000).toFixed(0), unitName: '' },
  ];
  const transAttrList = (arr: BAS.Attr[]) =>
    arr.map((item) =>
      item.attrValues.map((j: any) => ({
        attrId: item.attrId,
        attrName: item.attrName,
        attrValueId: j.attrValueId,
        attrValueName: j.attrValueName,
      })),
    );
  function generateAttrList(arr: any): any {
    const len = arr.length;
    if (len >= 2) {
      // 第一个数组的长度
      const len1 = arr[0].length;
      // 第二个数组的长度
      const len2 = arr[1].length;
      // 2个数组产生的组合数
      const lenBoth = len1 * len2;
      //  申明一个新数组
      const items = new Array(lenBoth);
      // 申明新数组的索引
      let index = 0;
      for (let i = 0; i < len1; i += 1) {
        for (let j = 0; j < len2; j += 1) {
          if (arr[0][i] instanceof Array) {
            // @ts-ignore
            items[index] = arr[0][i].concat(arr[1][j]);
          } else {
            items[index] = [arr[0][i]].concat(arr[1][j]);
          }
          index += 1;
        }
      }
      const newArr = new Array(len - 1);
      for (let i = 2; i < arr.length; i += 1) {
        newArr[i - 1] = arr[i];
      }
      newArr[0] = items;
      return generateAttrList(newArr);
    }
    return arr[0];
  }
  // 表单初始化字段
  const [initialValues, setInitialValues] = useState<Partial<BAS.Spu>>({
    unitList: initUnitList,
    selectedValueList: [],
    unitListText: [],
    albumList: [],
  });
  // 计量单位
  const [unitListEditableKeys, setUnitListEditableKeys] = useState<React.Key[]>(() =>
    initUnitList.map((item) => {
      return item.autoId;
    }),
  );
  const [specListEditableKeys, setSpecListEditableKeys] = useState<React.Key[]>([]);
  const [prodColumns, setProdColumns] = useState<ProColumns<BAS.mulspecListItem>[]>();
  const specColumns: ProColumns<BAS.Attr>[] = [
    {
      dataIndex: 'attrId',
      title: '规格',
      renderFormItem: () => <Select options={attrListOptions} />,
      render: (_, row) => <a>{row.attrName}</a>,
      width: 200,
      editable: false,
    },
    {
      dataIndex: 'attrValues',
      title: '规格值',
      width: 500,
      renderFormItem: (_row, { recordKey }) => {
        return (
          <AttrValuesSelect
            options={
              allAttrList?.find((i) => {
                return i.attrId === recordKey;
              })?.attrValues
            }
          />
        );
      },
    },
  ];
  const updReload = async () => {
    const res = await queryProductInfo(id);
    const unitList: BAS.Unit[] = res.data.unitList.map((unit) => ({
      ...unit,
      autoId: +(Math.random() * 1000000).toFixed(0),
      unitMid: {
        key: String(unit.unitId),
        label: unit.unitName,
        value: unit.unitId,
      },
    }));
    const mulspecList = res.data.mulspecList.map((mul) => ({
      ...mul,
      autoId: +(Math.random() * 1000000).toFixed(0),
      priceList: mul.priceList.map((price) => ({
        ...price,
        unitPrices: price.unitPrices?.map((unit) => ({
          ...unit,
          autoId: +(Math.random() * 1000000).toFixed(0),
        })),
      })),
    }));
    setSpecListEditableKeys(res.data.selectedValueList.map((i) => i.attrId as React.Key));
    setUnitListEditableKeys(unitList.map((i) => i.autoId));
    setInitialValues({
      ...res.data,
      mulspecList,
      unitList,
      albumList: res.data.albumList.map((alb) => ({
        ...alb,
        uid: +(Math.random() * 1000000).toFixed(0),
      })),
    });
    return {
      data: {
        ...res.data,
        mulspecList,
        unitList,
        albumList: res.data.albumList.map((alb) => ({
          ...alb,
          uid: +(Math.random() * 1000000).toFixed(0),
        })),
      },
      success: true,
    };
  };
  const { run, loading, refresh } = useRequest(
    async () => {
      const baseLevelColumns: ProColumns<BAS.mulspecListItem>[] = [
        optionColumns({
          fixed: 'left',
          modify: async ({ record, action }) => {
            action.startEditable(record.autoId);
          },
          width: 100,
        }),
        {
          dataIndex: 'skuImageUrl',
          title: '主图',
          width: 80,
          renderFormItem: () => {
            return <ImageEdit />;
          },
          render: (_, record) => <Image src={record.skuImageUrl} />,
        },
        {
          dataIndex: 'skuCode',
          title: '商品条码',
          width: 120,
          editable: false,
        },
        {
          dataIndex: 'skuName',
          title: 'Sku名称',
          copyable: true,
          editable: false,
          width: 100,
        },
      ];
      setProdColumns(() => {
        return baseLevelColumns.concat(
          custLevel.map((item, index) => ({
            dataIndex: ['priceList', index],
            width: 150,
            title: () => (
              <Space>
                {item.levelName}
                <a>{item.discount}%</a>
              </Space>
            ),
            renderFormItem: () => {
              return <PriceEdit />;
            },
            render: (_) => {
              return (
                <Space direction="vertical">
                  {(_ as BAS.Spu['priceList'])?.unitPrices?.map((unit) => (
                    <Input key={unit.autoId} value={unit.price} suffix={unit.unitName} readOnly />
                  ))}
                </Space>
              );
            },
          })),
        );
      });
      if (id !== 'new') {
        return updReload();
      }
      const cateId = +(location as any).query.cateId;
      const res = await getCode('BarCode'); // 产品条码
      const spuCode = (await getCode('ProdCd')).data; // 产品编码
      const mulspecList = [
        {
          autoId: +(Math.random() * 1000000).toFixed(0),
          skuCode: res.data,
          skuImageUrl: '',
          attrList: [],
          priceList: custLevel.map((level) => ({
            levelId: level.levelId,
            levelName: level.levelName,
            discount: level.discount,
            unitPrices: [],
          })),
        },
      ];
      const selectedValueList =
        cateId > -1 ? (await queryProductTypesInfo(cateId)).data.attrList : [];
      setSpecListEditableKeys(selectedValueList.map((item) => item.attrId as React.Key));
      return {
        success: true,
        data: {
          ...initialValues,
          mulspecList,
          spuCode,
          cateId: cateId > 0 ? cateId : undefined,
          selectedValueList,
        },
      };
    },
    {
      manual: true,
      onSuccess(values) {
        formRef.current?.setFieldsValue(values);
      },
    },
  );
  useEffect(() => {
    run();
  }, [id, run]);

  /**
   * 根据单位列表和规格列表生成 mulspecList
   */
  const generateMulspecList = async (
    isMulSpec: number,
    unitList: BAS.Spu['unitList'],
    selectedValueList: BAS.Spu['selectedValueList'],
    spuName: string,
  ): Promise<boolean> => {
    if (!unitList[0].unitId) {
      // 没有输入基本单位
      message.error('请先选择计量单位');
      return false;
    }
    if (isMulSpec) {
      const attrList = transAttrList(selectedValueList);
      const a: {
        attrId: React.Key;
        attrValueId: React.Key;
        attrName: string;
        attrValueName: string;
      }[][] = attrList.length === 1 ? attrList[0].map((i) => [i]) : generateAttrList(attrList);
      const codeList = (await getCodeList('BarCode', a.length)).data;
      // @ts-ignore
      const newMulspecList: BAS.Spu['mulspecList'] = a.map((item, index) => {
        return {
          autoId: +(Math.random() * 1000000).toFixed(0),
          skuCode: codeList[index],
          skuImageUrl: '',
          attrList: item,
          skuName: `${spuName}: ${item.map((i) => i.attrValueName).join('-')}`,
          priceList: custLevel.map((level) => ({
            ...level,
            unitPrices: unitList?.map((unit) => ({
              ...unit,
              price: unit.price || undefined,
            })),
          })),
        };
      });
      if (isNew) {
        // 如果是新增商品, 则直接替换全新的mulspecList
        formRef.current?.setFieldsValue({
          mulspecList: newMulspecList,
        });
      } else {
        // 如果是修改商品,则需比对后插入,原数据不应该有变化,新生成的条目插入底部.
        const oldMulspecList = initialValues.mulspecList;
        const mulspecList = newMulspecList.map((newMul) => {
          const ttt = oldMulspecList?.find((oldMul) => {
            return (
              oldMul.attrList?.reduce((c, d) => `${c}${d.attrId}-${d.attrValueId}:`, '') ===
              newMul.attrList?.reduce((c, d) => `${c}${d.attrId}-${d.attrValueId}:`, '')
            );
          });
          if (ttt?.skuId) {
            return {
              ...newMul,
              skuId: ttt.skuId,
            };
          }
          return newMul;
        });
        formRef.current?.setFieldsValue({
          mulspecList,
        });
      }
    } else if (isNew) {
      const code = (await getCode('BarCode')).data;
      const mulspecList = [
        {
          autoId: +(Math.random() * 1000000).toFixed(0),
          skuCode: code,
          skuName: formRef.current?.getFieldValue('spuName'),
          skuImageUrl: '',
          attrList: '',
          priceList: custLevel.map((level) => ({
            levelId: level.levelId,
            levelName: level.levelName,
            discount: level.discount,
            unitPrices: unitList?.map((unit) => ({
              ...unit,
              price: unit.price || undefined,
            })),
          })),
        },
      ];
      formRef.current?.setFieldsValue({
        mulspecList,
      });
    } else {
      const oldMulspecList = initialValues.mulspecList;
      const mulspecList = oldMulspecList?.map((item) => ({
        ...item,
        priceList: custLevel.map((level) => ({
          levelId: level.levelId,
          levelName: level.levelName,
          discount: level.discount,
          unitPrices: unitList?.map((unit) => ({
            ...unit,
            price: unit.price || undefined,
          })),
        })),
      }));
      formRef.current?.setFieldsValue({
        mulspecList,
      });
    }
    message.success('生成组合成功');
    return true;
  };
  return (
    <PageContainer
      title={isNew ? '新建商品' : initialValues.spuName}
      footer={[
        <Button
          key="rest"
          onClick={() => {
            refresh();
          }}
          loading={loading}
        >
          重置
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            formRef.current?.submit();
          }}
          loading={loading}
        >
          提交
        </Button>,
      ]}
      content={
        <ProForm<BAS.Spu>
          formRef={formRef}
          submitter={false}
          initialValues={initialValues}
          onValuesChange={async (values) => {
            if (values.isMulUnit !== undefined) {
              const checked: boolean = values.isMulUnit;
              if (checked) {
                // 勾选多单位 -- > 取当前unitList
                const curUnitList: BAS.Spu['unitList'] = formRef.current?.getFieldValue('unitList');
                const preUnitList = curUnitList.concat([
                  {
                    unitId: '',
                    rate: 2,
                    autoId: +(Math.random() * 1000000).toFixed(0),
                    unitName: '',
                  },
                ]);
                setUnitListEditableKeys(() => preUnitList.map((i) => i.autoId));
                formRef.current?.setFieldsValue({
                  unitList: preUnitList,
                });
              } else {
                const curUnitList: BAS.Spu['unitList'] = formRef.current?.getFieldValue('unitList');
                formRef.current?.setFieldsValue({
                  unitList: curUnitList.slice(0, 1),
                });
              }
            }
            if (values.unitList !== undefined) {
              const recordList: BAS.Unit[] = values.unitList;
              const unitList = recordList.map((item) => ({
                ...item,
                unitId: item.unitMid?.value,
                unitName: item.unitMid?.label,
              }));
              // const mulspecList:
              //   | BAS.Spu['mulspecList']
              //   | undefined = formRef.current?.getFieldValue('mulspecList');
              // 为mulspecList的priceList 赋值
              formRef.current?.setFieldsValue({
                unitList,
                // mulspecList: mulspecList?.map((mul) => ({
                //   ...mul,
                //   priceList: mul.priceList.map((price) => ({
                //     ...price,
                //     unitPrices: unitList.map((unit, index) => ({
                //       ...unit,
                //       price: price.unitPrices?.[index]?.price,
                //     })),
                //   })),
                // })),
              });
            }
          }}
          onFinish={async (values) => {
            const submitForm = {
              ...values,
              albumList:
                values.albumList.map((item) => ({
                  url: item.response?.data?.path || item.url,
                })) || [],
            };
            if (isNew) {
              const res = await addProduct(submitForm);
              history.push(`/bas/product/${res.data.id}`);
            } else {
              await updProduct(submitForm);
              message.success('修改商品成功');
              refresh();
            }
          }}
        >
          <ProFormText width="md" name="spuId" label="spuId" disabled hidden />
          <ProForm.Group title="基本信息">
            <ProFormText
              width="md"
              name="spuName"
              label="商品名称"
              rules={patternMsg.text('商品名称')}
            />
            <ProductBrandSelect
              showNew
              width="md"
              name="brandId"
              label="品牌"
              options={brandOptions}
              rules={patternMsg.select('商品名称')}
            />
            <ProForm.Item
              label="商品类别"
              name="cateId"
              style={{ width: '328px' }}
              rules={patternMsg.select('商品类别')}
            >
              <ProductTypeTreeSelect
                isLeaf
                showNew
                fieldProps={{
                  onSelect: async (_, option) => {
                    if (!option.attrList.length) {
                      message.warn('此类别下没有属性');
                    }
                    setSpecListEditableKeys(
                      (option.attrList as BAS.Attr[]).map((item) => item.attrId as React.Key),
                    );
                    formRef.current?.setFieldsValue({
                      selectedValueList: option.attrList,
                    });
                  },
                }}
              />
            </ProForm.Item>
            <ProFormText
              label="商品编号"
              name="spuCode"
              width="md"
              rules={patternMsg.text('商品编号')}
            />
            <StoreSelect
              showNew
              width="md"
              name="storeCd"
              label="首选仓库"
              options={storeOptions}
              rules={patternMsg.select('仓库')}
            />
            <ProFormText width="md" name="keyword" label="搜索关键字" />
            <ProFormSelect
              mode="multiple"
              width="md"
              name="prodTag"
              label="商品标签"
              options={typeOption('ProdTag')}
            />
            <ProFormSwitch label="启用序列号管理" name="isSerNum" />
            <ProFormSwitch label="启用有效期管理" name="isWarranty" />
            <ProFormSlider label="排序" width="md" name="sortNum" max={100} min={1} />
            <ProFormTextArea label="备注" width="lg" name="memo" />
          </ProForm.Group>
          <ProForm.Group title="价格设置">
            <ProCard>
              <ProFormText label="基准价格" width="md" name="basePrice" required />
            </ProCard>
          </ProForm.Group>
          <ProCard ghost>
            {/* 多单位 Start */}
            <ProCard>
              <ProFormCheckbox name="isMulUnit" label="启用多单位" />
              <ProFormDependency name={['isMulUnit']}>
                {({ isMulUnit }) => (
                  <ProForm.Item name="unitList" trigger="onValuesChange">
                    <EditableProTable<BAS.Unit>
                      rowKey="autoId"
                      recordCreatorProps={
                        isMulUnit
                          ? {
                              newRecordType: 'dataSource',
                              record: () => ({
                                autoId: Date.now(),
                                unitId: '',
                                unitName: '',
                              }),
                            }
                          : false
                      }
                      bordered
                      columns={[
                        {
                          dataIndex: 'unitMid',
                          title: () => (
                            <div>
                              <span className={Style['error-color']}>*</span>单位
                            </div>
                          ),
                          renderFormItem: () => {
                            const curUnitList: number[] = formRef.current
                              ?.getFieldValue('unitList')
                              .map((i: any) => i.unitId);
                            const options = unitOptions.map((item) => ({
                              ...item,
                              disabled: curUnitList.indexOf(+item.value) > -1,
                            }));
                            return <UnitSelect options={options} />;
                          },
                          width: '50%',
                        },
                        {
                          dataIndex: 'rate',
                          title: '比例',
                          valueType: 'digit',
                          width: '40%',
                        },
                        {
                          dataIndex: 'option',
                          title: '操作',
                          valueType: 'option',
                        },
                      ]}
                      maxLength={3}
                      editable={{
                        type: 'multiple',
                        editableKeys: unitListEditableKeys,
                        onChange: setUnitListEditableKeys,
                        actionRender: (row, config, defaultDom) => [defaultDom.delete],
                      }}
                    />
                  </ProForm.Item>
                )}
              </ProFormDependency>

              <ProFormDependency name={['isMulUnit', 'unitList']}>
                {({ isMulUnit, unitList }) => {
                  return (
                    isMulUnit && (
                      <>
                        <ProForm.Group>
                          <ProFormSelect
                            label="默认入库单位"
                            name="inLocationUnitId"
                            width="md"
                            options={unitList.map((item: any) => ({
                              label: item.unitName,
                              value: item.unitId,
                            }))}
                          />
                          <ProFormSelect
                            label="默认出库单位"
                            name="outLocationUnitId"
                            width="md"
                            options={unitList.map((item: any) => ({
                              label: item.unitName,
                              value: item.unitId,
                            }))}
                          />
                        </ProForm.Group>
                      </>
                    )
                  );
                }}
              </ProFormDependency>
            </ProCard>
            {/* 多单位 End */}
            <ProCard>
              <ProFormDependency name={['cateId']}>
                {({ cateId }) => (
                  <ProFormCheckbox
                    tooltip="选择商品类别后可启用多规格"
                    disabled={!cateId || !isNew}
                    labelAlign="right"
                    name="isMulSpec"
                    label="启用多规格"
                  />
                )}
              </ProFormDependency>
              <ProFormDependency name={['isMulSpec']}>
                {({ isMulSpec }) => {
                  return isMulSpec ? (
                    <ProForm.Item name="selectedValueList">
                      <EditableProTable
                        rowKey="attrId"
                        bordered
                        recordCreatorProps={false}
                        columns={specColumns}
                        editable={{
                          type: 'multiple',
                          editableKeys: specListEditableKeys,
                          onChange: setSpecListEditableKeys,
                          onValuesChange: async (record, recordList) => {
                            formRef.current?.setFieldsValue({
                              selectedValueList: recordList,
                            });
                          },
                        }}
                      />
                    </ProForm.Item>
                  ) : (
                    <ProFormText name="spec" label="商品规格" width="lg" />
                  );
                }}
              </ProFormDependency>
            </ProCard>
          </ProCard>
          <ProFormDependency name={['isMulSpec', 'selectedValueList', 'unitList', 'spuName']}>
            {({ isMulSpec, selectedValueList, unitList, spuName }) => {
              return (
                <ProForm.Item name="mulspecList" trigger="onValuesChange">
                  <EditableProTable<BAS.mulspecListItem>
                    bordered
                    headerTitle={
                      <Space align="start">
                        <Tooltip key="1" title="根据规格和计量单位自动生成商品组合">
                          <Button
                            type="primary"
                            onClick={async () => {
                              await generateMulspecList(
                                isMulSpec,
                                unitList,
                                selectedValueList,
                                spuName,
                              );
                            }}
                          >
                            重新生成组合
                          </Button>
                        </Tooltip>
                        <Tooltip key="2" title="根据基准价格批量设置">
                          <Button
                            onClick={() => {
                              const mulspecList: BAS.Spu['mulspecList'] = formRef.current?.getFieldValue(
                                'mulspecList',
                              );
                              const basePrice: BAS.Spu['basePrice'] =
                                formRef.current?.getFieldValue('basePrice') || 0;
                              if (mulspecList) {
                                try {
                                  formRef.current?.setFieldsValue({
                                    mulspecList: mulspecList.map((mul) => ({
                                      ...mul,
                                      priceList: mul.priceList.map((price) => ({
                                        ...price,
                                        unitPrices: price.unitPrices?.map((unit) => {
                                          return {
                                            ...unit,
                                            price:
                                              (basePrice * (unit.rate || 0) * price.discount) / 100,
                                          };
                                        }),
                                      })),
                                    })),
                                  });
                                  message.success('批量设置价格成功');
                                } catch (e) {
                                  message.warn(e);
                                }
                              } else {
                                message.warn('生成商品组合后再批量设置价格');
                              }
                            }}
                          >
                            批量设置价格
                          </Button>
                        </Tooltip>
                      </Space>
                    }
                    actionRef={mulspecListTableRef}
                    scroll={{ x: 2000 }}
                    rowKey="autoId"
                    recordCreatorProps={false}
                    columns={prodColumns}
                    editable={{
                      type: 'multiple',
                      actionRender: (row, config, defaultDom) => [defaultDom.save],
                    }}
                  />
                </ProForm.Item>
              );
            }}
          </ProFormDependency>
          <ProForm.Group title="商品图片">
            <ProFormUploadDragger
              width="lg"
              name="albumList"
              action={`${BASE_URL}/sys/upload/upload?type=prodImage`}
              fieldProps={{
                listType: 'picture-card',
              }}
            />
          </ProForm.Group>
        </ProForm>
      }
    />
  );
};

export default function ProductPage() {
  return (
    <GlobalWrapper type="descriptions">
      <ProductDetail />
    </GlobalWrapper>
  );
}
