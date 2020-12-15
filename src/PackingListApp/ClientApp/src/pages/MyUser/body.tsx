import { Alert, Col, Form, Input, Modal, Row, Spin } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { GetFieldDecoratorOptions } from "antd/lib/form/Form";
import autobind from "autobind-decorator";
import { setServers } from "dns";
import * as React from "react";
import { connect } from "redux-scaffolding-ts";
import { formatMessage } from "src/services/http-service";
import { nameof } from "src/utils/object";
import BooleanInput from "../../components/form/booleanInput";
import { NewMyUserItem, NewMyUserItemStore } from "../../stores/my-user-store";
import { AdminTypeDropdown } from "./components";
let FormItem = Form.Item;

interface NewMyUserItemViewProps {
  onClose: (id: string | undefined, item?: NewMyUserItem) => void;
}

interface ClassFormBodyProps {
  item: NewMyUserItem | undefined;
  onSave?: () => Promise<any>;
  setFieldsValue(obj: Object): void;
  getFieldValue(fieldName: string): any;
  getFieldDecorator<T extends Object = {}>(
    id: keyof T,
    options?: GetFieldDecoratorOptions
  ): (node: React.ReactNode) => React.ReactNode;
}

export const MyUserItemFormBody: React.FC<ClassFormBodyProps> = props => {
  const { getFieldDecorator } = props;

  var item = props.item || ({} as NewMyUserItem);
  const [isAdmin, setIsAdmin] = React.useState(item.isAdmin);
  return (
    <Form
      id="modaForm"
      onSubmit={() => {
        if (props.onSave) {
          props.onSave();
        }
      }}
    >
      <Row gutter={24}>
        <Col span={12}>
          <FormItem label={"Name"}>
            {getFieldDecorator(nameof<NewMyUserItem>("name"), {
              initialValue: item.name
            })(<Input />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label={"LastName"}>
            {getFieldDecorator(nameof<NewMyUserItem>("lastName"), {
              initialValue: item.lastName
            })(<Input />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label={"Address"}>
            {getFieldDecorator(nameof<NewMyUserItem>("address"), {
              initialValue: item.address
            })(<Input />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label={"Description"}>
            {getFieldDecorator(nameof<NewMyUserItem>("description"), {
              initialValue: item.description
            })(<Input />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label={"Is Admin"}>
            {getFieldDecorator(nameof<NewMyUserItem>("isAdmin"), {
              initialValue: item.isAdmin
            })(<BooleanInput onChange={v => setIsAdmin(v)} />)}
          </FormItem>
        </Col>
        <Col span={12}>
          {isAdmin && (
            <FormItem label={"Admin Type"}>
              {getFieldDecorator(nameof<NewMyUserItem>("adminType"), {
                initialValue: item.adminType
              })(<AdminTypeDropdown disabled={!isAdmin} />)}
            </FormItem>
          )}
        </Col>
      </Row>
    </Form>
  );
};

@connect(["newMyUserItem", NewMyUserItemStore])
class NewMyUserItemView extends React.Component<
  NewMyUserItemViewProps & FormComponentProps
> {
  private get MyUserItemStore() {
    return (this.props as any).newMyUserItem as NewMyUserItemStore;
  }

  constructor(props: NewMyUserItemViewProps & FormComponentProps) {
    super(props);
    this.MyUserItemStore.createNew({} as any);
  }

  componentWillReceiveProps(nextProps: NewMyUserItemViewProps) {
    if (
      this.MyUserItemStore.state.result &&
      this.MyUserItemStore.state.result.isSuccess
    )
      nextProps.onClose(
        (this.MyUserItemStore.state.result as any).aggregateRootId,
        this.MyUserItemStore.state.item
      );
  }

  @autobind
  private onCreateNewItem() {
    var self = this;
    return new Promise((resolve, reject) => {
      self.props.form.validateFields(event => {
        var values = self.props.form.getFieldsValue();
        if (!event) {
          values = { ...values };
          self.MyUserItemStore.change(values);
          self.MyUserItemStore.submit().then(result => {
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
  private onCancelNewItem() {
    this.MyUserItemStore.clear();
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
        width="800px"
        title={"New MyUser item"}
      >
        {this.MyUserItemStore.state.result &&
          !this.MyUserItemStore.state.result.isSuccess && (
            <Alert
              type="error"
              message="Ha ocurrido un error"
              description={formatMessage(this.MyUserItemStore.state.result)}
            />
          )}
        <Spin spinning={this.MyUserItemStore.state.isBusy}>
          <MyUserItemFormBody
            item={this.MyUserItemStore.state.item}
            getFieldDecorator={getFieldDecorator}
            getFieldValue={this.props.form.getFieldValue}
            setFieldsValue={this.props.form.setFieldsValue}
            onSave={this.onCreateNewItem}
          />
        </Spin>
      </Modal>
    );
  }
}

// Wire up the React component to the Redux store
export default (Form.create({})(
  NewMyUserItemView as any
) as any) as React.ComponentClass<NewMyUserItemViewProps>;
