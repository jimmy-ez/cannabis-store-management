"use client";

import { AddIcon } from "@/components/icons";
import { IProduct } from "@/interface/product.interface";
import { fetchDataFromFirestore, addDataToFirestore, getAvailableProducts } from "@/service/firestoreService";

import { useEffect, useState } from "react";
import CannabisTable from "./component/CannabisTable";
import { Button, Tab, Tabs, useDisclosure } from "@heroui/react"
import CannabisModal from "./component/CannabisModal";
import { Input } from "@heroui/react"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IShop } from "@/interface/general.interface";
import AddOrderModal from "../orders/component/AddOrderModal";

const types = [
  {
    id: "all", name: "All"
  },
  {
    id: "indica", name: "Indica"
  }, {
    id: "sativa", name: "Sativa"
  }, {
    id: "hybrid", name: "Hybrid"
  },
]

export default function StockPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [cannabis, setCannabis] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct>();
  const [searchValue, setSearchValue] = useState<string>("");

  const [shops, setShops] = useState<IShop[]>([]);
  const [selectedShop, setSelectedShop] = useState<string>();

  const [selectedType, setSelectedType] = useState<string>("all");

  const { isOpen: isOpenAddCannabis, onClose: onCloseAddCannabis, onOpen: onOpenAddCannabis } = useDisclosure();
  const { isOpen: isOpenAddOrder, onClose: onCloseAddOrder, onOpen: onOpenAddOrder } = useDisclosure();

  const fetchProducts = async (shopId: string, keyword?: string, type?: string) => {
    let products: IProduct[] = [];
    let fetchedProducts = (await fetchDataFromFirestore("products")).filter((product: IProduct) => product.isActive);

    if (shopId) {
      const filteredProducts = await fetchedProducts.filter((product) => product.shopId === shopId);
      fetchedProducts = filteredProducts
    }

    if (type && type !== "all") {
      const filteredProducts = fetchedProducts.filter((product) => product.cannabis?.type.toLowerCase() === type);
      fetchedProducts = filteredProducts;
    }

    if (keyword) {
      const filteredProducts = fetchedProducts.filter((product) =>
        product.name.toLowerCase().includes(keyword) ||
        product.cannabis?.type.toLowerCase().includes(keyword) ||
        product.cannabis?.feeling.toLowerCase().includes(keyword) ||
        product.cannabis?.taste.toLowerCase().includes(keyword)
      );
      products = filteredProducts;
    } else {
      products = fetchedProducts;
    }

    const othersProducts = products.filter((product: IProduct) => !product.isStrain);
    const cannabisProducts = products.filter((product: IProduct) => product.isStrain);

    setProducts(othersProducts);
    setCannabis(cannabisProducts);
  }

  const fetchShopList = async () => {
    const fetchedShop = (await fetchDataFromFirestore("shops")).filter((shop: IShop) => shop.isActive);
    if (fetchedShop && session && session.user.shopId) {
      const filteredShops = fetchedShop.filter(shop => session.user.shopId.includes(shop.id));
      setShops(filteredShops);
      setSelectedShop(filteredShops[0].id);
      fetchProducts(filteredShops[0].id);
    }
  };

  useEffect(() => {
    fetchShopList();
  }, []);

  useEffect(() => {
    if (selectedShop) {
      fetchProducts(selectedShop);
    }
    console.log("selectedShop", selectedShop);
  }, [selectedShop]);

  useEffect(() => {
    if (selectedType === "all") {
      fetchProducts(selectedShop!, searchValue);
    } else {
      fetchProducts(selectedShop!, searchValue, selectedType);
    }
  }, [selectedType, searchValue]);

  const handleSelectProduct = async (product: IProduct) => {
    setSelectedProduct(product);
    onOpenAddCannabis();
  };

  const handleCloseAddCannabis = async () => {
    fetchProducts(selectedShop!);
    onCloseAddCannabis();
  }



  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center">
        <h1 className={`text-2xl text-white border-b-2 border-cannabis`}>{"ALL PRODUCTS"}</h1>
        <div className="flex items-center gap-2">
          <div
            role="button"
            onClick={onOpenAddOrder}
            className="w-full p-3 bg-[#2a2a2d] rounded-md hover:bg-gray-hover cursor-pointer flex flex-row items-center"
          >
            <AddIcon width={25} height={25} color="#0fab79" />
            <p className="text-sm font-semibold pl-2">ADD ORDER</p>
          </div>
          <Input
            type="text"
            placeholder="Search by name..."
            classNames={{
              "inputWrapper": "bg-gray-hover h-[48px] w-[300px] rounded-md group-data-[focus=true]:bg-cannabis ",
              "input": "text-black group-data-[focus=true]:placeholder:text-gray-300",
            }}
            value={searchValue}
            onChange={(e) => {
              const searchValue = e.target.value;
              setSearchValue(searchValue);
            }}
            isClearable
            onClear={() => setSearchValue("")}
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

        <div className="mb-4 flex flex-row justify-between items-center">
          <Tabs aria-label="Options" selectedKey={selectedShop} onSelectionChange={(e) => {
            setSelectedShop(e.toString());
            setSearchValue("");
            setSelectedType("all");
          }}>
            {
              shops.map((shop) => (
                <Tab key={shop.id} title={shop.name}></Tab>))
            }
          </Tabs>
          <div>
            <Tabs aria-label="Type Option" selectedKey={selectedType} onSelectionChange={(e) => {
              setSelectedType(e.toString());
            }}>
              {
                types.map((type) => (
                  <Tab key={type.id} title={type.name}></Tab>))
              }
            </Tabs>
          </div>
        </div>

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

        <AddOrderModal
          defaultShopId={selectedShop}
          isOpen={isOpenAddOrder}
          onClose={onCloseAddOrder}
          onOpen={onOpenAddOrder}
        />
      </div>
    </div>
  );
}