import BERequest from "./request";
export default class BEObject {
    static request: BERequest;
    sets(params: {
        [key: string]: any;
    }): BEObject;
    set(key: string, value: any): BEObject;
}
