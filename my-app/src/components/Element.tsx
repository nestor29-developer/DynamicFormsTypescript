import React from "react";
import { Fields } from "../interfaces/fields";
import { NewForm } from "./elements/Form";
import { Input } from "./elements/Input";
import { Select } from "./elements/Select";
import { TextEditor } from "./elements/TextEditor";

export const Element: React.FC<Fields> = ({
  data_type,
  uid,
  label,
  field_placeholder,
  field_value,
  field_options,
  field_mandatory,
  field_mandatory_active,
  label_mandatory,
  type,
  error_msg,
  value,
}) => {
  switch (data_type) {
    case "string":
      return (
        <Input
          uid={uid}
          label={label}
          field_placeholder={field_placeholder}
          field_value={field_value}
          field_mandatory={field_mandatory}
          type={type}
          label_mandatory={label_mandatory}
          error_msg={error_msg}
          field_mandatory_active={field_mandatory_active}
        />
      );
    case "select":
      return <Select uid={uid} label={label} field_options={field_options} />;
    case "texteditor":
      return <TextEditor uid={uid} label={label} />;
    case "group":
      return (
        <NewForm
          uid={uid}
          label={label}
          value={value}
        />
      );
    default:
      return null;
  }
};
