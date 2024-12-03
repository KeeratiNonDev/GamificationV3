import type { ReactNode } from "react";

import { Type } from "@sinclair/typebox";

import * as G_20240814_EASY_GIFT from "./20240814_EASY_GIFT/setting.form";

const schemas = {
  "20240814_EASY_GIFT": G_20240814_EASY_GIFT.SCHEMA,
};

const settings = {
  "20240814_EASY_GIFT": G_20240814_EASY_GIFT.SettingFormWithParent,
};

export class Game {
  static getSettingFormSchema(gameId: string) {
    return schemas?.[gameId as keyof typeof settings] ?? Type.Any();
  }

  static getSettingFormComponent(gameId: string) {
    return settings?.[gameId as keyof typeof settings] ?? null;
  }
}
