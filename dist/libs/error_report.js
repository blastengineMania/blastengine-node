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
const strftime_1 = __importDefault(require("strftime"));
strftime_1.default.timezone(9 * 60);
class ErrorReport extends object_1.default {
    constructor() {
        super();
        this.percentage = 0;
        this.status = '';
        this.errorFileUrl = '';
        this.total_count = 0;
        this._responseCode = [];
    }
    setErrorStart(start) {
        this._errorStart = (0, strftime_1.default)('%FT%T%z', start).replace('+0900', '+09:00');
        return this;
    }
    setErrorEnd(end) {
        this._errorEnd = (0, strftime_1.default)('%FT%T%z', end).replace('+0900', '+09:00');
        return this;
    }
    setEmail(email) {
        this._email = email;
        return this;
    }
    setResponseCode(code) {
        this._responseCode = code;
        return this;
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/errors/list`;
            const body = {};
            if (this._errorStart)
                body['error_start'] = this._errorStart;
            if (this._errorEnd)
                body['error_end'] = this._errorEnd;
            if (this._email)
                body['email'] = this._email;
            if (this._responseCode.length > 0)
                body['response_code'] = this._responseCode;
            const res = yield ErrorReport.request.send('post', url, body);
            this.jobId = res.job_id;
            return this.jobId;
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.jobId) {
                yield this.create();
            }
            const path = `/errors/list/${this.jobId}`;
            const res = yield ErrorReport.request.send('get', path);
            this.percentage = res.percentage;
            this.status = res.status;
            if (res.total_count) {
                this.total_count = res.total_count;
            }
            if (res.error_file_url) {
                this.errorFileUrl = res.error_file_url;
            }
        });
    }
    finished() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.jobId) {
                try {
                    yield this.create();
                }
                catch (e) {
                    const messages = JSON.parse(e);
                    if (messages.error_messages &&
                        messages.error_messages.main &&
                        messages.error_messages.main[0] === 'no data found.') {
                        return true;
                    }
                }
            }
            yield this.get();
            return this.percentage === 100;
        });
    }
    download() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.report)
                return this.report;
            if (this.percentage < 100)
                return [];
            const url = `/errors/list/${this.jobId}/download`;
            const buffer = yield ErrorReport.request.send('get', url);
            const jsZip = yield jszip_1.default.loadAsync(buffer);
            const fileName = Object.keys(jsZip.files)[0];
            const zipObject = jsZip.files[fileName];
            const text = yield zipObject.async('text');
            const lines = text.split(/\r|\n|\r\n/);
            this.report = [];
            for (const line of lines.slice(1)) {
                if (line === '')
                    continue;
                const values = line.split(',').map(v => v.replace(/^"|"$/g, ''));
                this.report.push({
                    id: parseInt(values[0]),
                    date: new Date(values[1]),
                    email: values[2],
                    response_code: values[3],
                    error_message: values[4],
                });
            }
            return this.report;
        });
    }
}
exports.default = ErrorReport;
