import { DataStore, DataModel } from './dataStore';
import { FormStore } from './formStore';
import { repository, reduce, AsyncAction } from 'redux-scaffolding-ts';
import { Validator } from "lakmus";
import { AxiosResponse } from 'axios';
import { container } from '../inversify.config';
import { CommandResult } from './types';
import { adminType } from '../enums/adminType';
import { OccupationItem } from './occupation-store';

export interface UserItem {
    id: number;
    name: string; 
    lastName: string;
    direction: string;
    isAdmin: boolean;
    adminType: adminType;
    occupation: OccupationItem;
}

@repository("@@UserItem", "UserItem.summary")
export class UserItemsStore extends DataStore<UserItem> {
    baseUrl: string = "api/User";

    constructor() {
        super('UserItem', {
            count: 0,
            isBusy: false,
            items: [],
            result: undefined,
            discard: item => { }
        }, container);
    }

  

   
}
//Agregar la interface de user

export interface NewUserItem {
    name: string;
    lastName: string;
    direction: string;
    isAdmin: boolean;
    adminType: adminType;
    occupation: OccupationItem;
}

export class NewUserValidator extends Validator<NewUserItem> {
    constructor() {
        super();

        this.ruleFor(x => x.name)
            .notNull()
            .withMessage("Name cant be empty");

        this.ruleFor(x => x.lastName)
            .notNull()
            .withMessage("Last Name cant be empty");
    }
}

@repository("@@UserItem", "UserItem.new")
export class NewUserItemStore extends FormStore<NewUserItem> {
    baseUrl: string = "api/User";

    protected validate(item: NewUserItem) {
        return (new NewUserValidator()).validate(item);
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



export class UserValidator extends Validator<UserItem> {
    constructor() {
        super();

        this.ruleFor(x => x.name)
            .notNull()
            .withMessage("Name cant be empty");
        this.ruleFor(x => x.lastName)
            .notNull()
            .withMessage("Last Name cant be empty");
    }
}



@repository("@@UserItem", "UserItem.detail")
export class UserItemStore extends FormStore<UserItem> {
    baseUrl: string = "api/User";

    protected validate(item: UserItem) {
        return new UserValidator().validate(item);
    }

    constructor() {
        super('UserItem', {
            isBusy: false,
            status: 'New',
            item: undefined,
            result: undefined
        }, container);
    }
}