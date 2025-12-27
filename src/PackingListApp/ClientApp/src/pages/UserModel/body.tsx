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

interface NewUserDataViewProps extends FormComponentProps {
  onClose: (id: string | undefined, item?: NewUserData) => void;
}

interface NewUserDataViewState {}

interface ClassFormBodyProps {
  item: UserData | NewUserData | undefined;
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
    var item = this.props.item || ({} as any);
    const { getFieldDecorator, getFieldValue } = this.props;

    return (
      <Form
        id="modaForm"
        onSubmit={(e) => {
          e.preventDefault();
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
            <FormItem label={"Dirección (máx 10 caracteres)"}>
              {getFieldDecorator(nameof<NewUserData>("address"), {
                initialValue: item.address,
              })(<Input maxLength={10} />)}
            </FormItem>
          </Col>
        </Row>
        {/* Campo: Es Administrador */}
        <Row>
          <Col span={24}>
            <FormItem label="Es Administrador">
              {getFieldDecorator("isAdmin", {
                initialValue: item?.isAdmin || false,
                valuePropName: "checked",
              })(<Checkbox>Sí</Checkbox>)}
            </FormItem>
          </Col>
        </Row>
        {/* Campo: Categoría de Administrador */}
        {getFieldValue("isAdmin") && (
          <Row>
            <Col span={24}>
              <FormItem label="Categoría de Admin">
                {getFieldDecorator("category", {
                  initialValue: item?.category || 1,
                })(
                  <Select placeholder="Seleccione una categoría">
                    <Select.Option value={1}>Normal</Select.Option>
                    <Select.Option value={2}>Vip</Select.Option>
                    <Select.Option value={3}>King</Select.Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        )}
      </Form>
    );
  }
}

@connect(["newUserData", NewUserDataStore])
class NewUserDataViewInternal extends React.Component<
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

export const NewUserDataView = Form.create<NewUserDataViewProps>()(
  NewUserDataViewInternal
) as any as React.ComponentClass<
  Omit<NewUserDataViewProps, keyof FormComponentProps>
>;

interface EditUserDataViewProps extends FormComponentProps {
  item: UserData;
  visible: boolean;
  onClose: () => void;
  onSave: (id: number, data: UserData) => Promise<any>;
}

class EditUserDataViewInternal extends React.Component<
  EditUserDataViewProps & FormComponentProps
> {
  @autobind
  private onSave() {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // Fusionamos el ID original con los nuevos valores del form
        const updatedItem = { ...this.props.item, ...values };
        await this.props.onSave(this.props.item.id, updatedItem);
        this.props.onClose();
      }
    });
  }

  render() {
    const { visible, onClose, item, form } = this.props;
    return (
      <Modal
        title={`Editar Usuario: ${item.name}`}
        visible={visible}
        onOk={this.onSave}
        onCancel={onClose}
        width="800px"
        destroyOnClose={true} // Importante para limpiar el form al cerrar
      >
        <UserDataFormBody
          item={item}
          getFieldDecorator={form.getFieldDecorator}
          getFieldValue={form.getFieldValue}
          setFieldsValue={form.setFieldsValue}
        />
      </Modal>
    );
  }
}

export const EditUserDataView = Form.create<EditUserDataViewProps>()(
  EditUserDataViewInternal
) as any as React.ComponentClass<
  Omit<EditUserDataViewProps, keyof FormComponentProps>
>;
