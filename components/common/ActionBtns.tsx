'use client';

import DeleteConfirm from '@/components/common/DeleteConfirm';
import DropdownActions from '@/components/common/DropdownActions';
import ModalPopup from '@/components/common/ModalPopup';
import { useState } from 'react';
import SheetSlideOver from './SheetSlideOver';

interface ActionBtnsProps {
  model?: { id: string };
  editionContent: React.ReactNode;
  editionTitle: string;
  deletionTitle: string;
  deletionAction?: (id: string) => Promise<{ success?: string; error?: string } | void>;
  confirmText: string;
  clientAction?: () => void;
  editLink?: string;
  showSheet?: boolean;
}

const ActionBtns = ({
  model,
  editionContent,
  editionTitle,
  deletionTitle,
  deletionAction,
  confirmText,
  clientAction,
  editLink,
  showSheet = false,
}: ActionBtnsProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      {showSheet ? (
        <SheetSlideOver isOpen={isEditOpen} setIsOpen={setIsEditOpen} title={editionTitle} content={editionContent} />
      ) : (
        <ModalPopup isOpen={isEditOpen} setIsOpen={setIsEditOpen} title={editionTitle} content={editionContent} />
      )}
      <ModalPopup
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title={deletionTitle}
        content={
          <DeleteConfirm
            id={model?.id}
            clientAction={clientAction}
            confirmText={confirmText}
            serverAction={deletionAction}
            setIsDeleteOpen={setIsDeleteOpen}
          />
        }
        className='md:max-w-[450px]'
      />
      <DropdownActions setIsEditOpen={setIsEditOpen} setIsDeleteOpen={setIsDeleteOpen} editLink={editLink} />
    </>
  );
};

export default ActionBtns;
