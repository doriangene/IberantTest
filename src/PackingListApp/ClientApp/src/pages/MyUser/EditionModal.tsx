import { Alert, Col, Form, Input, Modal, Row, Spin } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { GetFieldDecoratorOptions } from "antd/lib/form/Form";
import autobind from "autobind-decorator";
import * as React from "react";
import { connect } from "redux-scaffolding-ts";
import { formatMessage } from "src/services/http-service";
import { nameof } from "src/utils/object";
import BooleanInput from "../../components/form/booleanInput";
import {
  MyUserItem,
  MyUserItemStore,
  NewMyUserItem,
  NewMyUserItemStore
} from "../../stores/my-user-store";
import { MyUserItemFormBody } from "./body";
import { AdminTypeDropdown } from "./components";
let FormItem = Form.Item;

interface NewMyUserItemViewProps {
  onClose: (id: string | undefined, item?: NewMyUserItem) => void;
  onSave: () => Promise<any>;
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

@connect(["DataStore", MyUserItemStore])
@connect(["CreationStore", NewMyUserItemStore])
class EditionModal extends React.Component<
  NewMyUserItemViewProps & FormComponentProps
> {
  private get CreationStore() {
    return (this.props as any).CreationStore as NewMyUserItemStore;
  }

  private get DataStore() {
    return (this.props as any).DataStore as MyUserItemStore;
  }

  constructor(props: NewMyUserItemViewProps & FormComponentProps) {
    super(props);
  }

  componentWillReceiveProps(nextProps: NewMyUserItemViewProps) {
    if (
      this.CreationStore.state.result &&
      this.CreationStore.state.result.isSuccess
    )
      nextProps.onClose(
        (this.CreationStore.state.result as any).aggregateRootId,
        this.CreationStore.state.item
      );
  }

  @autobind
  private onEditItem() {
    var self = this;
    return new Promise((resolve, reject) => {
      self.props.form.validateFields(event => {
        var values = self.props.form.getFieldsValue();
        if (!event) {
          values = { ...values };
          self.CreationStore.change(values);
          const item = this.CreationStore.state.item as any;
          this.DataStore.saveAsync(`${item.id}`, item, "Changed")
            .then(result => {
              if (result.isSuccess) {
                this.props
                  .onSave()
                  .then(resolve)
                  .catch(resolve);
              } else {
                reject();
              }
            })
            .catch(reject);
        }
      });
    });
  }

  @autobind
  private onCancelNewItem() {
    this.CreationStore.clear();
    this.props.onClose(undefined);
  }

  public render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        maskClosable={false}
        visible
        onCancel={this.onCancelNewItem}
        onOk={this.onEditItem}
        closable={false}
        width="800px"
        title={"New MyUser item"}
      >
        {this.CreationStore.state.result &&
          !this.CreationStore.state.result.isSuccess && (
            <Alert
              type="error"
              message="Ha ocurrido un error"
              description={formatMessage(this.CreationStore.state.result)}
            />
          )}
        <Spin spinning={this.CreationStore.state.isBusy}>
          <MyUserItemFormBody
            item={this.CreationStore.state.item}
            getFieldDecorator={getFieldDecorator}
            getFieldValue={this.props.form.getFieldValue}
            setFieldsValue={this.props.form.setFieldsValue}
            onSave={this.onEditItem}
          />
        </Spin>
      </Modal>
    );
  }
}

// Wire up the React component to the Redux store
export default (Form.create({})(
  EditionModal as any
) as any) as React.ComponentClass<NewMyUserItemViewProps>;
