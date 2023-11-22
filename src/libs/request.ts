import fetch, {Response, RequestInit} from "node-fetch";
import FormData from "form-data";
import {Blob} from "buffer";
import fs from "fs";
import qs from "qs";

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
  /*
  getRequest(method: string, url: string): Response {
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
  */

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
      const requestInit: RequestInit = {
        method,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      const url = `https://app.engn.jp/api/v1${path}`;
      const attachments = this.hasAttachment(params);
      if (attachments) {
        const res = await this.
          sendAttachment(url, requestInit, params as RequestParamsTransaction);
        return res.json() as SuccessFormat;
      }
      if (params && "file" in params) {
        // Upload Email
        const res = await this.sendFile(url, requestInit, params!.file!);
        return res.json() as SuccessFormat;
      } else if (params && "binary" in params) {
        const res = await this.sendJson(url, requestInit);
        return Buffer.from(await res.arrayBuffer());
      } else {
        const res = await this.sendJson(url, requestInit, params);
        const json = await res.json();
        if (json && json.error_messages) {
          throw new Error(JSON.stringify(json));
        }
        return json as SuccessFormat;
      }
    } catch (e: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ("response" in (e as any)) {
        const err = e as Response;
        throw new Error(err.body!.toString());
      }
      throw e;
    }
  }

  /**
   * Sends a JSON payload as part of a HTTP request.
   * @param {string} url - The URL to send the request to.
   * @param {RequestInit} requestInit - The Parameters to send the request to.
   * @param {RequestParams | undefined} params - The request parameters.
   * @return {Promise<Response>} - The updated
   */
  async sendJson(url: string, requestInit: RequestInit, params?: RequestParams):
    Promise<Response> {
    if (requestInit.method!.toUpperCase() === "GET") {
      const query = params ?
        qs.stringify(params).replace(/%5B[0-9]?%5D/g, "%5B%5D") :
        "";
      url = `${url}?${query}`;
    } else if (requestInit.method!.toUpperCase() === "POST" ||
      requestInit.method!.toUpperCase() === "PUT") {
      requestInit.body = JSON.stringify(params);
    }
    requestInit.headers = {
      ...requestInit.headers,
      "Content-Type": "application/json",
    };
    return fetch(url, requestInit);
  }

  /**
   * Sends attachments as part of a HTTP request.
   * @param {string} url - The URL to send the request to.
   * @param {RequestInit} requestInit - The Parameters to send the request to.
   * @param {RequestParamsTransaction} params - The request parameters.
   * @return {Promise<Response>} - The updated
   */
  async sendAttachment(
    url: string,
    requestInit: RequestInit,
    params: RequestParamsTransaction): Promise<Response> {
    const formData = new FormData();
    for (const file of params.attachments!) {
      if (typeof file === "string") {
        formData.append("file", fs.createReadStream(file));
      } else {
        formData.append("file", file as Blob);
      }
    }
    delete params.attachments;
    if (params) {
      formData.append("data", Buffer.from(JSON.stringify(params)), {
        contentType: "application/json",
      });
    }
    requestInit.body = formData;
    return fetch(url, requestInit);
  }

  /**
   * Sends a file as part of a HTTP request.
   * @param {string} url - The URL to send the request to.
   * @param {RequestInit} requestInit - The Parameters to send the request to.
   * @param {Attachment} file - The file to send.
   * @return {Promise<Response>} - The updated
   */
  async sendFile(
    url: string,
    requestInit: RequestInit,
    file: Attachment):
    Promise<Response> {
    const formData = new FormData();
    if (typeof file === "string") {
      formData.append("file", fs.createReadStream(file));
    } else {
      formData.append("file", file as Blob);
    }
    requestInit.body = formData;
    return fetch(url, requestInit);
  }
}
