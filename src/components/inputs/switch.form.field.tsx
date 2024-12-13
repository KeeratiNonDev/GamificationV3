import { Switch } from "antd";
import { useController } from "react-hook-form";
import { TBaseFormField, BaseFormField } from "./base.input";
import { FormHelper } from "../../helpers/form.helper";

type SwitchFormFieldProps = TBaseFormField & {
  name: string;
  defaultValue?: boolean;
};

export default function SwitchFormField({
  name,
  defaultValue = false,
  ...props
}: SwitchFormFieldProps) {
  const { field, fieldState } = useController({ name, defaultValue });
  const { helpText, status } = FormHelper.handleFieldState(fieldState);

  return (
    <BaseFormField help={helpText} status={status} {...props}>
      <Switch
        checkedChildren="ON"
        unCheckedChildren="OFF"
        checked={field.value}
        onChange={(v) => field.onChange(v)}
      />
    </BaseFormField>
  );
}
