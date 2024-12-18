import { useDataContext } from '@/context/DataContext';
import { Button, Modal, Select, Table, Transfer, TransferProps } from 'antd';
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import SwitchFormField from '../inputs/switch.form.field';
import NumberFormField from '../inputs/number,form.field';
import SelectFormField from '../inputs/select.form.field';

interface LimitationProps {
    prefix: string;
}
const LimitationPage = ({prefix}: LimitationProps) => {
    const [tierList, setTierList] = useState([]);
  const [loading, setLoading] = useState(true);
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

    const currentValues = watch(`${prefix}[${index}].tierIds`);
    setTargetKeys(currentValues || []);
  };

  const handleDelete = (index: number) => {
    const currentValues = watch(`${prefix}`);
    const newValues = currentValues.filter((_:any, i:any) => i!== index);
    setValue(`${prefix}`, newValues);
    setShowModal(false);
    setIndexTier(null);
  };

  const showDeleteConfirm = (index: number) => {
    Modal.confirm({
      title: "Delete this limitation?",
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
          scopeLimit: "",
          playLimitBy: "",
          quota: 0,
          isActive: false,
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
        <Button onClick={() => setShowModal(true)}>Add Limitations</Button>
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
            title: "Scope limit",
            dataIndex: "scopeLimit",
            key: "scopeLimit",
            render: (_, record, index) => {
              return (
                <SelectFormField
                  name={`${prefix}[${index}].scopeLimit`}
                  items={[
                    { value: "campaign", label: "Campaign" },
                    { value: 'period', label: 'Period' },
                  ]}
                />
              );
            },
          },
          {
            title: "Play limit by",
            dataIndex: "playLimitBy",
            key: "playLimitBy",
            render: (_, record, index) => {
              return (
                <SelectFormField
                  name={`${prefix}[${index}].playLimitBy`}
                  items={[
                    { value: "winner", label: "Winner" },
                    { value: 'loser', label: 'Loser' },
                    { value: 'giftQuota', label: 'Gift quota' },
                    { value: 'noOfTime', label: 'No of time' },
                  ]}
                />
              );
            },
          },
          {
            title: "Quota",
            dataIndex: "quota",
            key: "quota",
            render: (_, record, index) => {
              return <NumberFormField name={`${prefix}[${index}].quota`} />;
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
      title="Tier List"
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
  )
}

export default LimitationPage