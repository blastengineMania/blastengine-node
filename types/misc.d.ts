declare module '*/config.json' {
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

type RequestParamsBulkBegin = {
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
};

type InsertCode = {
  key: string,
  value: string,
};

type BulkUpdateTo = {
  email: string,
  insert_code?: InsertCode[],
}

type UsageResponseDataFormat = {
	month: number;
	current: number;
	remaining: number;
	update_time: string;
	plan_id: string;
}

type UsageResponseFormat = {
	data: UsageResponseDataFormat[];
}

type RequestParamsFile = {
	file: Attachment,
}

type RequestParamsUsage = {
	month_ago: number,
}

type RequestParamsBulkUpdate = {
	from: {
		email: string,
		name: string,
	},
  to?: BulkUpdateTo[],
	subject: string,
	text_part: string,
	html_part: string,
};

type RequestParamsBulkCommit = {
  reservation_time?: string,
}

type RequestParamsTransaction = {
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
};

type RequestParamsBulkImport = {
	file?: Attachment
}

type Attachment = Blob | Buffer | string;

type BEReturnType = Transaction | Bulk;

type RequestParams = RequestParamsTransaction | 
	RequestParamsBulkBegin |
	RequestParamsBulkUpdate |
	RequestParamsBulkCommit |
	RequestParamsFile |
	RequestParamsUsage |
	RequestParamsEmailCreate;

type SuccessFormat = {
	delivery_id?: number,
	job_id?: number,
};

type JobResponseFormat = {
	percentage: number,
	status: string,
	success_count: number,
	failed_count: number,
	total_count: number,
	error_file_url: string,
};

type GetResponseFormat = {
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
  attaches: [any],
  delivery_time: string?,
  reservation_time: string?,
  created_time: string,
  updated_time: string,
}

type GetEmailResponseFormat = {
	email_id: number,
	email: string,
	delivery_id: number,
	insert_code: [InsertCode],
	created_time: string,
	updated_time: string,
}

type RequestParamsEmailCreate = {
	email: string,
	insert_code: {[key: string]: string}[],
}

type CreateEmailResponseFormat = {
	email_id: number,
}

type GetReportResponseFormat = {
	percentage: number,
	status: string,
	total_count: number,
	mail_open_file_url: string,
}


type GetErrorReportResponseFormat = {
	percentage: number,
	status: string,
	total_count: number,
	error_file_url: string,
}

type MailConfig = {
	to: {
		email: string,
		insert_code?: {[key: string]: string},
	}[],
	cc?: string[],
	bcc?: string[],
	subject?: string,
	text_part?: string,
	html_part?: string,
	attachments?: Attachment[] = [],
	encode?: string,
	from?: {
		email: string,
		name: string,
	}
};