"use client";
import { AnySchema } from "ajv";
import { FormProvider, useForm } from "react-hook-form";
import { Game } from "@/game-list";
import { Button, message, Skeleton, Tabs } from "antd";
import { showValidationErrorNotification } from "@/hooks/useValidationErrorNotification";
import { InputFormField } from "@/components/inputs/text.input";
import DateRangeFormField from "@/components/inputs/date.range";
import TimelineList from "@/components/form-campaign/TimelineList";
import { useEffect, useMemo, useState } from "react";
import TimelineEditor from "@/components/form-campaign/TimelineEditor";
import { schemaResolver } from "@/utils/schema.validator";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useDataContext } from "@/context/DataContext";
import { HomeOutlined } from "@ant-design/icons";
import { useEditing } from "../../context/EditingContext";
import SwitchFormField from "../inputs/switch.form.field";
import { updateMockData } from "../../actions/campaign";
import { nanoid } from "nanoid";
import { LanguageProvider } from "../../context/LanguageContext";

export type TTimeline = {
  general: any;
  credit: any;
  redeem: any;
  game: any;
};

export type TSchema = {
  title: string;
  startTime: string;
  closeTime: string;
  properties: {
    defaults: TTimeline;
    timeline: TTimeline[];
  };
};

export const SCHEMA: AnySchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      minLength: 1,
      errorMessage: "Title is required",
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
      required: [],
    },
    timelineObject: {
      type: "object",
      properties: {
        general: {
          type: "object",
          properties: {
            name: {
              type: "string",
              minLength: 1,
              errorMessage: "Name is required",
            },
            startTime: {
              type: "string",
              format: "date-time",
              errorMessage: "Start Time is invalid",
            },
            closeTime: {
              type: "string",
              format: "date-time",
              errorMessage: "Close Time is invalid",
            },
          },
          required: ["name", "startTime", "closeTime"],
          additionalProperties: true,
        },
        game: {
          type: "object",
          properties: {
            giftList: {
              type: "array",
              items: {
                $ref: "external#/definitions/setting",
              },
            },
          },
        },
        credit: {
          type: "array",
          items: {
            type: "object",
            properties: {
              tierIds: {
                type: "array",
                items: {
                  type: "number",
                },
              },
              type: {
                type: "string",
                minLength: 1,
                errorMessage: "Type is required",
              },
              value: { type: "number" },
              total: { type: "number" },
              isActive: { type: "boolean" },
            },
            required: ["tierIds", "type", "value", "total", "isActive"],
            additionalProperties: false,
          },
        },
        redeem: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "string",
                errorMessage: "Redeem ID is required",
              },
              isActive: {
                type: "boolean",
              },
              name: {
                type: "string",
                minLength: 1,
                errorMessage: "Basket name is required",
              },
              giftShelf: {
                type: "number",
                minimum: 1,
                errorMessage: "giftShelf is required",
              },
              normal: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    giftId: { type: "number" },
                    isActive: { type: "boolean" },
                    limitPerUser: { type: "number" },
                    order: { type: "number" },
                  },
                  required: ["giftId", "limitPerUser", "order"],
                },
              },
              remark: {
                type: "string",
                default: "",
              },
              sequence: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    giftId: { type: "number" },
                    isActive: { type: "boolean" },
                    limitPerUser: { type: "number" },
                    start: { type: "number" },
                    type: { type: "string" },
                    value: { type: "number" },
                  },
                  required: [
                    "giftId",
                    "type",
                    "value",
                    "start",
                    "limitPerUser",
                  ],
                },
              },
              setGiftScore: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    giftId: { type: "number" },
                    limitPerUser: { type: "number" },
                    min: { type: "number" },
                    max: { type: "number" },
                    unlimit: { type: "boolean" },
                  },
                  required: ["giftId", "limitPerUser", "min", "max"],
                },
              },
            },
            required: ["id", "name", "giftShelf"],
          },
        },
      },
      required: [],
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

export function CampaginSettingForm() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const campaignTitle = searchParams.get("title");
  const campaignTarget = searchParams.get("target");

  const schema: AnySchema = {
    $id: "external",
    definitions: {
      setting: Game.getSettingFormSchema(String(campaignTarget)),
    },
  };

  const dataContext = useDataContext();
  const { isTimelineEditing, setIsTimelineEditing } = useEditing();

  const [timelineId, setTimelineId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dataContext.fetch("campaign-list");
        setCampaigns(response);
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isTimelineEditing) {
      setTimelineId("");
    }
  }, [isTimelineEditing]);

  const form = useForm<any>({
    defaultValues: {},
    resolver: schemaResolver(SCHEMA, [schema]),
  });

  const campaign = useMemo(() => {
    return campaigns.find((item) => item.id === Number(id));
  }, [id, campaigns]);

  useEffect(() => {
    if (campaign) {
      form.reset(campaign);
    }
  }, [campaign]);

  const timelineIndex = useMemo(() => {
    return (
      form
        .getValues("properties.timeline")
        ?.findIndex((v: any) => v.general.id === timelineId) ?? 0
    );
  }, [timelineId]);

  const handleSubmit = form.handleSubmit(
    async (data) => {
      try {
        await updateMockData(Number(id), data);
        console.log("Updated Campaign:", data);
      } catch (error) {
        console.error("Error updating campaign:", error);
      }
    },
    (errors) => {
      console.error("Form validation errors:", errors);
      showValidationErrorNotification({ errorMessages: errors });
    }
  );

  const handleBackClick = () => {
    // if (isTimelineEditing) {
    //   setTimelineId("");
    //   setIsTimelineEditing(false);
    // } else {
    router.back();
    // }
  };

  const handleCreateNewTimeline = () => {
    setTimelineId(String(nanoid()));
    setIsTimelineEditing(true);
  };

  return (
    <LanguageProvider>
      <div className="h-dvh flex flex-col justify-between">
        {loading ? (
          <Skeleton active />
        ) : (
          <FormProvider {...form}>
            <div>
              <div className="px-6 pt-6 flex justify-between">
                <div>
                  <span
                    className="hover: cursor-pointer"
                    onClick={() => {
                      setTimelineId("");
                      router.back();
                    }}
                  >
                    <HomeOutlined />
                  </span>
                  <span> / </span>
                  <span
                    className="hover: cursor-pointer"
                    onClick={() => setIsTimelineEditing(false)}
                  >
                    {campaignTitle}
                  </span>
                </div>
                <SwitchFormField name="isActive" />
              </div>
              <div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  <InputFormField
                    name="title"
                    label="Campaign Title"
                    labelCol={6}
                  />
                  <InputFormField
                    name="target"
                    label="Game"
                    labelCol={6}
                    disabled
                  />
                  <InputFormField
                    name="channel"
                    label="Channel"
                    labelCol={6}
                    disabled
                  />
                  <InputFormField
                    name="properties.defaults.general.creditMode"
                    label="Credit Mode"
                    labelCol={6}
                    disabled
                  />
                  <DateRangeFormField
                    names={["startTime", "closeTime"]}
                    label="Date time"
                    labelCol={6}
                  />
                  <InputFormField
                    name="type"
                    label="Game Type"
                    labelCol={6}
                    disabled
                  />
                  <InputFormField
                    name="code"
                    label="Campaign Code"
                    labelCol={6}
                    disabled
                  />
                  <InputFormField
                    name="properties.defaults.general.redeemType"
                    label="Redeem Type"
                    labelCol={6}
                    disabled
                  />
                </div>
                <div className="p-6 flex flex-col gap-6">
                  <div>
                    <Tabs
                      items={[
                        {
                          key: "1",
                          label: "Timeline",
                          children: (
                            <TimelineList
                              onEdit={(id: any) => {
                                setTimelineId(id);
                                setIsTimelineEditing(true);
                              }}
                            />
                          ),
                        },
                      ]}
                      destroyInactiveTabPane={true}
                    />
                  </div>
                  <Button onClick={handleCreateNewTimeline}>
                    Create New Timeline
                  </Button>
                </div>
              </div>
              {timelineId && isTimelineEditing && (
                <TimelineEditor
                  key={timelineIndex}
                  timeline={form.getValues(
                    `properties.timeline[${timelineIndex}]`
                  )}
                  redeemType={form.getValues(
                    `properties.defaults.general.redeemType`
                  )}
                  onChange={(values: any) => {
                    const existingTimelines = form.getValues(
                      "properties.timeline"
                    );

                    const isExisting = existingTimelines.some(
                      (timeline: any) =>
                        timeline.general.id === values.general.id
                    );
                    if (isExisting) {
                      form.setValue(
                        `properties.timeline[${timelineIndex}]`,
                        values
                      );
                    } else {
                      form.setValue("properties.timeline", [
                        ...existingTimelines,
                        values,
                      ]);
                    }
                  }}
                />
              )}
            </div>
            <div className="flex justify-between p-6">
              <Button onClick={handleBackClick}>Back</Button>
              <Button type="primary" onClick={handleSubmit}>
                Save
              </Button>
            </div>
          </FormProvider>
        )}
      </div>
    </LanguageProvider>
  );
}

export default CampaginSettingForm;
