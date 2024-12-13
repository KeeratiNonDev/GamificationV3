import { Select } from "antd";
import { useController } from "react-hook-form";
import { TBaseFormField, BaseFormField } from "./base.input";
import { FormHelper } from "../../helpers/form.helper";

type SelectFormFieldProps = TBaseFormField & {
  name: string;
  items: Array<{ label: string; value: string | number }>;
  allowEmpty?: boolean;
  allowClear?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

export default function SelectFormField({
  name,
  defaultValue,
  items,
  allowClear,
  disabled,
  onChange,
  ...props
}: SelectFormFieldProps) {
  const { field, fieldState } = useController({ name, defaultValue });
  const { helpText, status } = FormHelper.handleFieldState(fieldState);

  return (
    <BaseFormField
      help={helpText}
      status={status}
      hasFeedback={false}
      {...props}
    >
      <Select
        value={field.value}
        onChange={(value) => {
          field.onChange(value);
          if (onChange) onChange(value);
        }}
        onBlur={field.onBlur}
        options={items}
        allowClear={allowClear}
        disabled={disabled || field.disabled}
      />
    </BaseFormField>
  );
}
