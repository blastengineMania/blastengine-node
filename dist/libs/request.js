"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
const qs_1 = __importDefault(require("qs"));
/**
 * The `BERequest` class provides a structured way to handle HTTP requests
 * to a specified API, managing headers,
 * authentication, and various HTTP methods.
 */
class BERequest {
    /**
     * Creates a new instance of BERequest.
     *
     * @param {string} token - The token generated from the user credentials.
     */
    constructor(token) {
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
    hasAttachment(params) {
        if (!params)
            return undefined;
        if (!("attachments" in params))
            return undefined;
        if (params.attachments.length > 0) {
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
    send(method, path, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const requestInit = {
                    method,
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                };
                const url = `https://app.engn.jp/api/v1${path}`;
                const attachments = this.hasAttachment(params);
                if (attachments) {
                    const res = yield this.
                        sendAttachment(url, requestInit, params);
                    return res.json();
                }
                if (params && "file" in params) {
                    // Upload Email
                    const res = yield this.sendFile(url, requestInit, params.file);
                    return res.json();
                }
                else if (params && "binary" in params) {
                    const res = yield this.sendJson(url, requestInit);
                    return Buffer.from(yield res.arrayBuffer());
                }
                else {
                    const res = yield this.sendJson(url, requestInit, params);
                    const json = yield res.json();
                    if (json && json.error_messages) {
                        throw new Error(JSON.stringify(json));
                    }
                    return json;
                }
            }
            catch (e) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ("response" in e) {
                    const err = e;
                    throw new Error(err.body.toString());
                }
                throw e;
            }
        });
    }
    /**
     * Sends a JSON payload as part of a HTTP request.
     * @param {string} url - The URL to send the request to.
     * @param {RequestInit} requestInit - The Parameters to send the request to.
     * @param {RequestParams | undefined} params - The request parameters.
     * @return {Promise<Response>} - The updated
     */
    sendJson(url, requestInit, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (requestInit.method.toUpperCase() === "GET") {
                const query = params ?
                    qs_1.default.stringify(params).replace(/%5B[0-9]?%5D/g, "%5B%5D") :
                    "";
                url = `${url}?${query}`;
            }
            else if (requestInit.method.toUpperCase() === "POST" ||
                requestInit.method.toUpperCase() === "PUT") {
                requestInit.body = JSON.stringify(params);
            }
            requestInit.headers = Object.assign(Object.assign({}, requestInit.headers), { "Content-Type": "application/json" });
            return (0, node_fetch_1.default)(url, requestInit);
        });
    }
    /**
     * Sends attachments as part of a HTTP request.
     * @param {string} url - The URL to send the request to.
     * @param {RequestInit} requestInit - The Parameters to send the request to.
     * @param {RequestParamsTransaction} params - The request parameters.
     * @return {Promise<Response>} - The updated
     */
    sendAttachment(url, requestInit, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = new form_data_1.default();
            for (const file of params.attachments) {
                if (typeof file === "string") {
                    formData.append("file", fs_1.default.createReadStream(file));
                }
                else {
                    formData.append("file", file);
                }
            }
            delete params.attachments;
            if (params) {
                formData.append("data", Buffer.from(JSON.stringify(params)), {
                    contentType: "application/json",
                });
            }
            requestInit.body = formData;
            return (0, node_fetch_1.default)(url, requestInit);
        });
    }
    /**
     * Sends a file as part of a HTTP request.
     * @param {string} url - The URL to send the request to.
     * @param {RequestInit} requestInit - The Parameters to send the request to.
     * @param {Attachment} file - The file to send.
     * @return {Promise<Response>} - The updated
     */
    sendFile(url, requestInit, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = new form_data_1.default();
            if (typeof file === "string") {
                formData.append("file", fs_1.default.createReadStream(file));
            }
            else {
                formData.append("file", file);
            }
            requestInit.body = formData;
            return (0, node_fetch_1.default)(url, requestInit);
        });
    }
}
exports.default = BERequest;
