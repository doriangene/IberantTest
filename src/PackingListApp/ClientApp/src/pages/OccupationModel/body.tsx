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
import { NewOccupation, NewOccupationStore } from "src/stores/occupation-store";
import { connect } from "redux-scaffolding-ts";
import { nameof } from "src/utils/object";
import autobind from "autobind-decorator";
import { GetFieldDecoratorOptions } from "antd/lib/form/Form";
import { formatMessage } from "src/services/http-service";

interface NewOccupationViewProps {
  onClose: (id: string | undefined, item?: NewOccupation) => void;
}

interface NewOccupationViewState {}

interface ClassFormBodyProps {
  item: NewOccupation | undefined;
  onSave?: () => Promise<any>;
  setFieldsValue(obj: Object): void;
  getFieldValue(fieldName: string): any;
  getFieldDecorator<T extends Object = {}>(
    id: keyof T,
    options?: GetFieldDecoratorOptions
  ): (node: React.ReactNode) => React.ReactNode;
}

export class OccupationFormBody extends React.Component<ClassFormBodyProps> {
  render() {
    const { getFieldDecorator } = this.props;

    var item = this.props.item || ({} as NewOccupation);
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
          <Col span={12}>
            <FormItem label={"Ocupación"}>
              {getFieldDecorator(nameof<NewOccupation>("title"), {
                initialValue: item.title,
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={"Descripción"}>
              {getFieldDecorator(nameof<NewOccupation>("description"), {
                initialValue: item.description,
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

@connect(["newOccupation", NewOccupationStore])
class NewOccupationView extends React.Component<
  NewOccupationViewProps & FormComponentProps,
  NewOccupationViewState
> {
  private get OccupationsStore() {
    return (this.props as any).newOccupation as NewOccupationStore;
  }

  constructor(props: NewOccupationViewProps & FormComponentProps) {
    super(props);
    this.OccupationsStore.createNew({} as any);
  }

  componentWillReceiveProps(nextProps: NewOccupationViewProps) {
    if (
      this.OccupationsStore.state.result &&
      this.OccupationsStore.state.result.isSuccess
    )
      nextProps.onClose(
        (this.OccupationsStore.state.result as any).aggregateRootId,
        this.OccupationsStore.state.item
      );
  }

  @autobind
  private onCreateNewItem() {
    var self = this;
    return new Promise((resolve, reject) => {
      self.props.form.validateFields((event) => {
        var values = self.props.form.getFieldsValue();
        if (!event) {
          values = { ...values };
          self.OccupationsStore.change(values);
          self.OccupationsStore.submit().then((result) => {
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
    this.OccupationsStore.clear();
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
        title={"Nueva Ocupación"}
      >
        {this.OccupationsStore.state.result &&
          !this.OccupationsStore.state.result.isSuccess && (
            <Alert
              type="error"
              message="Ha ocurrido un error"
              description={formatMessage(this.OccupationsStore.state.result)}
            />
          )}
        <Spin spinning={this.OccupationsStore.state.isBusy}>
          <OccupationFormBody
            item={this.OccupationsStore.state.item}
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
export default Form.create({})(
  NewOccupationView as any
) as any as React.ComponentClass<NewOccupationViewProps>;
