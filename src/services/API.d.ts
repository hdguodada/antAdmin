declare namespace API {
  export type Dep = {
    DepId?: number;
    DepName: string;
    PDepId?: number;
    PDepName: string | null;
    Leader: string;
    Phone: string;
    Level?: number;
    Memo: string;
    SortNum: number;
    State: number;
    StateName?: string;
  };
  export type DepList = {
    rows: Dep[];
    total: number;
    pageSize: number;
    pageNumber: number;
  };
  export type UserRole = {
    RoleId: string;
    RoleName: string;
    RoleDesc: string;
    SortNum: number;
    State: number;
    StateName: string;
    funAuth: number[] | null;
    dataAuth: number[] | null;
  };
  export type UserRoleList = {
    rows: UserRole[];
    total: number;
    pageSize: number;
    pageNumber: number;
  };
  export type CurrentUser = {
    UserName: string;
    RealName: string;
    Mobile: string;
    DepName?: string;
    LastLogin?: string;
    LoginCnt?: number;
    UserId?: number | string;
    name?: string;
    PassWord?: string;
    Email?: string;
  };

  export type UserList = {
    rows: CurrentUser[];
    total: number;
    pageSize: number;
    pageNumber: number;
  };

  export type LoginStateType = {
    code: number;
    loginResultInfo: {
      token: string;
      RealName: string;
      UserName: string;
      UserId: number;
    };
    msg: string;
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
  export type Routers = any;
}
