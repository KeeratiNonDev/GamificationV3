import { LanguageDropdown } from "@/components/form-campaign/LanguageDropDown";
import CheckboxFormField from "@/components/inputs/checkbox.form.field";
import { ColorPickerFormField } from "@/components/inputs/color.box.form.field";
import SelectFormField from "@/components/inputs/select.form.field";
import SwitchFormField from "@/components/inputs/switch.form.field";
import { InputFormField } from "@/components/inputs/text.input";
import { showValidationErrorNotification } from "@/hooks/useValidationErrorNotification";
import { schemaResolver } from "@/utils/schema.validator";
import { Static, Type } from "@sinclair/typebox";
import {
  Button,
  Divider,
  message,
  Modal,
  Table,
  TableProps,
  Typography,
} from "antd";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";

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

const ItemSchema = Type.Object({
  id: Type.Optional(Type.String()),
  top: Type.Optional(Type.Number()),
  left: Type.Optional(Type.Number()),
  width: Type.Optional(Type.Number()),
  height: Type.Optional(Type.Number()),
  image: Type.Optional(Type.String()),
  isActive: Type.Optional(Type.Boolean()),
});

export const schema = Type.Object({
  id: Type.Optional(Type.String()),
  name: Type.String({
    minLength: 1,
    errorMessage: { minLength: "Scene name is required" },
  }),
  backgroundImage: Type.Optional(Type.String()),
  backgroundColor: Type.Optional(Type.String()),
  ordering: Type.String({
    minLength: 1,
    errorMessage: { minLength: "Ordering is required" },
  }),
  winnerScore: Type.String({
    minLength: 1,
    errorMessage: { minLength: "Win score is required" },
  }),
  isActive: Type.Optional(Type.Boolean()),
  items: Type.Optional(Type.Array(ItemSchema)),
});

type FindingItemSchema = Static<typeof schema>;

type SettingFormProps = {
  value: {
    scenes: FindingItemSchema[];
  };
  onChange?: (value: FindingItemSchema[]) => void;
};
export const SettingForm = (props: SettingFormProps) => {
  const sceneList = props.value?.scenes || [];
  const [showModal, setShowModal] = useState(false);
  const [index, setIndex] = useState<number | null>(null);
  const [tableKey, setTableKey] = useState(0);
  
  const { getValues, setValue } = useFormContext();

  const form = useForm({
    mode: "all",
    resolver: schemaResolver(schema),
  });

  const handleOk = form.handleSubmit(
    (values) => {
      const currentScenes = getValues("game.scenes") || [];

      if (index !== null) {
        currentScenes[index] = { ...values };
        message.success("Scene updated successfully!");
      } else {
        currentScenes.push({
          ...values,
        });
        message.success("Create scene successfully");
      }

      setValue("game.scenes", currentScenes);
      setTableKey((prev) => prev + 1);
      setShowModal(false);
      setIndex(null);
    },
    (errors) => {
      console.error("Form validation errors:", errors);
      showValidationErrorNotification({ errorMessages: errors });
    }
  );

  const handleCloseModal = () => {
    setShowModal(false);
    setIndex(null);
  };

  const handleCreateScene = () => {
    form.reset({
      id: String(nanoid()),
      name: "",
      backgroundImage: "",
      backgroundColor: "",
      ordering: "",
      winnerScore: "",
      isActive: false,
      items: [],
    });
    setShowModal(true);
    setIndex(null);
  };

  const handleEdit = (data: FindingItemSchema, editIndex: number) => {
    form.reset(data);
    setIndex(editIndex);
    setShowModal(true);
  };

  const handleDelete = (deleteIndex: number) => {
    const currentScenes = getValues("game.scenes") || [];
    const updatedScenes = currentScenes.filter(
      (_: any, idx: any) => idx !== deleteIndex
    );
    setValue("game.scenes", updatedScenes);
    setTableKey((prev) => prev + 1);

    message.success("Scene deleted successfully!");
  };

  const showDeleteConfirm = (index: number) => {
    Modal.confirm({
      title: "Delete this scene?",
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

  const columns: TableProps<FindingItemSchema>["columns"] = [
    {
      title: "Title",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Ordering",
      key: "ordering",
      dataIndex: "ordering",
    },
    {
      title: "Win score",
      key: "winnerScore",
      dataIndex: "winnerScore",
    },
    {
      title: "Status",
      key: "isActive",
      dataIndex: "isActive",
      render: (_, __, rowIndex) => (
        <SwitchFormField name={`game.scenes[${rowIndex}].isActive`} />
      ),
    },
    {
      title: "Tool",
      key: "tool",
      render: (_, __, rowIndex) => (
        <div className="flex">
          <Button
            type="link"
            size="small"
            onClick={() => handleEdit(sceneList[rowIndex], rowIndex)}
          >
            Edit
          </Button>
          <Divider type="vertical" />
          <Button
            type="link"
            size="small"
            onClick={() => showDeleteConfirm(rowIndex)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-end pb-4">
        <Button onClick={handleCreateScene}>Create scene</Button>
      </div>
      <Table
        key={tableKey}
        dataSource={sceneList as FindingItemSchema[]}
        columns={columns}
        rowKey="id"
      />
      <FormProvider {...form}>
        <Modal
          title={index !== null ? "Edit Scene" : "Create Scene"}
          open={showModal}
          onOk={handleOk}
          onCancel={handleCloseModal}
          width={1400}
          centered={true}
        >
          <div className="flex flex-col gap-4">
            {/* <div>
                    <LanguageDropdown />
                </div> */}
            <div className="flex gap-2.5">
              <section></section>
              <div className="flex flex-col gap-4">
                <section className="p-4 border border-[#D9D9D9] flex flex-col">
                  <div className="flex justify-between">
                    <div className="font-medium text-base mb-4">
                      Scene Setting
                    </div>
                    <div>
                      <SwitchFormField name="isActive" />
                    </div>
                  </div>
                  <div className="flex gap-10">
                    <div className="flex flex-col gap-4">
                      <InputFormField
                        name="name"
                        label="Scene name"
                        labelCol={8}
                      />
                      <InputFormField
                        name="winnerScore"
                        label="Win score"
                        labelCol={8}
                      />
                      <SelectFormField
                        name="ordering"
                        label="Ordering:"
                        labelCol={8}
                        items={Array.from({ length: 20 }, (_, index) => ({
                          label: String(index + 1),
                          value: String(index + 1),
                        }))}
                        className="w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      <InputFormField
                        name="backgroundImage"
                        label="Background image"
                        labelCol={10}
                      />
                      <ColorPickerFormField
                        name="backgroundColor"
                        label="Background color :"
                        labelCol={11}
                      />
                    </div>
                  </div>
                </section>
                <section className="p-4 border border-[#D9D9D9]">
                  <h1 className="font-medium text-base mb-2">Items</h1>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 10 }).map((_, index) => {
                      return (
                        <div key={index}>
                          <InputFormField name={`items.${index}.image`} />
                          <div className="flex gap-2 mt-2">
                            <CheckboxFormField
                              name={`items.${index}.isActive`}
                            />
                            <p className="text-sm leading-[22px] flex items-center">
                              Icon {index + 1}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </Modal>
      </FormProvider>
    </div>
  );
};
