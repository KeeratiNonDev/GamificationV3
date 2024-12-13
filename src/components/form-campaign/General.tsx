import React from "react";
import { InputFormField } from "../inputs/text.input";
import DateRangeFormField from "../inputs/date.range";

interface GeneralProps {
  prefix: string;
}

const General = ({ prefix }: GeneralProps) => {
  return (
    <div className="flex flex-col gap-2 w-1/3">
      <InputFormField name={`${prefix}.name`} label="Name" labelCol={6} />
      <DateRangeFormField
        names={[`${prefix}.startTime`, `${prefix}.closeTime`]}
        label="Period"
        labelCol={6}
      />
    </div>
  );
};

export default General;
