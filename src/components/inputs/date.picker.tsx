import { DatePicker } from "antd";
import { useController } from "react-hook-form";
import { TBaseFormField, BaseFormField } from "./base.input";
import { FormHelper } from "../../helpers/form.helper";
import { useMemo } from "react";
import dayjs from "dayjs";

type DateFormFieldProps = TBaseFormField & {
  name: string;
  defaultValue?: string;
  disabled?: boolean;
  transform?: (value: string) => string;
  readOnly?: boolean;
  allowClear?: boolean;
};

export default function DateFormField({
  name,
  defaultValue,
  disabled,
  readOnly,
  allowClear = false,
  ...props
}: DateFormFieldProps) {
  const { field, fieldState } = useController({ name, defaultValue });

  const formattedFieldState = FormHelper.handleFieldState(fieldState);

  const value = useMemo(() => {
    return field.value ? dayjs(field.value) : null;
  }, [field.value]);

  return (
    <BaseFormField
      help={formattedFieldState.helpText}
      status={formattedFieldState.status}
      {...props}
    >
      <DatePicker
        showTime={{ format: "HH:mm:ss" }}
        value={value}
        onChange={(date) => {
          field.onChange(date?.toISOString() || null);
        }}
        readOnly={readOnly}
        disabled={disabled}
        allowClear={allowClear}
      />
    </BaseFormField>
  );
}
