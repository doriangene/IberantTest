import * as React from "react";
import {
  Form,
  Spin,
  Select,
  Input,
  Checkbox,
  Modal,
  Row,
  Col,
  Alert,
  InputNumber,
  Table,
} from "antd";
import { FormComponentProps } from "antd/lib/form";
let FormItem = Form.Item;
import {
  NewUserData,
  NewUserDataStore,
  UserData,
  UserDataStore,
} from "src/stores/user-store";
import { connect } from "redux-scaffolding-ts";
import { nameof } from "src/utils/object";
import autobind from "autobind-decorator";
import { GetFieldDecoratorOptions } from "antd/lib/form/Form";
import { formatMessage } from "src/services/http-service";

interface NewUserDataViewProps {
  onClose: (id: string | undefined, item?: NewUserData) => void;
}

interface NewUserDataViewState {}

interface ClassFormBodyProps {
  item: NewUserData | undefined;
  onSave?: () => Promise<any>;
  setFieldsValue(obj: Object): void;
  getFieldValue(fieldName: string): any;
  getFieldDecorator<T extends Object = {}>(
    id: keyof T,
    options?: GetFieldDecoratorOptions
  ): (node: React.ReactNode) => React.ReactNode;
}

export class UserDataFormBody extends React.Component<ClassFormBodyProps> {
  render() {
    const { getFieldDecorator } = this.props;
    var item = this.props.item || ({} as NewUserData);

    return (
      <Form
        id="modaForm"
        onSubmit={() => {
          if (this.props.onSave) {
            this.props.onSave();
          }
        }}
      >
        <Row gutter={24}>
          {/* Campo: Nombre */}
          <Col span={8}>
            <FormItem label={"Nombre"}>
              {getFieldDecorator(nameof<NewUserData>("name"), {
                initialValue: item.name,
                rules: [
                  { required: true, message: "Por favor ingrese el nombre" },
                ],
              })(<Input />)}
            </FormItem>
          </Col>

          {/* Campo: Apellidos */}
          <Col span={8}>
            <FormItem label={"Apellidos"}>
              {getFieldDecorator(nameof<NewUserData>("lastName"), {
                initialValue: item.lastName,
              })(<Input />)}
            </FormItem>
          </Col>

          {/* Campo: Dirección */}
          <Col span={8}>
            <FormItem label={"Dirección"}>
              {getFieldDecorator(nameof<NewUserData>("address"), {
                initialValue: item.address,
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

@connect(["newUserData", NewUserDataStore])
class NewUserDataView extends React.Component<
  NewUserDataViewProps & FormComponentProps,
  NewUserDataViewState
> {
  private get UserDataStore() {
    return (this.props as any).newUserData as NewUserDataStore;
  }

  constructor(props: NewUserDataViewProps & FormComponentProps) {
    super(props);
    this.UserDataStore.createNew({} as any);
  }

  componentWillReceiveProps(nextProps: NewUserDataViewProps) {
    if (
      this.UserDataStore.state.result &&
      this.UserDataStore.state.result.isSuccess
    )
      nextProps.onClose(
        (this.UserDataStore.state.result as any).aggregateRootId,
        this.UserDataStore.state.item
      );
  }

  @autobind
  private OnCreateNewUser() {
    var self = this;
    return new Promise((resolve, reject) => {
      self.props.form.validateFields((event) => {
        var values = self.props.form.getFieldsValue();
        if (!event) {
          values = { ...values };
          self.UserDataStore.change(values);
          self.UserDataStore.submit().then((result) => {
            if (result.isSuccess) {
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
  private onCancelNewUser() {
    this.UserDataStore.clear();
    this.props.onClose(undefined);
  }

  public render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        maskClosable={false}
        visible
        onCancel={this.onCancelNewUser}
        onOk={this.OnCreateNewUser}
        closable={false}
        width="800px"
        title={"New UserData"}
      >
        {this.UserDataStore.state.result &&
          !this.UserDataStore.state.result.isSuccess && (
            <Alert
              type="error"
              message="Ha ocurrido un error"
              description={formatMessage(this.UserDataStore.state.result)}
            />
          )}
        <Spin spinning={this.UserDataStore.state.isBusy}>
          <UserDataFormBody
            item={this.UserDataStore.state.item}
            getFieldDecorator={getFieldDecorator}
            getFieldValue={this.props.form.getFieldValue}
            setFieldsValue={this.props.form.setFieldsValue}
            onSave={this.OnCreateNewUser}
          />
        </Spin>
      </Modal>
    );
  }
}

// Wire up the React component to the Redux store
export default Form.create({})(
  NewUserDataView as any
) as any as React.ComponentClass<NewUserDataViewProps>;
