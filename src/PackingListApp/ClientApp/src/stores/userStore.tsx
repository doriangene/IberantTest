import { Validator } from 'lakmus';
import { repository } from 'redux-scaffolding-ts';
import { SelectionItem } from '../components/form/selectionInput';
import { container } from '../inversify.config';
import { DataStore } from './dataStore';
import { FormStore } from './formStore';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    description: string;
    isAdmin: boolean;
    adminType: AdminType;
}

@repository('@@User', 'User.summary') // TODO
export class UsersStore extends DataStore<User> {
    /// A store to handle the list of users

    public baseUrl: string = 'api/user';

    constructor() {
        super(
            'User',
            {
                count: 0,
                isBusy: false,
                items: [],
                result: undefined,
                discard: item => {}
            },
            container
        );
    }
}

export enum AdminType {
    // The options are not in sync with backend :(
    Normal,
    Vip,
    King
}

export interface NewUser {
    firstName: string;
    lastName: string;
    address: string;
    description: string;
    isAdmin: boolean;
    adminType: AdminType;
}

export class NewUserValidator extends Validator<NewUser> {
    constructor() {
        super();

        this.ruleFor(x => x.firstName)
            .notNull()
            .withMessage("User name can't be empty");

        this.ruleFor(x => x.lastName)
            .notNull()
            .withMessage("User last name can't be empty");

        this.ruleFor(x => x.address)
            .notNull()
            .withMessage("User address can't be empty");
    }
}

@repository('@@User', 'User.new') // TODO
export class NewUserStore extends FormStore<NewUser> {
    // Store to handle user creation (including validation)

    public baseUrl: string = 'api/user';

    constructor() {
        super(
            'NEW_User',
            {
                isBusy: false,
                status: 'New',
                item: undefined,
                result: undefined
            },
            container
        );
    }

    protected validate(item: NewUser) {
        return new NewUserValidator().validate(item);
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
            .withMessage("User last name can't be empty");

        this.ruleFor(x => x.address)
            .notNull()
            .withMessage("User address can't be empty");
    }
}
