import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";

import VirtualKeyboard from "components/VirtualKeyboard";
import Modal from "components/Modal";
import Button from "components/Button";
import { addNumberToContact } from "services/mutation";
import { QueryContext } from "contexts/contactQueryContext";

import { FormStyled } from "./styled";

import { contactType } from "interfaces/Contact";

interface IModalForm {
  setDisplayAddModal: Dispatch<SetStateAction<boolean>>;
  displayAddModal: boolean;
  dataContact?: contactType;
  handleCloseAllModal: () => void;
}

const ModalAddNumberForm: React.FC<IModalForm> = ({
  displayAddModal,
  setDisplayAddModal,
  dataContact,
  handleCloseAllModal,
}) => {
  const keyboard = React.useRef<{
    input: { value: string };
    setInput: Dispatch<SetStateAction<string>>;
  }>(null);
  const appContext = useContext(QueryContext);

  const [mutateAddNumberToContact, { loading }] =
    useMutation(addNumberToContact);

  const onSubmit = () => {
    const dataSave = {
      contact_id: dataContact?.id,
      phone_number: keyboard.current?.input.value,
    };

    mutateAddNumberToContact({
      variables: dataSave,
      onCompleted() {
        toast.success("Success Add New Number!");
        appContext?.refetch();
        handleCloseAllModal();
        keyboard.current?.setInput("");
      },
    });
  };

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>): void => {
    const input = event.target.value;
    keyboard.current?.setInput(input);
  };
  return (
    <Modal
      isOpen={displayAddModal}
      setIsOpen={setDisplayAddModal}
      modalTitle="Add Number"
    >
      <FormStyled>
        <input
          className="input"
          value={keyboard.current?.input.value}
          placeholder="Phone Number"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChangeInput(e)
          }
        />
        <VirtualKeyboard
          keyboardRef={keyboard}
          onChange={keyboard.current?.setInput}
        />
        <Button onClick={onSubmit} disabled={loading}>
          Submit
        </Button>
      </FormStyled>
    </Modal>
  );
};

export default ModalAddNumberForm;
