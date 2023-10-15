import request, {SuperAgentRequest} from "superagent";
import {
  RequestParams,
  Attachment,
  SuccessFormat,
  RequestParamsTransaction,
} from "../../types/";


/**
 * The `BERequest` class provides a structured way to handle HTTP requests
 * to a specified API, managing headers,
 * authentication, and various HTTP methods.
 */
export default class BERequest {
  /**
   * The token generated from the user credentials.
   * @type {string}
   */
  public token: string;

  /**
   * Creates a new instance of BERequest.
   *
   * @param {string} token - The token generated from the user credentials.
   */
  constructor(token: string) {
    this.token = token;
  }

  /**
   * Gets a SuperAgentRequest object configured
   * for a specific HTTP method and URL.
   * @param {string} method - The HTTP method to use.
   * @param {string} url - The URL to send the request to.
   * @return {SuperAgentRequest} - The configured SuperAgentRequest object.
   * @throws Will throw an error if the method is not supported.
   */
  getRequest(method: string, url: string): SuperAgentRequest {
    switch (method.toUpperCase()) {
    case "GET":
      return request.get(url);
    case "POST":
      return request.post(url);
    case "PUT":
      return request.put(url);
    case "DELETE":
      return request.delete(url);
    case "PATCH":
      return request.patch(url);
    default:
      throw new Error(`${method} is not support.`);
    }
  }

  /**
   * Checks if the given parameters contain attachments.
   * @param {RequestParams | undefined} params - The request parameters.
   * @return {Attachment[] | undefined} - The attachments if present,
   * undefined otherwise.
   */
  hasAttachment(params?: RequestParams): Attachment[] | undefined {
    if (!params) return undefined;
    if (!("attachments" in params)) return undefined;
    if (params!.attachments!.length > 0) {
      return params.attachments;
    }
    return undefined;
  }

  /**
   * Sends a HTTP request to a specified path with optional parameters.
   * @param {string} method - The HTTP method to use.
   * @param {string} path - The path to send the request to.
   * @param {RequestParams | undefined} params - The request parameters.
   * @return {Promise<SuccessFormat>} - The response body.
   * @throws Will throw an error if the request fails.
   */
  async send(method: string, path: string, params?: RequestParams):
    Promise<SuccessFormat> {
    try {
      const request = this.getRequest(method, `https://app.engn.jp/api/v1${path}`);
      request
        .set("Authorization", `Bearer ${this.token}`);
      const attachments = this.hasAttachment(params);
      if (attachments) {
        const res = await this.
          sendAttachment(request, params as RequestParamsTransaction);
        return res.body as SuccessFormat;
      }
      if (params && "file" in params) {
        // Upload Email
        const res = await this.sendFile(request, params!.file!);
        return res.body as SuccessFormat;
      } else {
        const res = await this.sendJson(request, params);
        return res.body as SuccessFormat;
      }
    } catch (e: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ("response" in (e as any)) {
        const err = e as request.ResponseError;
        throw new Error(err.response!.text);
      }
      throw e;
    }
  }

  /**
   * Sends a JSON payload as part of a HTTP request.
   * @param {SuperAgentRequest} request - The SuperAgentRequest object.
   * @param {RequestParams | undefined} params - The request parameters.
   * @return {Promise<SuperAgentRequest>} - The updated
   * SuperAgentRequest object.
   */
  async sendJson(request: SuperAgentRequest, params?: RequestParams):
    Promise<SuperAgentRequest> {
    if (request.method.toUpperCase() === "GET") {
      const qs = new URLSearchParams(params as Record<string, string>);
      request.query(qs.toString());
    }
    return request
      .send(params)
      .set("Content-Type", "application/json");
  }

  /**
   * Sends attachments as part of a HTTP request.
   * @param {SuperAgentRequest} request - The SuperAgentRequest object.
   * @param {RequestParamsTransaction} params - The request parameters.
   * @return {Promise<SuperAgentRequest>} - The updated
   * SuperAgentRequest object.
   */
  async sendAttachment(
    request: SuperAgentRequest,
    params: RequestParamsTransaction): Promise<SuperAgentRequest> {
    for (const file of params.attachments!) {
      request.attach("file", file as Blob);
    }
    delete params.attachments;
    if (params) {
      request
        .attach(
          "data",
          Buffer.from(JSON.stringify(params)),
          {contentType: "application/json"}
        );
    }
    return request
      .type("form");
  }

  /**
   * Sends a file as part of a HTTP request.
   * @param {SuperAgentRequest} request - The SuperAgentRequest object.
   * @param {Attachment} file - The file to be sent.
   * @return {Promise<SuperAgentRequest>} - The updated
   * SuperAgentRequest object.
   */
  async sendFile(request: SuperAgentRequest, file: Attachment):
    Promise<SuperAgentRequest> {
    request.attach("file", file! as Blob, {contentType: "text/csv"});
    return request
      .type("form");
  }
}
