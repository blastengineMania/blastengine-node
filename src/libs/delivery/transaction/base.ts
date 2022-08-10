import { BlastEngine } from '../../..';
import Bulk from './bulk/';
import BERequest from '../../request';
import BEObject from '../../object';

export default class Base extends BEObject {
	public fromName = '';
	public fromEmail = '';
	public subject = '';
	public encode = 'UTF-8';
	public text_part = '';
	public html_part = '';
	public url?: string;
	public attachments: Attachment[] = [];
	public file?: Attachment;

	constructor() {
		super();
	}
	
	setSubject(subject: string): BEReturnType {
		this.subject = subject;
		return this;
	}

	setFrom(email: string, name = ''): BEReturnType {
		this.fromEmail = email;
		this.fromName = name;
		return this;
	}

	setEncode(encode: string): BEReturnType {
		this.encode = encode;
		return this;
	}

	setText(text: string): BEReturnType {
		this.text_part = text;
		return this;
	}

	setHtml(html: string): BEReturnType {
		this.html_part = html;
		return this;
	}

	addAttachment(file: Attachment): BEReturnType {
		this.attachments.push(file);
		return this;
	}
}
