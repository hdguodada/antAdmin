export const patternMsg = {
  select: (name: string) => [{ required: true, message: `请选择${name}` }],
  text: (name: string) => [{ required: true, message: `请输入${name}` }],
};
