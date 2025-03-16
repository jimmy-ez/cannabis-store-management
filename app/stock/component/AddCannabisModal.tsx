"use client";

import { IShop, ModalProps } from "@/interface/general.interface";
import { IProduct } from "@/interface/product.interface";
import { addDataToFirestore, fetchDataFromFirestore, updateDataToFirestore } from "@/service/firestoreService";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@nextui-org/modal";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { Switch } from "@nextui-org/switch";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/icons";

const label = `text-sm font-semibold pb-2 pl-1`;

interface AddCannabisModalProps extends ModalProps {
    selectedProduct?: IProduct;
}

export default function AddCannabisModal({ isOpen, onClose, onOpen, selectedProduct }: AddCannabisModalProps) {
    const router = useRouter();

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
            if (!strainName || !cnbType || !feeling || !taste || !price || !localPrice || !stock || !cost || !shopId) {
                return toast.error("Please fill all required fields");
            }

            const productData: IProduct = {
                name: strainName,
                shopId: shopId,
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

    return (
        <Modal size="xl" isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-cannabis">ADD CANNABIS PRODUCT</ModalHeader>
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
                                            value={strainName ?? undefined}
                                            onChange={(e) => setStrainName(e.target.value)}
                                            placeholder="Enter strain name"
                                            endContent={
                                                <div role="button" onClick={handleInfo} className="bg-gray-hover hover:bg-cannabis cursor-pointer p-[6px] rounded-sm">
                                                    <SearchIcon />
                                                </div>
                                            }
                                        />
                                    </div>

                                    <div>
                                        <p className={label}>STRAIN TYPE</p>
                                        <Select
                                            selectedKeys={[cnbType ? cnbType : "hybrid"]}
                                            multiple={false}
                                            disallowEmptySelection={true}
                                            onChange={(e) => {
                                                setCnbType(e.target.value as "hybrid" | "indica" | "sativa");
                                            }}
                                            aria-label="Select Strain Type"
                                        >
                                            <SelectSection title="Select Type">
                                                <SelectItem value="indica" key={"indica"}>Indica</SelectItem>
                                                <SelectItem value="sativa" key={"sativa"}>Sativa</SelectItem>
                                                <SelectItem value="hybrid" key={"hybrid"}>Hybrid</SelectItem>
                                            </SelectSection>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className={label}>{"THC%"}</p>
                                            <Input
                                                type="number"
                                                value={String(thc) ?? undefined}
                                                onChange={(e) => {
                                                    setThc(Number(e.target.value));
                                                }}
                                                placeholder="Enter THC%"
                                            />
                                        </div>
                                        <div>
                                            <p className={label}>{"CBD%"}</p>
                                            <Input
                                                type="number"
                                                value={String(cbd) ?? undefined}
                                                onChange={(e) => {
                                                    setCbd(Number(e.target.value));
                                                }}
                                                placeholder="Enter CBD%"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <p className={label}>TASTE</p>
                                        <Input
                                            value={taste ?? undefined}
                                            onChange={(e) => setTaste(e.target.value)}
                                            placeholder="Enter strain taste"
                                        />
                                    </div>

                                    <div>
                                        <p className={label}>FEELING</p>
                                        <Input
                                            value={feeling ?? undefined}
                                            onChange={(e) => setFeeling(e.target.value)}
                                            placeholder="Enter strain feeling"
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