import { createContext, useContext, useState } from "react";

interface IAddIncomeFormCOntext {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const AddIncomeFormCOntext = createContext<IAddIncomeFormCOntext | null>(null);

export const AddIncomeFormProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return <AddIncomeFormCOntext.Provider value={{ isOpen, openModal, closeModal }}>{children}</AddIncomeFormCOntext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAddIncomeForm() {
  const context = useContext(AddIncomeFormCOntext);
  if (!context) {
    throw new Error("useAddIncomeForm must be used within an AddIncomeFormProvider");
  }
  return context;
}
