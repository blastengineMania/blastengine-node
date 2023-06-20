import BEObject from "./object";
import { UsageResponseDataFormat } from '../../types/';
export default class Usage extends BEObject {
    month?: number;
    current?: number;
    remaining?: number;
    updateTime?: string;
    planId?: string;
    constructor(params: UsageResponseDataFormat);
    setParams(params: UsageResponseDataFormat): void;
    static get(month_ago?: number): Promise<Usage[]>;
    static getLatest(): Promise<Usage>;
    get(): Promise<Usage>;
}
