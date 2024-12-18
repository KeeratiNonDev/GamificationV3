import _ from "lodash";

export interface IProps {
  error?: string;
}

export const FormFieldErrorMessage: React.FC<IProps> = ({ error = "" }) => {
  if (!error) return;

  return (
    <p className="mt-2 text-danger text-sizeSmall">{_?.upperFirst?.(error)}</p>
  );
};

export default FormFieldErrorMessage;
