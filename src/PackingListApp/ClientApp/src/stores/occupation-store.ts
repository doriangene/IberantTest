import { DataStore, DataModel } from './dataStore';
import { FormStore } from './formStore';
import { repository, reduce, AsyncAction } from 'redux-scaffolding-ts';
import { Validator } from "lakmus";
import { AxiosResponse } from 'axios';
import { container } from '../inversify.config';
import { CommandResult } from './types';

export interface Occupation {
    id: number;
    title: string; 
    description: string;
}

@repository("@@Occupation", "Occupation.summary")
export class OccupationsStore extends DataStore<Occupation> {
    baseUrl: string = "api/occupation";

    constructor() {
        super('Occupation', {
            count: 0,
            isBusy: false,
            items: [],
            result: undefined,
            discard: item => { }
        }, container);
    }
}

export interface NewOccupation {
    title: string,
    description: string,
}

export class NewTestValidator extends Validator<NewOccupation> {
    constructor() {
        super();

        this.ruleFor(x => x.title)
            .notNull()
            .withMessage("Title cant be empty");
    }
}

@repository("@@Occupation", "Occupation.new")
export class NewOccupationStore extends FormStore<NewOccupation> {
    baseUrl: string = "api/occupation";

    protected validate(item: NewOccupation) {
        return (new NewTestValidator()).validate(item);
    }

    constructor() {
        super('NEW_Occupation', {
            isBusy: false,
            status: 'New',
            item: undefined,
            result: undefined
        }, container);
    }
}



export class TestValidator extends Validator<Occupation> {
    constructor() {
        super();

        this.ruleFor(x => x.title)
            .notNull()
            .withMessage("Title can not be null");

    }
}

const Occupation_UPDATE_ITEM = "Occupation_UPDATE_ITEM";
@repository("@@Occupation", "Occupation.detail")
export class OccupationStore extends FormStore<Occupation> {
    baseUrl: string = "api/test";

    protected validate(item: Occupation) {
        return new TestValidator().validate(item);
    }

    constructor() {
        super('Occupation', {
            isBusy: false,
            status: 'New',
            item: undefined,
            result: undefined
        }, container);
    }

    public async Update(item: Occupation) {
        var result = await super.patch(Occupation_UPDATE_ITEM, `${item.id}`, item) as any;
        return result.data as CommandResult<Occupation>;
    }

    @reduce(Occupation_UPDATE_ITEM)
    protected onUpdateBillingOrder(): AsyncAction<AxiosResponse<CommandResult<Occupation>>, DataModel<Occupation>> {
        return super.onPatch();
    }
}