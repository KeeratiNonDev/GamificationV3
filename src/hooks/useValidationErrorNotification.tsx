import { notification, message, Button } from "antd";

interface ValidationErrorNotificationProps {
  errorMessages: string[] | Record<string, any>;
}

const flattenErrors = (obj: any, prefix = ""): string[] => {
  let errors: string[] = [];

  if (typeof obj === "string") {
    return [prefix ? `${prefix}: ${obj}` : obj];
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      errors = errors.concat(flattenErrors(item, `${prefix}[${index + 1}]`));
    });
    return errors;
  }

  if (obj && typeof obj === "object") {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null && "message" in value) {
        errors.push(`${prefix ? `${prefix}.` : ""}${key}: ${value.message}`);
      } else {
        const newPrefix = prefix ? `${prefix}.${key}` : key;
        errors = errors.concat(flattenErrors(value, newPrefix));
      }
    });
  }

  return errors;
};

export const showValidationErrorNotification = ({
  errorMessages,
}: ValidationErrorNotificationProps) => {
  const flatErrors = Array.isArray(errorMessages)
    ? errorMessages
    : flattenErrors(errorMessages);

  notification.error({
    message: "Content Validation Error",
    description: (
      <div>
        {flatErrors.map((error, index) => (
          <div key={index} className="mb-1">
            {error}
          </div>
        ))}
        <Button
          onClick={() => {
            navigator.clipboard.writeText(flatErrors.join("\n"));
            message.success("Copied to clipboard!");
            setTimeout(() => {
              notification.destroy();
            }, 500);
          }}
          color="danger"
          variant="dashed"
          className="mt-2"
        >
          Copy Text
        </Button>
      </div>
    ),
    duration: 10,
    placement: "topRight",
  });
};
