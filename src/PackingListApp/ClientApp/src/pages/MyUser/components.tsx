import React, { FC, ReactElement } from "react";
import { Select } from "antd";

export const AdminTypeDropdown: FC<{ disabled: boolean }> = props => {
  return (
    <Select {...props} style={{ width: "100%" }}>
      <Select.Option value={0}>Normal</Select.Option>

      <Select.Option value={1}>VIP</Select.Option>

      <Select.Option value={2}>King</Select.Option>
    </Select>
  );
};
