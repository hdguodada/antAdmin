declare namespace API {
  export type CurrentUser = {
    RealName: string;
    Mobile: string;
    DepName: string;
    LastLogin: string;
    LoginCnt: number;
    UserId: number;
  };

  export type UserList = {
    rows: CurrentUser[];
    total: number;
    pageSize: number;
    pageNumber: number;
  }

  export type LoginStateType = {
    code: number;
    loginResultInfo: {
      token: string;
      RealName: string;
      UserName: string;
      UserId: number;
    }
    msg: string
  };

  export type NoticeIconData = {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  };
  export type Routers = any
}
