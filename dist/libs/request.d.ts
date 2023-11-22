import { Response, RequestInit } from "node-fetch";
import { RequestParams, Attachment, SuccessFormat, RequestParamsTransaction } from "../../types/";
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
    token: string;
    /**
     * Creates a new instance of BERequest.
     *
     * @param {string} token - The token generated from the user credentials.
     */
    constructor(token: string);
    /**
     * Gets a SuperAgentRequest object configured
     * for a specific HTTP method and URL.
     * @param {string} method - The HTTP method to use.
     * @param {string} url - The URL to send the request to.
     * @return {SuperAgentRequest} - The configured SuperAgentRequest object.
     * @throws Will throw an error if the method is not supported.
     */
    /**
     * Checks if the given parameters contain attachments.
     * @param {RequestParams | undefined} params - The request parameters.
     * @return {Attachment[] | undefined} - The attachments if present,
     * undefined otherwise.
     */
    hasAttachment(params?: RequestParams): Attachment[] | undefined;
    /**
     * Sends a HTTP request to a specified path with optional parameters.
     * @param {string} method - The HTTP method to use.
     * @param {string} path - The path to send the request to.
     * @param {RequestParams | undefined} params - The request parameters.
     * @return {Promise<SuccessFormat>} - The response body.
     * @throws Will throw an error if the request fails.
     */
    send(method: string, path: string, params?: RequestParams): Promise<SuccessFormat>;
    /**
     * Sends a JSON payload as part of a HTTP request.
     * @param {string} url - The URL to send the request to.
     * @param {RequestInit} requestInit - The Parameters to send the request to.
     * @param {RequestParams | undefined} params - The request parameters.
     * @return {Promise<Response>} - The updated
     */
    sendJson(url: string, requestInit: RequestInit, params?: RequestParams): Promise<Response>;
    /**
     * Sends attachments as part of a HTTP request.
     * @param {string} url - The URL to send the request to.
     * @param {RequestInit} requestInit - The Parameters to send the request to.
     * @param {RequestParamsTransaction} params - The request parameters.
     * @return {Promise<Response>} - The updated
     */
    sendAttachment(url: string, requestInit: RequestInit, params: RequestParamsTransaction): Promise<Response>;
    /**
     * Sends a file as part of a HTTP request.
     * @param {string} url - The URL to send the request to.
     * @param {RequestInit} requestInit - The Parameters to send the request to.
     * @param {Attachment} file - The file to send.
     * @return {Promise<Response>} - The updated
     */
    sendFile(url: string, requestInit: RequestInit, file: Attachment): Promise<Response>;
}
