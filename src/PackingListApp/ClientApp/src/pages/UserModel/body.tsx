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

export class UserItemFormBody extends React.Component<ClassFormBodyProps> {
    state = {
        admin_type_list: [{ value: 'Normal', display: 'Normal' },
            { value: 'VIP', display: 'VIP' },
            { value: 'KING', display: 'KING' }]
    }

    render() {
        const { getFieldDecorator } = this.props;

        var item = this.props.item || {} as NewUserItem;
        return <Form id="modaForm" onSubmit={() => { if (this.props.onSave) { this.props.onSave(); } }}>
            <Row gutter={24}>
                <Col span={8}>
                    <FormItem label={"Name"}>
                        {getFieldDecorator(nameof<NewUserItem>('name'), {
                            initialValue: item.name,
                            rules: [{ required: true, message: 'Name required.' }]
                        })(
                            <Input placeholder="Name" type="text"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={16}>
                    <FormItem label={'LastName'}>
                        {getFieldDecorator(nameof<NewUserItem>('lastNames'), {
                            initialValue: item.lastNames,
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <FormItem label={'Address'}>
                        {getFieldDecorator(nameof<NewUserItem>('address'), {
                            initialValue: item.address,
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <FormItem label={'Description'}>
                        {getFieldDecorator(nameof<NewUserItem>('description'), {
                            initialValue: item.description,
                            rules: [{ max: 10, message: 'Description cant have more than 10 characters.' }]
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={4}>
                    <FormItem label={'Is Admin'}>
                        {getFieldDecorator(nameof<NewUserItem>('isAdmin'), {
                            initialValue: item.isAdmin,
                        })(
                            <Checkbox  />
                        )}
                    </FormItem>
                </Col>
                
                <Col span={20}>
                    <FormItem label={'Admin Type'}>
                        {getFieldDecorator(nameof<NewUserItem>('adminType'), {
                            initialValue: item.adminType,
                        })(
                            <Select value={item.adminType} disabled={!this.props.getFieldValue('isAdmin')} placeholder={('Select an admin type')}>
                                {this.state.admin_type_list.map((team) =>
                                    <option key={team.value} value={team.value}>{team.display}</option>)}
                            </Select>
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
                    <UserItemFormBody item={this.UserItemsStore.state.item} getFieldDecorator={getFieldDecorator} getFieldValue={this.props.form.getFieldValue} setFieldsValue={this.props.form.setFieldsValue} onSave={this.onCreateNewItem} />
                </Spin>
            </Modal>
        );
    }
}

// Wire up the React component to the Redux store
export default Form.create({})(NewUserItemView as any) as any as React.ComponentClass<NewUserItemViewProps>;