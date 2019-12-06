import * as React from 'react';
import autobind from 'autobind-decorator';
import { Select } from 'antd';
const Option = Select.Option;
import { ItemReference, QueryResult } from '../../stores/dataStore';
import '../../utils/linq';

interface SelectionInputProps {
    className?: string;
    searchable?: boolean;
    disabled?: boolean;
    nullable?: boolean;
    minWidth?: number;
    width?: number;
    // readonly: boolean,
    content?: (item: any) => React.ReactElement<any>;
    multiple?: boolean;
    forcereload?: boolean;
    searchQuery?: string;
    placeholder?: string;
    valueAsItemReference?: boolean,
    value: ItemReference | ItemReference[] | string | string[];
    onChange: (item: ItemReference | ItemReference[] | string | string[] | undefined) => void;
    options?: SelectionItem[];
    query?: (searchQuery: string, selectedValue: any) => Promise<QueryResult<ItemReference>>;
    hideText?: boolean;
    url?: string;
    // onAdd: (item: ItemReference) => void,
    // onRemove: (item: ItemReference) => void
}

interface SelectionInputState {
    isFetching: boolean;
    url?: string;
    isDirty: boolean;
    searchQuery: string;
    lastSearchQuery: string;
    options: SelectionItem[];
    value?: string | string[];
    query?: (searchQuery: string, selectedValue: any) => Promise<QueryResult<ItemReference>>;
    forcereload?: boolean;
}

export interface SelectionItem {
    key: string;
    text: string;
    value: string;
    object?: any;
}

export default class SelectionInput extends React.Component<SelectionInputProps, SelectionInputState> {
    constructor(props: SelectionInputProps) {
        super(props);

        if (!props.options && !props.query) {
            throw Error('One of the \'options\' or \'query\' properties must be specified');
        }

        if (props.options && props.query) {
            throw Error('Only one of the \'options\' or \'query\' properties must be specified at the same time');
        }

        let value: string | string[] | undefined = undefined;
        if (props.value) {
            if (props.value instanceof Array) {
                value = (this.props.value as ItemReference[]).map((o) => o.id);
            } else {
                if ((this.props.value as ItemReference).id) {
                    value = (this.props.value as ItemReference).id;
                } else {
                    value = this.props.value as string;
                }
            }
        }

        this.state = {
            isFetching: false,
            isDirty: false,
            searchQuery: props.searchQuery || "",
            lastSearchQuery: "",
            options: (props.options || [] as SelectionItem[]),
            value,
            query: this.props.query,
            url: this.props.url,
            forcereload: this.props.forcereload
        };
        if (this.state.value)
            this.reload();
    }

    componentWillReceiveProps(nextProps: SelectionInputProps) {
        if (nextProps.value != this.props.value) {
            this.setState({ value: (nextProps.value ? `${nextProps.value}` : nextProps.value) as any }, () => {
                if (this.state.options.all(o => o.key != nextProps.value))
                    this.reload();
            });
        }
        if (nextProps.url !== this.props.url) {
            let value: string | string[] | undefined = undefined;
            if (nextProps.value) {
                if (nextProps.value instanceof Array) {
                    value = (nextProps.value as ItemReference[]).map((o) => o.id);
                } else {
                    if ((nextProps.value as ItemReference).id) {
                        value = (nextProps.value as ItemReference).id;
                    } else {
                        value = nextProps.value as string;
                    }
                }
            }
            this.setState({
                url: nextProps.url,
                query: nextProps.query,
                isFetching: false,
                isDirty: false,
                options: (nextProps.options || [] as SelectionItem[]),
                value,
            }, () => {
                this.reload();
            });
        }
    }

    @autobind
    private handleChange(value: string | string[]) {
        if (value === undefined) {
            this.setState({ value: undefined, searchQuery: "" }, () => this.props.onChange(undefined));
            return;
        }
        if (this.props.multiple) {
            //const filteredOptions = this.state.options.filter((o) => value.some((v) => v === o.value));
            //const items: ItemReference[] | string[] = filteredOptions.map((itm) => itm.object || itm.value);
            //this.props.onChange(items);
            //this.setState({ value: filteredOptions.map((itm) => itm.value) });
        } else {
            const filteredOptions = this.state.options.filter((o) => o.value === value);
            if (filteredOptions.length > 0) {
                const item: ItemReference | string = filteredOptions[0].object || filteredOptions[0].value;
                this.props.onChange(item);
                this.setState({ value: filteredOptions[0].value });
            }
        }
    }

    @autobind
    private handleSearchChange(searchQuery: string) {
        if (this.state.forcereload) {
            this.setState({ searchQuery }, () => this.reload());
            return;
        }
        if (this.state.searchQuery != searchQuery) {
            this.setState({ searchQuery }, () => this.reload());
        }
    }

    @autobind
    private async reload() {
        if (this.state.lastSearchQuery == this.state.searchQuery && this.state.options.any(o => o.key == this.state.value) && !this.state.forcereload)
            return;

        const addContent = (item: any, obj: any) => {
            item.searchableText = item.text;
            if (this.props.content) {
                item.text = this.props.content(obj);
            }
            return item;
        };

        if (this.props.options) {
            this.setState({
                isDirty: false,
                isFetching: false,
                options: this.props.options.filter((o) => o.text.includes(this.state.searchQuery)).map((o) => addContent(o, o))
            });
            return;
        }

        if (this.state.isFetching) {
            this.setState({ isDirty: true });
            return;
        }

        this.setState({ isFetching: true });
        const queryResult = await this.state.query!(this.state.searchQuery, this.state.value);

        var itemReference = (this.props.value as ItemReference);
        if (this.props.value && queryResult.items.filter((o) => o.id == (itemReference.id ? itemReference : this.props.value)).length === 0) {
            const item = (this.props.value as ItemReference);
            queryResult.items.push({
                id: item.id,
                title: item.title
            });
        }

        let options = (queryResult.items || []).map((o) => addContent({
            key: o.id == null ? 'NULL_VALUE' : o.id,
            value: o.id,
            text: o.title,
            object: o
        } as SelectionItem, o));

        //if (this.state.options) {
        //    this.state.options.forEach((o) => {
        //        if (options.filter((e) => e.value === o.value).length === 0) {
        //            options.push(o);
        //        }
        //    });
        //    options = options.orderBy((o) => o.value) as any[];
        //}

        //if (this.props.nullable && options.filter((o) => o.value == null).length === 0) {
        //    options.push({
        //        key: '',
        //        object: null,
        //        text: this.props.placeholder || '',
        //        value: ""
        //    } as SelectionItem);
        //}

        let changedItem: any = undefined;
        var value = this.state.value;
        if (!this.props.nullable && (this.state.value == null || this.state.value.length === 0) && options.length > 0) {
            const item: ItemReference = options[0].object || { id: options[0].value, title: options[0].text };
            if (this.props.multiple) {
                changedItem = [item];
                value = [options[0].value];
            } else {
                changedItem = item;
                value = options[0].value;
            }
        }

        if (value) {
            if (options.filter(o => o.key == value).length == 0) {
                value = undefined;
            }
        }

        const isDirty = this.state.isDirty;
        this.setState({ options, value: value ? `${value}` : undefined, isFetching: false, isDirty: false, lastSearchQuery: this.state.searchQuery });

        if (changedItem) {
            this.props.onChange(this.props.valueAsItemReference ? changedItem : value);
        }

        if (isDirty) {
            setTimeout(() => this.reload());
        }
    }

    render() {
        const { isFetching, options, value } = this.state;
        var name = options.firstOrDefault((t) => t.value == value);
        const { multiple, searchable, placeholder, hideText } = this.props;
        return <Select style={{ minWidth: this.props.minWidth, width: this.props.width || '100%' }}
            className={this.props.className}
            mode={multiple ? 'multiple' : 'default'}
            disabled={this.props.disabled}
            allowClear={this.props.nullable}
            value={name ? name.text : value}
            placeholder={placeholder}
            loading={isFetching}
            filterOption={false}
            autoClearSearchValue={false}
            showSearch={searchable}
            onChange={(o: any) => this.handleChange(o)}
            onDropdownVisibleChange={(open) => this.reload()}
            onSearch={this.handleSearchChange}>
            {options.map(o => <Option key={o.key} value={o.value}>
                {this.props.content ? this.props.content(o.object) : <span>{o.text}</span>}
            </Option>)}
        </Select>
    }
}