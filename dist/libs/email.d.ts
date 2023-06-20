import BEObject from './object';
import { RequestParamsEmailCreate } from '../../types/';
export default class Email extends BEObject {
    deliveryId: number;
    emailId?: number;
    address?: string;
    insertCode: {
        [key: string]: string;
    };
    createdTime?: Date;
    updatedTime?: Date;
    constructor(delivery_id: number);
    get(): Promise<number>;
    save(): Promise<number>;
    create(): Promise<number>;
    update(): Promise<number>;
    delete(): Promise<boolean>;
    getParams(): RequestParamsEmailCreate;
}
