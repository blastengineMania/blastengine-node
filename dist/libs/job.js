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
// import {BlastEngine} from "..";
// import {promisify} from "util";
const object_1 = __importDefault(require("./object"));
const JSZip = __importStar(require("jszip"));
/**
 * Class representing a job, extending the BEObject class.
 * Provides methods to get job details, check for errors,
 * download error information, and check if the job is finished.
 *
 * @extends {BEObject}
 */
class Job extends object_1.default {
    /**
     * Constructs a new instance of the Job class.
     *
     * @param {number} id - The unique identifier for the job.
     */
    constructor(id) {
        super();
        this.id = id;
    }
    /**
     * Retrieves the job data.
     *
     * @async
     * @return {Promise<JobResponseFormat>} - The job data.
     * @throws Will throw an error if id is not found.
     */
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.id)
                throw new Error("Job id is not found.");
            const url = `/deliveries/-/emails/import/${this.id}`;
            const res = yield Job.request.send("get", url);
            this.totalCount = res.total_count;
            this.percentage = res.percentage;
            this.successCount = res.success_count;
            this.failedCount = res.failed_count;
            this.status = res.status;
            return res;
        });
    }
    /**
     * Checks if the job has errors.
     *
     * @async
     * @return {Promise<boolean>} - True if the job has errors, false otherwise.
     * @throws Will throw an error if id is not found.
     */
    isError() {
        return __awaiter(this, void 0, void 0, function* () {
            const report = yield this.download();
            return report !== "";
        });
    }
    /**
     * Downloads the error information.
     *
     * @async
     * @return {Promise<string>} - The error information.
     * @throws Will throw an error if id is not found.
     */
    download() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.id)
                throw new Error("Job id is not found.");
            if (this.report)
                return this.report;
            const url = `/deliveries/-/emails/import/${this.id}/errorinfo/download`;
            try {
                const buffer = yield Job.request
                    .send("get", url, { binary: true });
                const jsZip = yield JSZip.loadAsync(buffer);
                const fileName = Object.keys(jsZip.files)[0];
                const zipObject = jsZip.files[fileName];
                this.report = yield zipObject.async("text");
                return this.report;
            }
            catch (e) {
                const error = JSON.parse(e);
                if (error &&
                    error.error_messages &&
                    error.error_messages.main &&
                    error.error_messages.main[0] === "no data found.") {
                    return "";
                }
                throw e;
            }
        });
    }
    /**
     * Checks if the job is finished.
     *
     * @async
     * @return {Promise<boolean>} - True if the job is finished, false otherwise.
     */
    finished() {
        this.get();
        return this.percentage === 100;
    }
}
exports.default = Job;
