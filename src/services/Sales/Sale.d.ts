declare namespace Sale {
  export type xhdd = PUR.base & {
    srcXhdBillNo: { billId: K; billNo: K }[]; // 关联销货单
  } & DefaultField;
}
