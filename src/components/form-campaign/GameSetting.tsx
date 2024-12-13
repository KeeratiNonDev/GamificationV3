import React from "react";
import { Game } from "../../game-list";
import { useSearchParams } from "next/navigation";
import { useFormContext } from "react-hook-form";

interface GameSettingProps {
  prefix: string;
  timelineId: string;
}

const GameSetting = ({ prefix, timelineId }: GameSettingProps) => {
  const { setValue } = useFormContext();
  const searchParams = useSearchParams();
  const target = String(searchParams.get("target"));

  const SettingGame = Game.getSettingFormComponent(target);

  const handleGameSettings = (values: any) => {
    setValue(prefix, values);
  };

  return (
    <SettingGame
      prefix={prefix}
      onChange={handleGameSettings}
      timelineId={timelineId}
    />
  );
};

export default GameSetting;
