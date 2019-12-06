export interface Message {
    propertyName?: string;
    body: string;
    level: 'Info' | 'Warning' | 'Error';
}

export interface CommandResult<T> {
    isSuccess: boolean;
    identifier?: string;
    aggregateRootId?: string;
    title?: string | undefined;
    messages: Message[];
    items: T[];
}

export interface CommandModel<T> {
    isBusy: boolean;
    result: CommandResult<T> | undefined;
}
