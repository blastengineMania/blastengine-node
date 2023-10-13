import Base from "./base";
import Job from "./job";
import Email from "./email";
import { Attachment, BulkUpdateTo, SuccessFormat, RequestParamsBulkBegin, RequestParamsBulkUpdate, RequestParamsBulkCommit } from "../../types/";
type InsertCode = {
    [key: string]: string;
};
/**
 * Class representing a bulk operation, extending the Base class.
 * Provides methods to register, update, and send bulk deliveries.
 *
 * @extends {Base}
 */
export default class Bulk extends Base {
    /**
     * An array to hold bulk update information.
     * @type {BulkUpdateTo[]}
     */
    to: BulkUpdateTo[];
    /**
     * Registers a new bulk delivery.
     *
     * @async
     * @return {Promise<SuccessFormat>} - The result of the registration.
     */
    register(): Promise<SuccessFormat>;
    /**
     * Imports a file for bulk update.
     *
     * @async
     * @param {Attachment} filePath - The path of the file to import.
     * @return {Promise<Job>} - A Job instance representing the import job.
     * @throws Will throw an error if deliveryId is not found.
     */
    import(filePath: Attachment): Promise<Job>;
    /**
     * Updates the bulk delivery.
     *
     * @async
     * @return {Promise<SuccessFormat>} - The result of the update.
     * @throws Will throw an error if deliveryId is not found.
     */
    update(): Promise<SuccessFormat>;
    /**
     * Creates a CSV string from the provided data.
     *
     * @param {BulkUpdateTo[]} to - The data to convert to CSV.
     * @return {string} - The CSV string.
     */
    createCsv(to: BulkUpdateTo[]): string;
    /**
     * Sends the bulk delivery.
     *
     * @async
     * @param {Date} [date] - The date to send the delivery.
     * @return {Promise<SuccessFormat>} - The result of the send operation.
     * @throws Will throw an error if deliveryId is not found.
     */
    send(date?: Date): Promise<SuccessFormat>;
    /**
     * Deletes the bulk delivery.
     *
     * @async
     * @return {Promise<SuccessFormat>} - The result of the delete operation.
     * @throws Will throw an error if deliveryId is not found.
     */
    delete(): Promise<SuccessFormat>;
    /**
     * Cancels the bulk delivery.
     *
     * @async
     * @return {Promise<SuccessFormat>} - The result of the cancel operation.
     * @throws Will throw an error if deliveryId is not found.
     */
    cancel(): Promise<SuccessFormat>;
    /**
     * Gets an Email instance for the current bulk delivery.
     *
     * @return {Email} - The Email instance.
     * @throws Will throw an error if deliveryId is not found.
     */
    email(): Email;
    /**
     * Adds a recipient to the bulk delivery.
     *
     * @param {string} email - The email address of the recipient.
     * @param {InsertCode} insertCode - The insert code for the recipient.
     * @return {Bulk} - The current instance.
     */
    addTo(email: string, insertCode?: InsertCode): Bulk;
    /**
     * Prepares the parameters for saving the bulk delivery.
     *
     * @return {RequestParamsBulkBegin} - The prepared parameters.
     */
    saveParams(): RequestParamsBulkBegin;
    /**
     * Prepares the parameters for updating the bulk delivery.
     *
     * @return {RequestParamsBulkUpdate} - The prepared parameters.
     */
    updateParams(): RequestParamsBulkUpdate;
    /**
     * Prepares the parameters for committing the bulk delivery.
     *
     * @param {Date} [date] - The date to commit the delivery.
     * @return {RequestParamsBulkCommit} - The prepared parameters.
     */
    commitParams(date?: Date): RequestParamsBulkCommit;
}
export {};
