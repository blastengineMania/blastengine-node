import Transaction from "./libs/transaction";
import Bulk from "./libs/bulk";
import Usage from "./libs/usage";
import ErrorReport from "./libs/error_report";
import Mail from "./libs/mail";
import Log from "./libs/log";
/**
 * BlastEngine class is responsible for managing user authentication
 * and making authenticated requests.
 */
declare class BlastEngine {
    /**
     * User identifier
     * @type {string}
     */
    userId?: string;
    /**
     * API Key
     * @type {string}
     */
    apiKey?: string;
    /**
     * Token generated from user credentials
     * @type {string}
     */
    token?: string;
    /**
     * Creates a new instance of BlastEngine.
     *
     * @param {string} userId - The user identifier.
     * @param {string} apiKey - The API key.
     */
    constructor(userId: string, apiKey: string);
    /**
     * Generates a token based on the user credentials,
     * and sets the token property on the instance.
     *
     * @throws Will throw an error if userId or apiKey is not provided.
     */
    generateToken(): void;
}
/**
 * Exports the BlastEngine class along with other related classes and types.
 */
export { BlastEngine, Bulk, Transaction, Usage, ErrorReport, Mail, Log };
