"use client";

import { ModalProps } from "@/interface/general.interface";
import { IOrderProduct, IProduct } from "@/interface/product.interface";
import { addDataToFirestore, fetchDataFromFirestore } from "@/service/firestoreService";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Tab, Tabs } from "@heroui/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ProductListModalProps extends ModalProps {
    shopId: string;
    addProductToOrder: (orderProduct: IOrderProduct) => void;
}

const label = `text-sm font-semibold pb-2 pl-1`;

const priceList = [
    { value: "normal", label: "Normal" },
    { value: "special", label: "Special" },
]

export default function ProductListModal({ isOpen, onClose, onOpen, shopId, addProductToOrder }: ProductListModalProps) {

    const [products, setProducts] = useState<IProduct[]>([]);

    const [selectedProduct, setSelectedProduct] = useState<IProduct>();
    const [quantity, setQuantity] = useState<number>();
    const [total, setTotal] = useState<number>();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [selectedPrice, setSelectedPrice] = useState<string>("normal");

    const handleClose = () => {
        setSelectedProduct(undefined);
        setQuantity(undefined);
        setTotal(undefined);
        setSelectedPrice("normal");
        onClose();
    }

    const handleFetchedData = async () => {
        const fetchedProducts = await fetchDataFromFirestore("products") as IProduct[];
        const filteredProducts = await fetchedProducts.filter((product) => (product.isActive && product.shopId === shopId));
        setProducts(filteredProducts);
    };

    useEffect(() => {
        handleFetchedData();
    }, [shopId]);

    const handleAddProduct = async () => {
        setIsLoading(true);
        try {
            if (!selectedProduct || !quantity || !total) {
                return toast.error("Please fill all required fields");
            }

            const orderProduct: IOrderProduct = {
                product: {
                    id: selectedProduct.id!,
                    name: selectedProduct.name
                },
                quantity: quantity!,
                total: total!
            }

            addProductToOrder(orderProduct);
            handleClose();
        } finally {
            setIsLoading(false);
        }

    };

    useEffect(() => {
        if (selectedProduct && quantity) {
            const price = selectedPrice === "normal" ? selectedProduct.price : selectedProduct.localPrice;
            if (price) {
                setTotal(price * quantity);
            }
        } else {
            setTotal(0);
        }
    }, [selectedProduct, quantity, selectedPrice]);

    return (
        <Modal size="xl" isOpen={isOpen} onOpenChange={handleClose} isDismissable={false}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-cannabis">CANNABIS PRODUCT</ModalHeader>
                        <ModalBody className="flex flex-row">
                            <div className="w-full flex flex-col gap-4">

                                <div>
                                    <p className={label}>PRODUCT</p>
                                    <Select
                                        disallowEmptySelection={true}
                                        className=""
                                        aria-label="Favorite Role"
                                        placeholder="Select a Role"
                                        selectedKeys={selectedProduct ? [selectedProduct.id!] : []}
                                        onChange={(e) => {
                                            setSelectedProduct(products.find((product) => product.id === e.target.value));
                                        }}
                                    >
                                        {products.map((item) => (
                                            <SelectItem key={item.id}>{item.name}</SelectItem>
                                        ))}
                                    </Select>
                                </div>

                                <div className="w-full grid grid-cols-2 items-center">
                                    <Tabs aria-label="Type Option" selectedKey={selectedPrice} onSelectionChange={(e) => {
                                        setSelectedPrice(e.toString());
                                    }}>
                                        {
                                            priceList.map((price) => (
                                                <Tab key={price.value} title={price.label}>
                                                </Tab>))
                                        }
                                    </Tabs>
                                    {(selectedPrice && selectedProduct) && <p className="text-cannabis text-right pr-4">{`${selectedPrice === "normal" ? selectedProduct?.price : selectedProduct?.localPrice} Baht`}</p>}
                                </div>

                                <div>
                                    <p className={label}>QUANTITY</p>
                                    <Input
                                        value={quantity?.toString() ?? undefined}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        type="number"
                                        placeholder="Enter quantity"
                                    />
                                </div>

                                <div>
                                    <p className={label}>TOTAL</p>
                                    <Input
                                        // isDisabled={true}
                                        value={total?.toLocaleString() ?? undefined}
                                        onChange={(e) => {
                                            const value = Number(e.target.value.replace(/,/g, ""));
                                            setTotal(value);
                                        }}
                                        placeholder="Total Price"
                                    />
                                </div>

                                {/* {
                                    products.map((product, index) => (
                                        <div key={index} className="w-full bg-gray-600 p-2 m-2 rounded-md hover:bg-gray-900 cursor-pointer">
                                            <p>{product.name}</p>
                                        </div>
                                    ))
                                } */}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="bg-cannabis" onPress={handleAddProduct}>
                                ADD
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
};