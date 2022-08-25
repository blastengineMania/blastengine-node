import Base from './base';
export default class Transaction extends Base {
    to: string;
    url: string;
    setTo(email: string | string[]): BEReturnType;
    params(): RequestParamsTransaction;
    send(url?: string, requestParams?: RequestParams): Promise<SuccessFormat>;
}
