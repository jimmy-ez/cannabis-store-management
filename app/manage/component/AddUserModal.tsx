"use client";

import { IShop, ModalProps } from "@/interface/general.interface";
import { addDataToFirestore, fetchDataFromFirestore, updateDataToFirestore } from "@/service/firestoreService";
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
import { Select, SelectSection, SelectItem } from "@heroui/react"
import { Switch } from "@heroui/react"
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/icons";
import { SharedSelection } from "@heroui/react"

const label = `text-sm font-semibold pb-2 pl-1`;

const roleList = [
    { value: "manager", label: "Manager" },
    { value: "staff", label: "Staff" },
    { value: "owner", label: "Owner" },
];

interface AddUserModalProps extends ModalProps {
    selectedUser?: IUser;
}

export default function AddUserModal({ isOpen, onClose, onOpen, selectedUser }: AddUserModalProps) {
    const router = useRouter();

    const [name, setName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [role, setRole] = useState<string>("staff");
    const [shopId, setShopId] = useState<string[]>();
    const [isActive, setIsActive] = useState<boolean>(true);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    const [shops, setShops] = useState<IShop[]>([]);

    const fetchShopList = async () => {
        const fetchedShop = await fetchDataFromFirestore("shops");
        if (fetchedShop) {
            setShops(fetchedShop);
        }
    };

    useEffect(() => {
        fetchShopList();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            console.log("selectedUser", selectedUser);
            setName(selectedUser.name);
            setEmail(selectedUser.email);
            setRole(selectedUser.role);
            setShopId(selectedUser.shopId);
            setIsActive(selectedUser.isActive);
            setIsEdit(true);
        }
    }, [selectedUser]);

    const handleClose = () => {
        onClose();
        setName("");
        setEmail("");
        setRole("staff");
        setShopId([]);
        setIsActive(true);
        setIsEdit(false);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (!name || !email || !role || !shopId) {
                toast.error("Please fill all fields");
                return;
            }

            const data: IUser = {
                name,
                email,
                role,
                shopId,
                isActive,
            };

            if (isEdit && selectedUser && selectedUser.id) {
                const res = await updateDataToFirestore("users", selectedUser?.id, data);
                if (res) {
                    toast.success("Shop user updated successfully");
                    handleClose();
                } else {
                    toast.error("Failed to update user");
                }
            } else {
                delete data.id;
                const resId = await addDataToFirestore("users", data);
                if (resId) {
                    toast.success("Shop user successfully");
                    handleClose();
                } else {
                    toast.error("Failed to add user");
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
                        <ModalHeader className="flex flex-col gap-1 text-cannabis">ADD NEW USER</ModalHeader>
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
                                    <div>
                                        <p className={label}>E-MAIL</p>
                                        <Input
                                            type="email"
                                            value={email ?? undefined}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter user's email"
                                            readOnly={isEdit}
                                        />
                                    </div>
                                    <div>
                                        <p className={label}>Role</p>
                                        <Select
                                            disallowEmptySelection={true}
                                            className=""
                                            aria-label="Favorite Role"
                                            placeholder="Select a Role"
                                            selectedKeys={role ? [role] : ["staff"]}
                                            onChange={(e) => {
                                                setRole(e.target.value);
                                            }}
                                        >
                                            {roleList.map((animal) => (
                                                <SelectItem key={animal.value}>{animal.label}</SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                    <div>
                                        <p className={label}>SHOP LIST</p>
                                        <Select
                                            selectionMode="multiple"
                                            disallowEmptySelection={true}
                                            className=""
                                            aria-label="Select Shop"
                                            placeholder="Select Shop"
                                            selectedKeys={shopId}
                                            onChange={(e) => {
                                                const splitValue = e.target.value.split(",");
                                                console.log("splitValue", splitValue);
                                                if (splitValue.length > 0) {
                                                    setShopId(splitValue);
                                                }
                                            }}
                                        >
                                            {shops.map((shop) => (
                                                <SelectItem key={shop.id}>{shop.name}</SelectItem>
                                            ))}
                                        </Select>
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