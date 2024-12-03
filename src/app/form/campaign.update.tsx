import { AnySchema, JSONSchemaType } from "ajv";
import { FormProvider, useForm } from "react-hook-form";
import { ajvResolver } from "@hookform/resolvers/ajv";
import { fullFormats } from "ajv-formats/dist/formats";
import { Game } from "../games";
import { Button, message, Tabs } from "antd";
import { showValidationErrorNotification } from "../hooks/useValidationErrorNotification";
import { InputFormField } from "../inputs/text.input";
import DateRangeFormField from "../inputs/date.range";
import TimelineList from "../components/TimelineList";
import { useMemo, useState } from "react";

type TTimeline = {
  game: any;
};

type TSchema = {
  title: string;
  startTime: string;
  closeTime: string;
  properties: {
    defaults: TTimeline;
    timeline: TTimeline[];
  };
};

const SCHEMA: JSONSchemaType<TSchema> = {
  type: "object",
  properties: {
    title: {
      type: "string",
      default: "",
    },
    startTime: {
      $ref: "#/definitions/dateTimeObject",
    },
    closeTime: {
      $ref: "#/definitions/dateTimeObject",
    },
    properties: {
      $ref: "#/definitions/propertyObject",
    },
  },
  required: ["title", "properties"],
  definitions: {
    dateTimeObject: {
      type: "string",
      format: "date-time",
    },
    translatableObject: {
      type: "object",
      additionalProperties: { type: "string" },
      required: [],
    },
    defaultsObject: {
      type: "object",
      properties: {
        game: {
          $ref: "external#/definitions/setting",
          default: {},
        },
      },
      required: ["game"],
    },
    timelineObject: {
      type: "object",
      properties: {
        game: {
          $ref: "external#/definitions/setting",
          default: {},
        },
      },
      required: ["game"],
    },
    propertyObject: {
      type: "object",
      properties: {
        defaults: {
          $ref: "#/definitions/defaultsObject",
        },
        timeline: {
          type: "array",
          items: {
            $ref: "#/definitions/timelineObject",
          },
          default: [{}],
        } as any,
      },
      required: ["defaults", "timeline"],
    },
  },
};

export function CampaginUpdateForm() {
  const [timelineId, setTimelineId] = useState('');

  // const timelineIndex = useMemo(() => {
  //   return (
  //       form
  //           .getValues('properties.timeline')
  //           ?.findIndex((v:any) => v.general.id === timelineId) ?? 0
  //   );
  // }, [timelineId]);

  const target = "20240814_EASY_GIFT";

  const schema: AnySchema = {
    $id: "external",
    definitions: {
      setting: Game.getSettingFormSchema(target),
    },
  };

  const form = useForm<any>({
    defaultValues: {
      title: 'Easy Gift',
      channel: 'True',
      startTime: "2024-10-23T17:00:00.000Z",
      closeTime: "2024-11-30T16:59:59.000Z",
      code: 'GAMI000000002',
      target: '0240814_EASY_GIFT',
      type: 'check-in',
      properties: {
        defaults: {
          general: {
            creditMode: 'local',
            redeemType: 'sequence'
          }
        },
        timeline:[
          {
            general: {
              closeTime: "2024-11-30T16:59:59.000Z",
              id: "0iSp64TDoFTnhmL9UflQv",
              isActive: true,
              name: "OCT",
              startTime: "2024-10-23T17:00:00.000Z",
            }
          },
          {
            general: {
              closeTime: "2024-11-30T16:59:59.000Z",
              id: "2",
              isActive: true,
              name: "OCT 2",
              startTime: "2024-10-23T17:00:00.000Z",
            }
          },
        ]
      }
    },
    resolver: ajvResolver(SCHEMA, {
      allErrors: true,
      useDefaults: true,
      coerceTypes: true,
      formats: fullFormats,
      schemas: [schema],
    }),
  });

  const handleSubmit = form.handleSubmit(
    async (values) => {
      console.log("onSubmit", values);
      message.success("Submit success");
    },
    (errors) => {
      console.error("Form validation errors:", errors);
      showValidationErrorNotification({ errorMessages: errors });
    }
  );

  // const GameSetting = Game.getSettingFormComponent(target);
console.log(timelineId)
  return (
    <FormProvider {...form}>
      <Button onClick={()=>setTimelineId('')}>Home</Button>
      {!timelineId
      ? 
        <div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <InputFormField name='title' label="Campaign Title" labelCol={6}/>
            <InputFormField name='target' label="Game" labelCol={6} disabled/>
            <InputFormField name='channel' label="Channel" labelCol={6} disabled/>
            <InputFormField name='properties.defaults.general.creditMode' label="Credit Mode" labelCol={6} disabled/>
            <DateRangeFormField names={['startTime', 'closeTime']} label="Date time" labelCol={6} />
            <InputFormField name='type' label="Game Type" labelCol={6} disabled/>
            <InputFormField name='code' label="Campaign Code" labelCol={6} disabled/>
            <InputFormField name='properties.defaults.general.redeemType' label="Redeem Type" labelCol={6} disabled/>
          </div>
          <div className="p-6">
            <Tabs
              items={[
                  {
                      key: '1',
                      label: 'Timeline',
                      children: (
                          <TimelineList
                            onEdit={(id) => {
                              setTimelineId(id);
                            }}
                          />
                      ),
                  },
                ]}
              destroyInactiveTabPane={true}
            />
          </div>
        </div>
        // {/* <GameSetting
        //   prefix="properties.defaults.game"
        //   onChange={(values) => {
        //     form.setValue("properties.defaults.game", values);
        //     console.log("onChange:properties.defaults.game", values);
        //   }}
        // />

        // {form.watch("properties.timeline")?.map((_: any, index: number) => (
        //   <div key={index}>
        //     <h4>Timeline {index + 1}</h4>
        //     <GameSetting
        //       prefix={`properties.timeline.${index}.game`}
        //       onChange={(values) => {
        //         form.setValue(`properties.timeline.${index}.game`, values);
        //       }}
        //     />
        //   </div>
        // ))} */}

        // {/* <Button
        //   onClick={() => {
        //     const timeline = form.getValues("properties.timeline") || [];
        //     form.setValue("properties.timeline", [
        //       ...timeline,
        //       { game: { title: "" } },
        //     ]);
        //   }}
        // >
        //   Add Timeline
        // </Button> */}

        // {/* <Button onClick={handleSubmit}>Submit</Button> */}
      :
          <div>
            t
          </div>
      }
    </FormProvider>
  );
}
