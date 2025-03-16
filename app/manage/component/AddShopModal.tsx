"use client";

import { IShop, ModalProps } from "@/interface/general.interface";
import { addDataToFirestore, updateDataToFirestore } from "@/service/firestoreService";
import { Button } from "@heroui/react"
import { Input } from "@heroui/react"
import { IUser } from "@/interface/general.interface";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@heroui/react"
import { Switch } from "@heroui/react"
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/icons";
import { SharedSelection } from "@heroui/react"

const label = `text-sm font-semibold pb-2 pl-1`;


interface AddShopModalProps extends ModalProps {
    selectedShop?: IShop;
}

export default function AddShopModal({ isOpen, onClose, onOpen, selectedShop }: AddShopModalProps) {
    const router = useRouter();

    const [name, setName] = useState<string>();
    const [isActive, setIsActive] = useState<boolean>(true);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    const [shopId, setShopId] = useState<string>();

    useEffect(() => {
        if (selectedShop) {
            setShopId(selectedShop.id);
            setName(selectedShop.name);
            setIsActive(selectedShop.isActive);
            setIsEdit(true);
        }
    }, [selectedShop]);

    const handleClose = () => {
        onClose();
        setName("");
        setIsActive(true);
        setIsEdit(false);
     };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (!name) {
                toast.error("Name is required");
                return;
            }

            const data: IShop = {
                name: name,
                isActive: isActive,
            };

            if (isEdit) {
                // updateDataToFirestore("shops", data, data.id);
                // toast.success("Shop updated successfully");
            } else {
                console.log("data", data);
                delete data.id;
                const resId = await addDataToFirestore("shops", data);
                if (resId) {
                    toast.success("Shop added successfully");
                    handleClose();
                } else {
                    toast.error("Failed to add shop");
                }
            }

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal size="xl" isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-cannabis">ADD NEW SHOP</ModalHeader>
                        <ModalBody className="max-h-[70vh] overflow-y-scroll">
                            <form>
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <p className={label}>NAME</p>
                                        <Input
                                            value={name ?? undefined}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter user's name"
                                        />
                                    </div>
                                </div>
                            </form>
                        </ModalBody>
                        <ModalFooter className="flex flex-row justify-between">
                            <div>
                                <Switch
                                    classNames={{
                                        thumb: "bg-white",
                                        wrapper: "bg-red-500 group-data-[selected=true]:bg-green-500",
                                    }}
                                    size="sm"
                                    isSelected={isActive}
                                    onValueChange={setIsActive}
                                >
                                    {isActive ? "ACTIVE" : "INACTIVE"}
                                </Switch>
                            </div>
                            <div className="flex gap-4">
                                <Button color="danger" onPress={handleClose}>
                                    CLOSE
                                </Button>
                                <Button isDisabled={isLoading} className="bg-cannabis" onPress={handleSubmit}>
                                    {isLoading ? "LOADING..." : isEdit ? "UPDATE" : "ADD"}
                                </Button>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}