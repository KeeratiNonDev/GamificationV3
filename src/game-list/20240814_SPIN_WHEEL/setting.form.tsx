import { Static, Type } from "@sinclair/typebox";
import { useEffect, useMemo, useState } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";

import { Default } from "@sinclair/typebox/value";
import { InputFormField } from "../../components/inputs/text.input";
import { useDataContext } from "@/context/DataContext";

import { ajvResolver } from "@hookform/resolvers/ajv";
import { fullFormats } from "ajv-formats/dist/formats";
import { JSONSchemaType } from "ajv";
import { schemaResolver } from "@/utils/schema.validator";
import SelectFormField from "@/components/inputs/select.form.field";
import { LanguageDropdown } from "@/components/form-campaign/LanguageDropDown";
import { useLanguage } from "@/context/LanguageContext";
import { Select } from "antd";

type Basket = {
  id: number;
  name: string;
  items: any[];
};

type SettingFormWithParentProps = {
  prefix: string;
  onChange?: (value: any) => void;
  timelineId: string;
};

export const SettingFormWithParent = (props: SettingFormWithParentProps) => {
  const form = useFormContext();
  const data = form.getValues(props.prefix);

  return <SettingForm {...props} value={data} />;
};

export const schema = Type.Object({
  titleImage: Type.Optional(Type.Record(Type.String(), Type.String())),
  buttonImage: Type.Optional(Type.Record(Type.String(), Type.String())),
  backgroundImage: Type.Optional(Type.Record(Type.String(), Type.String())),
  effectImage: Type.Optional(Type.Record(Type.String(), Type.String())),
  wheelCoverImage: Type.Optional(Type.Record(Type.String(), Type.String())),
  wheelBackgroundImage: Type.Optional(
    Type.Record(Type.String(), Type.String())
  ),
  WheelCircleImage: Type.Optional(Type.Record(Type.String(), Type.String())),
  propsImage: Type.Optional(Type.Record(Type.String(), Type.String())),
  numberOfPrizes: Type.Optional(Type.Number()),
  basketId: Type.Optional(Type.Number()),
});

type TSchema = Static<typeof schema>;

type SettingFormProps = {
  value: TSchema;
  onChange?: (value: TSchema) => void;
};

export const SettingForm = (props: SettingFormProps) => {
  const [loading, setLoading] = useState(true);
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [noOfPrize, setNoOfPrize] = useState(6);

  const { lang } = useLanguage();
  const dataContext = useDataContext();

  useEffect(() => {
    const fetchGiftShelves = async () => {
      try {
        const response: Basket[] = await dataContext.fetch("gift-shelf-list");
        setBaskets(response);
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGiftShelves();
  }, []);

  const form = useForm({
    mode: "onChange",
    resolver: schemaResolver(schema),
  });

  useEffect(() => {
    form.reset(props.value);
  }, [lang, props.value]);

  console.log("SettingForm", "re-render");

  const giftList = useMemo(() => {
    const basketId = form.watch("basketId");
    const selectedBasket = baskets.find((basket) => basket.id === basketId);
    if (!selectedBasket) return [];

    return selectedBasket.items.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [baskets, form.watch("basketId")]);

    console.log(giftList)

  const basketOption = useMemo(() => {
    return baskets.map((basket) => ({
      label: basket.name,
      value: basket.id,
    }));
  }, [baskets]);

  const prizeOption = [
    { label: "6", value: 6 },
    { label: "8", value: 8 },
    { label: "10", value: 10 },
  ];

  const handleNoOfPrizesChange = (value: number) => {
    setNoOfPrize(value as 6 | 8 | 10);
    form.setValue(`numberOfPrizes`, value);
    const currentGiftImages = form.getValues(`giftImages`) || [];
    const newGiftImages = Array(value)
      .fill(null)
      .map((_, index) => currentGiftImages[index] || { image: "", id: "" });
    form.setValue(`giftImages`, newGiftImages);
  };

  const handleBasketChange = (value: number) => {
    form.setValue(`basketId`, value);
  };

  const selectedBasket = baskets.find(
    (basket) => basket.id === Number(form.getValues("basketId"))
  );

  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <LanguageDropdown />
        </div>
        <div className="flex gap-4">
          <div className="w-1/2 flex flex-col gap-4 border p-4">
            <h1 className="text-base font-medium">Landing Setting</h1>
            <div className="grid grid-cols-3 gap-4">
              <InputFormField name={`titleImage.${lang}`} />
              <InputFormField name={`buttonImage.${lang}`} />
              <InputFormField name={`backgroundImage.${lang}`} />
              <InputFormField name={`effectImage.${lang}`} />
              <InputFormField name={`wheelCoverImage.${lang}`} />
              <InputFormField name={`wheelBackgroundImage.${lang}`} />
              <InputFormField name={`WheelCircleImage.${lang}`} />
              <InputFormField name={`propsImage.${lang}`} />
            </div>
          </div>
          <div className="w-1/2 flex flex-col gap-4 border p-4">
            <h1 className="text-base font-medium">Gift Setting</h1>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <h1>No of prize: </h1>
                <SelectFormField
                  className="flex-1"
                  name="numberOfPrizes"
                  items={prizeOption}
                  defaultValue={String(noOfPrize)}
                  onChange={(value) => handleNoOfPrizesChange(Number(value))}
                />
              </div>
              <div className="flex items-center gap-4">
                <h1>Gift Shelves: </h1>
                <Select
                  className="flex-1"
                  value={loading ? "Loading..." : selectedBasket?.id}
                  options={basketOption}
                  onChange={(value) => handleBasketChange(Number(value))}
                  loading={loading}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Array(noOfPrize)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="flex flex-col gap-4">
                    <InputFormField
                      name={`giftImages[${index}].image`}
                      label={`Gift Image ${index + 1}`}
                    />
                    <SelectFormField
                      name={`giftImages[${index}].id`}
                      items={giftList}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
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
