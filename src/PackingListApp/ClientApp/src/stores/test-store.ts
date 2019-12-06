import { DataStore, DataModel } from './dataStore';
import { FormStore } from './formStore';
import { repository, reduce, AsyncAction } from 'redux-scaffolding-ts';
import { Validator } from "lakmus";
import { AxiosResponse } from 'axios';
import { container } from '../inversify.config';
import { CommandResult } from './types';

export interface TestItem {
    id: number;
    title: string; 
    description: string;
}

@repository("@@TestItem", "TestItem.summary")
export class TestItemsStore extends DataStore<TestItem> {
    baseUrl: string = "api/test";

    constructor() {
        super('TestItem', {
            count: 0,
            isBusy: false,
            items: [],
            result: undefined,
            discard: item => { }
        }, container);
    }

  

   
}

export interface NewTestItem {
    title: string,
    description: string,
}

export class NewTestValidator extends Validator<NewTestItem> {
    constructor() {
        super();

        this.ruleFor(x => x.title)
            .notNull()
            .withMessage("Title cant be empty");
    }
}

@repository("@@TestItem", "TestItem.new")
export class NewTestItemStore extends FormStore<NewTestItem> {
    baseUrl: string = "api/test";

    protected validate(item: NewTestItem) {
        return (new NewTestValidator()).validate(item);
    }

    constructor() {
        super('NEW_TestItem', {
            isBusy: false,
            status: 'New',
            item: undefined,
            result: undefined
        }, container);
    }
}



export class TestValidator extends Validator<TestItem> {
    constructor() {
        super();

        this.ruleFor(x => x.title)
            .notNull()
            .withMessage("Title can not be null");

    }
}

const TestItem_UPDATE_ITEM = "TestItem_UPDATE_ITEM";
@repository("@@TestItem", "TestItem.detail")
export class TestItemStore extends FormStore<TestItem> {
    baseUrl: string = "api/test";

    protected validate(item: TestItem) {
        return new TestValidator().validate(item);
    }

    constructor() {
        super('TestItem', {
            isBusy: false,
            status: 'New',
            item: undefined,
            result: undefined
        }, container);
    }

    public async Update(item: TestItem) {
        var result = await super.patch(TestItem_UPDATE_ITEM, `${item.id}`, item) as any;
        return result.data as CommandResult<TestItem>;
    }

    @reduce(TestItem_UPDATE_ITEM)
    protected onUpdateBillingOrder(): AsyncAction<AxiosResponse<CommandResult<TestItem>>, DataModel<TestItem>> {
        return super.onPatch();
    }
}