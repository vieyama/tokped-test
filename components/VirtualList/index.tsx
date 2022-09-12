import { useContext, useState, useEffect } from "react";
import { Virtuoso } from "react-virtuoso";
import { useMutation } from "@apollo/client";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

import SearchComponent from "components/SearchComponent";
import AvatarComponent from "components/Avatar";
import Modal from "components/Modal";
import Button from "components/Button";
import ModalAddNumberForm from "components/widgets/ModalForm/addNumber";
import ModalDelete from "components/widgets/ModalForm/ModalDelete";
import ModalForm from "components/widgets/ModalForm";
import { deleteContact, deleteNumber } from "services/mutation";
import { QueryContext } from "contexts/contactQueryContext";
import getAcronym from "utils/acronym";

import {
  ContactListDisplay,
  DetailButtonWrapper,
  DetailInfoDisplay,
  DetailNumberDisplay,
  DetailWrapper,
  DipslayContactWrapper,
  EditButton,
  NameDisplay,
  NumberDisplay,
} from "./styled";

import type { contactType, phoneType } from "interfaces/Contact";
import type { EmotionJSX } from "@emotion/react/types/jsx-namespace";

type modalDeleteDisplayType = {
  modalTitle: string;
  modalMessage: EmotionJSX.Element;
  id: string;
  deleteType: "contact" | "number";
};

const VirtualListComponent = () => {
  const appContext = useContext(QueryContext);
  const [displayModal, setDisplayModal] = useState(false);
  const [displayModalDelete, setDisplayModalDelete] = useState(false);
  const [displayModalEdit, setDisplayModalEdit] = useState(false);
  const [displayModalAddNumber, setDisplayModalAddNumber] = useState(false);
  const [selectedContact, setSelectedContact] = useState<contactType>();
  const [selectedNumber, setSelectedNumber] = useState<phoneType>();

  const [modalDeleteDisplay, setModalDeleteDisplay] =
    useState<modalDeleteDisplayType>();

  useEffect(() => {
    if (!displayModalEdit) {
      setSelectedNumber(undefined);
    }
  }, [displayModalEdit]);

  const handleClickDetail = (data: contactType) => {
    setSelectedContact(data);
    setDisplayModal(true);
  };

  const detailAvatar = getAcronym(
    `${selectedContact?.first_name} ${selectedContact?.last_name}`
  );

  const [mutateDeleteContact] = useMutation(deleteContact);
  const [mutateDeleteNumber] = useMutation(deleteNumber);

  const handleCloseAllModal = () => {
    setDisplayModal(false);
    setDisplayModalAddNumber(false);
    setDisplayModalDelete(false);
    setDisplayModalEdit(false);
    setDisplayModalEdit(false);

    setSelectedNumber(undefined);
    setSelectedContact(undefined);
  };

  const handleDelete = () => {
    if (modalDeleteDisplay?.deleteType === "contact") {
      mutateDeleteContact({
        variables: {
          id: selectedContact?.id,
        },
        onCompleted() {
          toast.success("Success Delete Contact!");
          appContext?.refetch();
          setDisplayModalDelete(false);
          setSelectedContact(undefined);
        },
      });
    } else {
      mutateDeleteNumber({
        variables: {
          contact_id: selectedContact?.id,
          number: modalDeleteDisplay?.id,
        },
        onCompleted() {
          toast.success("Success Delete Number!");
          appContext?.refetch();
          handleCloseAllModal();
        },
      });
    }
  };

  return (
    <>
      <SearchComponent
        data-testid="search-component"
        setSearch={appContext?.setSearch}
      />
      <Virtuoso
        data-testid="virtuoso-component"
        style={{ height: "80vh" }}
        data={appContext?.data}
        endReached={appContext?.loadMore}
        itemContent={(index, user: contactType) => {
          const { acronym } = getAcronym(
            appContext?.data[index]?.first_name as string
          );

          return (
            <ContactListDisplay key={index}>
              <AvatarComponent displayString={acronym} />
              <DipslayContactWrapper onClick={() => handleClickDetail(user)}>
                <NameDisplay>
                  {user?.first_name} {user?.last_name}
                </NameDisplay>
                <NumberDisplay>{user?.phones[0]?.number}</NumberDisplay>
              </DipslayContactWrapper>
            </ContactListDisplay>
          );
        }}
      />
      <Modal
        isOpen={displayModal}
        setIsOpen={setDisplayModal}
        modalTitle="Detail Contact"
      >
        <DetailWrapper>
          <AvatarComponent
            displayString={detailAvatar.acronym || ""}
            size="60px"
          />
          <DetailInfoDisplay>
            <NameDisplay>
              {selectedContact?.first_name} {selectedContact?.last_name}
            </NameDisplay>
            <DetailNumberDisplay>
              {selectedContact?.phones?.map((phone, key) => (
                <NumberDisplay key={key}>
                  {phone?.number}{" "}
                  <div className="button-wrapper">
                    <EditButton
                      onClick={() => {
                        setSelectedNumber({ addNumber: false, ...phone });
                        setDisplayModalEdit(true);
                      }}
                    >
                      <FiEdit />
                    </EditButton>
                    <EditButton
                      data-testid="btn-delete-number"
                      onClick={() => {
                        setModalDeleteDisplay({
                          modalTitle: "Delete Number",
                          modalMessage: (
                            <span>
                              Are you sure you want to delete{" "}
                              <b>{phone.number}</b> from your contact ?
                            </span>
                          ),
                          deleteType: "number",
                          id: phone?.number as string,
                        });
                        setDisplayModal(false);
                        setDisplayModalDelete(true);
                      }}
                    >
                      <FiTrash2 />
                    </EditButton>
                  </div>
                </NumberDisplay>
              ))}
            </DetailNumberDisplay>
          </DetailInfoDisplay>
        </DetailWrapper>
        <DetailButtonWrapper>
          <Button
            onClick={() => {
              setDisplayModalAddNumber(true);
            }}
          >
            Add Number
          </Button>
          <Button
            data-testid="btn-delete-contact"
            onClick={() => {
              setModalDeleteDisplay({
                modalTitle: "Delete Contact",
                modalMessage: (
                  <span>
                    Are you sure you want to delete{" "}
                    <b>
                      {selectedContact?.first_name} {selectedContact?.last_name}
                    </b>{" "}
                    from your contact ?
                  </span>
                ),
                deleteType: "contact",
                id: selectedContact?.id as string,
              });
              setDisplayModal(false);
              setDisplayModalDelete(true);
            }}
          >
            Delete
          </Button>
        </DetailButtonWrapper>
      </Modal>
      <ModalDelete
        displayModalDelete={displayModalDelete}
        setDisplayModalDelete={setDisplayModalDelete}
        setDisplayModalDetail={setDisplayModal}
        modalTitle={modalDeleteDisplay?.modalTitle as string}
        modalMessage={modalDeleteDisplay?.modalMessage as EmotionJSX.Element}
        handleDelete={handleDelete}
        idData={modalDeleteDisplay?.id as string}
      />
      <ModalForm
        handleCloseAllModal={handleCloseAllModal}
        setDisplayAddModal={setDisplayModalEdit}
        displayAddModal={displayModalEdit}
        dataEdit={selectedNumber}
      />
      <ModalAddNumberForm
        handleCloseAllModal={handleCloseAllModal}
        setDisplayAddModal={setDisplayModalAddNumber}
        displayAddModal={displayModalAddNumber}
        dataContact={selectedContact}
      />
    </>
  );
};

export default VirtualListComponent;
