import { SuperAgentRequest } from 'superagent';
import { RequestParams, Attachment, SuccessFormat, RequestParamsTransaction } from '../../types/';
export default class BERequest {
    token: string;
    constructor(token: string);
    getRequest(method: string, url: string): SuperAgentRequest;
    hasAttachment(params?: RequestParams): Attachment[] | undefined;
    send(method: string, path: string, params?: RequestParams): Promise<SuccessFormat>;
    sendJson(request: SuperAgentRequest, params?: RequestParams): Promise<SuperAgentRequest>;
    sendAttachment(request: SuperAgentRequest, params: RequestParamsTransaction): Promise<SuperAgentRequest>;
    sendFile(request: SuperAgentRequest, file: Attachment): Promise<SuperAgentRequest>;
}
