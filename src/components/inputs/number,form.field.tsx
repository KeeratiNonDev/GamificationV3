import { Input, InputNumber } from "antd";
import { useController } from "react-hook-form";
import { TBaseFormField, BaseFormField } from "./base.input";
import { FormHelper } from "../../helpers/form.helper";

type NumberFormFieldProps = TBaseFormField & {
  name: string;
  defaultValue?: number;
  disabled?: boolean;
  readOnly?: boolean;
};

export default function NumberFormField({
  name,
  defaultValue,
  disabled,
  readOnly,
  ...props
}: NumberFormFieldProps) {
  const { field, fieldState } = useController({ name, defaultValue });
  const { helpText, status } = FormHelper.handleFieldState(fieldState);

  return (
    <BaseFormField help={helpText} status={status} {...props}>
      <InputNumber
        name={field.name}
        value={field.value}
        onBlur={field.onBlur}
        onChange={field.onChange}
        readOnly={readOnly}
        disabled={disabled || field.disabled}
      />
      {/* <Input
                type="number"
                name={field.name}
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
                onBlur={field.onBlur}
                readOnly={readOnly}
                disabled={disabled || field.disabled}
            /> */}
    </BaseFormField>
  );
}
