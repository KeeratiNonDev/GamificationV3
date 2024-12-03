import { Input } from "antd";
import { useController } from "react-hook-form";
import { FormHelper } from "../helpers/form.helper";
import { TBaseFormField, BaseFormField } from "./base.input";

type InputFormFieldProps = TBaseFormField & {
  type?: string;
  name: string;
  defaultValue?: string;
  disabled?: boolean;
  transform?: (value: string) => string;
  readOnly?: boolean;
};

export function InputFormField({
  name,
  defaultValue,
  disabled,
  readOnly,
  transform,
  type,
  ...props
}: InputFormFieldProps) {
  const { field, fieldState } = useController({ name, defaultValue });
  const { helpText, status } = FormHelper.handleFieldState(fieldState);

  return (
    <BaseFormField help={helpText} status={status} {...props}>
      <Input
        type={type}
        name={field.name}
        value={transform ? transform(field.value || "") : field.value || ""}
        onChange={field.onChange}
        onBlur={field.onBlur}
        readOnly={readOnly}
        disabled={disabled || field.disabled}
      />
    </BaseFormField>
  );
}
