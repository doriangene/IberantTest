import * as React from 'react'
import { Form, Spin, Select, Input, Checkbox, Modal, Row, Col, Alert, InputNumber, Table } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
let FormItem = Form.Item;
import { NewUserItem, NewUserItemStore, AdminType } from 'src/stores/user-store';
import { connect } from 'redux-scaffolding-ts'
import { nameof } from 'src/utils/object';
import autobind from 'autobind-decorator';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import { formatMessage } from 'src/services/http-service';
import axios from 'axios';

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
        isAdmin: false,
        occupations: [] as any[],
    };

    loadOccupations = async () => {
        try {
            const response = await axios.get('api/occupation');
            const occupationsArray = Array.isArray(response.data.items) ? response.data.items : [response.data.items];
            this.setState({ occupations: occupationsArray });
        } catch (error) {
            console.error('Error getting occupations', error);
        }
    };

    componentDidMount() {
        this.loadOccupations();
    }

    render() {
        const { isAdmin, occupations } = this.state;
        const onChange = () => { this.setState(() => ({ isAdmin: !isAdmin }))};
        const { getFieldDecorator } = this.props;

        var item = this.props.item || {} as NewUserItem;
        return <Form id="modaForm" onSubmit={() => { if (this.props.onSave) { this.props.onSave(); } }}>
            <Row gutter={24}>
                <Col span={12}>
                    <FormItem label={"Name"}>
                        {getFieldDecorator(nameof<NewUserItem>('name'), {
                            initialValue: item.name,
                        })(
                            <Input placeholder="(Required)"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label={'Last Name'}>
                        {getFieldDecorator(nameof<NewUserItem>('lastName'), {
                            initialValue: item.lastName,
                        })(
                            <Input placeholder="(Required)"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label={'Address'}>
                        {getFieldDecorator(nameof<NewUserItem>('address'), {
                            initialValue: item.address,
                        })(
                            <Input placeholder="(Required)" />
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label={'Is Admin'}>
                        {getFieldDecorator(nameof<NewUserItem>('isAdmin'), {
                            initialValue: item.isAdmin,
                        })(
                            <Checkbox checked={isAdmin} onChange={onChange} />
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label={'Occupation'}>
                        {getFieldDecorator(nameof<NewUserItem>('occupationId'), {
                            initialValue: item.occupationId,
                        })(
                            <Select placeholder="Non-occupation">
                                <option value={undefined}>Non-occupation</option>
                                {occupations.map(occupation => (
                                    <option key={occupation.id} value={occupation.id}>{occupation.title}</option>
                                ))}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                {this.state.isAdmin && < Col span={12}>
                    <FormItem label={'Admin Type'}>
                        {getFieldDecorator(nameof<NewUserItem>('adminType'), {
                            initialValue: item.adminType || AdminType.Normal,
                        })(
                            <Select>
                                <option value={AdminType.Normal}>Normal</option>
                                <option value={AdminType.Vip}>Vip</option>
                                <option value={AdminType.King}>King</option>
                            </Select>
                        )}
                    </FormItem>
                </Col>}
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
                title={"New User"}>
                {this.UserItemsStore.state.result && !this.UserItemsStore.state.result.isSuccess &&
                    <Alert type='error'
                        message="An error has occurred"
                    description={this.UserItemsStore.state.result.messages.map(o => o.body).join(", ")}
                    />}
                <Spin spinning={this.UserItemsStore.state.isBusy}>
                    <UserItemFormBody item={this.UserItemsStore.state.item} getFieldDecorator={getFieldDecorator} getFieldValue={this.props.form.getFieldValue} setFieldsValue={this.props.form.setFieldsValue} onSave={this.onCreateNewItem} />
                </Spin>
            </Modal>
        );
    }
}

// Wire up the React component to the Redux store
export default Form.create({})(NewUserItemView as any) as any as React.ComponentClass<NewUserItemViewProps>;