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
class Report extends object_1.default {
    constructor(deliveryId) {
        super();
        this.percentage = 0;
        this.status = '';
        this.mailOpenFileUrl = '';
        this.totalCount = 0;
        this.deliveryId = deliveryId;
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/deliveries/${this.deliveryId}/analysis/report`;
            const res = yield Report.request.send('post', url);
            this.jobId = res.job_id;
            return this.jobId;
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const path = `/deliveries/-/analysis/report/${this.jobId}`;
            const res = yield Report.request.send('get', path);
            this.percentage = res.percentage;
            this.status = res.status;
            if (res.total_count) {
                this.totalCount = res.total_count;
            }
            if (res.mail_open_file_url) {
                this.mailOpenFileUrl = res.mail_open_file_url;
            }
        });
    }
    finished() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.jobId)
                yield this.create();
            yield this.get();
            return this.percentage === 100;
        });
    }
    download() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.report)
                return this.report;
            if (this.percentage < 100)
                return null;
            const url = `/deliveries/-/analysis/report/${this.jobId}/download`;
            const buffer = yield Report.request.send('get', url);
            const jsZip = yield jszip_1.default.loadAsync(buffer);
            const fileName = Object.keys(jsZip.files)[0];
            const zipObject = jsZip.files[fileName];
            this.report = yield zipObject.async('text');
            return this.report;
        });
    }
}
exports.default = Report;
