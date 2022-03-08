import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { Fields } from "../../interfaces/fields";
import {
  AiOutlineSortDescending,
  AiOutlineSortAscending,
} from "react-icons/ai";

export const AddGroup: React.FC<Fields> = ({
  uid,
  value,
  label,
  initvalues,
}) => {
  let obj: any = [];
  const [fields, setFields] = useState(value);
  let lengtharr = 0;
  initvalues.forEach((e) => {
    if (e.uid === uid) {
      localStorage.setItem("init"+uid, JSON.stringify(e.value))
      e.value.forEach(() => {
        lengtharr++;
      });
    }
  });

  useEffect(() => {
    localStorage.removeItem(uid + "group");
  }, []);

  const handleNewField = (e: any): any => {
    e.preventDefault();
    let arr: any = [];
    const initval:any = localStorage.getItem("init"+uid);
    const parseit = JSON.parse(initval);
    for (var i = 0; i < parseit.length; i++) {
      obj = {
        id: uuidv4(),
        uid: value[i].uid,
        data_type: value[i].data_type,
        field_placeholder: value[i].field_placeholder,
        field_value: "",
        type: value[i].type,
      };
      arr.push(obj);
    }
    setFields([...fields, ...arr]);
  };

  const handleSortAsc = () => {
    const sorted = fields.sort((a, b): any => {
      const isReserved = 1;
      return isReserved * a.field_value.localeCompare(b.field_value);
    });
    setFields([...sorted]);
    updatedvalues(fields);
  };

  const handleSortDesc = () => {
    const sorted = fields.sort((a, b): any => {
      const isReserved = -1;
      return isReserved * a.field_value.localeCompare(b.field_value);
    });
    setFields([...sorted]);
    updatedvalues(fields);
  };

  const handleInputChange = (index: number, event: any) => {
    const values: any = [...fields];
    values[index]["field_value"] = event.target.value;
    setFields(values);
    updatedvalues(fields);
  };

  const handleRemoveFields = (id) => {
    const values = [...fields];
    let updated: any = [];
    updated = values.filter((field) => field.id !== id);
    setFields(updated);
    updatedvalues(updated);
  };

  function updatedvalues(val) {
    const savedata = {
      value: val,
    };
    localStorage.setItem(uid + "group", JSON.stringify(savedata));
  }

  return (
    <form onSubmit={handleNewField}>
      <div className="">
        <div className="d-flex align-items-center">
          <h3>
            <IoMdAddCircle
              style={{
                marginLeft: "104px",
                marginTop: "-92.5px",
                cursor: "pointer",
              }}
              onClick={(e) => handleNewField(e)}
            />
          </h3>

          {lengtharr === 1 && (
            <>
              <div
                style={{
                  marginLeft: "64px",
                  marginTop: "-88.5px",
                  cursor: "pointer",
                }}
                onClick={() => handleSortAsc()}
              >
                <h3>
                  <AiOutlineSortDescending />
                </h3>
              </div>
              <div
                style={{
                  marginLeft: "32px",
                  marginTop: "-88.5px",
                  cursor: "pointer",
                }}
                onClick={() => handleSortDesc()}
              >
                <h3>
                  <AiOutlineSortAscending />
                </h3>
              </div>
            </>
          )}
        </div>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">{label}</th>
            </tr>
          </thead>
          <tbody>
            {lengtharr === 1 ? (
              fields.map((field: any, i: any) => (
                <tr key={i}>
                  <td className="w-100">
                    <div className="form-group mt-3">
                      <input
                        name={field.uid}
                        type={field.type}
                        className="form-control"
                        value={field.field_value}
                        id="inputElement"
                        placeholder={
                          field.field_placeholder ? field.field_placeholder : ""
                        }
                        onChange={(e) => handleInputChange(i, e)}
                      />
                    </div>
                  </td>
                  <td>
                    {i > 0 && (
                      <div
                        onClick={() => handleRemoveFields(field.id)}
                        style={{
                          marginTop: "14px",
                          marginLeft: "32px",
                          cursor: "pointer",
                        }}
                      >
                        <h3>
                          <MdDelete />
                        </h3>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr
                style={{
                  display: "grid",
                  gridTemplateColumns: "400px 400px 400px",
                }}
              >
                {fields.map((field: any, i: any) => (
                  <td className="" key={i}>
                    <div className="form-group mt-3">
                      <input
                        name={field.uid}
                        type={field.type}
                        className="form-control"
                        value={field.field_value}
                        id="inputElement"
                        placeholder={
                          field.field_placeholder ? field.field_placeholder : ""
                        }
                        onChange={(e) => handleInputChange(i, e)}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </form>
  );
};
