import { Col, Input, Row } from "antd";
import Form, { GetFieldDecoratorOptions } from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import React, { FC, ReactElement } from "react";
import { NewUser, User } from "../../stores/userStore";
import { nameof } from "../../utils/object";
import { FormBodyProps } from "../common/NewItemView";

const UserFormBody: FC<FormBodyProps<NewUser>> = ({
    getFieldDecorator,
    item,
    onSave,
}): ReactElement => {
    return (
        <Form
            id="modaForm"
            onSubmit={() => {
                if (onSave) {
                    onSave();
                }
            }}
        >
            <Row gutter={24}>
                <Col span={6}>
                    <FormItem label={"First Name"}>
                        {getFieldDecorator(nameof<NewUser>("firstName"), {
                            initialValue: (item as NewUser).firstName,
                        })(<Input />)}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem label={"Last Name"}>
                        {getFieldDecorator(nameof<NewUser>("lastName"), {
                            initialValue: (item as NewUser).lastName,
                        })(<Input />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    s
                    <FormItem label={"Address"}>
                        {getFieldDecorator(nameof<NewUser>("address"), {
                            initialValue: (item as NewUser).address,
                        })(<Input />)}
                    </FormItem>
                </Col>
            </Row>
        </Form>
    );
};

export default UserFormBody;
