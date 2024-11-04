"use client";

import { AddIcon } from "@/components/icons";
import { IProduct } from "@/interface/product.interface";
import { fetchDataFromFirestore, addDataToFirestore } from "@/service/firestoreService";

import { useEffect, useState } from "react";
import CannabisTable from "./component/CannabisTable";
import { useDisclosure } from "@nextui-org/modal";
import AddCannabisModal from "./component/AddCannabisModal";

export default function StockPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [cannabis, setCannabis] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct>();

  const { isOpen: isOpenAddCannabis, onClose: onCloseAddCannabis, onOpen: onOpenAddCannabis } = useDisclosure();

  const fetchProducts = async () => {
    const fetchedProducts = await fetchDataFromFirestore("products");

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
    setSelectedProduct(undefined);
    onCloseAddCannabis();
  }

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center">
        <h1 className={`text-2xl text-white border-b-2 border-cannabis`}>{"STOCK MANAGEMENT"}</h1>
        <div
          role="button"
          onClick={onOpenAddCannabis}
          className="p-3 bg-[#2a2a2d] rounded-md hover:bg-gray-hover cursor-pointer flex flex-row items-center"
        >
          <AddIcon width={25} height={25} color="#0fab79" />
          <p className="text-sm font-semibold pl-2">ADD STRAIN</p>
        </div>
      </div>
      <div className="mt-8">
        <CannabisTable
          products={cannabis}
          handleSelectProduct={handleSelectProduct}
        />
        <AddCannabisModal
          isOpen={isOpenAddCannabis}
          onClose={handleCloseAddCannabis}
          onOpen={onOpenAddCannabis}
          selectedProduct={selectedProduct}
        />
      </div>
    </div>
  );
}
