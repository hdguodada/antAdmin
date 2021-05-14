declare namespace FUND {
  export type Entries = {
    autoId: K;
    raccttype?: K;
    amount?: number;
    remark?: string;
  };
  export type Accounts = {
    autoId: K;
    accountId?: K;
    accountName?: string;
    payment?: number;
    settlement?: K;
    settlementName?: string;
    settlementNo?: string;
    remark?: string;
    recAccountName?: string;
    recAccountId?: K;
    payAccountName?: K;
    payAccountId?: K;
    amount?: number;
  };
  export type fundItem = {
    date: string | number;
    billNo: K;
    billId: K;
    amount: number; // 采购金额
    contactName: string;
    crtName: string;
    checkName: string;
    acceptedAmount: number;
    billStatus: number;
    memo: string;
    custId?: K;
    entries?: Entries[];
    accounts?: Accounts[];
    rpAmount: number; // 收款金额
    accountId: K;
    totalAmount: number; // 合计
    arrears: number; // 本次欠款
    checkStatus?: 1 | 2 | 3; // 审核状态
  };
}
