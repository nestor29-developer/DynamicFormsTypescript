import { Fields } from "../../interfaces/fields";
import { Table } from "./Table";

export const Group: React.FC<Fields> = ({ uid, label, value, initvalues }) => {
  return (
    <div>
      <div className="card card-body bg-secondary text-dark">
        <div className="mb-5">
          <h6>{label}</h6>

          <div className="mt-3">
            <Table uid={uid} value={value} label={label} initvalues={initvalues} />
          </div>
        </div>
      </div>
    </div>
  );
};
