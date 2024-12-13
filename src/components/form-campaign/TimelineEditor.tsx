import { message, Modal, Tabs } from "antd";
import React, { useEffect } from "react";
import General from "./General";
import GameSetting from "./GameSetting";
import { useEditing } from "../../context/EditingContext";
import { FormProvider, useForm } from "react-hook-form";
import { showValidationErrorNotification } from "../../hooks/useValidationErrorNotification";
import { AnySchema } from "ajv";
import { TTimeline } from "./CampaginSettingForm";
import { useSearchParams } from "next/navigation";
import { Game } from "../../game-list";
import { schemaResolver } from "../../utils/schema.validator";
import { LanguageProvider } from "../../context/LanguageContext";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import RedeemSetting from "./RedeemSetting";
import CreditPage from "./CreditPage";

// interface TimelineForm {
//   general: {
//     name: string;
//     startTime: string;
//     closeTime: string;
//   };
//   game: any
// }

interface TimelineEditorProps {
  timeline: TTimeline;
  redeemType: string;
  onChange: (values: TTimeline) => void;
}

const TIMELINE_SCHEMA: AnySchema = {
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
        startTime: { $ref: "#/definitions/dateTime" },
        closeTime: { $ref: "#/definitions/dateTime" },
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
              required: ["giftId", "type", "value", "start", "limitPerUser"],
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
  definitions: {
    dateTime: {
      type: "string",
      format: "date-time",
      errorMessage: "Invalid date-time format.",
    },
  },
};

const TimelineEditor = (props: TimelineEditorProps) => {
  const { isTimelineEditing, setIsTimelineEditing } = useEditing();
  const searchParams = useSearchParams();
  const campaignTarget = searchParams.get("target");

  const gameSchema = Game.getSettingFormSchema(String(campaignTarget));

  const schema: AnySchema = {
    $id: "external",
    type: "object",
    definitions: {
      setting: gameSchema,
    },
  };

  const form = useForm({
    defaultValues: {
      general: {
        id: props.timeline?.general?.id || String(nanoid()),
        name: props.timeline?.general?.name,
        startTime:
          props.timeline?.general?.startTime ||
          dayjs().startOf("day").toISOString(),
        closeTime:
          props.timeline?.general?.closeTime ||
          dayjs().endOf("day").toISOString(),
      },
      credit: props.timeline?.credit,
      redeem: props.timeline?.redeem,
      game: props.timeline?.game,
    },
    resolver: schemaResolver(TIMELINE_SCHEMA, [schema]),
  });

  const timelineId = form.getValues("general.id");

  useEffect(() => {
    setIsTimelineEditing(true);
  }, []);

  const handleModalCancel = () => {
    setIsTimelineEditing(false);
  };

  const handleModalOk = form.handleSubmit(
    (values) => {
      props.onChange(values as TTimeline);
      console.log("Save Timeline", values);
      setIsTimelineEditing(false);
      message.success("Save Timeline successfully!");
    },
    (errors) => {
      console.error("Form validation errors:", errors);
      showValidationErrorNotification({ errorMessages: errors });
    }
  );

  return (
    <LanguageProvider>
      <FormProvider {...form}>
        <Modal
          title="Timeline Form"
          open={isTimelineEditing}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          width={1200}
          centered={true}
        >
          <div className="p-6 h-[65dvh]">
            <Tabs
              items={[
                {
                  key: "1",
                  label: "General",
                  children: <General prefix={`general`} />,
                },
                {
                  key: "2",
                  label: "Redeem",
                  children: (
                    <RedeemSetting
                      prefix={`redeem`}
                      redeemType={props.redeemType}
                    />
                  ),
                },
                {
                  key: "3",
                  label: "Credit",
                  children: <CreditPage prefix={`credit`} />,
                },
                {
                  key: "7",
                  label: "Game Setting",
                  children: (
                    <GameSetting prefix={`game`} timelineId={timelineId} />
                  ),
                },
              ]}
              destroyInactiveTabPane={true}
            />
          </div>
        </Modal>
      </FormProvider>
    </LanguageProvider>
  );
};

export default TimelineEditor;
