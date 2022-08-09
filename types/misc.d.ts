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
	attachments?: [Attachment],
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

type RequestParamsFile = {
	file: Attachment,
}

type RequestParamsBulkUpdate = {
	from: {
		email: string,
		name: string,
	},
  to: BulkUpdateTo[],
	subject: string,
	text_part: string,
	html_part: string,
};

type RequestParamsBulkCommit = {
  reservation_time: string,
}

type RequestParamsTransaction = {
	from: {
		email: string,
		name: string,
	},
	to: string,
	subject: string,
	encode: string,
	text_part: string,
	html_part: string,
	attachments?: [Attachment],
};

type RequestParamsBulkImport = {
	file?: Attachment
}

type Attachment = Blob | Buffer | string;

type BEReturnType = Transaction | Bulk;

type RequestParams = RequestParamsTransaction | RequestParamsBulkBegin | RequestParamsBulkUpdate | RequestParamsBulkCommit | RequestParamsFile;

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