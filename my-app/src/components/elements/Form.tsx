import { Fields } from "../../interfaces/fields";
import { AddForm } from "./AddForm";

export const NewForm: React.FC<Fields> = ({ uid, label, value }) => {
  return (
    <div>
      <div className="card card-body bg-secondary text-dark">
        <div className="mb-5">
          <h6>{label}</h6>

          <div className="mt-3">
            <AddForm uid={uid} value={value} label={label} />
          </div>
        </div>
      </div>
    </div>
  );
};
