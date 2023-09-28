import Transaction from './libs/transaction';
import Bulk from './libs/bulk';
import Usage from './libs/usage';
import ErrorReport from './libs/error_report';
import Mail from './libs/mail';
import Log from './libs/log';
declare class BlastEngine {
    userId?: string;
    apiKey?: string;
    token?: string;
    constructor(userId: string, apiKey: string);
    generateToken(): void;
}
export { BlastEngine, Bulk, Transaction, Usage, ErrorReport, Mail, Log };
