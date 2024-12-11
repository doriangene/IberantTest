import * as React from 'react'
import { Form, Spin, Select, Input, Checkbox, Modal, Row, Col, Alert, InputNumber, Table } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
let FormItem = Form.Item;
import { AdminType, NewUserItem, NewUserItemStore, UserItemStore } from 'src/stores/user-store';
import { connect } from 'redux-scaffolding-ts'
import { nameof } from 'src/utils/object';
import autobind from 'autobind-decorator';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import { formatMessage } from 'src/services/http-service';
import BooleanInput from 'src/components/form/booleanInput';
import SelectionInput from 'src/components/form/selectionInput';
import { ItemReference } from 'src/stores/dataStore';


interface NewUserItemViewProps {
    onClose: (id: string | undefined, item?: NewUserItem) => void;
    occupationData: any;
}

interface NewUserItemViewState {

}

interface ClassFormBodyProps {
    item: NewUserItem | undefined,
    occupationData: any;
    onSave?: () => Promise<any>;
    setFieldsValue(obj: Object): void;
    getFieldValue(fieldName: string): any;
    getFieldDecorator<T extends Object = {}>(id: keyof T, options?: GetFieldDecoratorOptions): (node: React.ReactNode) => React.ReactNode;
}

export class UserItemFormBody extends React.Component<ClassFormBodyProps> {

    // CheckBox
    isAdmin: boolean = false;
    adminType?: number | null;//0;//AdminType.Normal;
    occupationId?: number;
    onIsAdminHandler = () => {
        this.isAdmin = !this.isAdmin
        if(!this.isAdmin)
            this.adminType = null
        console.log(this.isAdmin)
    }

    // Select
    handleChange = (value: string)  => {
        console.log(`selected ${value}`);
    }


        render() {

    const { getFieldDecorator, getFieldValue, occupationData } = this.props;

    const occupationItems: any[] = occupationData.items.map((occup: any) => { return { key: occup.item.id, value: occup.item.id, text: occup.item.title, id: occup.item.id, title: occup.item.title, description: occup.item.description}})
    occupationItems.unshift({
        key: -1, value: null, text: "None", id: -1, title: "None", description: "None"
        })

    const adminTypes: any[] = [
        {key: -1, value: null, text: "None"} ,
            { key: 0, value: 0, text: "Normal" },
            { key: 1, value: 1, text: "Vip" },
            { key: 2, value: 2, text: "King" }
        ]

    console.log("Occupation Data", occupationData)

    const getAdminType = (adminType: ItemReference | ItemReference[] | string | string[] | undefined | AdminType | null): any => adminType == "Normal" || adminType == AdminType.Normal ? AdminType.Normal : (adminType == "King"  || adminType == AdminType.King) ? AdminType.King : (adminType == "Vip"  || adminType == AdminType.Vip) ? AdminType.Vip : null

    const getOccupation: any = () => this.occupationId && this.occupationId > 0 ? item.occupation : ''

    var item = this.props.item || {} as NewUserItem;
    return <Form id="modaForm" onSubmit={() => { if (this.props.onSave) { this.props.onSave(); } }}>
        <Row gutter={24}>

            <Col span={12}>
                <FormItem label={"FirstName"}>
                    {getFieldDecorator(nameof<NewUserItem>('firstName'), {
                        initialValue: item.firstName,
                    })(
                        <Input />
                    )}
                </FormItem>
            </Col>
            <Col span={12}>
                <FormItem label={'LastName'}>
                    {getFieldDecorator(nameof<NewUserItem>('lastName'), {
                        initialValue: item.lastName,
                    })(
                        <Input />
                    )}
                </FormItem>
            </Col>
            <Col span={12}>
                <FormItem label={"Address"}>
                    {getFieldDecorator(nameof<NewUserItem>('address'), {
                        initialValue: item.address,
                    })(
                        <Input maxLength={10} />
                    )}
                </FormItem>
            </Col>
            <Col span={12}>
                <FormItem label={'IsAdmin'}>
                    {getFieldDecorator(nameof<NewUserItem>('isAdmin'), {
                        initialValue: item.isAdmin,
                    })(
                        <BooleanInput onChange={this.onIsAdminHandler} />
                    )}
                </FormItem>
            </Col>
            <Col span={12}>
                <FormItem label={'AdminType'}>
                    {getFieldDecorator(nameof<NewUserItem>('adminType'), {
                        initialValue: item.adminType,
                    })(
                        <SelectionInput options={adminTypes} value={this.isAdmin ? getAdminType(this.adminType ?? null): null} onChange={function (adminType: ItemReference | ItemReference[] | string | string[] | undefined): void {
                            console.log("AdminType", adminType)
                            item.adminType = getAdminType(adminType)
                            console.log("Item", item)
                            // console.log()
                        } }>
                        </SelectionInput>
                    )}
                </FormItem>
            </Col>

            <Col span={12}>
                <FormItem label={'OccupationId'}>
                    {getFieldDecorator(nameof<NewUserItem>('occupationId'), {
                        initialValue: item.occupationId,
                    })(
                        <SelectionInput 
                        options={occupationItems}
                         value={''} onChange={ (occupation: ItemReference | ItemReference[] | string | string[] | any | undefined): void => {
                            console.log(item)
                            console.log(occupationItems)
                            console.log("Occupation", occupation)
                            const selectedOccupation = occupationData.items.firstOrDefault((occup: any) => occup.item.title == occupation)//occupationItems.firstOrDefault(x => x.value == occupation)
                            console.log(selectedOccupation)
                          
                        } }>
                            
                        </SelectionInput>
                    )}
                </FormItem>
            </Col>
        </Row>


    </Form>
}
}

@connect(["newUserItem", NewUserItemStore])
class NewUserItemView extends React.Component<NewUserItemViewProps & FormComponentProps, NewUserItemViewState> {
    private get UserItemsStore() {
        return (this.props as any).newUserItem as NewUserItemStore;
    }

    constructor(props: NewUserItemViewProps & FormComponentProps) {
        super(props);
        this.UserItemsStore.createNew({} as any);
    }

    componentWillReceiveProps(nextProps: NewUserItemViewProps) {
        if (this.UserItemsStore.state.result && this.UserItemsStore.state.result.isSuccess)
            nextProps.onClose((this.UserItemsStore.state.result as any).aggregateRootId, this.UserItemsStore.state.item)
    }

    @autobind
    private onCreateNewItem() {
        var self = this;
        return new Promise((resolve, reject) => {
            self.props.form.validateFields(event => {
                var values = self.props.form.getFieldsValue();
                if (!event) {
                    values = { ...values, };
                    self.UserItemsStore.change(values);
                    self.UserItemsStore.submit().then(result => {
                        if (result.isSuccess) {
                            resolve();
                        } else {
                            reject();
                        }
                    });
                }
            });
        })
    }

    @autobind
    private onCancelNewItem() {
        this.UserItemsStore.clear();
        this.props.onClose(undefined);
    }

    public render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                maskClosable={false}
                visible
                onCancel={this.onCancelNewItem}
                onOk={this.onCreateNewItem}
                closable={false}
                width='800px'
                title={"New UserItem"}>
                {this.UserItemsStore.state.result && !this.UserItemsStore.state.result.isSuccess &&
                    <Alert type='error'
                        message="Ha ocurrido un error"
                        description={formatMessage(this.UserItemsStore.state.result)}
                    />
                }
                <Spin spinning={this.UserItemsStore.state.isBusy}>
                    <UserItemFormBody item={this.UserItemsStore.state.item} getFieldDecorator={getFieldDecorator} getFieldValue={this.props.form.getFieldValue} setFieldsValue={this.props.form.setFieldsValue} onSave={this.onCreateNewItem} occupationData={this.props.occupationData} />
                </Spin>
            </Modal>
        );
    }
}

// Wire up the React component to the Redux store
export default Form.create({})(NewUserItemView as any) as any as React.ComponentClass<NewUserItemViewProps>;

// Update User
interface UpdateUserItemViewProps {
    onClose: (id: string | undefined, item?: NewUserItem) => void;
    occupationData: any;
}

interface UpdateUserItemViewState {

}

@connect(["updateUserItem", UserItemStore])
class UpdateUserItemView extends React.Component<UpdateUserItemViewProps & FormComponentProps, UpdateUserItemViewState> {
    private get UserItemsStore() {
        return (this.props as any).newUserItem as NewUserItemStore;
    }

    constructor(props: NewUserItemViewProps & FormComponentProps) {
        super(props);
        this.UserItemsStore.createNew({} as any);
    }

    componentWillReceiveProps(nextProps: NewUserItemViewProps) {
        if (this.UserItemsStore.state.result && this.UserItemsStore.state.result.isSuccess)
            nextProps.onClose((this.UserItemsStore.state.result as any).aggregateRootId, this.UserItemsStore.state.item)
    }

    @autobind
    private onCreateNewItem() {
        var self = this;
        return new Promise((resolve, reject) => {
            self.props.form.validateFields(event => {
                var values = self.props.form.getFieldsValue();
                if (!event) {
                    values = { ...values, };
                    self.UserItemsStore.change(values);
                    self.UserItemsStore.submit().then(result => {
                        if (result.isSuccess) {
                            resolve();
                        } else {
                            reject();
                        }
                    });
                }
            });
        })
    }

    @autobind
    private onCancelNewItem() {
        this.UserItemsStore.clear();
        this.props.onClose(undefined);
    }

    // @autobind
    // private onDeleteRow(){}

    public render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                maskClosable={false}
                visible
                onCancel={this.onCancelNewItem}
                onOk={this.onCreateNewItem}
                closable={false}
                width='800px'
                title={"New UserItem"}>
                {this.UserItemsStore.state.result && !this.UserItemsStore.state.result.isSuccess &&
                    <Alert type='error'
                        message="Ha ocurrido un error"
                        description={formatMessage(this.UserItemsStore.state.result)}
                    />
                }
                <Spin spinning={this.UserItemsStore.state.isBusy}>
                    <UserItemFormBody item={this.UserItemsStore.state.item} getFieldDecorator={getFieldDecorator} getFieldValue={this.props.form.getFieldValue} setFieldsValue={this.props.form.setFieldsValue} onSave={this.onCreateNewItem} occupationData={this.props.occupationData} />
                </Spin>
            </Modal>
        );
    }
}