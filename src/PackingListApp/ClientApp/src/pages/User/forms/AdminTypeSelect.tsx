import { Select } from 'antd';
import React, { FC } from 'react';
import { AdminType } from '../../../stores/userStore';

const AdminTypeSelect: FC<{ disabled: boolean }> = props => {
    return (
        <Select {...props} style={{ width: '100%' }}>
            {Object.keys(AdminType)
                .filter(key => !isNaN(Number(AdminType[key as any])))
                .map(item => (
                    <Select.Option value={AdminType[item as any]}>
                        {item.toString()}
                    </Select.Option>
                ))}
        </Select>
    );
};

export default AdminTypeSelect;
