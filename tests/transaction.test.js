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
const src_1 = __importDefault(require("../src/"));
const config_json_1 = __importDefault(require("./config.json"));
describe('Test of transaction', () => {
    let client;
    beforeAll(() => {
        client = new src_1.default(config_json_1.default.userId, config_json_1.default.apiKey);
    });
    describe('Test as successful', () => {
        test('Transaction successful.', () => __awaiter(void 0, void 0, void 0, function* () {
            const transaction = client.Delivery.transaction();
            try {
                const res = yield transaction
                    .setFrom(config_json_1.default.from.email, config_json_1.default.from.name)
                    .setSubject('Test subject')
                    .setTo(config_json_1.default.to)
                    .setText('メールの本文')
                    .send();
                expect(`${res.delivery_id}`).toMatch(/[0-9]+/);
            }
            catch (e) {
                expect(true).toBe(false);
            }
        }));
    });
});
