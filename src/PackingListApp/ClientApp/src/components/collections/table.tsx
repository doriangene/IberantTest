import React, { cloneElement } from 'react';
import autobind from 'autobind-decorator';
import { DataModel, ItemModel, ItemState, SortDirection, Query } from '../../stores/dataStore';
import { Table as AntTable, Alert, Input, InputNumber, Row, Col, Button, Icon, Dropdown, Menu, Popconfirm, Modal, Select, Form, Card, Tooltip, Upload } from 'antd';
let Option = Select.Option;
let Search = Input.Search;
import { clone, getProperties } from '../../utils/object';
import '../../utils/linq';
import HttpService from "../../services/http-service";
import FileSaver from 'file-saver';
import { withSize } from 'react-sizeme'
import { CommandResult } from '../../stores/types';
import { resolve } from '../../inversify.config';

export interface TableSortFieldDefinition {
    field: string;
    text: string;
    useProfile: boolean;
}

export interface TableColumn<T> {
    field: string;
    title: string;
    visible?: boolean;
    required?: boolean;
    align?: 'left' | 'right' | 'center';
    sortable?: boolean;
    sortField?: string;
    filter?: TableColumnFilter | React.ReactNode;
    fiterField?: string;
    filterByQueryString?: boolean;
    collapsing?: boolean;
    selectableHeader?: boolean;
    headerRenderer?: (title: string, onFilter?: (id: string, key: string, op: string, value: string, preventReload?: boolean) => void, onClearFilter?: (id: string, preventReload?: boolean) => void) => any;
    renderer?: (item: T) => any;
    editorValuePropName?: string,
    editor?: (item: T) => any;
}

export interface TableColumnFilter {
    children: React.ReactNode,
}

export interface TableModel<T> {
    query: Query,
    columns: TableColumn<T>[];
    data: DataModel<T>;
    sortFields?: TableSortFieldDefinition[];
}

export interface TableProps<T> {
    error?: string;
    title?: string | React.ReactNode;
    rowKey: string;
    embedded?: boolean;
    headerMarginRight?: number;
    headerMarginLeft?: number;
    model: TableModel<T>;
    onRefresh?: () => void;
    onExportToExcel?: () => void;
    exportable?: boolean;
    canCreateNew?: boolean;
    onNewItem?: () => void;
    canEdit?: boolean;
    canSort?: boolean;
    onSaveRow?: (item: T, state: ItemState) => Promise<CommandResult<any>>;
    canDelete?: boolean;
    deleteLabel?: string;
    onDeleteRow?: (item: T, state: ItemState) => Promise<CommandResult<any>>;
    onRowClick?: (item: T, state: ItemState) => void;
    searchText?: string
    onQueryChanged: (query: Query) => void;
    searchWidth?: number;
    bulkTemplateUrl?: string;
    bulkInsertUrl?: string;
    bulkTemplateName?: string;
    hidepagination?: boolean;
    hideSearch?: boolean;
    hideRefresh?: boolean;
    onSelection?: (ids: any[]) => void;
    autosave?: boolean;
    saveAllDone?: () => void;
    // added this prop to get user for edition modal
    onModalOpen?: (item: T) => void;

    //onPageChange?: (skip: number, take: number) => void;
    //onSearchFilterChanged?: (q: string) => void;
    //onFilterChanged?: (filterObject: any) => void;
    //onOrderByChanged?: (orderBy: string, orderDirection: SortDirection) => void;
    //editLabel?: string;
    //extraActions?: {content: any, onClick: (item: T) => void}[];
    //disallowHidingColumns?: boolean;
}

export interface TableState<T> {
    rowKey: string;
    columns: TableColumn<T>[];
    searchFilter: string;
    data: TableRow<T>[];
    result: CommandResult<any> | undefined;
    showDeleteConfirm: boolean;
    toDelete: TableRow<T> | undefined;
    pageSize: number;
    activePage: number;
    totalPages: number;
    totalItems: number;
    filter: { [id: string]: { key: string, op: string, value: string } };
    selectedRowKeys: any[];
    showConfirmDeletion: boolean;
    editingKeys: any[];
    saveAllDone?: () => void;
    filters: any;
    parameters: any;
    uploading: boolean;
    uploadingError?: any;

}

type RowMode = 'editor' | 'normal';

interface TableRow<T> {
    item: T;
    state: ItemState;
    original: T;
    mode: RowMode;
    selected: boolean;
    actionsMenuOpened: boolean;
}

const FormItem = Form.Item;
const EditableContext = React.createContext({});

const EditableRow = (props: any) => (
    <EditableContext.Provider value={props.form}>
        <tr {...props} />
    </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component<any> {
    render() {
        let {
            centered,
            required,
            editing,
            editor,
            dataIndex,
            title,
            inputType,
            record,
            index,
            editorValuePropName,
            ...restProps
        } = this.props;
        return (
            <EditableContext.Consumer>
                {(form: any) => {
                    const { getFieldDecorator } = form;
                    return (
                        <td {...restProps} className={editing ? `ant-table-cell-editing ${restProps.className}` : restProps.className} style={{ textAlign: centered ? 'center' : '', ...restProps.style }}>
                            {editing && editor ? (
                                <FormItem style={{ margin: 0 }}>
                                    {getFieldDecorator(dataIndex, {
                                        valuePropName: editorValuePropName || 'value',
                                        initialValue: record[dataIndex],
                                        rules: [{
                                            required: required || false,
                                            message: `Field '${title}' is required!`,
                                        }]
                                    })(editor(record))}
                                </FormItem>
                            ) : restProps.children}
                        </td>
                    );
                }}
            </EditableContext.Consumer>
        );
    }
}

interface FilterComponentProps {
    value: any,
    onChange: (value: any) => void;
}

class FilterComponent extends React.Component<FilterComponentProps> {
    constructor(props: FilterComponentProps) {
        super(props);
        this.state = {}
    }

    @autobind
    public onValueChanged(value: any) {
        this.props.onChange(value);
    }

    @autobind
    public onClearFilter() {
        this.props.onChange(undefined);
    }

    public render() {
        if (!this.props.children)
            return <Card>filter not configured</Card>

        return <Card style={{ minWidth: 320 }}>{React.cloneElement(this.props.children as any, { value: this.props.value, onChange: this.onValueChanged })}{this.props.value && <a style={{ float: 'right', marginTop: 10 }} onClick={this.onClearFilter}>Clear filter</a>}</Card>
    }
}

class Table<T> extends React.Component<TableProps<T>, TableState<T>> {

    constructor(props: TableProps<T>) {
        super(props);
        this.state = {
            columns: this.props.model.columns,
            searchFilter: '',
            data: this.BuildRows(props.model.data),
            result: undefined,
            showDeleteConfirm: false,
            toDelete: undefined,
            activePage: 1,
            pageSize: 10,
            totalPages: 1,
            totalItems: 0,
            filter: {},
            selectedRowKeys: [],
            showConfirmDeletion: false,
            editingKeys: [],
            rowKey: props.rowKey || 'id',
            filters: {},
            parameters: {},
            uploading: false,
        };
        this.editingDictionary = [];
    }


    editingDictionary: any[];
    componentWillReceiveProps(nextProps: TableProps<T>) {
        this.setState({
            data: this.BuildRows(nextProps.model.data),
            result: undefined,
            totalItems: nextProps.model.data.count,
            totalPages: Math.ceil((nextProps.model.data == null ? 1 : nextProps.model.data.count) / this.state.pageSize),
        });
    }
    componentDidUpdate(prevProps: TableProps<T>) {
        if (prevProps.autosave != undefined && prevProps.autosave != this.props.autosave) {
            this.SaveAll();

        }
    }


    public async SaveAll() {
        var self = this
        var keys = { ...self.state.editingKeys };
        for (var i = 0; i < this.state.editingKeys.length; i++) {
            
            var key = keys[i];
            var model = self.editingDictionary.firstOrDefault(o => (o as any)["Key"] == key);
            var form = model["Form"];
            var values = form.getFieldsValue();
            if (self.props.onSaveRow) {
                var obj = self.state.data.filter(o => (o.item as any)[self.state.rowKey] == key)[0];
                values[self.state.rowKey] = ((obj || {}).item || {} as any)[self.state.rowKey];
                var result = await self.props.onSaveRow(values, ((obj || {}).state || 'New'));
                if (result && result.isSuccess) {
                    if (obj != null) {
                        obj.item = Object.assign(clone((obj || {} as any).item || {} as any), values);
                        if (result.identifier) {
                            (obj as any)[this.props.rowKey] = result.identifier;
                        }
                        obj.state = 'Unchanged';
                        obj.mode = 'normal';
                    }
                   await self.setState({ editingKeys: self.state.editingKeys.filter(o => o != values[self.state.rowKey]) });
                }
                else {
                    return;
                }

            }

        }
        if (self.state.editingKeys.length > 0) {
            this.SaveAll();
            return;
        }
        if (this.props.saveAllDone) {
           
            this.props.saveAllDone();
        }
    }

    private BuildRows(result: DataModel<T>): TableRow<T>[] {
        const data = result == null ? [] : (result.items || []);
        return data.map((o) => ({
            state: o.state,
            item: o.item,
            original: o.item,
            mode: o.state === 'New' ? 'editor' : 'normal',
            actionsMenuOpened: false,
            selected: false,
        } as TableRow<T>));
    }

    //@autobind
    //private openNewForm() {
    //    this.props.onNewItem();
    //}

    @autobind
    private async onDeleteRow() {
        const row = this.state.toDelete;
        if (this.props.onDeleteRow && row) {
            this.hideConfirmModal();
            const result = await this.props.onDeleteRow(row.item, row.state);
            if (result && result.isSuccess) {
                this.props.model.data.discard(row.item);
                this.setState({ data: this.state.data.filter((o) => o.item !== row.item) });
            }
        }
    }

    @autobind
    private onSortDirection() {
        var query = clone<Query>(this.props.model.query);
        query.orderBy = [{
            field: query!.orderBy![0].field,
            direction: (query!.orderBy![0].direction || 'Ascending') === 'Ascending' ? 'Descending' : 'Ascending',
            useProfile: query!.orderBy![0].useProfile
        }];
        if (this.props.onQueryChanged)
            this.props.onQueryChanged(query);
    }

    @autobind
    private async onExportToExcel() {
        if (this.props.onExportToExcel) {


            await this.props.onExportToExcel();
        }
    }

    @autobind
    private hideConfirmModal() {
        this.setState({ showDeleteConfirm: false, toDelete: undefined });
    }

    //@autobind
    //private showConfirmModal(row: TableRow<T>) {
    //    row.actionsMenuOpened = false;
    //    this.forceUpdate();
    //    this.setState({showDeleteConfirm: true, toDelete: row});
    //}

    @autobind
    private handlePaginationChange(currentPage: number) {
        if (currentPage !== this.state.activePage) {
            this.setState({
                activePage: currentPage
            });

            var query = clone<Query>(this.props.model.query);

            query.skip = (currentPage - 1) * this.state.pageSize;
            query.take = this.state.pageSize;

            this.props.model.query = query;

            if (this.props.onQueryChanged)
                this.props.onQueryChanged(query);
        }
    }

    @autobind
    private handlePageSizeChange(pageSize: number) {
        if (pageSize !== this.state.pageSize) {
            this.setState({
                pageSize: pageSize,
                activePage: 1,
            });

            var query = clone<Query>(this.props.model.query);

            query.skip = 0;
            query.take = pageSize;

            if (this.props.onQueryChanged)
                this.props.onQueryChanged(query);
        }
    }

    @autobind
    private onFilterChanged(filterByQueryString: boolean, filterObject: any) {
        var query = clone<Query>(this.props.model.query);

        if (filterByQueryString) {
            query.parameters = filterObject;
        } else {
            query.filter = filterObject;
        }

        if (this.props.onQueryChanged)
            this.props.onQueryChanged(query);
    }

    @autobind
    private onOrderByChanged(field: string, direction: SortDirection, useProfile: boolean) {
        var query = clone<Query>(this.props.model.query);

        query.orderBy = [{
            field: field,
            direction: direction,
            useProfile: useProfile
        }];

        if (this.props.onQueryChanged)
            this.props.onQueryChanged(query);
    }

    @autobind
    private onSearchFilterChanged(value: string) {
        var query = clone<Query>(this.props.model.query);
        if (!query.parameters)
            query.parameters = {} as any;

        (query.parameters as any)['$search'] = value;

        if (this.props.onQueryChanged)
            this.props.onQueryChanged(query);
    }

    //private getOnClick = (data: TableRow<T>) => {
    //    if (this.props.onRowClick == null || data.mode === 'editor' ) {
    //        return null;
    //    } else {
    //        return () => this.props.onRowClick(data.item, data.state);
    //    }
    //}

    //private addFilter = (id: string, key: string, op: string, value: string, preventReload?: boolean) => {
    //    const filter = this.state.filter;
    //    filter[id] = {key, op, value};
    //    this.setState({filter}, () => {
    //        if (!preventReload && this.props.onFilterChange) {
    //            this.setState({activePage: 1});
    //            const filters = getProperties(filter).map((kvp) => kvp.value);
    //            this.props.onFilterChange(filters);
    //        }
    //    });
    //}

    //private removeFilter = (id: string, preventReload?: boolean) => {
    //    const filter = this.state.filter;
    //    delete filter[id];

    //    this.setState({filter}, () => {
    //        if (!preventReload && this.props.onFilterChange) {
    //            this.setState({activePage: 1});
    //            const filters = getProperties(filter).map((kvp) => kvp.value);
    //            this.props.onFilterChange(filters);
    //        }
    //    });
    //}

    @autobind
    private onSelectChange(selectedRowKeys: any[]) {
        this.setState({ selectedRowKeys });
        if (this.props.onSelection)
            this.props.onSelection(selectedRowKeys);
    }

    @autobind
    private async onDeleteItems() {
        var self = this;

        await Promise.all(self.state.selectedRowKeys.map(key => {
            let item = self.props.model.data.items.filter(o => (o.item as any)[self.state.rowKey as string] == key)[0];
            if (item) {
                if (self && self.props && self.props.onDeleteRow)
                    return self.props.onDeleteRow(item.item, item.state);
            }
        }) as any) as any;

        self.setState({ selectedRowKeys: [], showConfirmDeletion: false })
    }

    private isEditing(record: any) {
        return this.state.editingKeys.filter(o => o == record.key).length > 0 || this.props.model.data.items.filter(o => (o.item as any)[this.props.rowKey] == record[this.props.rowKey] && o.state != 'Unchanged').length > 0;
    }

    @resolve(HttpService)
    httpService!: HttpService;

    downloadExcelTemplate = async () => {
        const result = await this.httpService.get(this.props.bulkTemplateUrl as string, {
            responseType: 'arraybuffer'
        });
        const blob = new Blob([result.data as any], { type: result.headers['content-type'] });
        (FileSaver as any).saveAs(blob, this.props.bulkTemplateName || "template.xlsx");
    }

    handleMenuClick = (e: any) => {
        switch (e.key) {
            case 'download':
                e.domEvent.stopPropagation();
                this.downloadExcelTemplate();
                break;
        }
    }

    @autobind
    private onSaveRow(form: any, key: any) {
        var self = this;
        form.validateFields((event: any) => {
            var values = form.getFieldsValue();
            if (!event) {
                if (self.props.onSaveRow) {
                    var obj = self.state.data.filter(o => (o.item as any)[self.state.rowKey] == key)[0];
                    values[self.state.rowKey] = ((obj || {}).item || {} as any)[self.state.rowKey];
                    self.props.onSaveRow(values, ((obj || {}).state || 'New')).then(result => {
                        if (result && result.isSuccess) {
                            if (obj != null) {
                                obj.item = Object.assign(clone((obj || {} as any).item || {} as any), values);
                                if (result.identifier) {
                                    (obj as any)[this.props.rowKey] = result.identifier;
                                }
                                obj.state = 'Unchanged';
                                obj.mode = 'normal';
                            }
                            self.setState({ editingKeys: self.state.editingKeys.filter(o => o != values[self.state.rowKey]) });
                        }


                    });
                }
            }
        });
    }

    @autobind
    private onRowEdit(key: string) {
        this.setState({ editingKeys: [...this.state.editingKeys, key] });
    }

    @autobind
    private onRowEditCancelled(key: string) {
        var model = this.props.model.data.items.firstOrDefault(o => (o.item as any)[this.props.rowKey] == key);
        if (model && model.state == 'New' && this.props.onDeleteRow) {
            this.props.onDeleteRow(model.item, model.state);
        }
        this.setState({ editingKeys: this.state.editingKeys.filter(o => o != key) });
    }

    @autobind
    private onChange(pagination: any, filters: any, sorter: any) {
        var query = clone<Query>(this.props.model.query);

        let field = sorter.field;
        if (!sorter.field && this.props.model.sortFields && this.props.model.sortFields.length > 0)
            field = this.props.model.sortFields[0].field;

        if (!field)
            return;

        let useProfile = false;
        if (this.props.model.sortFields) {
            var result = this.props.model.sortFields.filter(o => o.field == sorter.field);
            if (result.length > 0)
                useProfile = result[0].useProfile;
        }

        query.orderBy = [{
            field: field,
            direction: sorter.order == 'descend' ? 'Descending' : 'Ascending',
            useProfile: useProfile
        }];
        query.take = pagination.pageSize;

        if (query)
            if (this.props.onQueryChanged)
                this.props.onQueryChanged(query);
    }

    //@autobind
    //private onDiscardRow(row: TableRow<T>) {
    //    if (row.state === 'New') {
    //        this.props.model.data.discard(row.item);
    //        this.setState({ data: this.state.data.filter((o) => o !== row) });
    //    } else {
    //        row.mode = 'normal';
    //        row.selected = false;
    //        row.item = clone(row.original);
    //        this.forceUpdate();
    //    }
    //}

    public Addform(key: any, form: any) {
        if (!this.editingDictionary.firstOrDefault(t => t.Key == key))
            this.editingDictionary.push({ Key: key, Form: form });
        return true;
    }

    public render() {
        let columns = [];

        if (this.props.canEdit) {
            columns.push({
                title: "",
                width: 50,
                dataIndex: 'operation',
                render: (text: any, record: any) => {
                    const editable = this.isEditing(record);
                    return (
                        <div style={{ width: editable ? 50 : 'auto' }}>
                            {editable ? (
                                <span>
                                    <EditableContext.Consumer>
                                        {form => this.Addform(record.key, form) && (
                                            <a
                                                href="javascript:;"
                                                onClick={() => this.onSaveRow(form, record.key)}
                                                style={{ marginRight: 8 }}
                                            >
                                                <Icon type='save' />
                                            </a>
                                        )}
                                    </EditableContext.Consumer>
                                    <Popconfirm
                                        title="¿Está seguro que desea descartar los cambios?"
                                        onConfirm={() => this.onRowEditCancelled(record.key)}
                                    >
                                        <a><Icon type='undo' /></a>
                                    </Popconfirm>
                                </span>
                            ) : (
                                    <>
                                    <a onClick={() => this.onRowEdit(record.key)}><Icon type='edit' /></a>
                                        <a
                                            onClick={() => { 
                                                var obj = this.state.data.filter(o =>
                                                    (o.item as any)[this.state.rowKey] == record.key)[0];
                                                if (this.props.onModalOpen !== undefined)
                                                    this.props.onModalOpen(obj.item as T);
                                            }}>
                                            <Icon type='setting' />
                                        </a>
                                    </>
                                )}
                        </div>
                    );
                },
            } as any);
        }
        var self = this;
        columns = columns.concat(this.state.columns.filter((c) => c.visible || c.visible === undefined).map(c => {
            let sorField = this.props.model.query.orderBy ? this.props.model.query.orderBy.firstOrDefault(o => o.field == (c.sortField || c.field)) : undefined;
            console.log(c.title);
            return {
                title: c.title,
                dataIndex: c.field || c.title,
                editorValuePropName: c.editorValuePropName,
                key: c.field || c.title,
                align: c.align || 'left',
                onCell: (record: any) => ({
                    record,
                    required: c.required,
                    align: c.align,
                    editorValuePropName: c.editorValuePropName,
                    dataIndex: c.field || c.title,
                    title: c.title,
                    editor: c.editor,
                    editing: this.isEditing(record),
                }),
                sorter: c.sortable || false,
                sortOrder: c.sortable && sorField ? (sorField.direction == 'Ascending' ? 'ascend' : 'descend') : false,
                filteredValue: self.state.filter[c.field] || null,
                filterDropdown: !c.filter ? undefined : (props: any) => (<FilterComponent onChange={value => {
                    var change = {} as any;
                    change[c.fiterField || c.field] = value;
                    var filterObject = c.filterByQueryString ? { ...self.state.parameters, ...change } : { ...self.state.filter, ...change };
                    self.setState({ filter: filterObject });
                    self.onFilterChanged(c.filterByQueryString ? true : false, filterObject);
                    confirm();
                }} value={self.state.filter[c.field]}>{c.filter}</FilterComponent>),
                filterIcon: (filtered: boolean) => <Icon type="filter" style={{ color: filtered ? '#1890ff' : undefined }} />,
                render: (text: any, record: any, index: number) => c.renderer === undefined ? <span style={{ textAlign: c.align || 'left' }}>{text}</span> : <div style={{ textAlign: c.align || 'left' }}>{c.renderer(record)}</div>
            };
        }));

        var width = (this.props as any).size.width;
        var isMobile = width < 480;
        var isTablet = width >= 480 && width < 1024;

        let pagination = {
            size: (isMobile || isTablet) ? 'small' : undefined,
            showSizeChanger: !isMobile,
            showQuickJumper: !isMobile,
            onShowSizeChange: (_: any, pageSize: number) => {
                this.handlePageSizeChange(pageSize);
            },
            onChange: (page: number) => {
                this.handlePaginationChange(page);
            },
            pageSize: this.state.pageSize,
            total: this.state.totalItems,
            showTotal: (total: number, range: any) => isMobile ? '' : `${range[0]} a ${range[1]} de ${total}`,
        };

        let rowKey = 1;
        var tableData = this.state.data.map(o => {
            var item = clone<T>(o.item);
            (item as any).key = (item as any)[this.state.rowKey] || rowKey;
            rowKey++;
            return item;
        });

        const { selectedRowKeys } = this.state;
        const rowSelection = (this.props.canEdit || this.props.canDelete) ? {
            selectedRowKeys,
            onChange: this.onSelectChange,
        } : null;
        const hasSelected = selectedRowKeys.length > 0;

        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        let orderBy = this.props.model.query.orderBy && this.props.model.query.orderBy.length > 0 ? this.props.model.query.orderBy[0].field : undefined;
        let useProfile = false;
        let direction: SortDirection = 'Ascending';
        if (orderBy && this.props.model.sortFields) {
            var item = this.props.model.sortFields.firstOrDefault(o => o.field == orderBy);
            if (item && this.props.model && this.props.model.query && this.props.model.query.orderBy) {
                useProfile = this.props.model.query.orderBy[0].useProfile;
                direction = this.props.model.query.orderBy[0].direction;
            }
        }
        let canEmbedd = this.props.embedded && (!this.state.result || this.state.result.isSuccess);
        const menu = (
            <Menu onClick={this.handleMenuClick}>
                {this.props.bulkTemplateUrl && <Menu.Item key="download"><Icon type="download" />Descargar plantilla</Menu.Item>}
            </Menu>
        );
        return <div>
            <Modal
                visible={this.state.showConfirmDeletion}
                closable={false}
                onOk={this.onDeleteItems}
                onCancel={() => this.setState({ showConfirmDeletion: false })}
                title="Advertencia">
                <p>¿Está seguro que desea eliminar los elementos seleccionados?</p>
            </Modal>
            <div className="table-header" style={{ marginTop: canEmbedd ? -64 : 0, marginBottom: canEmbedd ? 16 : 0, marginRight: this.props.headerMarginRight ? this.props.headerMarginRight : 0, marginLeft: this.props.headerMarginLeft ? this.props.headerMarginLeft : 0 }}>
                <Row>
                    <Col span={6}>
                        {this.props.title && ((typeof this.props.title === 'string' || this.props.title instanceof String) ? <h3>{this.props.title}</h3> : this.props.title)}
                        <ul className="toolbar" style={{ float: 'left' }}>

                            {this.props.canCreateNew && this.props.onNewItem && <li><Tooltip placement="topLeft" title="Añadir nuevo"><Button icon='plus' onClick={this.props.onNewItem}></Button></Tooltip></li>}
                            {hasSelected && this.props.canDelete && <li><Tooltip placement="topLeft" title="Eliminar elementos seleccionados"><Button onClick={() => this.setState({ showConfirmDeletion: true })} type='danger'><Icon type='delete' /></Button></Tooltip></li>}

                            {this.props.bulkInsertUrl && <li><Upload
                                name="file"
                                headers={{
                                    authorization: `Bearer ${HttpService.accessToken}`,
                                }}
                                showUploadList={false}
                                action={this.props.bulkInsertUrl}
                                onChange={info => {
                                    if (info.file.status == 'uploading')
                                        this.setState({ uploading: true });
                                    else {
                                        this.setState({ uploading: false });
                                    }
                                    if (info.file.status == 'error' || (info.file.response.messages && info.file.response.messages.length > 0)) {

                                        this.setState({ uploadingError: info.file.response.messages.map((i: any) => i.body).join(",") })
                                    } else {
                                        this.setState({ uploadingError: undefined })
                                    }
                                    if (info.file.status == 'done')
                                        if (this.props.onRefresh)
                                            this.props.onRefresh()
                                }}>
                                <Tooltip title="Carga masiva">
                                    <Dropdown.Button overlay={menu}>
                                        <Icon type="upload" />
                                    </Dropdown.Button>
                                </Tooltip>
                            </Upload></li>}

                        </ul>
                    </Col>
                    <Col span={18}>
                        <ul className="toolbar" style={{ float: 'right' }}>
                            {!isMobile && this.props.model.sortFields && this.props.model.sortFields.length > 0 && (this.props.canSort == undefined || this.props.canSort) && <li>
                                <Select placeholder={"Ordernar por"} value={this.props.model.query.orderBy && this.props.model.query.orderBy.length > 0 ? this.props.model.query.orderBy[0].field : undefined} onChange={(value: any) => this.onOrderByChanged(value as string, direction, useProfile)}>
                                    {(this.props.model.sortFields || []).map(o => <Option key={o.field} value={o.field}>{o.text}</Option>)}
                                </Select>
                            </li>}
                            {!isMobile && orderBy && (this.props.canSort == undefined || this.props.canSort) && <li>
                                <Tooltip placement="topLeft" title='Ordenar'><Button onClick={e => this.onSortDirection()}>
                                    <Icon type={(direction || 'Ascending') == 'Ascending' ? 'sort-ascending' : 'sort-descending'} />
                                </Button></Tooltip>
                            </li>}
                            {!isMobile && orderBy && (this.props.exportable) && <li>
                                <Tooltip placement="topLeft" title='Exportar a Excel'> <Button onClick={e => this.onExportToExcel()}>
                                    <Icon type={'download'} />
                                </Button> </Tooltip>
                            </li>}
                            {(this.props.hideRefresh == undefined || !this.props.hideRefresh) &&
                                <li>  <Tooltip placement="topLeft" title='Recargar'><Button onClick={this.props.onRefresh}><Icon type='reload' /></Button></Tooltip></li>
                            }
                            {(this.props.hideSearch == undefined || !this.props.hideSearch) && !isMobile && <li>
                                <Tooltip placement="topLeft" title='Buscar'> <Search
                                    placeholder={this.props.searchText || "Texto de búsqueda"}
                                    onSearch={value => this.onSearchFilterChanged(value)}
                                    style={{ width: this.props.searchWidth || 200 }}
                                />
                                </Tooltip>
                            </li>}
                        </ul>
                    </Col>
                </Row>
            </div>
            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                {this.state.uploadingError &&
                    <Alert
                        type='error'
                        message="Ha ocurrido un error"
                        description={this.state.uploadingError} />
                }
                {this.state.result && !this.state.result.isSuccess &&
                    <Alert type='error' style={{ marginBottom: 16 }}
                        message="Ha ocurrido un error"
                        description={this.state.result.messages.map((o) => o.body)}
                    />
                }
                {this.props.error &&
                    <Alert type='error' style={{ marginBottom: 16 }}
                        message="Ha ocurrido un error"
                        description={this.props.error}
                    />
                }
            </div>
            <AntTable
                onChange={this.onChange}
                components={components}
                rowSelection={rowSelection as any}
                loading={(this.props.model.data && this.props.model.data.isBusy) || this.state.uploading}
                columns={columns}
                locale={{
                    emptyText: "No hay datos disponibles",
                    filterReset: "Borrar filtros",
                    selectAll: "Seleccionar todo",
                    filterConfirm: "Confirmar filtro",
                    filterTitle: "Filtro",
                    selectInvert: "Invertir selección",
                    sortTitle: "Ordenar"
                }}
                pagination={!this.props.hidepagination ? pagination : false}
                dataSource={tableData} />
        </div>
    }
}

export const TableView = withSize()(Table) as React.ComponentClass<TableProps<any>>;
