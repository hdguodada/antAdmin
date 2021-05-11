declare namespace FUND {
  export type Entries = {
    autoId: React.Key;
    Raccttype?: React.Key;
    amount?: number;
    memo?: string;
  };
  export type Accounts = {
    autoId: React.Key;
    accountId?: React.Key;
    payment?: number;
    settlement?: React.Key;
    settlementNo?: string;
    memo?: string;
  };
  export type fundItem = {
    date: string | number;
    billNo: React.Key;
    billId: React.Key;
    amount: number; // 采购金额
    contactName: string;
    crtName: string;
    checkName: string;
    acceptedAmount: number;
    billStatus: number;
    memo: string;
    custId?: React.Key;
    entries?: Entries[];
    accounts?: Accounts[];
    rpAmount: number; // 收款金额
    accountId: React.Key;
    totalAmount: number; // 合计
    arrears: number; // 本次欠款
    checkStatus?: 1 | 2 | 3; // 审核状态
  };
}
