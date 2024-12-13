import React, { useEffect, useMemo, useState } from "react";
import { useDataContext } from "../../context/DataContext";
import {
  Button,
  Checkbox,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Table,
} from "antd";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import SwitchFormField from "../inputs/switch.form.field";
import { AnySchema } from "ajv";
import { InputFormField } from "../inputs/text.input";
import { schemaResolver } from "../../utils/schema.validator";
import { nanoid } from "nanoid";
import { showValidationErrorNotification } from "../../hooks/useValidationErrorNotification";
import SelectFormField from "../inputs/select.form.field";
import NumberFormField from "../inputs/number,form.field";
import CheckboxFormField from "../inputs/checkbox.form.field";

const schema: AnySchema = {
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
};

interface RedeemItem {
  id: string;
  isActive: boolean;
  name: string;
  giftShelf: number;
  normal: any[];
  remark: string;
  sequence: any[];
  setGiftScore: any[];
}

interface RedeemSettingProps {
  prefix: string;
  redeemType: string;
}

const RedeemSetting = (props: RedeemSettingProps) => {
  const [baskets, setBaskets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [indexBasket, setIndexbasket] = useState<number | null>(null);

  const [editStatus, setEditStatus] = useState(false);
  const [editData, setEditData] = useState<RedeemItem | null>(null);

  const [stateBasket, setStateBasket] = useState(null);
  const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});

  const { getValues, setValue, watch } = useFormContext();
  const dataContext = useDataContext();

  const form = useForm({
    mode: "onSubmit",
    resolver: schemaResolver(schema),
  });

  useEffect(() => {
    const fetchGiftShelves = async () => {
      setLoading(true);
      try {
        const response = await dataContext.fetch("gift-shelf-list");
        setBaskets(response);
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGiftShelves();
  }, []);

  useEffect(() => {
    if (editStatus && editData) {
      const basket = baskets.find((b) => b.id === editData.giftShelf);
      setStateBasket(basket.items);

      form.reset({
        id: editData.id,
        name: editData.name,
        giftShelf: editData.giftShelf,
        normal: editData.normal,
        sequence: editData.sequence,
        setGiftScore: editData.setGiftScore,
        remark: editData.remark,
        isActive: editData.isActive,
      });
    } else {
      setStateBasket(null);

      form.reset({
        id: String(nanoid()),
        name: "",
        giftShelf: undefined,
        normal: [],
        sequence: [],
        setGiftScore: [],
        remark: "",
        isActive: false,
      });
    }
  }, [editStatus, editData]);

  const handleCreate = () => {
    setEditStatus(false);
    setStateBasket(null);
    setShowModal(true);
  };

  const handleEdit = (index: number) => {
    setShowModal(true);
    setEditStatus(true);

    const data = getValues(`${props.prefix}[${index}]`);
    setEditData(data);
    setIndexbasket(index);
  };

  const handleDelete = (index: number) => {
    const basket = getValues(`${props.prefix}`);
    const updatedBaskets = basket.filter((_: any, idx: any) => idx !== index);
    setValue(props.prefix, updatedBaskets);
    message.success("Deleted Basket successfully!");
  };

  const showDeleteConfirm = (index: number) => {
    Modal.confirm({
      title: "Delete this Basket?",
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
    (values) => {
      const filteredSetGiftScore = values.setGiftScore.filter(
        (_: any, index: number) => selectedRows[index]
      );

      const arrayBasket = getValues(`${props.prefix}`);
      const existingIndex = arrayBasket.findIndex(
        (basket: any) => basket.id === values.id
      );

      let updatedBaskets;
      if (existingIndex !== -1) {
        updatedBaskets = [...arrayBasket];
        updatedBaskets[existingIndex] = {
          ...values,
          setGiftScore: filteredSetGiftScore,
        };
      } else {
        updatedBaskets = [
          { ...values, setGiftScore: filteredSetGiftScore },
          ...arrayBasket,
        ];
      }

      setValue(props.prefix, updatedBaskets);
      setShowModal(false);
      setIndexbasket(null);
      message.success(
        existingIndex !== -1
          ? "Updated Basket successfully!"
          : "Created Basket successfully!"
      );
    },
    (errors) => {
      console.error("Validation errors:", errors);
      showValidationErrorNotification({ errorMessages: errors });
    }
  );

  const handleModalCancel = () => {
    setShowModal(false);
    setEditStatus(false);
    setIndexbasket(null);
    setSelectedRows({});
  };

  const basketOption = useMemo(() => {
    return baskets.map((basket) => ({
      label: basket.name,
      value: basket.id,
    }));
  }, [baskets]);

  const selectedBasket = baskets.find(
    (basket) => Number(basket.id) === Number(form.watch("giftShelf"))
  );

  const handleBasketChange = (value: number) => {
    form.setValue(`giftShelf`, value);

    const selected =
      baskets.find((basket) => Number(basket.id) === Number(value)) || {};
    setStateBasket(selected.items);

    const mappedSequence = selected.items.map((item: any) => ({
      giftId: item.id,
      isActive: false,
      limitPerUser: 0,
      start: 0,
      type: "base-position",
      value: 0,
    }));

    const mappedNormal = selected.items.map((item: any) => ({
      giftId: item.id,
      isActive: false,
      limitPerUser: 0,
      order: 0,
    }));

    const mappedSetGiftScore = selected.items.map((item: any) => ({
      giftId: item.id,
      limitPerUser: 0,
      min: 0,
      max: 0,
      unlimit: false,
    }));

    props.redeemType === "sequence"
      ? form.setValue("sequence", mappedSequence)
      : props.redeemType === "normal"
      ? form.setValue("normal", mappedNormal)
      : form.setValue("setGiftScore", mappedSetGiftScore);
  };

  console.log(form.watch("setGiftScore"));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={handleCreate}>Crate Gift Basket</Button>
      </div>
      <Table
        columns={[
          {
            title: "Basket Name",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Gift Shelf",
            dataIndex: "giftShelf",
            key: "giftShelf",
          },
          {
            title: "Remark",
            dataIndex: "remark",
            key: "remark",
          },
          {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            render: (_: any, record: any, index: number) => {
              return (
                <SwitchFormField name={`${props.prefix}[${index}].isActive`} />
              );
            },
          },
          {
            title: "Action",
            key: "action",
            render: (_, record, index: number) => (
              <div className="flex gap-4">
                <Button onClick={() => handleEdit(index)}>Edit</Button>
                <Button onClick={() => showDeleteConfirm(index)}>Delete</Button>
              </div>
            ),
          },
        ]}
        dataSource={watch(props.prefix)}
        rowKey="id"
        loading={loading}
      />
      <Modal
        title="Basket List"
        open={showModal}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={1000}
        centered={true}
      >
        <FormProvider {...form}>
          <div className="border p-4 flex flex-col gap-4">
            <div className="flex gap-6">
              <InputFormField name="name" label="Basket Name" labelCol={8} />
              <div className="flex items-center gap-1.5 w-1/3">
                <h1>Gift Shelf: </h1>
                <Select
                  className="flex-1"
                  value={loading ? "Loading..." : selectedBasket?.id}
                  options={basketOption}
                  onChange={(value) => handleBasketChange(Number(value))}
                  loading={loading}
                />
              </div>
            </div>
            <Table
              columns={
                props.redeemType === "sequence"
                  ? [
                      {
                        title: "ID",
                        dataIndex: "id",
                        key: "id",
                      },
                      {
                        title: "Name",
                        dataIndex: "name",
                        key: "name",
                      },
                      {
                        title: "Balance / Total",
                        dataIndex: "balance",
                        key: "balance",
                        render: (_, record: any) => {
                          return (
                            <div>
                              {record.balance} / {record.total}
                            </div>
                          );
                        },
                      },
                      {
                        title: "Type",
                        dataIndex: "type",
                        key: "type",
                        render: (_: any, record: any, index: number) => {
                          return (
                            <SelectFormField
                              name={`sequence[${index}].type`}
                              items={[
                                {
                                  label: "Base Position",
                                  value: "base-position",
                                },
                                {
                                  label: "Fixed Position",
                                  value: "fixed-position",
                                },
                                {
                                  label: "Every Position",
                                  value: "every-position",
                                },
                              ]}
                            />
                          );
                        },
                      },
                      {
                        title: "Position",
                        dataIndex: "position",
                        key: "position",
                        render: (_, record: any, index: number) => {
                          const type = form.watch(`sequence[${index}].type`);
                          return (
                            <NumberFormField
                              defaultValue={0}
                              name={`sequence[${index}].value`}
                              disabled={type === "base-position"}
                            />
                          );
                        },
                      },
                      {
                        title: "Start",
                        dataIndex: "start",
                        key: "start",
                        render: (_, record: any, index: number) => {
                          return (
                            <NumberFormField
                              defaultValue={0}
                              name={`sequence[${index}].start`}
                              disabled
                            />
                          );
                        },
                      },
                      {
                        title: "Is Active",
                        dataIndex: "isActive",
                        key: "isActive",
                        render: (_: any, record: any, index: number) => {
                          return (
                            <SwitchFormField
                              name={`sequence[${index}].isActive`}
                            />
                          );
                        },
                      },
                    ]
                  : props.redeemType === "normal"
                  ? [
                      {
                        title: "ID",
                        dataIndex: "id",
                        key: "id",
                      },
                      {
                        title: "Name",
                        dataIndex: "name",
                        key: "name",
                      },
                      {
                        title: "Balance / Total",
                        dataIndex: "balance",
                        key: "balance",
                        render: (_, record: any) => {
                          return (
                            <div>
                              {record.balance} / {record.total}
                            </div>
                          );
                        },
                      },
                      {
                        title: "Ordering",
                        dataIndex: "order",
                        key: "order",
                        render: (_, record: any, index: number) => {
                          return (
                            <NumberFormField
                              defaultValue={0}
                              name={`normal[${index}].order`}
                            />
                          );
                        },
                      },
                      {
                        title: "Is Active",
                        dataIndex: "isActive",
                        key: "isActive",
                        render: (_: any, record: any, index: number) => {
                          return (
                            <SwitchFormField
                              name={`normal[${index}].isActive`}
                            />
                          );
                        },
                      },
                    ]
                  : [
                      {
                        title: "",
                        dataIndex: "checkbox",
                        key: "checkbox",
                        render: (_, record: any, index: number) => {
                          return (
                            <Checkbox
                              checked={selectedRows[index]}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setSelectedRows((prev) => ({
                                  ...prev,
                                  [index]: checked,
                                }));
                              }}
                            />
                          );
                        },
                      },
                      {
                        title: "ID",
                        dataIndex: "id",
                        key: "id",
                      },
                      {
                        title: "Name",
                        dataIndex: "name",
                        key: "name",
                      },
                      {
                        title: "Min. score",
                        dataIndex: "min",
                        key: "min",
                        render: (_, record: any, index: number) => {
                          return (
                            <NumberFormField
                              defaultValue={0}
                              name={`setGiftScore[${index}].min`}
                              disabled={!selectedRows[index]}
                            />
                          );
                        },
                      },
                      {
                        title: "Max. score",
                        dataIndex: "max",
                        key: "max",
                        render: (_, record: any, index: number) => {
                          const unlimit = form.watch(
                            `setGiftScore[${index}].unlimit`
                          );

                          return (
                            <>
                              {!unlimit ? (
                                <NumberFormField
                                  defaultValue={0}
                                  name={`setGiftScore[${index}].max`}
                                  disabled={unlimit || !selectedRows[index]}
                                />
                              ) : (
                                <InputNumber disabled />
                              )}
                            </>
                          );
                        },
                      },
                      {
                        title: "",
                        dataIndex: "unlimit",
                        key: "unlimit",
                        render: (_, record: any, index: number) => {
                          return (
                            <div className="flex gap-4">
                              <CheckboxFormField
                                name={`setGiftScore[${index}].unlimit`}
                                onChange={(checked) => {
                                  if (checked) {
                                    form.setValue(
                                      `setGiftScore[${index}].max`,
                                      0
                                    );
                                  }
                                }}
                                disabled={!selectedRows[index]}
                              />
                              <h1>Unlimit</h1>
                            </div>
                          );
                        },
                      },
                    ]
              }
              dataSource={stateBasket || []}
              rowKey={(record) => record.id}
              loading={loading}
            />
          </div>
        </FormProvider>
      </Modal>
    </div>
  );
};

export default RedeemSetting;
