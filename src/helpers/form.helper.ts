import type { ControllerFieldState } from "react-hook-form";
import type { useAppProps } from "antd/es/app/context";
import type { ValidateStatus } from "antd/es/form/FormItem";

import { message } from "antd";

export class FormHelper {
  static handleFieldState = (fieldState: ControllerFieldState) => {
    let status: ValidateStatus = "";
    let helpText: string | undefined;

    if (fieldState.isValidating) {
      status = "validating";
    } else if (fieldState.error) {
      status = "error";
      helpText = fieldState.error.message;
    } else if (fieldState.isDirty) {
      status = "success";
    }

    return { status, helpText };
  };

  static handleDynamicIsDisabled<T>(
    isDisabled: boolean | ((value: T) => boolean),
    value: T
  ) {
    if (typeof isDisabled === "function") {
      return isDisabled(value);
    }
    return isDisabled;
  }

  static handleError(error: unknown) {
    if (error instanceof Error) {
      message.error(error.message);
    } else {
      message.error("Something went wrong");
    }
    return error;
  }

  static handleAppError(app: useAppProps, error: unknown) {
    if (error instanceof Error) {
      app.message.error(error.message);
    } else {
      app.message.error("Something went wrong");
    }
    return error;
  }
}
