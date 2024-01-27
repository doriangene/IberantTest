﻿import { DataStore, DataModel } from './dataStore';
import { FormStore } from './formStore';
import { repository, reduce, AsyncAction } from 'redux-scaffolding-ts';
import { Validator } from "lakmus";
import { AxiosResponse } from 'axios';
import { container } from '../inversify.config';
import { CommandResult } from './types';

export enum AdminType { None, Normal, Vip, King }

export interface UserItem {
    id: number;
    name: string;
    lastName: string;
    address: string;
    isAdmin: boolean;
    adminType: AdminType;
    occupationId: number | null;
}

@repository("@@UserItem", "UserItem.summary")
export class UserItemsStore extends DataStore<UserItem> {
    baseUrl: string = "api/user";

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

export interface NewUserItem {
    name: string,
    lastName: string,
    address: string,
    isAdmin: boolean,
    adminType: AdminType,
    occupationId: number | null,
}

export class NewUserValidator extends Validator<NewUserItem> {
    constructor() {
        super();

        this.ruleFor(x => x.name)
            .notNull()
            .withMessage("Name cant be empty");

        this.ruleFor(x => x.address)
            .maxLength(10)
            .withMessage("Address cant be more than 10 characters");
    }
}

@repository("@@UserItem", "UserItem.new")
export class NewUserItemStore extends FormStore<NewUserItem> {
    baseUrl: string = "api/user";

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
            .withMessage("Name can not be null");

        this.ruleFor(x => x.address)
            .maxLength(10)
            .withMessage("Address cant be more than 10 characters");
    }
}

const UserItem_UPDATE_ITEM = "UserItem_UPDATE_ITEM";
@repository("@@UserItem", "UserItem.detail")
export class UserItemStore extends FormStore<UserItem> {
    baseUrl: string = "api/user";

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

    public async Update(item: UserItem) {
        var result = await super.patch(UserItem_UPDATE_ITEM, `${item.id}`, item) as any;
        return result.data as CommandResult<UserItem>;
    }

    @reduce(UserItem_UPDATE_ITEM)
    protected onUpdateBillingOrder(): AsyncAction<AxiosResponse<CommandResult<UserItem>>, DataModel<UserItem>> {
        return super.onPatch();
    }
}