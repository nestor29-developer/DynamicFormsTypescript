import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { Fields } from "../../interfaces/fields";
import {
  AiOutlineSortDescending,
  AiOutlineSortAscending,
} from "react-icons/ai";
import { render } from "@testing-library/react";
import React from "react";

export const AddGroup: React.FC<Fields> = ({
  uid,
  value,
  label,
  initvalues,
}) => {
  let obj: any = [];
  const [fields, setFields] = useState(value);
  const [activateColReal, setActivateColReal] = useState(false);
  let lengtharr = 0;
  initvalues.forEach((e) => {
    if (e.uid === uid) {
      localStorage.setItem("init" + uid, JSON.stringify(e.value));
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
    const initval: any = localStorage.getItem("init" + uid);
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
    setActivateColReal(true);
    updatedRows(uid);
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
    setActivateColReal(true);
  };

  const handleRemoveFields = (id) => {
    const values = [...fields];
    let updated: any = [];
    updated = values.filter((field) => field.id !== id);
    setFields(updated);
    updatedvalues(updated);
    let newrow = getLastRow(uid);
    --newrow;
    localStorage.setItem("count" + uid, newrow);
  };

  function updatedvalues(val) {
    const savedata = {
      value: val,
    };
    localStorage.setItem(uid + "group", JSON.stringify(savedata));
  }

  function updatedRows(val) {
    const getStorage: any = localStorage.getItem("count" + val);
    const existsStorage = JSON.parse(getStorage);
    if (existsStorage) {
      let lastRow = existsStorage;
      lastRow++;
      localStorage.setItem("count" + val, lastRow);
    } else {
      localStorage.setItem("count" + val, "2");
    }
  }

  function getLastRow(val) {
    const getStorage: any = localStorage.getItem("count" + val);
    let numberOfRow = JSON.parse(getStorage);
    return numberOfRow;
  }

  const createTable = () => {
    const getDataStorage: any = localStorage.getItem("init" + uid);
    const colStorage: any = JSON.parse(getDataStorage);
    const colReal: any = fields;
    if (colStorage.length === colReal.length) {
      localStorage.removeItem("count" + uid);
    }
    const col: any = activateColReal ? colReal : colStorage;
    const rows = getLastRow(uid);

    const raw: any = rows ? rows : 1;

    let table: any = [];

    for (let i = 0; i < raw; i++) {
      let children: any = [];

      for (let j = 0; j < colStorage.length; j++) {
        children.push(
          <td key={j}>
            <div className="form-group mt-3 d-flex align-items-center">
              <input
                name={
                  colStorage.length === 1
                    ? col[i].uid
                    : col[j + i * colStorage.length].uid
                }
                type={
                  colStorage.length > 1
                    ? col[j + i * colStorage.length].type
                    : col[i].type
                }
                className="form-control"
                value={
                  colStorage.length > 1
                    ? col[j + i * colStorage.length].field_value
                    : col[i].field_value
                }
                id="inputElement"
                placeholder={
                  colStorage.length > 1
                    ? col[j + i * colStorage.length].field_placeholder
                    : col[i].field_placeholder
                }
                onChange={(e) =>
                  handleInputChange(
                    colStorage.length > 1 ? j + i * colStorage.length : i,
                    e
                  )
                }
              />

              <div>
                {lengtharr === 1 && i > 0 && (
                  <div
                    onClick={() => handleRemoveFields(col[i].id)}
                    style={{
                      marginLeft: "22px",
                      cursor: "pointer",
                    }}
                  >
                    <h3>
                      <MdDelete />
                    </h3>
                  </div>
                )}
              </div>
            </div>
          </td>
        );
      }
      table.push(<tr key={i}>{children}</tr>);
    }
    return table;
  };

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
          <tbody>{createTable()}</tbody>
        </table>
      </div>
    </form>
  );
};
