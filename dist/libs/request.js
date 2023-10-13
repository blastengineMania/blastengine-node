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
const superagent_1 = __importDefault(require("superagent"));
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
    getRequest(method, url) {
        switch (method.toUpperCase()) {
            case "GET":
                return superagent_1.default.get(url);
            case "POST":
                return superagent_1.default.post(url);
            case "PUT":
                return superagent_1.default.put(url);
            case "DELETE":
                return superagent_1.default.delete(url);
            case "PATCH":
                return superagent_1.default.patch(url);
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
                const request = this.getRequest(method, `https://app.engn.jp/api/v1${path}`);
                request
                    .set("Authorization", `Bearer ${this.token}`);
                const attachments = this.hasAttachment(params);
                if (attachments) {
                    const res = yield this.
                        sendAttachment(request, params);
                    return res.body;
                }
                if (params && "file" in params) {
                    // Upload Email
                    const res = yield this.sendFile(request, params.file);
                    return res.body;
                }
                else {
                    const res = yield this.sendJson(request, params);
                    return res.body;
                }
            }
            catch (e) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ("response" in e) {
                    const err = e;
                    throw new Error(err.response.text);
                }
                throw e;
            }
        });
    }
    /**
     * Sends a JSON payload as part of a HTTP request.
     * @param {SuperAgentRequest} request - The SuperAgentRequest object.
     * @param {RequestParams | undefined} params - The request parameters.
     * @return {Promise<SuperAgentRequest>} - The updated
     * SuperAgentRequest object.
     */
    sendJson(request, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.method.toUpperCase() === "GET") {
                const qs = new URLSearchParams(params);
                request.query(qs.toString());
            }
            return request
                .send(params)
                .set("Content-Type", "application/json");
        });
    }
    /**
     * Sends attachments as part of a HTTP request.
     * @param {SuperAgentRequest} request - The SuperAgentRequest object.
     * @param {RequestParamsTransaction} params - The request parameters.
     * @return {Promise<SuperAgentRequest>} - The updated
     * SuperAgentRequest object.
     */
    sendAttachment(request, params) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const file of params.attachments) {
                request.attach("file", file);
            }
            delete params.attachments;
            if (params) {
                request
                    .attach("data", Buffer.from(JSON.stringify(params)), { contentType: "application/json" });
            }
            return request
                .type("form");
        });
    }
    /**
     * Sends a file as part of a HTTP request.
     * @param {SuperAgentRequest} request - The SuperAgentRequest object.
     * @param {Attachment} file - The file to be sent.
     * @return {Promise<SuperAgentRequest>} - The updated
     * SuperAgentRequest object.
     */
    sendFile(request, file) {
        return __awaiter(this, void 0, void 0, function* () {
            request.attach("file", file, { contentType: "text/csv" });
            return request
                .type("form");
        });
    }
}
exports.default = BERequest;
