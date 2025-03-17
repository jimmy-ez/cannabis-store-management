"use client";

import { IShop, ModalProps } from "@/interface/general.interface";
import { IProduct } from "@/interface/product.interface";
import { addDataToFirestore, fetchDataFromFirestore, updateDataToFirestore } from "@/service/firestoreService";
import { Button } from "@heroui/react";
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
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/icons";

const label = `text-sm font-semibold pb-2 pl-1`;

interface AddProductModalProps extends ModalProps {
    selectedProduct?: IProduct;
}

export default function AddProductModal({ isOpen, onClose, onOpen, selectedProduct }: AddProductModalProps) {
    const router = useRouter();

    const [productName, setproductName] = useState<string>();
    // const [cnbType, setCnbType] = useState<"hybrid" | "indica" | "sativa">("hybrid");
    // const [thc, setThc] = useState<number>();
    // const [cbd, setCbd] = useState<number>();
    // const [feeling, setFeeling] = useState<string>();
    // const [taste, setTaste] = useState<string>();
    const [price, setPrice] = useState<number>();
    const [localPrice, setLocalPrice] = useState<number>();
    const [stock, setStock] = useState<number>();
    const [cost, setCost] = useState<number>();
    const [isActive, setIsActive] = useState<boolean>(true);
    const [shopId, setShopId] = useState<string>();
    const [detail, setDetail] = useState<string>();

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [productId, setProductId] = useState<string>();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [shopList, setShopList] = useState<IShop[]>([]);

    const fetchedShop = async () => {
        const fetchedShop = await fetchDataFromFirestore("shops");
        if (fetchedShop) {
            setShopList(fetchedShop);
        }
    }

    useEffect(() => {
        fetchedShop();
    }, []);

    useEffect(() => {
        if (selectedProduct) {
            setproductName(selectedProduct.name);
            // setCnbType(selectedProduct.cannabis?.type as "hybrid" | "indica" | "sativa");
            // setThc(selectedProduct.cannabis?.thc ?? 0);
            // setCbd(selectedProduct.cannabis?.cbd ?? 0);
            // setFeeling(selectedProduct.cannabis?.feeling);
            // setTaste(selectedProduct.cannabis?.taste);
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
            if (!productName || !price || !localPrice || !stock || !shopId || !detail) {
                return toast.error("Please fill all required fields");
            }

            const productData: IProduct = {
                name: productName,
                shopId: shopId,
                detail: detail,
                cost: cost ?? 0,
                price: price,
                localPrice: localPrice,
                stock: stock,
                isActive: isActive,
                isStrain: false,
                // cannabis: {
                //     type: cnbType,
                //     thc: thc ?? 0,
                //     cbd: cbd ?? 0,
                //     feeling: feeling,
                //     taste: taste
                // },
                createdAt: new Date(),
                updatedAt: new Date()
            }

            if (isEdit && productId) {
                productData.id = productId;
                const res = await updateDataToFirestore("products", productId, productData);
                if (res) {
                    toast.success("Product updated successfully");
                    handleClose();
                } else {
                    toast.error("Failed to update product");
                }
            } else {
                delete productData.id;
                const resId = await addDataToFirestore("products", productData);
                if (resId) {
                    toast.success("Product added successfully");
                    handleClose();
                } else {
                    toast.error("Failed to add product");
                }
            }
        }
        finally {
            setIsLoading(false);
        }
    }

    const handleClearState = () => {
        setproductName("");
        // setCnbType("hybrid");
        // setThc(0);
        // setCbd(0);
        // setFeeling("");
        // setTaste("");
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

    return (
        <Modal size="xl" isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-cannabis">ADD OTHERS PRODUCT</ModalHeader>
                        <ModalBody className="max-h-[70vh] overflow-y-scroll">
                            <form>
                                <div className="flex flex-col gap-4">

                                    <div>
                                        <p className={label}>SHOP LIST</p>
                                        <Select
                                            // selectionMode="multiple"
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
                                        <p className={label}>STRAIN NAME</p>
                                        <Input
                                            value={productName ?? undefined}
                                            onChange={(e) => setproductName(e.target.value)}
                                            placeholder="Enter strain name"
                                        />
                                    </div>

                                    <div>
                                        <p className={label}>DETAIL</p>
                                        <Input
                                            value={detail ?? undefined}
                                            onChange={(e) => setDetail(e.target.value)}
                                            placeholder="Enter product detail"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className={label}>{"COST (THB)"}</p>
                                            <Input
                                                type="number"
                                                value={String(cost) ?? undefined}
                                                onChange={(e) => {
                                                    setCost(Number(e.target.value));
                                                }}
                                                placeholder="Enter strain cost"
                                            />
                                        </div>
                                        <div>
                                            <p className={label}>{"STOCK (g.)"}</p>
                                            <Input
                                                type="number"
                                                value={String(stock) ?? undefined}
                                                onChange={(e) => {
                                                    setStock(Number(e.target.value));
                                                }}
                                                placeholder="Enter strain stock"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className={label}>{"PRICE (THB)"}</p>
                                            <Input
                                                type="number"
                                                value={String(price) ?? undefined}
                                                onChange={(e) => {
                                                    setPrice(Number(e.target.value));
                                                }}
                                                placeholder="Enter price"
                                            />
                                        </div>
                                        <div>
                                            <p className={label}>{"LOCAL PRICE (THB)"}</p>
                                            <Input
                                                type="number"
                                                value={String(localPrice) ?? undefined}
                                                onChange={(e) => {
                                                    setLocalPrice(Number(e.target.value));
                                                }}
                                                placeholder="Enter local price"
                                            />
                                        </div>
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