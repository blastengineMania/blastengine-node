"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BEObject {
    sets(params) {
        Object.entries(params).forEach(([key, value]) => {
            this.set(key, value);
        });
        return this;
    }
    set(key, value) {
        return this;
    }
}
exports.default = BEObject;
