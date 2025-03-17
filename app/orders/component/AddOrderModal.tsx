"use client";

import { IShop, ModalProps } from "@/interface/general.interface";
import { IOrder, IOrderProduct, IProduct } from "@/interface/product.interface";
import { addDataToFirestore, fetchDataFromFirestore, updateDataToFirestore } from "@/service/firestoreService";
import { Button, useDisclosure } from "@heroui/react";
import { Input } from "@heroui/react"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@heroui/react"
import { Select, SelectSection, SelectItem } from "@heroui/react"
import { Switch } from "@heroui/react"
import { useEffect, useMemo, useState } from "react";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { AddIcon, DeleteIcon, SearchIcon } from "@/components/icons";
import { useSession } from "next-auth/react";
import ProductListModal from "./ProductListModal";

const label = `text-sm font-semibold pb-2 pl-1`;

interface AddOrderModalProps extends ModalProps {
    defaultShopId: string | undefined;
    selectedProduct?: IProduct;
}

export default function AddOrderModal({ isOpen, onClose, onOpen, selectedProduct, defaultShopId }: AddOrderModalProps) {
    const router = useRouter();
    const { data: session } = useSession();

    const { isOpen: isOpenProductList, onClose: onCloseProductList, onOpen: onOpenProductList } = useDisclosure();

    const [strainName, setStrainName] = useState<string>();
    const [cnbType, setCnbType] = useState<"hybrid" | "indica" | "sativa">("hybrid");
    const [thc, setThc] = useState<number>();
    const [cbd, setCbd] = useState<number>();
    const [feeling, setFeeling] = useState<string>();
    const [taste, setTaste] = useState<string>();
    const [price, setPrice] = useState<number>();
    const [localPrice, setLocalPrice] = useState<number>();
    const [stock, setStock] = useState<number>();
    const [cost, setCost] = useState<number>();
    const [isActive, setIsActive] = useState<boolean>(true);
    const [shopId, setShopId] = useState<string>();

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [productId, setProductId] = useState<string>();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [shopList, setShopList] = useState<IShop[]>([]);

    const [customerName, setCustomerName] = useState<string>("Guest");
    const [orderProduct, setOrderProduct] = useState<IOrderProduct[]>();
    const [note, setNote] = useState<string>();

    const fetchedShop = async () => {
        const fetchedShop = (await fetchDataFromFirestore("shops")).filter((shop: IShop) => shop.isActive && session && session.user.shopId.includes(shop.id!));
        if (fetchedShop) {
            setShopList(fetchedShop);
        }
    }

    useEffect(() => {
        if (defaultShopId) {
            setShopId(defaultShopId);
        }
    }, [defaultShopId]);

    useEffect(() => {
        fetchedShop();
    }, []);

    const totalPriceInOrder = useMemo(() => {
        if (orderProduct && orderProduct.length > 0) {
            const sum = orderProduct.reduce((acc, item) => acc + item.total, 0);
            return sum.toLocaleString();
        }
        return 0;
    }, [orderProduct]);

    useEffect(() => {
        if (selectedProduct) {
            setStrainName(selectedProduct.name);
            setCnbType(selectedProduct.cannabis?.type as "hybrid" | "indica" | "sativa");
            setThc(selectedProduct.cannabis?.thc ?? 0);
            setCbd(selectedProduct.cannabis?.cbd ?? 0);
            setFeeling(selectedProduct.cannabis?.feeling);
            setTaste(selectedProduct.cannabis?.taste);
            setPrice(selectedProduct.price);
            setLocalPrice(selectedProduct.localPrice);
            setStock(selectedProduct.stock);
            setCost(selectedProduct.cost);
            setIsActive(selectedProduct.isActive);
            setProductId(selectedProduct.id);
            setIsEdit(true);
        }
    }, [selectedProduct]);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (!shopId || !orderProduct || orderProduct.length === 0 || !customerName) {
                return toast.error("Please fill all required fields");
            }

            const orderData: IOrder = {
                shopId: shopId,
                sellerId: session?.user.id!,
                products: orderProduct,
                total: orderProduct.reduce((acc, item) => acc + item.total, 0),
                status: "completed",
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const result = await addDataToFirestore("orders", orderData);
            if (result) {
                toast.success("Order added successfully");
                handleClose();
                router.push("/orders");
            } else {
                toast.error("Failed to add order");
            }
        }
        finally {
            setIsLoading(false);
        }
    }

    const handleClearState = () => {
        setStrainName("");
        setCnbType("hybrid");
        setThc(0);
        setCbd(0);
        setFeeling("");
        setTaste("");
        setPrice(0);
        setLocalPrice(0);
        setStock(0);
        setCost(0);
        setIsActive(true);
        setIsEdit(false);
        setProductId("");
    }

    const handleClose = async () => {
        handleClearState();
        onClose();
    }

    const handleInfo = () => {
        if (strainName) {
            const qName = strainName?.split(" ").join("+");
            window.open(`https://www.leafly.com/search?q=${qName}&searchCategory=strain`, "_blank");
        } else {
            toast.error("Please enter strain name");
        }
    }

    const handleAddProduct = () => {
        onOpenProductList();
    };

    const handleAddProductToOrder = async (newProduct: IOrderProduct) => {
        const prevData = orderProduct || [];
        setOrderProduct([...prevData, newProduct]);
    };

    useEffect(() => {
        console.log("orderProduct", orderProduct);
    }, [orderProduct]);

    return (
        <>
            {shopId && <ProductListModal isOpen={isOpenProductList} onClose={onCloseProductList} onOpen={onOpenProductList} shopId={shopId} addProductToOrder={handleAddProductToOrder} />}
            <Modal size="3xl" isOpen={isOpen} onOpenChange={onClose} isDismissable={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-cannabis">ADD ORDER</ModalHeader>
                            <ModalBody className="max-h-[70vh] overflow-y-scroll">
                                <form>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className={label}>SHOP</p>
                                                <Select
                                                    isDisabled={true}
                                                    disallowEmptySelection={true}
                                                    className=""
                                                    aria-label="Select Shop"
                                                    placeholder="Select Shop"
                                                    selectedKeys={shopId ? [shopId] : []}
                                                    onChange={(e) => {
                                                        console.log(e.target.value);
                                                        setShopId(e.target.value);
                                                    }}
                                                >
                                                    {shopList.map((shop) => (
                                                        <SelectItem key={String(shop.id)}>{shop.name}</SelectItem>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div>
                                                <p className={label}>CUSTOMER</p>
                                                <Input
                                                    value={customerName ?? undefined}
                                                    onChange={(e) => setCustomerName(e.target.value)}
                                                    placeholder="Enter customer name"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex flex-row justify-between items-center">
                                                <p className={label}>PRODUCTS</p>
                                                <div
                                                    role="button"
                                                    onClick={handleAddProduct}
                                                    className="p-3 bg-[#2a2a2d] rounded-md hover:bg-gray-hover cursor-pointer flex flex-row items-center"
                                                >
                                                    <AddIcon width={25} height={25} color="#0fab79" />
                                                </div>
                                            </div>
                                            {(orderProduct && orderProduct?.length > 0) && <div className="pl-2">
                                                <div className="grid grid-cols-4 text-cannabis mb-2">
                                                    <p className="text-sm font-semibold">{"Product"}</p>
                                                    <p className="text-sm font-semibold">{"Quantity"}</p>
                                                    <p className="text-sm font-semibold">{"Total"}</p>
                                                </div>
                                                {
                                                    orderProduct?.map((product, index) => (
                                                        <div key={index} className="grid grid-cols-4 items-center mb-2">
                                                            <p className="text-sm font-semibold">{index + 1}. {product.product.name}</p>
                                                            <p className="text-sm font-semibold">{product.quantity}</p>
                                                            <p className="text-sm font-semibold">{product.total?.toLocaleString()}</p>
                                                            <div className="w-full flex flex-row justify-end">
                                                                <div
                                                                    role="button"
                                                                    onClick={() => {
                                                                        const newOrderProduct = orderProduct.filter((item, i) => i !== index);
                                                                        setOrderProduct(newOrderProduct);
                                                                    }}
                                                                    className="w-fit p-2 bg-[#2a2a2d] rounded-md hover:bg-gray-hover cursor-pointer flex flex-row items-center"
                                                                >
                                                                    <DeleteIcon width={16} height={16} color="red" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>}

                                            <div>
                                                <p className={label}>NOTE</p>
                                                <Input
                                                    value={note ?? undefined}
                                                    onChange={(e) => setNote(e.target.value)}
                                                    placeholder="Enter order note"
                                                />
                                            </div>

                                        </div>

                                    </div>
                                </form>
                            </ModalBody>
                            <ModalFooter className="flex flex-row justify-between">
                                <div>
                                    <p className="font-bold text-cannabis">{`TOTAL ${totalPriceInOrder} BAHT`}</p>
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
        </>
    )
}