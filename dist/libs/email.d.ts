import BEObject from "./object";
import { RequestParamsEmailCreate } from "../../types/";
/**
 * Class representing an email, extending the BEObject class.
 * Provides methods to get, save, create, update, and delete an email.
 *
 * @extends {BEObject}
 */
export default class Email extends BEObject {
    /**
     * Unique identifier for a delivery.
     * @type {number}
     */
    deliveryId: number;
    /**
     * Unique identifier for an email.
     * @type {number}
     */
    emailId?: number;
    /**
     * The email address.
     * @type {string}
     */
    address?: string;
    /**
     * An object representing the insert code.
     * @type {Object<string, string>}
     */
    insertCode: {
        [key: string]: string;
    };
    /**
     * The creation time of the email.
     * @type {Date}
     */
    createdTime?: Date;
    /**
     * The updated time of the email.
     * @type {Date}
     */
    updatedTime?: Date;
    /**
     * Constructs a new instance of the Email class.
     *
     * @param {number} deliveryId - The unique identifier for a delivery.
     */
    constructor(deliveryId: number);
    /**
     * Retrieves the email data.
     *
     * @async
     * @return {Promise<number>} - The emailId.
     * @throws Will throw an error if emailId is not found.
     */
    get(): Promise<number>;
    /**
     * Saves the email data.
     *
     * @async
     * @return {Promise<number>} - The emailId.
     */
    save(): Promise<number>;
    /**
     * Creates a new email.
     *
     * @async
     * @return {Promise<number>} - The emailId.
     * @throws Will throw an error if deliveryId is not found.
     */
    create(): Promise<number>;
    /**
     * Updates the email data.
     *
     * @async
     * @return {Promise<number>} - The emailId.
     * @throws Will throw an error if emailId is not found.
     */
    update(): Promise<number>;
    /**
     * Deletes the email data.
     *
     * @async
     * @return {Promise<boolean>} - A boolean indicating success.
     * @throws Will throw an error if emailId is not found.
     */
    delete(): Promise<boolean>;
    /**
     * Prepares the parameters for creating or updating an email.
     *
     * @return {RequestParamsEmailCreate} - The prepared parameters.
     */
    getParams(): RequestParamsEmailCreate;
}
