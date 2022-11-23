import BEObject from "./object";
export default class Usage extends BEObject {
    month?: number;
    current?: number;
    remaining?: number;
    update_time?: string;
    plan_id?: string;
    constructor(params: UsageResponseDataFormat);
    setParams(params: UsageResponseDataFormat): void;
    static get(month_ago?: number): Promise<Usage[]>;
    static getLatest(): Promise<Usage>;
    get(): Promise<Usage>;
}
