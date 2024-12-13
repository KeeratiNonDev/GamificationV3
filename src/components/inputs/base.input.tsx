import type { ValidateStatus } from "antd/es/form/FormItem";
import type { FormItemLayout } from "antd/es/form/Form";

import { Form } from "antd";
import { PropsWithChildren } from "react";

export type TBaseFormField = PropsWithChildren<{
  label?: string;
  labelCol?: number;
  wrapperCol?: number;
  layout?: FormItemLayout;
  required?: boolean;
  tooltip?: string;
  help?: string;
  status?: ValidateStatus;
  hasFeedback?: boolean;
  className?: string;
}>;

export function BaseFormField({ className = "", ...props }: TBaseFormField) {
  if (props.labelCol && !props.wrapperCol) {
    props.wrapperCol = 24 - props.labelCol;
  }
  return (
    <Form.Item
      layout={props.layout}
      label={props.label}
      required={props.required}
      labelCol={{ span: props.labelCol }}
      rootClassName={`!m-0 ${className}`}
      help={props.help}
      validateStatus={props.status}
      hasFeedback={props.hasFeedback}
      tooltip={props.tooltip}
      wrapperCol={{ span: props.wrapperCol }}
    >
      {props.children}
    </Form.Item>
  );
}
