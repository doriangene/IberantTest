import {DataStore} from "./dataStore";
import {FormStore} from "./formStore";
import {Validator} from "lakmus";
import {container} from "../inversify.config";
import {repository} from "redux-scaffolding-ts";

const MAX_CHARS = 10;
const maxCharsMsg = `User description can't exceed ${MAX_CHARS} characters`;

export enum AdminType {
    Normal,
    Vip,
    King
}

export interface UserItem {
    id: number,
    firstName: string,
    lastName: string,
    address: string,
    description: string,
    isAdmin: boolean,
    adminType: string
}

export interface UserItemDto {
    firstName: string,
    lastName: string,
    address: string,
    description: string,
    isAdmin: boolean,
    adminType: string
}

@repository("@@UserItem", "UserItem.summary")
export class UserItemStore extends DataStore<UserItem> {
    baseUrl: string = "api/user";

    constructor() {
        super('UserItem', {
            count: 0,
            isBusy: false,
            items: [],
            result: undefined,
            discard: item => {
            }
        }, container);
    }
}

export class UserItemDtoValidator extends Validator<UserItemDto> {
    constructor() {
        super();

        const notNullMsg = (prop: string) =>
            `User does not permit null values for "${prop}"`;

        this.ruleFor(item => item.firstName)
            .notNull()
            .withMessage(notNullMsg("FirstName"))
        this.ruleFor(item => item.lastName)
            .notNull()
            .withMessage(notNullMsg("LastName"))
        this.ruleFor(item => item.address)
            .notNull()
            .withMessage(notNullMsg("Address"))
        this.ruleFor(item => item.description)
            .maxLength(MAX_CHARS)
            .withMessage(maxCharsMsg)
    }
}

// export class UserItemValidator extends Validator<UserItem> {
//     constructor() {
//         super();
//         const notNullMsg = (prop: string) =>
//             `User does not permit null values for "${prop}"`;
//
//         this.ruleFor(item => item.firstname)
//             .notNull()
//             .withMessage(notNullMsg("FirstName"))
//         this.ruleFor(item => item.lastname)
//             .notNull()
//             .withMessage(notNullMsg("LastName"))
//         this.ruleFor(item => item.address)
//             .notNull()
//             .withMessage(notNullMsg("Address"))
//         this.ruleFor(item => item.description)
//             .maxLength(MAX_CHARS)
//             .withMessage(maxCharsMsg)
//     }
// }

@repository("@@UserItem", "UserItem.new")
export class UserItemDtoStore extends FormStore<UserItemDto> {
    baseUrl: string = 'api/user';

    protected validate(item: UserItemDto) {
        return new UserItemDtoValidator().validate(item);
    }

    constructor() {
        super('NEW_UserItem', {
            isBusy: false,
            status: 'New',
            item: undefined,
            result: undefined
        }, container);
    }
}