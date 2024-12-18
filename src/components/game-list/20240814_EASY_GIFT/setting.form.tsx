import { useEffect, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import { InputFormField } from "../../inputs/text.input";
import {
  Button,
  Divider,
  message,
  Modal,
  Table,
  TableProps,
  Typography,
} from "antd";
import SwitchFormField from "@/components/inputs/switch.form.field";
import DateRangeFormField from "@/components/inputs/date.range";
import DateFormField from "@/components/inputs/date.picker";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { showValidationErrorNotification } from "@/hooks/useValidationErrorNotification";
import { Static, Type } from "@sinclair/typebox";
import { schemaResolver } from "@/utils/schema.validator";
import { useDataContext } from "@/context/DataContext";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageDropdown } from "@/components/form-campaign/LanguageDropDown";

export const schema = Type.Object({
  id: Type.String(),
  title: Type.Record(
    Type.String(),
    Type.String({ minLength: 1, errorMessage: "Title is required" })
  ),
  description: Type.Record(
    Type.String(),
    Type.String({ minLength: 1, errorMessage: "Description is required" })
  ),
  position: Type.String({ minLength: 1, errorMessage: "Position is required" }),
  startTime: Type.String({
    format: "date-time",
    errorMessage: "Invalid startTime",
  }),
  closeTime: Type.String({
    format: "date-time",
    errorMessage: "Invalid closeTime",
  }),
  isActive: Type.Boolean(),
  announcementStatus: Type.Boolean(),
  announcementContent: Type.Optional(
    Type.Union([
      Type.Record(
        Type.String(),
        Type.String({
          minLength: 1,
          errorMessage: "announcementContent is required",
        })
      ),
      Type.Object({}),
    ])
  ),
  announcementDate: Type.Optional(
    Type.String({ format: "date-time", errorMessage: "Invalid dateTime" })
  ),
});

export type GiftSchemaType = Static<typeof schema>;

type SettingFormWithParentProps = {
  prefix: string;
  onChange?: (value: any) => void;
  timelineId: string;
};

export const SettingFormWithParent = (props: SettingFormWithParentProps) => {
  const form = useFormContext();
  const data = form.watch(props.prefix);

  return <SettingForm {...props} value={data} />;
};

type SettingFormProps = {
  value: {
    giftList: GiftSchemaType[];
  };
  onChange?: (value: { giftList: GiftSchemaType[] }) => void;
  timelineId: string;
};

export const SettingForm = (props: SettingFormProps) => {
  const giftList = props.value?.giftList || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState<GiftSchemaType | null>(null);
  const [editStatus, setEditStatus] = useState(false);

  const params = useParams();

  const dataContext = useDataContext();
  const { lang, setLang } = useLanguage();

  const form = useForm({
    mode: "onSubmit",
    defaultValues: {
      id: nanoid(),
      title: {},
      description: {},
      position: "",
      startTime: "",
      closeTime: "",
      isActive: false,
      announcementStatus: false,
      announcementContent: {},
      announcementDate: undefined,
    },
    resolver: schemaResolver(schema),
  });

  useEffect(() => {
    if (showOrder) {
      const campaignId = Number(params.id);
      const timelineId = props.timelineId;
      const giftId = form.getValues("id");
      const fetchOrderList = async () => {
        setLoading(true);
        try {
          const response = await dataContext.fetch("order-list", {
            campaignId,
            timelineId,
            giftId,
          });
          setOrderList(response);
          setLoading(false);
        } catch (error) {
          console.log("Can't fetch order list", error);
        }
      };

      fetchOrderList();
    }
  }, [showOrder]);

  console.log("SettingForm", "re-render");

  const columns: TableProps<any>["columns"] = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (_, { title }) => (
        <div>{title.th || title[Object.keys(title)[0]]}</div>
      ),
    },
    {
      title: "Period",
      key: "period",
      render: (_, record) => {
        const formattedStartTime =
          record.startTime && dayjs(record.startTime).isValid()
            ? dayjs(record.startTime).format("YYYY/MM/DD HH:mm")
            : "";
        const formattedCloseTime =
          record.closeTime && dayjs(record.closeTime).isValid()
            ? dayjs(record.closeTime).format("YYYY/MM/DD HH:mm")
            : "";

        return `${formattedStartTime} - ${formattedCloseTime}`;
      },
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Status",
      key: "isActive",
      dataIndex: "isActive",
      render: (_, record) => (
        <div className="flex items-center">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              record.isActive ? "bg-[#1890FF]" : "bg-red-500"
            }`}
          ></span>
          <Typography.Text className="pl-2">
            {record.isActive ? "on" : "off"}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Announcement",
      key: "announcementStatus",
      dataIndex: "announcementStatus",
      render: (_, record) => (
        <div className="flex items-center">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              record.announcementStatus ? "bg-[#1890FF]" : "bg-red-500"
            }`}
          ></span>
          <Typography.Text className="pl-2">
            {record.announcementStatus ? "on" : "off"}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Tool",
      key: "tool",
      render: (data, __, index) => (
        <div className="flex">
          <Button type="link" size="small" onClick={() => handleEditData(data)}>
            Edit
          </Button>
          <Divider type="vertical" />
          <Button
            type="link"
            size="small"
            onClick={() => showDeleteConfirm(index)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleAddGift = () => {
    setIsModalOpen(true);
    setEditStatus(false);
  };

  const handleEditData = (data: any) => {
    setIsModalOpen(true);
    setEditStatus(true);
    setEditData(data);
  };

  useEffect(() => {
    if (isModalOpen) {
      setLang("th");
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen && editStatus && editData) {
      form.reset({
        ...editData,
        title: {
          ...editData.title,
          [lang]: editData.title?.[lang] || "",
        },
        description: {
          ...editData.description,
          [lang]: editData.description?.[lang] || "",
        },
        announcementContent: {
          ...(editData.announcementContent as Record<string, string>),
          [lang]:
            (editData.announcementContent as Record<string, string>)[lang] ||
            "",
        },
      });
    } else if (isModalOpen && !editStatus) {
      form.reset({
        id: nanoid(),
        title: { [lang]: "" },
        description: { [lang]: "" },
        position: "",
        startTime: "",
        closeTime: "",
        isActive: false,
        announcementStatus: false,
        announcementContent: { [lang]: "" },
        announcementDate: undefined,
      });
    }
  }, [lang, isModalOpen, editStatus, editData]);

  const handleDelete = (index: number) => {
    const updatedGiftList = giftList.filter((_, idx) => idx !== index);
    props.onChange?.({ giftList: updatedGiftList });

    message.success("Gift deleted successfully!");
  };

  const showDeleteConfirm = (index: number) => {
    Modal.confirm({
      title: "Delete this gift?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      maskClosable: true,
      centered: true,
      onOk() {
        handleDelete(index);
      },
    });
  };

  const handleModalOk = form.handleSubmit(
    (newGift) => {
      const typedGift = newGift as GiftSchemaType;
      const existingIndex = giftList.findIndex(
        (item) => item.id === typedGift.id
      );

      let updatedGiftList: GiftSchemaType[];
      if (existingIndex === -1) {
        updatedGiftList = [typedGift, ...giftList];
        message.success("Gift created successfully!");
      } else {
        updatedGiftList = [...giftList];
        updatedGiftList[existingIndex] = newGift as GiftSchemaType;
        message.success("Gift updated successfully!");
      }

      props.onChange?.({
        giftList: updatedGiftList,
      });

      setIsModalOpen(false);
    },
    (errors) => {
      console.error("Form validation errors:", errors);
      showValidationErrorNotification({ errorMessages: errors });
    }
  );

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleModalOrderCancel = () => {
    setShowOrder(false);
  };

  const columnsOrderList: TableProps<any>["columns"] = [
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
    },
    {
      title: "Date Time",
      dataIndex: "dateTime",
      key: "dateTime",
    },
    {
      title: "CustomerRef",
      dataIndex: "customerRef",
      key: "customerRef",
    },
  ];

  return (
    <div>
      <div className="flex flex-col items-end gap-10 pb-2">
        <Button onClick={handleAddGift}>Add Gift</Button>
      </div>
      <Table columns={columns} dataSource={giftList} rowKey="id" />
      <Modal
        title="Gift Form"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={1100}
        centered={true}
      >
        <FormProvider {...form}>
          <form className="flex gap-8 h-[60dvh]">
            <div className="flex flex-col gap-4 w-1/2 border p-4">
              <div className="flex justify-between">
                <div className="font-medium text-base">Gift</div>
                <SwitchFormField name="isActive" />
              </div>
              <div>
                <LanguageDropdown />
              </div>
              <InputFormField
                name={`title.${lang}`}
                label="Title"
                labelCol={6}
                addonBefore={lang.toUpperCase()}
              />
              <InputFormField
                name={`description.${lang}`}
                label="Desc"
                labelCol={6}
                addonBefore={lang.toUpperCase()}
              />
              <InputFormField name="position" label="Position" labelCol={6} />
              <DateRangeFormField
                names={["startTime", "closeTime"]}
                label="Period"
                labelCol={6}
              />
            </div>
            <div className="flex flex-col gap-4 w-1/2 border p-4">
              <div className="flex justify-between">
                <div className="font-medium text-base">Annonucement</div>
                <SwitchFormField name="announcementStatus" />
              </div>
              <div className="flex flex-col gap-4 justify-between h-full">
                <div className="flex flex-col gap-4">
                  <DateFormField
                    name="announcementDate"
                    label="Date"
                    labelCol={8}
                  />
                  <InputFormField
                    name={`announcementContent.${lang}`}
                    label="announcementContent"
                    labelCol={8}
                    addonBefore={lang.toUpperCase()}
                  />
                </div>
                <Button
                  onClick={() => {
                    setShowOrder(true);
                    setOrderList([]);
                  }}
                >
                  Show Order List
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
        <Modal
          title="Order List"
          open={showOrder}
          footer={null}
          onCancel={handleModalOrderCancel}
          width={800}
          centered={true}
        >
          <div className="h-[80dvh]">
            <Table
              columns={columnsOrderList}
              dataSource={orderList}
              rowKey="id"
              loading={loading}
            />
          </div>
        </Modal>
        {/* <ChangeDetector onChange={props.onChange} /> */}
      </Modal>
    </div>
  );
};

// export const ChangeDetector = (props: any) => {
//   const data = useWatch();
// console.log(data);
//   useEffect(() => {
//     if (props.onChange) {
//       props.onChange(data);
//     }
//   }, [data, props.onChange]);

//   return null;
// };
