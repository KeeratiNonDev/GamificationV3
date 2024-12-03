import { Static, Type } from "@sinclair/typebox";
import { useEffect, useMemo } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";

import { Default } from "@sinclair/typebox/value";
import { InputFormField } from "../../inputs/text.input";
import { useDataContext } from "@/app/context/DataContext";
import { ajvResolver } from "@hookform/resolvers/ajv";
import { fullFormats } from "ajv-formats/dist/formats";
import { JSONSchemaType } from "ajv";

type SettingFormWithParentProps = {
  prefix: string;
  onChange?: (value: any) => void;
};

export const SettingFormWithParent = (props: SettingFormWithParentProps) => {
  const form = useFormContext();
  const data = form.getValues(props.prefix);
  return <SettingForm {...props} value={data} />;
};

export const SCHEMA = Type.Object({
  title: Type.String({ default: "", format: "email" }),
});

type TSchema = Static<typeof SCHEMA>;

type SettingFormProps = {
  value: TSchema;
  onChange?: (value: TSchema) => void;
};

export const SettingForm = (props: SettingFormProps) => {
  const dataContext = useDataContext();

  const defaultValues = useMemo(() => {
    return Default(SCHEMA, props.value) as TSchema;
  }, []);

  const form = useForm({
    mode: "onChange",
    resolver: ajvResolver(SCHEMA as JSONSchemaType<TSchema>, {
      allErrors: true,
      useDefaults: true,
      coerceTypes: true,
      formats: fullFormats,
    }),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    dataContext
      .fetch("test", {})
      .then((result) => console.log("dataContext.fetch(test)", result));
  }, []);

  console.log("SettingForm", "re-render");

  return (
    <FormProvider {...form}>
      <InputFormField name="title" required />
      <ChangeDetector onChange={props.onChange} />
    </FormProvider>
  );
};

export const ChangeDetector = (props: any) => {
  const data = useWatch();

  useEffect(() => {
    props.onChange?.(data);
  }, [data]);

  return null;
};
