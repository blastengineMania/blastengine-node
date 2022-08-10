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
const object_1 = __importDefault(require("../object"));
class Usage extends object_1.default {
    constructor(params) {
        super();
        this.setParams(params);
    }
    setParams(params) {
        this.month = params.month;
        this.current = params.current;
        this.remaining = params.remaining;
        this.update_time = params.update_time;
        this.plan_id = params.plan_id;
    }
    static get(month_ago = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/usages`;
            const res = yield Usage.request.send('get', url, { month_ago });
            return res.data.map(d => new Usage(d));
        });
    }
    static getLatest() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/usages/latest`;
            const res = yield Usage.request.send('get', url);
            return new Usage(res);
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/usages/${this.month}`;
            const res = yield Usage.request.send('get', url);
            this.setParams(res);
            return this;
        });
    }
}
exports.default = Usage;
