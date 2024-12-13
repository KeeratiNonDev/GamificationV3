"use client";
import { useDataContext } from "@/context/DataContext";
import { Button, Skeleton, Table, TableProps } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ActiveCampaign = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const dataContext = useDataContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dataContext.fetch("campaign-list");
        setCampaigns(data);
      } catch (error) {
        console.error("Error fetching mock data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSettingCampaign = (id: any, target: any, title: any) => {
    router.push(
      `/campaigns/${id}/edit?target=${encodeURIComponent(
        target
      )}&title=${encodeURIComponent(title)}`
    );
  };

  const columns: TableProps<any>["columns"] = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Target",
      dataIndex: "target",
      key: "target",
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
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Action",
      render: (_, { id, target, title }) => {
        return (
          <Button onClick={() => handleSettingCampaign(id, target, title)}>
            Setting
          </Button>
        );
      },
    },
  ];
  return (
    <div>
      {loading ? (
        <Skeleton active />
      ) : (
        <Table
          dataSource={campaigns.map((item, index) => ({
            ...item,
            key: index,
          }))}
          columns={columns}
        />
      )}
    </div>
  );
};

export default ActiveCampaign;
