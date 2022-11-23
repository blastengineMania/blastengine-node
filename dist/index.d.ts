import Transaction from './libs/transaction';
import Bulk from './libs/bulk';
import Usage from './libs/usage';
declare class BlastEngine {
    userId?: string;
    apiKey?: string;
    token?: string;
    constructor(userId: string, apiKey: string);
    generateToken(): void;
}
export { BlastEngine, Bulk, Transaction, Usage };
