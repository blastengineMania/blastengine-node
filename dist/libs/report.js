"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const JSZip = __importStar(require("jszip"));
/**
 * The Report class extends the BEObject to handle the creation, retrieval,
 * and downloading of analysis reports related to email delivery.
 */
class Report extends object_1.default {
    /**
     * Constructs a new instance of the Report class.
     *
     * @param {number} deliveryId - The unique identifier for a delivery.
     */
    constructor(deliveryId) {
        super();
        /**
         * The percentage of the report.
         * @type {number}
         */
        this.percentage = 0;
        /**
         * The status of the report.
         * @type {string}
         */
        this.status = "";
        /**
         * The URL of the report.
         * @type {string}
         */
        this.mailOpenFileUrl = "";
        /**
         * The total count of the report.
         * @type {number}
         */
        this.totalCount = 0;
        this.deliveryId = deliveryId;
    }
    /**
     * Creates a new report.
     *
     * @async
     * @return {Promise<number>} - The Job ID associated with the report.
     */
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/deliveries/${this.deliveryId}/analysis/report`;
            const res = yield Report.request.send("post", url);
            this.jobId = res.job_id;
            return this.jobId;
        });
    }
    /**
     * Retrieves the report data.
     *
     * @async
     * @return {Promise<void>}
     */
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const path = `/deliveries/-/analysis/report/${this.jobId}`;
            const res = yield Report.request
                .send("get", path);
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
    /**
     * Checks if the report is finished.
     *
     * @async
     * @return {Promise<boolean>} - True if the report is finished.
     */
    finished() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.jobId)
                yield this.create();
            yield this.get();
            return this.percentage === 100;
        });
    }
    /**
     * Downloads the report.
     *
     * @async
     * @return {Promise<any>} - The report.
     */
    download() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.report)
                return this.report;
            if (this.percentage < 100)
                return null;
            const url = `/deliveries/-/analysis/report/${this.jobId}/download`;
            const buffer = yield Report.request.send("get", url);
            const jsZip = yield JSZip.loadAsync(buffer);
            const fileName = Object.keys(jsZip.files)[0];
            const zipObject = jsZip.files[fileName];
            this.report = yield zipObject.async("text");
            return this.report;
        });
    }
}
exports.default = Report;
