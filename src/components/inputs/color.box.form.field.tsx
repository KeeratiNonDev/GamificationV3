import { useController } from "react-hook-form";
import { FormHelper } from "../../helpers/form.helper";
import { TBaseFormField, BaseFormField } from "./base.input";
import { ColorPicker } from "antd";

type ColorPickerFormFieldProps = TBaseFormField & {
  name: string;
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
};

export function ColorPickerFormField({
  name,
  label,
  disabled,
  ...props
}: ColorPickerFormFieldProps) {
  const { field, fieldState } = useController({ name });
  const { helpText, status } = FormHelper.handleFieldState(fieldState);

  return (
    <BaseFormField help={helpText} status={status} {...props}>
        <div className="flex justify-between items-center">
        {label && (
            <div>{label}</div>
        )}
        <ColorPicker
            value={field.value}
            onChange={(color) => {
            field.onChange(color.toHexString());
            }}
            disabled={disabled || field.disabled}
        />
        </div>
    </BaseFormField>
  );
}
