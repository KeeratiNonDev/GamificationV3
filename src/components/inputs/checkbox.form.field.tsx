import { Checkbox } from "antd";
import { useController } from "react-hook-form";
import { TBaseFormField, BaseFormField } from "./base.input";
import { FormHelper } from "../../helpers/form.helper";
import { CheckboxChangeEvent } from "antd/es/checkbox";

type CheckboxFormFieldProps = TBaseFormField & {
  name: string;
  defaultValue?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
};

export default function CheckboxFormField({
  name,
  defaultValue,
  disabled,
  ...props
}: CheckboxFormFieldProps) {
  const { field, fieldState } = useController({ name, disabled, defaultValue });
  const { helpText, status } = FormHelper.handleFieldState(fieldState);

  const handleChange = (e: CheckboxChangeEvent) => {
    field.onChange(e.target.checked);
    if (props.onChange) {
      props.onChange(e.target.checked);
    }
  };

  return (
    <BaseFormField help={helpText} status={status} {...props}>
      <Checkbox
        checked={field.value}
        onChange={handleChange}
        disabled={disabled}
      />
    </BaseFormField>
  );
}
