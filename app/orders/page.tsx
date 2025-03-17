"use client";

import { AddIcon } from "@/components/icons";
import { IOrder } from "@/interface/product.interface";
import { fetchDataFromFirestore, addDataToFirestore, getAvailableProducts } from "@/service/firestoreService";

import { useEffect, useState } from "react";
import CannabisTable from "../shop/component/CannabisTable";
import { Tab, Tabs, useDisclosure } from "@heroui/react";
import CannabisModal from "../shop/component/CannabisModal";
import { Input } from "@heroui/react";
import OrderTable from "./component/OrderTable";
import { IShop } from "@/interface/general.interface";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AddOrderModal from "./component/AddOrderModal";

export default function StockPage() {
    const { data: session } = useSession();
    const router = useRouter();

    const [shops, setShops] = useState<IShop[]>([]);
    const [selectedShop, setSelectedShop] = useState<string>();

    const [orders, setOrders] = useState<IOrder[]>([]);

    const { isOpen: isOpenAddOrder, onClose: onCloseAddOrder, onOpen: onOpenAddOrder } = useDisclosure();

    const fetchOrders = async (shopId: string) => {
        if (session?.user.role === "staff") {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const fetchedOrders = (await fetchDataFromFirestore("orders", "createdAt", "desc")).filter((order: any) => {
                const createdDate = order.createdAt["seconds"] * 1000;
                const orderDate = new Date(createdDate);
                orderDate.setHours(0, 0, 0, 0);
                
                return order.shopId === shopId && order.sellerId === session?.user.username && orderDate.getTime() === today.getTime();
            });
            if (fetchedOrders) {
                setOrders(fetchedOrders);
            }
        } else {
            const fetchedOrders = (await fetchDataFromFirestore("orders", "createdAt", "desc")).filter((order: any) => (order.shopId === shopId));
            if (fetchedOrders) {
                setOrders(fetchedOrders);
            }
        }
    };

    const fetchShopList = async () => {
        const fetchedShop = (await fetchDataFromFirestore("shops")).filter((shop: IShop) => shop.isActive);
        if (fetchedShop && session && session.user.shopId) {
            const filteredShops = fetchedShop.filter(shop => session.user.shopId.includes(shop.id));
            setShops(filteredShops);
            setSelectedShop(filteredShops[0].id);
        }
    };

    useEffect(() => {
        fetchShopList();
    }, []);

    useEffect(() => {
        if (selectedShop) {
            fetchOrders(selectedShop);
        }
    }, [selectedShop]);

    return (
        <div className="w-full">
            <div className="flex flex-row justify-between items-center">
                <h1 className={`text-2xl text-white border-b-2 border-cannabis`}>{"ORDERS"}</h1>
                <div className="flex items-center gap-2">
                    <div
                        role="button"
                        onClick={onOpenAddOrder}
                        className="w-full p-3 bg-[#2a2a2d] rounded-md hover:bg-gray-hover cursor-pointer flex flex-row items-center"
                    >
                        <AddIcon width={25} height={25} color="#0fab79" />
                        <p className="text-sm font-semibold pl-2">ADD ORDER</p>
                    </div>
                </div>
            </div>
            <div className="mt-8">

                <div className="mb-4 flex flex-row justify-between items-center">
                    <Tabs aria-label="Options" selectedKey={selectedShop} onSelectionChange={(e) => {
                        setSelectedShop(e.toString());
                    }}>
                        {
                            shops.map((shop) => (
                                <Tab key={shop.id} title={shop.name}></Tab>))
                        }
                    </Tabs>
                </div>

                <OrderTable
                    orders={orders}
                />
            </div>

            <AddOrderModal
                defaultShopId={selectedShop}
                isOpen={isOpenAddOrder}
                onClose={onCloseAddOrder}
                onOpen={onOpenAddOrder}
                fetchOrders={fetchOrders}
            />

        </div>
    );
}