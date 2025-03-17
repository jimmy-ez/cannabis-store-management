"use client";

import { AddIcon } from "@/components/icons";
import AddUserModal from "./component/AddUserModal";
import { useDisclosure } from "@heroui/react";
import AddShopModal from "./component/AddShopModal";
import { fetchDataFromFirestore } from "@/service/firestoreService";
import { useEffect, useState } from "react";
import ShopTable from "./component/ShopTable";
import { IShop, IUser } from "@/interface/general.interface";
import UserTable from "./component/UserTable";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ManagePage() {
    const { data: session, status: sessionStatus } = useSession();
    const router = useRouter();

    const { isOpen: isOpenAddUser, onClose: onCloseAddUser, onOpen: onOpenAddUser } = useDisclosure();
    const { isOpen: isOpenAddShop, onClose: onCloseAddShop, onOpen: onOpenAddShop } = useDisclosure();

    const [shops, setShops] = useState<IShop[]>([]);
    const [users, setUsers] = useState<IUser[]>([]);

    const [selectedShop, setSelectedShop] = useState<IShop>();
    const [selectedUser, setSelectedUser] = useState<IUser>();

    const fetchShopData = async () => {
        const fetchedShop = await fetchDataFromFirestore("shops");
        if (fetchedShop) {
            setShops(fetchedShop);
        }
    };

    const fetchUser = async () => {
        const fetchedUser = await fetchDataFromFirestore("users");
        if (fetchedUser) {
            setUsers(fetchedUser);
        }
    };

    useEffect(() => {
        fetchShopData();
        fetchUser();
    }, []);

    useEffect(() => {
        if (sessionStatus == "authenticated" && session && session.user.role !== "owner") {
            router.push("/");
        }
    }, [session]);

    const handleSelectShop = async (shop: IShop) => {
        setSelectedShop(shop);
        onOpenAddShop();
    };

    const handleCloseAddShop = async () => {
        onCloseAddShop();
        fetchShopData();
    };

    const handleSelectUser = async (user: any) => {
        setSelectedUser(user);
        onOpenAddUser();
    };

    const handleCloseAddUser = async () => {
        onCloseAddUser();
        fetchUser();
    };

    return (
        <div className="w-full">

            <AddUserModal isOpen={isOpenAddUser} onClose={handleCloseAddUser} onOpen={onOpenAddUser} selectedUser={selectedUser} />
            <AddShopModal isOpen={isOpenAddShop} onClose={handleCloseAddShop} onOpen={onOpenAddShop} selectedShop={selectedShop} />

            <div className="flex flex-row justify-between items-center">
                <h1 className={`text-2xl text-white border-b-2 border-cannabis`}>{"MANAGEMENT"}</h1>
                <div className="flex flex-row gap-2">
                    <div
                        role="button"
                        onClick={onOpenAddUser}
                        className="p-3 bg-[#2a2a2d] rounded-md hover:bg-gray-hover cursor-pointer flex flex-row items-center"
                    >
                        <AddIcon width={25} height={25} color="#02c1a4" />
                        <p className="text-sm font-semibold pl-2">ADD USER</p>
                    </div>
                    <div
                        role="button"
                        onClick={onOpenAddShop}
                        className="p-3 bg-[#2a2a2d] rounded-md hover:bg-gray-hover cursor-pointer flex flex-row items-center"
                    >
                        <AddIcon width={25} height={25} color="#02c1a4" />
                        <p className="text-sm font-semibold pl-2">ADD SHOP</p>
                    </div>
                </div>
            </div>

            <div className="w-full mt-4 flex flex-col gap-4">
                <div className="">
                    <p className="ml-2 font-bold mb-2 text-cannabis">SHOP LIST</p>
                    <ShopTable shops={shops} handleSelectShop={handleSelectShop} />
                </div>
                <div className="mt-2">
                    <p className="ml-2 font-bold mb-2 text-cannabis">USER LIST</p>
                    <UserTable users={users} shops={shops} handleSelectUser={handleSelectUser} />
                </div>
            </div>
        </div>
    );
}