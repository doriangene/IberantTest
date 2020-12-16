import React, { FC, ReactElement, useState } from 'react';
import { Col, Input, Row, Select, Switch } from 'antd';
import Form, { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import { AdminType, NewUser, User } from '../../stores/userStore';
import { nameof } from '../../utils/object';
import { FormBodyProps } from '../common/NewItemView';
import BooleanInput from '../../components/form/booleanInput';
import AdminTypeSelect from './forms/AdminTypeSelect';
const Option = Select.Option;

const UserFormBody: FC<FormBodyProps<NewUser>> = ({
    getFieldDecorator,
    item,
    onSave
}): ReactElement => {
    const [isAdmin, setIsAdmin] = useState((item as NewUser).isAdmin);

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
                <Col span={12}>
                    <FormItem label={'First Name'}>
                        {getFieldDecorator(nameof<NewUser>('firstName'), {
                            initialValue: (item as NewUser).firstName
                        })(<Input />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label={'Last Name'}>
                        {getFieldDecorator(nameof<NewUser>('lastName'), {
                            initialValue: (item as NewUser).lastName
                        })(<Input />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label={'Address'}>
                        {getFieldDecorator(nameof<NewUser>('address'), {
                            initialValue: (item as NewUser).address
                        })(<Input />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label={'Description'}>
                        {getFieldDecorator(nameof<NewUser>('description'), {
                            initialValue: (item as NewUser).description
                        })(<Input />)}
                    </FormItem>
                </Col>
                <Col span={3}>
                    <FormItem label={'Is Admin'}>
                        {getFieldDecorator(nameof<NewUser>('isAdmin'), {
                            initialValue: (item as NewUser).isAdmin
                        })(
                            <BooleanInput
                                onChange={value => setIsAdmin(value)}
                            />
                        )}
                    </FormItem>
                </Col>
                {isAdmin && (
                    <Col span={6}>
                        <FormItem label={'Admin Type'}>
                            {getFieldDecorator(nameof<NewUser>('adminType'), {
                                initialValue: (item as NewUser).adminType
                            })(<AdminTypeSelect disabled={!isAdmin} />)}
                        </FormItem>
                    </Col>
                )}
            </Row>
        </Form>
    );
};

export default UserFormBody;
