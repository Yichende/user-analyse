// @ts-ignore
/* eslint-disable */

declare namespace API {
  type UserRegisterParams = {
    account: string;
    password: string;
    contains?: string;
    role: string;
  };

  type CurrentUser = {
    username?: string;
    avatar?: string;
    role?: string;
    user_id?: string;
    account?: string;
    token?: string;
  };

  type UserUpdated = {
    user_id: number;
    account: string;
    username: string;
    role: string;
  };

  type UserNameUpdate = {
    account: string;
    username: string;
  }

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  // -----------------Mock
  type VisitedBehavior = {
    user_id: number;
    visited_time: string;
    visited_target: string;
    duration_minutes: number;
  };

  type PurchaseBehavior = {
    user_id: number;
    purchase_time: string;
    purchased_product: string;
    quantity: number;
    total_amount: number;
  };

  type SearchBehavior = {
    user_id: number;
    search_time: string;
    search_query: string;
    results_count: number;
  };

  type CommentBehavior = {
    user_id: number;
    comment_time: string;
    comment_target: string;
    rating: number;
    comment: string;
  };

  type InteractBehavior = {
    user_id: number;
    interact_time: string;
    interact_target: string;
    interact_type: string;
  }
  // -----------------

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
