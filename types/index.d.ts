import Transaction from "../src/libs/transaction";
import Bulk from "../src/libs/bulk";
import {Blob} from "buffer";

declare module "*/config.json" {
  interface ConfigData {
    userId: string;
    apiKey: string;
    from: {
      email: string;
      name: string;
    },
    to: string;
  }

  const value: ConfigData;
  export = value;
}

export type RequestParamsBulkBegin = {
  from: {
    email: string,
    name: string,
  },
  subject: string,
  encode: string,
  text_part: string,
  html_part: string,
  attachments?: Attachment[],
  file?: Attachment,
  list_unsubscribe?: {
    mailto?: string;
    url?: string;
  }
};

export type InsertCode = {
  key: string,
  value: string,
};

export type Unsubscribed = {
  email?: string;
  url?: string;
}

export type UnsubscribedParmas = {
  mailto?: string;
  url?: string;
}

export type BulkUpdateTo = {
  email: string,
  insert_code?: InsertCode[],
}

export type UsageResponseDataFormat = {
  month: number;
  current: number;
  remaining: number;
  update_time: string;
  plan_id: string;
}

export type UsageResponseFormat = {
  data: UsageResponseDataFormat[];
}

export type RequestParamsFile = {
  file: Attachment,
}

export type RequestParamsUsage = {
  month_ago: number,
}

export type RequestParamsBulkUpdate = {
  from: {
    email: string,
    name: string,
  },
  to?: BulkUpdateTo[],
  subject: string,
  text_part: string,
  html_part: string,
  list_unsubscribe?: UnsubscribedParmas,
};

export type RequestParamsBulkCommit = {
  reservation_time?: string,
}

export type RequestParamsTransaction = {
  from: {
    email: string,
    name: string,
  },
  to: string,
  cc?: string[],
  bcc?: string[],
  insert_code?: InsertCode[],
  subject: string,
  encode?: string,
  text_part: string,
  html_part?: string,
  attachments?: Attachment[],
  list_unsubscribe?: UnsubscribedParmas,
};

export type RequestParamsBulkImport = {
  file?: Attachment
}

export type Attachment = Blob | Buffer | string;

export type BEReturnType = Transaction | Bulk;

export type RequestParams = RequestParamsTransaction |
  RequestParamsBulkBegin |
  RequestParamsBulkUpdate |
  RequestParamsBulkCommit |
  RequestParamsFile |
  RequestParamsUsage |
  RequestParamsEmailCreate |
  SearchLogCondition |
  {binary: boolean};

export type SuccessJsonFormat = {
  delivery_id?: number,
  job_id?: number,
};

export type SuccessFormat = SuccessJsonFormat | Buffer;


export type JobResponseFormat = {
  percentage: number,
  status: string,
  success_count: number,
  failed_count: number,
  total_count: number,
  error_file_url: string,
};

export type GetResponseFormat = {
  delivery_id: number,
  from: {
    email: string,
    name: string,
  },
  delivery_type: string,
  status: string,
  subject: string,
  total_count: number,
  sent_count: number,
  drop_count: number,
  hard_error_count: number,
  soft_error_count: number,
  open_count: number,
  text_part: string,
  html_part: string,
  attaches: [unknown],
  delivery_time?: string,
  reservation_time?: string,
  created_time: string,
  updated_time: string,
}

export type GetEmailResponseFormat = {
  email_id: number,
  email: string,
  delivery_id: number,
  insert_code: [InsertCode],
  created_time: string,
  updated_time: string,
}

export type RequestParamsEmailCreate = {
  email: string,
  insert_code: {[key: string]: string}[],
}

export type CreateEmailResponseFormat = {
  email_id: number,
}

export type GetReportResponseFormat = {
  percentage: number,
  status: string,
  total_count: number,
  mail_open_file_url: string,
}


export type GetErrorReportResponseFormat = {
  percentage: number,
  status: string,
  total_count: number,
  error_file_url: string,
}

export type MailConfig = {
  to: {
    email: string,
    insert_code?: {[key: string]: string},
  }[],
  cc?: string[],
  bcc?: string[],
  subject?: string,
  text_part?: string,
  html_part?: string,
  attachments?: Attachment[],
  encode?: string,
  from?: {
    email: string,
    name: string,
  }
};

export type SendStatus = "EDIT" | "IMPORTING" | "RESERVE" |
  "WAIT" | "SENDING" | "SENT" | "FAILED" | "HARDERROR" |
  "SOFTERROR" | "DROP" | "RETRY";

export type DeliveryType = "TRANSACTION" | "BULK" | "SMTP" | "ALL";
export type SortType = "delivery_time:desc" | "delivery_time:asc" |
    "updated_time:desc" | "updated_time:asc";
export type ResponseCode = 250 | 421 | 450 | 451 | 452 | 453 |
  454 | 500 | 521 | 530 | 550 | 551 | 552 | 553 | 554;

export interface SearchCondition {
  text_part?: string,
  html_part?: string,
  subject?: string,
  from?: string,
  status?: SendStatus[],
  delivery_type?: DeliveryType[],
  delivery_start?: Date | string,
  delivery_end?: Date | string,
  size?: number,
  page?: number,
  sort?: SortType,
}

export interface SearchAllCondition extends SearchCondition {
  list_unsubscribe_mailto?: string,
  list_unsubscribe_url?: string,
}

export type SearchResponse = {
  data: SearchResult[],
};

export type SearchResult = {
  updated_time: string,
  created_time: string,
  delivery_type: string,
  subject: string,
  delivery_id: number,
  from: {
    email: string,
    name: string,
  }
  reservation_time?: string,
  delivery_time: string,
  status: string,
}

export type SearchLogCondition = {
  anchor?: number,
  count?: number,
  email?: string,
  delivery_type?: DeliveryType[],
  delivery_id?: number,
  status?: SendStatus[],
  response_code?: ResponseCode[],
  delivery_start?: Date | string,
  delivery_end?: Date | string,
};

export type SearchLogResponse = {
  data: SearchLogResult[],
};

export type SearchLogResult = {
  delivery_time: string,
  delivery_id: number,
  maillog_id: number,
  delivery_type: string,
  email: string,
  status: string,
  last_response_code: string,
  last_response_message: string,
  open_time: string,
  created_time: string,
  updated_time: string,
};


export type ErrorMessage = {
  error_messages: {[key: string]: string[]}
}
