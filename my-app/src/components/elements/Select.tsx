import React, { useContext } from "react";
import { FormContext } from "../../FormContext";
import { Fields } from "../../interfaces/fields";

export const Select: React.FC<Fields> = ({ uid, label, field_options }) => {
  const { handleChange }: any = useContext(FormContext);

  return (
    <div className="mb-4 col-6">
      <label className="form-label">{label}</label>
      <select
        className="form-select"
        aria-label="Default select example"
        onChange={(event) => handleChange(uid, event)}
      >
        {field_options.length > 0 &&
          field_options.map((option: any, i: any) => (
            <option value={option.option_label} key={i}>
              {option.option_label}
            </option>
          ))}
      </select>
    </div>
  );
};
