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
const object_1 = __importDefault(require("./object"));
const jszip_1 = __importDefault(require("jszip"));
class Job extends object_1.default {
    constructor(id) {
        super();
        this.id = id;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.id)
                throw 'Job id is not found.';
            const url = `/deliveries/-/emails/import/${this.id}`;
            const res = yield Job.request.send('get', url);
            this.total_count = res.total_count;
            this.percentage = res.percentage;
            this.success_count = res.success_count;
            this.failed_count = res.failed_count;
            this.status = res.status;
            return res;
        });
    }
    isError() {
        return __awaiter(this, void 0, void 0, function* () {
            const report = yield this.download();
            return report !== '';
        });
    }
    download() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.id)
                throw 'Job id is not found.';
            if (this.report)
                return this.report;
            const url = `/deliveries/-/emails/import/${this.id}/errorinfo/download`;
            try {
                const buffer = yield Job.request.send('get', url);
                const jsZip = yield jszip_1.default.loadAsync(buffer);
                const fileName = Object.keys(jsZip.files)[0];
                const zipObject = jsZip.files[fileName];
                this.report = yield zipObject.async('text');
                return this.report;
            }
            catch (e) {
                const error = JSON.parse(e);
                if (error &&
                    error.error_messages &&
                    error.error_messages.main &&
                    error.error_messages.main[0] === 'no data found.') {
                    return '';
                }
                throw e;
            }
        });
    }
    finished() {
        return this.percentage === 100;
    }
}
exports.default = Job;
