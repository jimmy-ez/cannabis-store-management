export interface ModalProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export interface IUser {
    id?: string;
    name: string;
    email: string;
    isActive: boolean;
    role: string;
    shopId: string[];
}

export interface IShop {
    id?: string;
    name: string;
    isActive: boolean;
}