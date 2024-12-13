import { DatePicker } from "antd";
import { useController } from "react-hook-form";
import { TBaseFormField, BaseFormField } from "./base.input";
import { FormHelper } from "../../helpers/form.helper";
import { useMemo } from "react";
import dayjs from "dayjs";

type DateRangeFormFieldProps = TBaseFormField & {
  names: [string, string];
  defaultValue?: string;
  disabled?: boolean;
  transform?: (value: string) => string;
  readOnly?: boolean;
  allowEmpty?: boolean;
  allowClear?: boolean;
};

export default function DateRangeFormField({
  names,
  defaultValue,
  disabled,
  readOnly,
  allowEmpty = false,
  allowClear = false,
  ...props
}: DateRangeFormFieldProps) {
  const v1 = useController({ name: names[0], defaultValue });
  const v2 = useController({ name: names[1], defaultValue });

  const v1f = FormHelper.handleFieldState(v1.fieldState);
  const v2f = FormHelper.handleFieldState(v2.fieldState);

  const value = useMemo<[dayjs.Dayjs | null, dayjs.Dayjs | null]>(() => {
    return [
      v1.field.value ? dayjs(v1.field.value) : null,
      v2.field.value ? dayjs(v2.field.value) : null,
    ];
  }, [v1.field.value, v2.field.value]);

  return (
    <BaseFormField
      help={v1f.helpText || v2f.helpText}
      status={v1f.status || v2f.status}
      {...props}
    >
      <DatePicker.RangePicker
        showTime
        value={value}
        onChange={(dates) => {
          v1.field.onChange(dates?.[0]?.toISOString() || null);
          v2.field.onChange(dates?.[1]?.toISOString() || null);
        }}
        readOnly={readOnly}
        disabled={disabled}
        allowEmpty={allowEmpty}
        allowClear={allowClear}
      />
    </BaseFormField>
  );
}
