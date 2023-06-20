import BERequest from "./request";

export default class BEObject {
	static request: BERequest;
	sets(params: {[key: string]: any}): BEObject {
		Object.entries(params).forEach(([key, value]) => {
			this.set(key, value);
		});
		return this;
	}

	set(key: string, value: any): BEObject {
		return this;
	}

}