import { DataStore, DataModel } from './dataStore';
import { FormStore } from './formStore';
import { repository, reduce, AsyncAction } from 'redux-scaffolding-ts';
import { Validator } from "lakmus";
import { AxiosResponse } from 'axios';
import { container } from '../inversify.config';
import { CommandResult } from './types';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
}

@repository("@@User", "User.summary") // TODO
export class UsersStore extends DataStore<User> {
    /// A store to handle the list of users 

    baseUrl: string = "api/user";

    constructor() {
        super('User', { // Creo que User es el nombre de la entidad en back
            count: 0,
            isBusy: false,
            items: [],
            result: undefined,
            discard: item => { }
        }, container);
    }
}


export interface NewUser {
    firstName: string;
    lastName: string;
    address: string;
}

export class NewUserValidator extends Validator<NewUser> {
    constructor() {
        super();

        this.ruleFor(x => x.firstName)
            .notNull()
            .withMessage("User name can't be empty");

        this.ruleFor(x => x.lastName)
            .notNull()
            .withMessage("User last name can't be empty")

        this.ruleFor(x => x.address)
            .notNull()
            .withMessage("")
    }
}

@repository("@@User", "User.new") // TODO
export class NewUserStore extends FormStore<NewUser> {
    // Store to handle user creation (including validation)

    baseUrl: string = "api/user";

    protected validate(item: NewUser) {
        return (new NewUserValidator()).validate(item);
    }

    constructor() {
        super('NEW_User', {
            isBusy: false,
            status: 'New',
            item: undefined,
            result: undefined
        }, container);
    }
}



export class UserValidator extends Validator<User> {
    constructor() {
        super();

        this.ruleFor(x => x.firstName)
            .notNull()
            .withMessage("User name can't be empty");

        this.ruleFor(x => x.lastName)
            .notNull()
            .withMessage("User last name can't be empty")

        this.ruleFor(x => x.address)
            .notNull()
            .withMessage("")

    }
}

const User_UPDATE_ITEM = "User_UPDATE_ITEM";
@repository("@@User", "User.detail")
export class UserStore extends FormStore<User> {
    //? Añadir y editar utilizan vistas y, por lo tanto, 
    //acciones distintas, así que se utilizan dos stores.

    baseUrl: string = "api/user";

    protected validate(item: User) {
        return new UserValidator().validate(item);
    }

    constructor() {
        super('User', {
            isBusy: false,
            status: 'New',
            item: undefined,
            result: undefined
        }, container);
    }

    public async Update(item: User) {
        var result = await super.patch(User_UPDATE_ITEM, `${item.id}`, item) as any;
        return result.data as CommandResult<User>;
    }

    //@reduce(User_UPDATE_ITEM) //? TF is this
    //protected onUpdateBillingOrder(): AsyncAction<AxiosResponse<CommandResult<User>>, DataModel<User>> {
    //    return super.onPatch();
    //}
}