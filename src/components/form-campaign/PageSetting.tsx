import { Tabs } from "antd";
import React from "react";
import { LandingPageSetting } from "./LandingPageSetting";
import { HTPPage } from "./HTPPageSetting";
import { WinPageSetting } from "./WinPageSetting";
import { LosePageSetting } from "./LosePageSetting";
import { NoPrizePageSetting } from "./NoPrizePageSetting";
import { TimeOutPageSetting } from "./TimeOutPageSetting";
import { RankingPageSetting } from "./RankingPageSetting";


interface PageSettingProps {
  prefix: string;
}

const PageSetting = ({ prefix }: PageSettingProps) => {
  return (
    <div>
      <Tabs
        type="card"
        items={[
          {
            key: "1",
            label: "Landing Page",
            children: <LandingPageSetting prefix={prefix} />,
          },
          {
            key: "2",
            label: "How To Play",
            children: <HTPPage prefix={prefix} />,
          },
          {
            key: "3",
            label: "Win",
            children: <WinPageSetting prefix={prefix} />,
          },
          {
            key: "4",
            label: "Lose",
            children: <LosePageSetting prefix={prefix} />,
          },
          {
            key: "5",
            label: "No Prize",
            children: <NoPrizePageSetting prefix={prefix} />,
          },
          {
            key: "6",
            label: "Time Out",
            children: <TimeOutPageSetting prefix={prefix} />,
          },
          {
            key: "7",
            label: "Ranking",
            children: <RankingPageSetting prefix={prefix} />,
          },
        ]}
        destroyInactiveTabPane={true}
      />
    </div>
  );
};

export default PageSetting;
