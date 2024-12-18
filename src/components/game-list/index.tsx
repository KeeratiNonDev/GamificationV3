import { Type } from "@sinclair/typebox";

import * as G_20240814_EASY_GIFT from "./20240814_EASY_GIFT/setting.form";
import * as G_20240814_SPIN_WHEEL from "./20240814_SPIN_WHEEL/setting.form";
import * as G_20240814_FINDING_ITEM from "./20240814_FINDING_ITEM/setting.form";

const schemas = {
  "20240814_EASY_GIFT": G_20240814_EASY_GIFT.schema,
  "20240814_SPIN_WHEEL": G_20240814_SPIN_WHEEL.schema,
  "20240814_FINDING_ITEM": G_20240814_FINDING_ITEM.schema,
};

const settings = {
  "20240814_EASY_GIFT": G_20240814_EASY_GIFT.SettingFormWithParent,
  "20240814_SPIN_WHEEL": G_20240814_SPIN_WHEEL.SettingFormWithParent,
  "20240814_FINDING_ITEM": G_20240814_FINDING_ITEM.SettingFormWithParent,
};

export class Game {
  static getSettingFormSchema(gameId: string) {
    return schemas?.[gameId as keyof typeof settings] ?? Type.Any();
  }

  static getSettingFormComponent(gameId: string) {
    return settings?.[gameId as keyof typeof settings] ?? null;
  }
}
