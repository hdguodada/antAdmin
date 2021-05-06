declare namespace Sale {
  export type xhdd = PUR.base & {
    srcXhdBillNo: { billId: React.Key; billNo: React.Key }[]; // 关联销货单
  } & DefaultField;
}
