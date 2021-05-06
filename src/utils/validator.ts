import type { Rule } from 'antd/lib/form';

export const patternMsg = {
  select: (name: string) => [{ required: true, message: `请选择${name}` }],
  text: (name: string) => [{ required: true, message: `请输入${name}` }],
  EditTable: (name: string): Rule[] => [{ required: true, message: `请输入${name}` }],
};
