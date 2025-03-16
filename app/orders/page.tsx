"use client";

import { AddIcon } from "@/components/icons";
import { IProduct } from "@/interface/product.interface";
import { fetchDataFromFirestore, addDataToFirestore, getAvailableProducts } from "@/service/firestoreService";

import { useEffect, useState } from "react";
import CannabisTable from "../shop/component/CannabisTable";
import { useDisclosure } from "@heroui/react";
import CannabisModal from "../shop/component/CannabisModal";
import { Input } from "@heroui/react";

export default function StockPage() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [cannabis, setCannabis] = useState<IProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<IProduct>();
    const [searchValue, setSearchValue] = useState<string>("");

    const { isOpen: isOpenAddCannabis, onClose: onCloseAddCannabis, onOpen: onOpenAddCannabis } = useDisclosure();

    const fetchProducts = async () => {
        const fetchedProducts = await getAvailableProducts();

        const othersProducts = fetchedProducts.filter((product: IProduct) => !product.isStrain);
        const cannabisProducts = fetchedProducts.filter((product: IProduct) => product.isStrain);

        setProducts(othersProducts);
        setCannabis(cannabisProducts);
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSelectProduct = async (product: IProduct) => {
        setSelectedProduct(product);
        onOpenAddCannabis();
    };

    const handleCloseAddCannabis = async () => {
        fetchProducts();
        onCloseAddCannabis();
    }

    useEffect(() => {
        if (!searchValue) {
            fetchProducts();
        } else {
            const filteredProducts = cannabis.filter((product) =>
                product.name.toLowerCase().includes(searchValue) ||
                product.cannabis?.type.toLowerCase().includes(searchValue)
            );
            setCannabis(filteredProducts);
        }
    }, [searchValue]);

    return (
        <div className="w-full">
            <div className="flex flex-row justify-between items-center">
                <h1 className={`text-2xl text-white border-b-2 border-cannabis`}>{"ORDERS"}</h1>
                <div className="flex items-center">
                    <Input
                        type="text"
                        placeholder="Search by name..."
                        classNames={{
                            "inputWrapper": "bg-gray-hover h-[48px] w-[300px] rounded-md group-data-[focus=true]:bg-cannabis ",
                            "input": "text-black group-data-[focus=true]:placeholder:text-gray-300",
                        }}
                        onChange={(e) => {
                            const searchValue = e.target.value.toLowerCase();
                            setSearchValue(searchValue);
                        }}
                    />
                </div>
                {/* <div
          onClick={onOpenAddCannabis}
          className="p-3 bg-[#2a2a2d] rounded-md hover:bg-gray-hover cursor-pointer flex flex-row items-center"
        >
          <AddIcon width={25} height={25} color="#0fab79" />
          <p className="text-sm font-semibold pl-2">ADD STRAIN</p>
        </div> */}
            </div>
            <div className="mt-8">
                <CannabisTable
                    products={cannabis}
                    handleSelectProduct={handleSelectProduct}
                />
                <CannabisModal
                    isOpen={isOpenAddCannabis}
                    onClose={handleCloseAddCannabis}
                    onOpen={onOpenAddCannabis}
                    selectedProduct={selectedProduct}
                />
            </div>
        </div>
    );
}