import { Button, message, Modal } from "antd";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import SwitchFormField from "../inputs/switch.form.field";
import dayjs from "dayjs";

interface TimelineListProps {
  onEdit: (id: string) => void;
}
const TimelineList = (props: TimelineListProps) => {
  const { setValue, watch } = useFormContext();
  const allTimeline = watch("properties.timeline") || [];

  const handleDelete = (index: number) => {
    const updatedTimeline = allTimeline.filter(
      (_: any, i: number) => i !== index
    );
    setValue("properties.timeline", updatedTimeline);
    message.success("Timeline deleted successfully!");
  };

  const showDeleteConfirm = (index: number) => {
    Modal.confirm({
      title: "Delete this timeline?",
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {allTimeline.map((timeline: any, index: any) => {
          return (
            <div
              key={index}
              className="flex border p-6 items-center justify-between"
            >
              <span>{timeline.general.name}</span>
              <span>
                {dayjs(timeline.general.startTime).format("YYYY/MM/DD HH:mm")} -{" "}
                {dayjs(timeline.general.closeTime).format("YYYY/MM/DD HH:mm")}
              </span>
              <div className="flex gap-2">
                <SwitchFormField
                  name={`properties.timeline[${index}.general.isActive]`}
                />
                <Button onClick={() => props.onEdit(timeline.general.id)}>
                  Edit
                </Button>
                <Button danger onClick={() => showDeleteConfirm(index)}>
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineList;
