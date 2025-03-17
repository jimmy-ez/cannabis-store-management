"use client";

import { AddIcon } from "@/components/icons";
import { IProduct } from "@/interface/product.interface";
import { fetchDataFromFirestore, addDataToFirestore } from "@/service/firestoreService";

import { useEffect, useState } from "react";
import CannabisTable from "./component/CannabisTable";
import { CardBody, Card, Tab, Tabs, useDisclosure } from "@heroui/react"
import AddCannabisModal from "./component/AddCannabisModal";
import { IShop } from "@/interface/general.interface";
import AddProductModal from "./component/AddProductModal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function StockPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [cannabis, setCannabis] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct>();
  const [shops, setShops] = useState<IShop[]>([]);

  const [selectedShop, setSelectedShop] = useState<string>();

  const { isOpen: isOpenAddCannabis, onClose: onCloseAddCannabis, onOpen: onOpenAddCannabis } = useDisclosure();
  const { isOpen: isOpenAddProduct, onClose: onCloseAddProduct, onOpen: onOpenAddProduct } = useDisclosure();

  const fetchProducts = async (shopId?: string) => {
    let fetchedProducts = await fetchDataFromFirestore("products");

    if (shopId) {
      const filteredProducts = await fetchedProducts.filter((product) => product.shopId === shopId);
      fetchedProducts = filteredProducts
    }

    const othersProducts = fetchedProducts.filter((product: IProduct) => !product.isStrain);
    const cannabisProducts = fetchedProducts.filter((product: IProduct) => product.isStrain);

    setProducts(othersProducts);
    setCannabis(cannabisProducts);
  }

  const fetchShopList = async () => {
    const fetchedShop = await fetchDataFromFirestore("shops");
    if (fetchedShop && session && session.user.shopId) {
      const filteredShops = fetchedShop.filter(shop => session.user.shopId.includes(shop.id));
      setShops(filteredShops);
      setSelectedShop(filteredShops[0].id);
      fetchProducts(filteredShops[0].id);
    }
  };

  useEffect(() => {
    if(session && session.user.role !== "manager") {
      router.push("/");
    }
    fetchShopList();
  }, []);

  useEffect(() => {
    if (selectedShop) {
      fetchProducts(selectedShop);
    }
  }, [selectedShop]);

  const handleSelectProduct = async (product: IProduct) => {
    setSelectedProduct(product);
    onOpenAddCannabis();
  };

  const handleCloseAddCannabis = async () => {
    fetchProducts(selectedShop);
    setSelectedProduct(undefined);
    onCloseAddCannabis();
  }

  const handleCloseAddProduct = async () => {
    // fetchProducts();
    // setSelectedProduct(undefined);
    onCloseAddProduct();
  };

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center">
        <h1 className={`text-2xl text-white border-b-2 border-cannabis`}>{"STOCK"}</h1>
        <div className="flex flex-row gap-2">
          <div
            role="button"
            onClick={onOpenAddCannabis}
            className="p-3 bg-[#2a2a2d] rounded-md hover:bg-gray-hover cursor-pointer flex flex-row items-center"
          >
            <AddIcon width={25} height={25} color="#0fab79" />
            <p className="text-sm font-semibold pl-2">ADD STRAIN</p>
          </div>
          <div
            role="button"
            onClick={onOpenAddCannabis}
            className="p-3 bg-[#2a2a2d] rounded-md hover:bg-gray-hover cursor-pointer flex flex-row items-center"
          >
            <AddIcon width={25} height={25} color="#0fab79" />
            <p className="text-sm font-semibold pl-2">ADD PRODUCT</p>
          </div>
        </div>
      </div>
      <div className="mt-8">

        <div className="mb-4">
          <Tabs aria-label="Options" selectedKey={selectedShop} onSelectionChange={(e) => {
            setSelectedShop(e.toString());
          }}>
            {
              shops.map((shop) => (
                <Tab key={shop.id} title={shop.name}></Tab>))
            }
          </Tabs>
        </div>

        <CannabisTable
          products={cannabis}
          handleSelectProduct={handleSelectProduct}
        />

        <AddCannabisModal
          isOpen={isOpenAddCannabis}
          onClose={handleCloseAddCannabis}
          onOpen={onOpenAddCannabis}
          selectedProduct={selectedProduct}
          defaultShopId={selectedShop}
        />

        <AddProductModal
          isOpen={isOpenAddProduct}
          onClose={handleCloseAddProduct}
          onOpen={onOpenAddProduct}
          selectedProduct={selectedProduct}
        />
      </div>
    </div>
  );
}
