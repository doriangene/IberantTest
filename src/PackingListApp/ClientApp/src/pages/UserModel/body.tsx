import * as React from 'react'
import { Form, Spin, Select, Input, Checkbox, Modal, Row, Col, Alert, InputNumber, Table } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
let FormItem = Form.Item;
import { NewUserItem, NewUserItemStore } from 'src/stores/user-store';
import { connect } from 'redux-scaffolding-ts'
import { nameof } from 'src/utils/object';
import autobind from 'autobind-decorator';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import { formatMessage } from 'src/services/http-service';
import { max } from 'moment';


interface NewUserItemViewProps {
    onClose: (id: string | undefined, item?: NewUserItem) => void;
}

interface NewUserItemViewState {

}

interface ClassFormBodyProps {
    item: NewUserItem | undefined,
    onSave?: () => Promise<any>;
    setFieldsValue(obj: Object): void;
    getFieldValue(fieldName: string): any;
    getFieldDecorator<T extends Object = {}>(id: keyof T, options?: GetFieldDecoratorOptions): (node: React.ReactNode) => React.ReactNode;
}

 export enum AdminTypes {
    'Normal', 
    'Vip',
    'King'
}

export class UserItemFormBody extends React.Component<ClassFormBodyProps> {

    stringIsNumber = (val: any) => isNaN(Number(val)) === false;

    render() {

       const { getFieldDecorator } = this.props;

        var item = this.props.item || {} as NewUserItem;
        return <Form id="modaForm" onSubmit={() => { if (this.props.onSave) { this.props.onSave(); } }}>
            <Row gutter={24}>
                <Col span={8}>
                    <FormItem label={"Name"}>
                        {getFieldDecorator(nameof<NewUserItem>('name'), {
                            initialValue: item.name,
                            rules: [
                                {
                                    min: 1,
                                    required: true,
                                    message: 'Name cannot be null or empty'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem label={'LastName'}>
                        {getFieldDecorator(nameof<NewUserItem>('lastname'), {
                            initialValue: item.lastname,
                            rules: [
                                {
                                    required: true,
                                    message: 'Lastname cannot be null or empty'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem label={'Address'}>
                        {getFieldDecorator(nameof<NewUserItem>('address'), {
                            initialValue: item.address,
                            rules: [
                                {
                                    required:true,
                                    max: 10,
                                    message: 'Address must have at most 10 characters'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <FormItem label={'Is Admin'}>
                    {getFieldDecorator(nameof<NewUserItem>('isAdmin'), {
                        initialValue: item.isAdmin,
                    })(
                        <Checkbox />
                    )}
                </FormItem>
            </Row>
            <Row>
                <FormItem label={'Admin Type'}>
                    {getFieldDecorator(nameof<NewUserItem>('adminType'), {
                        initialValue: item.adminType,
                        rules: [
                            {
                                required: true
                            }
                        ]
                    })(
                        <Select
                            value={item.adminType}
                            disabled={!this.props.getFieldValue('isAdmin')}
                            placeholder={this.props.getFieldValue('isAdmin')?"Select an admin type":""}
                            >
                            {  
                                Object.keys(AdminTypes)
                                    .filter(this.stringIsNumber)
                                    .map((key: any) =>
                                        <option value={key}>{AdminTypes[key]}</option>
                                )
                            }
                        </Select>
                    )}
                </FormItem>
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
                    <UserItemFormBody item={this.UserItemsStore.state.item} getFieldDecorator={getFieldDecorator} getFieldValue={this.props.form.getFieldValue} setFieldsValue={this.props.form.setFieldsValue} onSave={this.onCreateNewItem} />
                </Spin>
            </Modal>
        );
    }
}

// Wire up the React component to the Redux store
export default Form.create({})(NewUserItemView as any) as any as React.ComponentClass<NewUserItemViewProps>;