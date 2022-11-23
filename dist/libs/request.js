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
class BERequest {
    constructor(token) {
        this.token = token;
    }
    getRequest(method, url) {
        switch (method.toUpperCase()) {
            case 'GET':
                return superagent_1.default.get(url);
            case 'POST':
                return superagent_1.default.post(url);
            case 'PUT':
                return superagent_1.default.put(url);
            case 'DELETE':
                return superagent_1.default.delete(url);
            case 'PATCH':
                return superagent_1.default.patch(url);
            default:
                throw `${method} is not support.`;
        }
    }
    hasAttachment(params) {
        if (!params)
            return undefined;
        if (!('attachments' in params))
            return undefined;
        if (params.attachments.length > 0) {
            return params.attachments;
        }
        return undefined;
    }
    send(method, path, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = this.getRequest(method, `https://app.engn.jp/api/v1${path}`);
                request
                    .set('Authorization', `Bearer ${this.token}`);
                const attachments = this.hasAttachment(params);
                if (attachments) {
                    const res = yield this.sendAttachment(request, params);
                    return res.body;
                }
                if (params && 'file' in params) {
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
                if ('response' in e) {
                    throw e.response.text;
                }
                throw e;
            }
        });
    }
    sendJson(request, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.method.toUpperCase() === 'GET') {
                const qs = new URLSearchParams(params);
                request.query(qs.toString());
            }
            return request
                .send(params)
                .set('Content-Type', 'application/json');
        });
    }
    sendAttachment(request, params) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const file of params.attachments) {
                request.attach('file', file);
            }
            delete params.attachments;
            if (params) {
                request
                    .attach('data', Buffer.from(JSON.stringify(params)), { contentType: 'application/json' });
            }
            return request
                .type('form');
        });
    }
    sendFile(request, file) {
        return __awaiter(this, void 0, void 0, function* () {
            request.attach('file', file, { contentType: 'text/csv' });
            return request
                .type('form');
        });
    }
}
exports.default = BERequest;
