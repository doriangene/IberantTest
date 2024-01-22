import { DataStore, DataModel } from './dataStore';
import { FormStore } from './formStore';
import { repository, reduce, AsyncAction } from 'redux-scaffolding-ts';
import { Validator } from "lakmus";
import { AxiosResponse } from 'axios';
import { container } from '../inversify.config';
import { CommandResult } from './types';

export interface OccupationItem {
    id: number;
    title: string; 
    description: string;
}

@repository("@@OccupationItem", "OccupationItem.summary")
export class OccupationItemsStore extends DataStore<OccupationItem> {
    baseUrl: string = "api/occupation";

    constructor() {
        super('OccupationItem', {
            count: 0,
            isBusy: false,
            items: [],
            result: undefined,
            discard: item => { }
        }, container);
    }

  

   
}

export interface NewOccupationItem {
    title: string,
    description: string,
}

export class NewOccupationValidator extends Validator<NewOccupationItem> {
    constructor() {
        super();

        this.ruleFor(x => x.title)
            .notNull()
            .withMessage("Title cant be empty");
    }
}

@repository("@@OccupationItem", "OccupationItem.new")
export class NewOccupationItemStore extends FormStore<NewOccupationItem> {
    baseUrl: string = "api/occupation";

    protected validate(item: NewOccupationItem) {
        return (new NewOccupationValidator()).validate(item);
    }

    constructor() {
        super('NEW_OccupationItem', {
            isBusy: false,
            status: 'New',
            item: undefined,
            result: undefined
        }, container);
    }
}



export class OccupationValidator extends Validator<OccupationItem> {
    constructor() {
        super();

        this.ruleFor(x => x.title)
            .notNull()
            .withMessage("Title can not be null");

    }
}

//const OccupationItem_UPDATE_ITEM = "OccupationItem_UPDATE_ITEM";
@repository("@@OccupationItem", "OccupationItem.detail")
export class OccupationItemStore extends FormStore<OccupationItem> {
    baseUrl: string = "api/occupation";

    protected validate(item: OccupationItem) {
        return new OccupationValidator().validate(item);
    }

    constructor() {
        super('OccupationItem', {
            isBusy: false,
            status: 'New',
            item: undefined,
            result: undefined
        }, container);
    }

    //public async Update(item: OccupationItem) {
    //    var result = await super.patch(OccupationItem_UPDATE_ITEM, `${item.id}`, item) as any;
    //    return result.data as CommandResult<OccupationItem>;
    //}

    //@reduce(OccupationItem_UPDATE_ITEM)
    //protected onUpdateBillingOrder(): AsyncAction<AxiosResponse<CommandResult<OccupationItem>>, DataModel<OccupationItem>> {
    //    return super.onPatch();
    //}
}