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
const request_1 = __importDefault(require("../../../request"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
class Job {
    constructor(id) {
        this.id = id;
        this.request = new request_1.default();
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.id)
                throw 'Job id is not found.';
            const url = `/deliveries/-/emails/import/${this.id}`;
            const res = yield this.request.send(Job.client.token, 'get', url);
            this.total_count = res.total_count;
            this.percentage = res.percentage;
            this.success_count = res.success_count;
            this.failed_count = res.failed_count;
            this.status = res.status;
            return res;
        });
    }
    download(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.id)
                throw 'Job id is not found.';
            const url = `/deliveries/-/emails/import/${this.id}/errorinfo/download`;
            const buffer = yield this.request.send(Job.client.token, 'get', url);
            if (filePath) {
                yield (0, util_1.promisify)(fs_1.default.writeFile)(filePath, buffer);
            }
            return buffer;
        });
    }
    finished() {
        return this.percentage === 100;
    }
}
exports.default = Job;
