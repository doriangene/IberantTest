import * as React from 'react'
import { Form, Spin, Select, Input, Switch, Modal, Row, Col, Alert, Dropdown, Table } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
let FormItem = Form.Item;
import { AdminType, NewUserItem, NewUserItemStore, UserItem } from 'src/stores/user-store';
import { connect } from 'redux-scaffolding-ts'
import { nameof } from 'src/utils/object';
import autobind from 'autobind-decorator';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import { formatMessage } from 'src/services/http-service';
import { TestItem } from '../../stores/test-store';
import { DataModel } from '../../stores/dataStore';


interface NewUserItemViewProps {
    onClose: (id: string | undefined, item?: NewUserItem) => void;
    item: UserItem | null;
    occupations: Array<TestItem>;
}

interface NewUserItemViewState {

}

interface ClassFormBodyProps {
    item: NewUserItem | undefined,
    userId: number | undefined,
    onSave?: () => Promise<any>;
    onEdit?: () => Promise<any>;
    occupations: Array<TestItem>;
    setFieldsValue(obj: Object): void;
    getFieldValue(fieldName: string): any;
    getFieldDecorator<T extends Object = {}>(id: keyof T, options?: GetFieldDecoratorOptions): (node: React.ReactNode) => React.ReactNode;
}

export class UserItemFormBody extends React.Component<ClassFormBodyProps> {

    state = {
        isAdminTypeVisible: false
    }

    
    handleAdminTypeSelect = () => {
        this.setState({ isAdminTypeVisible: !this.state.isAdminTypeVisible });
        this.props.setFieldsValue({ isAdmin: !this.state.isAdminTypeVisible });
    }

    handleAdminType = (value : number) => {
        this.props.setFieldsValue({adminType: value });
    }

    render() {
        const { getFieldDecorator } = this.props;
        var item = this.props.item || {} as NewUserItem;
        return <Form id="modaForm" onSubmit={() => {
            if (this.props.onEdit && this.props.userId) { this.props.onEdit(); }
            else { if (this.props.onSave) { this.props.onSave(); } }
        }}>
            <Row gutter={24}>

                <Col span={8}>
                    <FormItem label={"Name"}>
                        {getFieldDecorator(nameof<NewUserItem>('name'), {
                            initialValue: item.name,
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem label={'Lastname'}>
                        {getFieldDecorator(nameof<NewUserItem>('lastname'), {
                            initialValue: item.lastname,
                        })(
                            <Input  />
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem label={'Address'}>
                        {getFieldDecorator(nameof<NewUserItem>('address'), {
                            initialValue: item.address,
                        })(
                            <Input maxLength={10} />
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem label={'Admin'}>
                        {getFieldDecorator(nameof<NewUserItem>('isAdmin'), {
                            initialValue: item.isAdmin,
                        })(
                            <Switch onChange={this.handleAdminTypeSelect} />
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem label={'Occupation'}>
                        {getFieldDecorator(nameof<NewUserItem>('occupation'), {
                            initialValue: item.adminType,
                        })(
                            <Select>
                                {
                                    this.props.occupations.map((item, index) =>
                                        <Select.Option key={`occupation-${index}`} value={item.id}>{item.title}</Select.Option>
                                    )
                                }
                            </Select>
                        )}
                    </FormItem>
                </Col>
                {
                    this.state.isAdminTypeVisible &&
                  <Col span={8}>
                        <FormItem label={'Admin Type'}>
                            {getFieldDecorator(nameof<NewUserItem>('adminType'), {
                                initialValue: item.adminType,
                            })(
                                <Select clearIcon onChange={this.handleAdminType}>
                                    {
                                        Object.keys(AdminType).filter(x => !(parseInt(x) >= 0)).map((item, index) =>
                                            <Select.Option key={`admintype-${index}`} value={index}>{item}</Select.Option>
                                        )
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                }
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
        this.UserItemsStore.createNew(
            this.props.item ? {
                name: this.props.item.name,
                lastname: this.props.item.lastname,
                address: this.props.item.address,
                isAdmin: this.props.item.isAdmin,
                AdminType: this.props.item.adminType
            } : {} as any
        );
    }

    componentWillReceiveProps(nextProps: NewUserItemViewProps) {
        if (this.UserItemsStore.state.result && this.UserItemsStore.state.result.isSuccess)
            nextProps.onClose((this.UserItemsStore.state.result as any).aggregateRootId, this.UserItemsStore.state.item)
    }

    @autobind
    private onCreateNewItem() {
        var self = this;
        return new Promise<void>((resolve, reject) => {
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
    private onEditItem() {
        var self = this;
        return new Promise<void>((resolve, reject) => {
            self.props.form.validateFields(event => {
                var values = self.props.form.getFieldsValue();
                if (!event) {
                    values = { ...values, };
                    self.UserItemsStore.change(values);
                    self.UserItemsStore.patch('UserItem_UPDATE_ITEM', `${this.props.item?.id}`, values).then(result => {
                        if (result.status === 200 || result.status === 201) {
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
                title={this.props.item ? "Edit User" : "New User"}>
                {this.UserItemsStore.state.result && !this.UserItemsStore.state.result.isSuccess &&
                    <Alert type='error'
                        message="Ha ocurrido un error"
                    description={formatMessage(this.UserItemsStore.state.result)}
                    />
                }
                <Spin spinning={this.UserItemsStore.state.isBusy}>
                    <UserItemFormBody occupations={this.props.occupations} item={this.UserItemsStore.state.item} userId={this.props.item?.id} getFieldDecorator={getFieldDecorator} getFieldValue={this.props.form.getFieldValue} setFieldsValue={this.props.form.setFieldsValue} onSave={this.onCreateNewItem} onEdit={this.onEditItem} />
                </Spin>
            </Modal>
        );
    }
}

// Wire up the React component to the Redux store
export default Form.create({})(NewUserItemView as any) as any as React.ComponentClass<NewUserItemViewProps>;