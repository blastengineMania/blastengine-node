import BEObject from './object';
export default class Email extends BEObject {
    delivery_id: number;
    email_id?: number;
    address?: string;
    insert_code: {
        [key: string]: string;
    };
    created_time?: Date;
    updated_time?: Date;
    constructor(delivery_id: number);
    get(): Promise<number>;
    save(): Promise<number>;
    create(): Promise<number>;
    update(): Promise<number>;
    delete(): Promise<boolean>;
    getParams(): RequestParamsEmailCreate;
}
