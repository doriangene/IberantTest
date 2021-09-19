import {UserItem, UserItemDto, UserItemStore, UserItemDtoStore} from "../../stores/user-store";
import {GetFieldDecoratorOptions} from "antd/lib/form/Form";
import React from "react";
import {nameof} from 'src/utils/object';
import {Form, Spin, Select, Input, Checkbox, Modal, Row, Col, Alert, InputNumber, Table} from 'antd';
import BooleanInput from "../../components/form/booleanInput";
import {AdminTypeComponent} from "./adminTypeComponent";
import {connect} from "redux-scaffolding-ts";
import {FormComponentProps} from "antd/lib/form";
import autobind from "autobind-decorator";
import {formatMessage} from "../../services/http-service";

let FormItem = Form.Item;

interface UserItemDtoViewProps {
    onClose: (id: string | undefined, item?: UserItemDto) => void
}

interface ClassFormBodyProps {
    item: UserItemDto | undefined
    onSave?: () => Promise<any>;

    setFieldsValue(obj: Object): void;

    getFieldValue(fieldName: string): any;

    getFieldDecorator<T extends Object = {}>(
        id: keyof T,
        options?: GetFieldDecoratorOptions
    ): (node: React.ReactNode) => React.ReactNode;
}

export const UserItemFormBody: React.FC<ClassFormBodyProps> = props => {
    const {getFieldDecorator} = props;

    let item = props.item || {} as UserItemDto;
    const [isAdmin, setIsAdmin] = React.useState(item.isadmin);

    return (
        <Form
            id={"modaForm"}
            onSubmit={() => {
                if (props.onSave) {
                    props.onSave();
                }
            }} >
            <Row gutter={24}>
                <Col span={12}>
                    <FormItem label={"First Name"}>
                        {getFieldDecorator(nameof<UserItemDto>('firstname'), {
                            initialValue: item.firstname,
                        })(<Input/>)}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <FormItem label={"Last Name"}>
                        {getFieldDecorator(nameof<UserItemDto>('lastname'), {
                            initialValue: item.lastname,
                        })(<Input/>)}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <FormItem label={"Address"}>
                        {getFieldDecorator(nameof<UserItemDto>('address'), {
                            initialValue: item.address,
                        })(<Input/>)}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <FormItem label={"Description"}>
                        {getFieldDecorator(nameof<UserItemDto>('description'), {
                            initialValue: item.description,
                        })(<Input/>)}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <FormItem label={"Is Admin"}>
                        {getFieldDecorator(nameof<UserItemDto>('isadmin'), {
                            initialValue: item.isadmin,
                        })(<BooleanInput onChange={v => setIsAdmin(v)}/>)}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <FormItem label={"Admin Type"}>
                        {getFieldDecorator(nameof<UserItemDto>('admintype'), {
                            initialValue: item.admintype,
                        })(<AdminTypeComponent disabled={!isAdmin}/>)}
                    </FormItem>
                </Col>
            </Row>
        </Form>
    );
}

@connect(["UserItemDto", UserItemDtoStore])
class UserItemDtoView extends React.Component<UserItemDtoViewProps & FormComponentProps> {

    private get UserItemStore() {
        return (this.props as any).UserItemDto as UserItemDtoStore;
    }

    constructor(props: UserItemDtoViewProps & FormComponentProps) {
        super(props);
        this.UserItemStore.createNew({} as any);
    }

    componentWillReceiveProps(nextProps: Readonly<UserItemDtoViewProps & FormComponentProps>, nextContext: any) {
        if (this.UserItemStore.state.result && this.UserItemStore.state.result.isSuccess) {
            nextProps.onClose((this.UserItemStore.state.result as any).aggregateRootId,
                this.UserItemStore.state.item)
        }
    }

    @autobind
    private onCreateNewItem() {
        let self = this;

        return new Promise((resolve, reject) => {
            self.props.form.validateFields(event => {
                let values = self.props.form.getFieldsValue();
                if (!event) {
                    values = {...values};
                    self.UserItemStore.change(values);
                    self.UserItemStore.submit().then(response => {
                        if (response.isSuccess) {
                            resolve();
                        } else {
                            reject();
                        }
                    });
                }
            });
        });
    }

    @autobind
    private onCancelNewItem() {
        this.UserItemStore.clear();
        this.props.onClose(undefined);
    }

    public render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal
                maskClosable={false}
                visible
                onCancel={this.onCancelNewItem}
                onOk={this.onCreateNewItem}
                closable={false}
                width={'800px'}
                title={'New User Item'}
            >
                {
                    this.UserItemStore.state.result &&
                    !this.UserItemStore.state.result.isSuccess && (
                        <Alert
                            type={"error"}
                            message={"Ha ocurrido un error"}
                            description={formatMessage(this.UserItemStore.state.result)}
                        />
                    )
                }

                <Spin spinning={this.UserItemStore.state.isBusy}>
                    <UserItemFormBody
                        item={this.UserItemStore.state.item}
                        setFieldsValue={this.props.form.setFieldsValue}
                        getFieldValue={this.props.form.getFieldValue}
                        getFieldDecorator={getFieldDecorator}
                        onSave={this.onCreateNewItem}
                    />
                </Spin>
            </Modal>
        )
    }
}

export default Form.create({})(
    UserItemDtoView as any
) as any as React.ComponentClass<UserItemDtoViewProps>;