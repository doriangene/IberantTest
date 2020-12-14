import { Alert, Checkbox, Col, Form, Input, InputNumber, Modal, Row, Select, Spin, Table } from "antd";
import { FormComponentProps } from "antd/lib/form";
import React, { FC, ReactElement } from "react";
const FormItem = Form.Item;
import { GetFieldDecoratorOptions } from "antd/lib/form/Form";
import autobind from "autobind-decorator";
import { connect } from "redux-scaffolding-ts";
import { formatMessage } from "src/services/http-service";
import { NewTestItem, NewTestItemStore } from "src/stores/test-store";
import { nameof } from "src/utils/object";
import { FormBodyProps } from "../common/NewItemView";

const TestItemFormBody: FC<FormBodyProps<NewTestItem>> = ({ getFieldDecorator, item, onSave }): ReactElement => {

    return <Form id="modaForm" onSubmit={() => { if (onSave) { onSave(); } }}>
        <Row gutter={24}>

            <Col span={12}>
                <FormItem label={"Title"}>
                    {getFieldDecorator(nameof<NewTestItem>("title"), {
                        initialValue: (item as NewTestItem).title,
                    })(
                        <Input />,
                    )}
                </FormItem>
            </Col>
            <Col span={12}>
                <FormItem label={"Description"}>
                    {getFieldDecorator(nameof<NewTestItem>("description"), {
                        initialValue: (item as NewTestItem).description,
                    })(
                        <Input />,
                    )}
                </FormItem>
            </Col>

        </Row>

    </Form>;

};

export default TestItemFormBody;
