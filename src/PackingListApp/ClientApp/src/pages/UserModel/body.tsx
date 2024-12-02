import * as React from 'react'
import { Form, Spin, Select, Input, Checkbox, Modal, Row, Col, Alert, InputNumber, Table } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
let FormItem = Form.Item;
import { AdminType, NewUserItem, NewUserItemStore } from 'src/stores/user-store';
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
    adminType?: number;//0;//AdminType.Normal;
    occupationId?: number;
    onIsAdminHandler = () => {
        this.isAdmin = !this.isAdmin
        console.log(this.isAdmin)
        // (document.getElementById("adminTypeSelect") as Select).disabled = true;
    }

    // Select
    handleChange = (value: string)  => {
        console.log(`selected ${value}`);
    }


        render() {

    const { getFieldDecorator, getFieldValue, occupationData } = this.props;

    const occupationItems: any[] = occupationData.items.map((occup: any) => { return { key: occup.item.id, value: occup.item.title, text: occup.item.title}})
    occupationItems.unshift({
            key: -1, value: null, text: "None"
        })

    const adminTypes: any[] = [
        {key: -1, value: null, text: "None"} ,
            { key: 0, value: 0, text: "Normal" },
            { key: 1, value: 1, text: "Vip" },
            { key: 2, value: 2, text: "King" }
        ]
    // adminTypes.unshift({ 
    //     })
    // occupationItems
    //                         .map(item: any => 
    //                         { key: item.item.id, value: item.item.title, text: item.item.title }
                        // )
    console.log("Occupation Data", occupationData)

    const getAdminType = (adminType: ItemReference | ItemReference[] | string | string[] | undefined | AdminType): any => adminType == "Normal" || adminType == AdminType.Normal ? AdminType.Normal : (adminType == "King"  || adminType == AdminType.King) ? AdminType.King : (adminType == "Vip"  || adminType == AdminType.Vip) ? AdminType.Vip : null

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
                        <Input />
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
                        <SelectionInput disabled={!this.isAdmin} options={adminTypes} value={this.isAdmin ? getAdminType(item.adminType): ''} onChange={function (adminType: ItemReference | ItemReference[] | string | string[] | undefined): void {
                            item.adminType = getAdminType(adminType)
                            console.log("Item", item)
                            // console.log()
                        } }>
                            {/* <Option value="disabled" disabled>
                                Disabled
                            </Option> */}
                        </SelectionInput>
                    )}
                </FormItem>
            </Col>

            <Col span={12}>
                <FormItem label={'Occupation'}>
                    {getFieldDecorator(nameof<NewUserItem>('occupation'), {
                        initialValue: item.occupation,
                    })(
                        <SelectionInput 
                        options={occupationItems}
                        // .push({
                        //     key: -1, value: null, text: "None"
                        // })
                         value={''} onChange={ (occupation: ItemReference | ItemReference[] | string | string[] | undefined): void => {
                            // item.adminType = adminType == "Normal" ? AdminType.Normal : adminType == "King" ? AdminType.King : AdminType.Vip
                            console.log(item)
                            console.log(occupationItems)
                            console.log("Occupation", occupation)
                            const selectedOccupation = occupationItems.firstOrDefault(x => x.value == occupation)
                            console.log(selectedOccupation)
                            this.occupationId = selectedOccupation >= 0 ? selectedOccupation.key : null
                        } }>
                            
                        </SelectionInput>
                    )}
                </FormItem>
            </Col>
            <Col span={12} hidden>
                <FormItem label={"OccupationId"}>
                    {getFieldDecorator(nameof<NewUserItem>('occupationId'), {
                        initialValue: item.occupationId,
                    })(
                        <Input value={this.occupationId}/>
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

// Wire up the React component to the Redux store
export default Form.create({})(NewUserItemView as any) as any as React.ComponentClass<NewUserItemViewProps>;