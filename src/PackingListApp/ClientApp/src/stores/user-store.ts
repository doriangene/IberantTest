import { DataStore, DataModel } from './dataStore';
import { FormStore } from './formStore';
import { repository, reduce, AsyncAction } from 'redux-scaffolding-ts';
import { Validator } from "lakmus";
import { AxiosResponse } from 'axios';
import { container } from '../inversify.config';
import { CommandResult } from './types';

export interface UserData {
    id: number;
    name: string; 
    lastName: string;
    address: string;
}

@repository("@@UserData", "UserData.summary")
export class UsersDataStore extends DataStore<UserData> {
    baseUrl: string = "api/user";

    constructor() {
        super('UserData', {
            count: 0,
            isBusy: false,
            items: [],
            result: undefined,
            discard: item => { }
        }, container);
    }

  

   
}

export interface NewUserData {
    name: string,
    lastName: string,
    address: string,
}

export class NewUserDataValidator extends Validator<NewUserData> {
    constructor() {
        super();

        this.ruleFor(x => x.name)
            .notNull()
            .withMessage("Name cant be empty");

        this.ruleFor(x => x.lastName)
            .notNull()
            .withMessage("Last name cant be empty");
    }
}

@repository("@@UserData", "UserData.new")
export class NewUserDataStore extends FormStore<NewUserData> {
    baseUrl: string = "api/user";

    protected validate(item: NewUserData) {
        return (new NewUserDataValidator()).validate(item);
    }

    constructor() {
        super('NEW_UserData', {
            isBusy: false,
            status: 'New',
            item: undefined,
            result: undefined
        }, container);
    }
}



export class UserValidator extends Validator<UserData> {
    constructor() {
        super();

        this.ruleFor(x => x.name)
            .notNull()
            .withMessage("Name can not be null");

    }
}

const UserData_UPDATE_ITEM = "UserData_UPDATE_ITEM";
@repository("@@UserData", "UserData.detail")
export class UserDataStore extends FormStore<UserData> {
    baseUrl: string = "api/user";

    protected validate(item: UserData) {
        return new UserValidator().validate(item);
    }

    constructor() {
        super('UserData', {
            isBusy: false,
            status: 'New',
            item: undefined,
            result: undefined
        }, container);
    }

    public async Update(item: UserData) {
        var result = await super.patch(UserData_UPDATE_ITEM, `${item.id}`, item) as any;
        return result.data as CommandResult<UserData>;
    }

    @reduce(UserData_UPDATE_ITEM)
    protected onUpdateBillingOrder(): AsyncAction<AxiosResponse<CommandResult<UserData>>, DataModel<UserData>> {
        return super.onPatch();
    }
}