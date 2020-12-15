import { DataStore } from "./dataStore";
import { FormStore } from "./formStore";
import { repository } from "redux-scaffolding-ts";
import { Validator } from "lakmus";
import { container } from "../inversify.config";

export enum AdminType {
  Normal,
  VIP,
  King
}

export interface MyUserItem {
  id: number;
  name: string;
  lastName: string;
  address: string;
  description: string;
  isAdmin: boolean;
  adminType: string;
}

@repository("@@MyUserItem", "MyUserItem.summary")
export class MyUserItemStore extends DataStore<MyUserItem> {
  protected get baseUrl(): string {
    return "api/myuser";
  }

  constructor() {
    super(
      "MyUser",
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

export interface NewMyUserItem {
  name: string;
  lastName: string;
  address: string;
  description: boolean;
  isAdmin: boolean;
  adminType: string;
}

export class NewMyUserItemValidator extends Validator<NewMyUserItem> {
  constructor() {
    super();

    // validation rules for name, last name and address
    const MAX_CHARS_FOR_DESCRIPTION = 13;
    const notNullMessage = (propName: string) =>
      `MyUser instance does not admit null values for property "${propName}".`;

    this.ruleFor(item => item.name)
      .notNull()
      .withMessage(notNullMessage("name"));
    this.ruleFor(item => item.lastName)
      .notNull()
      .withMessage(notNullMessage("last name"));
    this.ruleFor(item => item.address)
      .notNull()
      .withMessage(notNullMessage("address"));
    this.ruleFor(item => item.description)
      .maxLength(MAX_CHARS_FOR_DESCRIPTION)
      .withMessage(
        `MyUser description cannot exceed ${MAX_CHARS_FOR_DESCRIPTION} characters.`
      );
  }
}

@repository("@@MyUserItem", "MyUserItem.new")
export class NewMyUserItemStore extends FormStore<NewMyUserItem> {
  baseUrl: string = "api/myuser";

  protected validate = (item: NewMyUserItem) =>
    new NewMyUserItemValidator().validate(item);

  constructor() {
    super(
      "NEW_MyUserItem",
      {
        isBusy: false,
        status: "New",
        item: undefined,
        result: undefined
      },
      container
    );
  }
}
