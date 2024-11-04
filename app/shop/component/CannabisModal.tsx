"use client";

import { ModalProps } from "@/interface/general.interface";
import { IProduct } from "@/interface/product.interface";
import { addDataToFirestore, updateDataToFirestore } from "@/service/firestoreService";
import { cn } from "@/utils/twHelper";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@nextui-org/modal";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

const label = `text-md pb-2 text-gray-500`;
const value = `text-md font-semibold pb-2`;

interface AddCannabisModalProps extends ModalProps {
    selectedProduct?: IProduct;
}

export default function CannabisModal({ isOpen, onClose, onOpen, selectedProduct }: AddCannabisModalProps) {
    const router = useRouter();

    const [strainName, setStrainName] = useState<string>();
    const [cnbType, setCnbType] = useState<"hybrid" | "indica" | "sativa">();
    const [thc, setThc] = useState<number>();
    const [cbd, setCbd] = useState<number>();
    const [feeling, setFeeling] = useState<string>();
    const [taste, setTaste] = useState<string>();
    const [price, setPrice] = useState<number>();
    const [localPrice, setLocalPrice] = useState<number>();
    const [stock, setStock] = useState<number>();
    const [cost, setCost] = useState<number>();
    const [isActive, setIsActive] = useState<boolean>(true);

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [productId, setProductId] = useState<string>();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (selectedProduct) {
            setStrainName(selectedProduct.name);
            setCnbType(selectedProduct.cannabis?.type);
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
            if (!strainName || !cnbType || !feeling || !taste || !price || !localPrice || !stock || !cost) {
                return toast.error("Please fill all required fields");
            }

            const productData: IProduct = {
                id: isEdit ? productId : undefined,
                name: strainName,
                detail: "",
                cost: cost,
                price: price,
                localPrice: localPrice,
                stock: stock,
                isActive: isActive,
                isStrain: true,
                cannabis: {
                    type: cnbType,
                    thc: thc ?? 0,
                    cbd: cbd ?? 0,
                    feeling: feeling,
                    taste: taste
                },
                createdAt: new Date(),
                updatedAt: new Date()
            }

            if (isEdit && productId) {
                const res = await updateDataToFirestore("products", productId, productData);
                if (res) {
                    toast.success("Product updated successfully");
                    handleClose();
                } else {
                    toast.error("Failed to update product");
                }
            } else {
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

    return (
        <Modal size="xl" isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-cannabis">CANNABIS PRODUCT</ModalHeader>
                        <ModalBody className="flex flex-row">
                            <div className="w-1/4">
                                <p className={`${label} text-lg`}>{"NAME"}</p>
                                <p className={label}>{"TYPE"}</p>
                                <p className={label}>{"MEASURE"}</p>
                                <p className={label}>{"TASTE"}</p>
                                <p className={label}>{"FEELING"}</p>
                                <p className={label}>{"PRICE"}</p>
                            </div>
                            <div className="w-3/4">
                                <p className={`${value} text-lg`}>{strainName}</p>
                                <p className={cn(`${value} capitalize text-green-600`, cnbType == "indica" && "text-orange-600")}>
                                    {cnbType}
                                </p>
                                <div className="flex flex-row gap-2 pb-2">
                                    <div className="bg-gray-700 w-[75px] flex justify-center rounded-md py-1 items-center">
                                        <p className="text-xs font-semibold">{`THC: ${thc} %`}</p>
                                    </div>
                                    <div className="bg-gray-700 w-[75px] flex justify-center rounded-md py-1 items-center">
                                        <p className="text-xs font-semibold">{`CBD: ${cbd} %`}</p>
                                    </div>
                                </div>
                                <p className={value}>{taste}</p>
                                <p className={value}>{feeling}</p>
                                <p className={value}>{`${localPrice}/${price} THB`}</p>

                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onPress={handleClose}>
                                CLOSE
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}