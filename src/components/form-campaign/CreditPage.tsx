import { useDataContext } from "@/context/DataContext";
import { JSONSchemaType } from "ajv";
import { Button, message, Modal, Select, Table, Transfer, TransferProps } from "antd";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import SelectFormField from "../inputs/select.form.field";
import NumberFormField from "../inputs/number,form.field";
import SwitchFormField from "../inputs/switch.form.field";
import { format } from "path";
import { schemaResolver } from "@/utils/schema.validator";

interface CreditPageProps {
  prefix: string;
}
const CreditPage = ({ prefix }: CreditPageProps) => {
  const [tierList, setTierList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editStatus, setEditStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [tierListModal, setTierListModal] = useState<{ key: number; title: string }[]>([]);
  const [targetKeys, setTargetKeys] = useState<number[]>([]);
  const [indexTier, setIndexTier] = useState<number | null>(null)

  const dataContext = useDataContext();

  const { getValues, setValue, watch } = useFormContext();

  const dataSource =
    getValues(`${prefix}`)?.map((item: any, index: number) => ({
      ...item,
      key: index,
    })) || [];

  useEffect(() => {
    const fetchTierList = async () => {
      try {
        const response = await dataContext.fetch("tier-list");
        const formattedList = response.map(
          (tier: { id: number; name: string }) => ({
            label: tier.name,
            value: tier.id,
          })
        );

        const formattedListModal = response.map(
          (tier: { id: number; name: string }) => ({
            key: tier.id,
            title: tier.name,
          })
        );
        setTierList(formattedList);
        setTierListModal(formattedListModal);
      } catch (error) {
        console.error("Error fetching tier list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTierList();
  }, []);

  const form = useForm();

  const handleEdit = (index: number) => {
    setIndexTier(index);
    setShowModal(true);
    setEditStatus(true);

    const currentValues = watch(`${prefix}[${index}].tierIds`);
    setTargetKeys(currentValues || []);
  };

  const handleDelete = (index: number) => {
    const currentValues = watch(`${prefix}`);
    const newValues = currentValues.filter((_:any, i:any) => i!== index);
    setValue(`${prefix}`, newValues);
    setShowModal(false);
    setEditStatus(false);
    setIndexTier(null);
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

  const handleModalOk = () => {
    if (targetKeys.length === 0) {
        Modal.error({
            title: 'Error',
            content: 'Please select at least one tier',
        });
        return;
    }
    
    if (indexTier === null) {
        const currentValues = watch(`${prefix}`);
        const newEntry = {
          tierIds: targetKeys,
          type: "",
          value: 0,
          total: 0,
          isActive: true,
        };
    
        setValue(`${prefix}`, [...(currentValues || []), newEntry]);
      } else {
        setValue(`${prefix}[${indexTier}].tierIds`, targetKeys);
      }

      setTargetKeys([]);
      setIndexTier(null);
      setShowModal(false);
  };

  const handleModalCancel = () => {
    setTargetKeys([]);
    setIndexTier(null);
    setShowModal(false);
  };

  const onChangeTarget: TransferProps['onChange'] = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys as number[]);
};

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <Button onClick={() => setShowModal(true)}>Add Credit</Button>
        </div>
        <Table
          columns={[
            {
              title: "Tier",
              dataIndex: "tierIds",
              key: "tierIds",
              render: (_, record, index) => {
                const value = watch(`${prefix}[${index}].tierIds`);

                const handleChange = (selected: number[]) => {
                  setValue(`${prefix}[${index}].tierIds`, selected);
                };

                return (
                  <Select
                    mode="multiple"
                    value={loading ? ["Loading..."] : value || []}
                    onChange={handleChange}
                    options={tierList}
                    placeholder="Select Tiers"
                    style={{ width: "100%" }}
                  />
                );
              },
            },
            {
              title: "Credit Mode",
              dataIndex: "type",
              key: "type",
              width: "25%",
              render: (_, record, index) => {
                const value = watch(`${prefix}[${index}].value`);
                return (
                  <SelectFormField
                    name={`${prefix}[${index}].type`}
                    items={[
                      { value: "campaign", label: "No reset" },
                      // { value: 'unlimited', label: 'Unlimited' },
                      {
                        value: "minutes",
                        label: `Reset every ${value} Minutes`,
                      },
                      {
                        value: "topup-minutes",
                        label: `Topup every ${value} Minutes`,
                      },
                      { value: "days", label: `Reset every ${value} Days` },
                      {
                        value: "topup-days",
                        label: `Topup every ${value} Days`,
                      },
                      { value: "weeks", label: `Reset every ${value} Weeks` },
                      {
                        value: "topup-weeks",
                        label: `Topup every ${value} Weeks`,
                      },
                      { value: "months", label: `Reset every ${value} Months` },
                      {
                        value: "topup-months",
                        label: `Topup every ${value} Months`,
                      },
                      {
                        value: "timeline",
                        label: `Reset every ${value} Timeline`,
                      },
                    ]}
                  />
                );
              },
            },
            {
              title: "Value",
              dataIndex: "value",
              key: "value",
              render: (_, record, index) => {
                return <NumberFormField name={`${prefix}[${index}].value`} />;
              },
            },
            {
              title: "Credit",
              dataIndex: "total",
              key: "total",
              render: (_, record, index) => {
                return <NumberFormField name={`${prefix}[${index}].total`} />;
              },
            },
            {
              title: "Max",
              //   dataIndex: "total",
              //   key: "total",
              render: (_, record, index) => {
                return <NumberFormField name="" disabled />;
              },
            },
            {
              title: "Status",
              dataIndex: "isActive",
              key: "isActive",
              render: (_, record, index) => {
                return (
                  <SwitchFormField name={`${prefix}[${index}].isActive`} />
                );
              },
            },
            {
              title: "Action",
              key: "action",
              render: (_, record, index) => (
                <div className="flex">
                  <Button type="link" onClick={() => handleEdit(index)}>
                    Edit
                  </Button>
                  <Button type="link" onClick={() => showDeleteConfirm(index)}>
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
          dataSource={dataSource}
          loading={loading}
        />
      </div>
      <Modal
        title="Credit List"
        open={showModal}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={1000}
        centered={true}
      >
        <FormProvider {...form}>
          <Transfer
            titles={["Tiers Source", "Tiers Target"]}
            dataSource={tierListModal}
            targetKeys={targetKeys}
            onChange={onChangeTarget}
            render={(item) => item.title}
            listStyle={{ width: 300, height: 400 }}
            showSearch
            oneWay
          />
        </FormProvider>
      </Modal>
    </div>
  );
};

export default CreditPage;
