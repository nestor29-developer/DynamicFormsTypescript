import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Form } from "../../interfaces/form";
import { AiOutlinePlus } from "react-icons/ai";

interface Props {
  addNewForm: (form: Form) => void;
}

type HandleInputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const inititalState = {
    name: "",
    age: 0,
    relationship: ""
};

export const NewForm = ({ addNewForm }: Props) => {
  const [form, setForm] = useState<Form>(inititalState);
  const titleInput = useRef<HTMLInputElement>(null);

  const handleNewForm = (e: FormEvent<HTMLFormElement>): any => {
    e.preventDefault();
    addNewForm(form);
    setForm(inititalState);
    titleInput.current?.focus();
  };

  const handleInputChange = ({ target: { name, value } }: HandleInputChange) =>
    setForm({ ...form, [name]: value });

  return (
    <div className="card card-body bg-secondary text-dark">
      <h1>Add a Form</h1>

      <form onSubmit={handleNewForm}>
        <input
          type="text" 
          name={form.name}
          onChange={handleInputChange}
          value={form.name}
          className="form-control mb-3 rounded-0 shadow-none border-0"
          autoFocus
          ref={titleInput}
        />
        <input
          onChange={handleInputChange}
          name={form.name}
          className="form-control mb-3 shadow-none border-0" 
          value={form.age}
        ></input>
        <button type="submit" className="btn btn-primary">
          Save <AiOutlinePlus />
        </button>
      </form>
    </div>
  );
};