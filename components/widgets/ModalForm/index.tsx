import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
  useEffect,
} from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";

import VirtualKeyboard from "components/VirtualKeyboard";
import Modal from "components/Modal";
import Button from "components/Button";
import { addContact, updatePhoneNumber } from "services/mutation";
import { QueryContext } from "contexts/contactQueryContext";

import { FormStyled } from "./styled";

import { phoneType } from "interfaces/Contact";

interface IModalForm {
  setDisplayAddModal: Dispatch<SetStateAction<boolean>>;
  displayAddModal: boolean;
  dataEdit?: phoneType;
  handleCloseAllModal?: () => void;
}

type FormValuesType = {
  firstName: string;
  lastName: string;
};

const ModalForm: React.FC<IModalForm> = ({
  displayAddModal,
  setDisplayAddModal,
  dataEdit,
  handleCloseAllModal,
}) => {
  const [input, setInput] = useState("");
  const keyboard = React.useRef<{
    input: { value: string };
    setInput: Dispatch<SetStateAction<string>>;
  }>(null);
  const appContext = useContext(QueryContext);

  const { register, handleSubmit, setValue } = useForm<FormValuesType>();

  const [mutateAddContact, { loading }] = useMutation(addContact);
  const [mutateEditContact] = useMutation(updatePhoneNumber);

  useEffect(() => {
    setValue("firstName", dataEdit?.contact?.first_name as string);
    setValue("lastName", dataEdit?.contact?.last_name as string);
    setInput(dataEdit?.number as string);
    keyboard.current?.setInput(dataEdit?.number as string);
  }, [dataEdit]);

  const onSubmit = (data: FormValuesType) => {
    const dataSave = {
      first_name: data.firstName,
      last_name: data.lastName,
      phones: [
        {
          number: input,
        },
      ],
    };
    mutateAddContact({
      variables: dataSave,
      onCompleted() {
        toast.success("Success Add New Contact!");
        appContext?.refetch();
        setDisplayAddModal(false);
      },
    });
  };

  const onSubmitEdit = (data: FormValuesType) => {
    const dataUpdate = {
      pk_columns_phone: {
        contact_id: dataEdit?.contact_id,
        number: dataEdit?.number,
      },
      set_phone: {
        number: input,
      },
      pk_columns_contact: { id: dataEdit?.contact_id },
      set_contact: { first_name: data.firstName, last_name: data.lastName },
    };
    mutateEditContact({
      variables: dataUpdate,
      onCompleted() {
        toast.success("Success Edit Contact!");
        appContext?.refetch();
        handleCloseAllModal && handleCloseAllModal();
      },
    });
  };

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>): void => {
    const input = event.target.value;
    setInput(input);
    keyboard.current?.setInput(input);
  };
  return (
    <Modal
      isOpen={displayAddModal}
      setIsOpen={setDisplayAddModal}
      modalTitle="Add Contact"
    >
      <FormStyled onSubmit={handleSubmit(dataEdit ? onSubmitEdit : onSubmit)}>
        <input
          className="input"
          {...register("firstName")}
          disabled={loading}
          placeholder="First Name"
        />
        <input
          className="input"
          {...register("lastName")}
          disabled={loading}
          placeholder="Last Name"
        />
        <input
          className="input"
          value={input}
          placeholder="Phone Number"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChangeInput(e)
          }
        />
        <VirtualKeyboard keyboardRef={keyboard} onChange={setInput} />
        <Button type="submit" disabled={loading}>
          Submit
        </Button>
      </FormStyled>
    </Modal>
  );
};

export default ModalForm;
