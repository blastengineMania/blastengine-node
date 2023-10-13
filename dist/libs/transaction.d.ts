import Base from "./base";
import { RequestParamsTransaction, SuccessFormat } from "../../types/";
/**
 * Class representing a transaction operation, extending the Base class.
 * Provides methods to send transaction deliveries.
 *
 * @extends {Base}
 */
export default class Transaction extends Base {
    /**
     * The email address of the sender.
     * @type {string}
     */
    to: string;
    /**
     * The email address of the sender as Cc.
     * @type {string[]}
     */
    cc: string[];
    /**
     * The email address of the sender as Bcc.
     * @type {string[]}
     */
    bcc: string[];
    /**
     * Replace the insert code in the email.
     * @type {{key: string, value: string}[]}
     */
    insert_code: {
        key: string;
        value: string;
    }[];
    /**
     * Set a recipient to the transaction delivery.
     *
     * @param {string} email - The email address of the recipient.
     * @param {InsertCode} insertCode - The insert code for the recipient.
     * @return {BEReturnType} - The current instance.
     */
    setTo(email: string, insertCode?: {
        [key: string]: string;
    }): Transaction;
    /**
     * Add a recipient to the transaction delivery as Cc.
     *
     * @param {string} email - The email address of the recipient.
     * @return {BEReturnType} - The current instance.
     */
    addCc(email: string): Transaction;
    /**
     * Add a recipient to the transaction delivery as Bcc.
     *
     * @param {string} email - The email address of the recipient.
     * @return {BEReturnType} - The current instance.
     */
    addBcc(email: string): Transaction;
    /**
     * Prepares the parameters for sending the transaction delivery.
     *
     * @return {RequestParamsTransaction} - The prepared parameters.
     */
    params(): RequestParamsTransaction;
    /**
     * Sends the transaction delivery.
     *
     * @async
     * @return {Promise<SuccessFormat>} - The success message.
     */
    send(): Promise<SuccessFormat>;
}
