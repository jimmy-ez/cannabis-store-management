"use client";

import { IOrder, IProduct } from "@/interface/product.interface";
import { cn } from "@/utils/twHelper";
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell
} from "@heroui/react";
import { Timestamp } from "firebase/firestore";
import { useEffect } from "react";

interface OrderTableProps {
    orders: IOrder[];
    // handleSelectProduct: (product: IProduct) => void;
}

export default function OrderTable({ orders }: OrderTableProps) {
    const tableHeaderClass = "text-cannabis";

    const formatDate = (date: Date | Timestamp) => {
        if (date instanceof Timestamp) {
            return date.toDate().toLocaleDateString("en-GB");
        }
        return 0;
    }

    return (
        <div>
            <Table aria-label="Example static collection table" style={{ width: '100%' }}>
                <TableHeader>
                    <TableColumn className={`${tableHeaderClass}`}>DATE</TableColumn>
                    <TableColumn className={`${tableHeaderClass}`}>CUSTOMER</TableColumn>
                    <TableColumn className={`${tableHeaderClass}`}>PRODUCT</TableColumn>
                    <TableColumn className={`${tableHeaderClass}`}>TOTAL</TableColumn>
                    <TableColumn className={`${tableHeaderClass}`}>SELLER</TableColumn>
                    <TableColumn className={`${tableHeaderClass}`}>NOTE</TableColumn>
                </TableHeader>
                <TableBody>
                    {orders.map((item, index) => (
                        <TableRow
                            key={item.id}
                            className={
                                cn("cursor-pointer hover:bg-gray-hover", index % 2 !== 0 && "bg-[#2a2a2d]")
                            }
                        // onClick={() => { handleSelectProduct(item) }}
                        >
                            <TableCell style={{ width: '10%' }}>{formatDate(item.createdAt)}</TableCell>
                            <TableCell style={{ width: '10%' }}>{item.customerName}</TableCell>
                            <TableCell style={{ width: '20%' }}>
                                {
                                    item.products.map((product, index) => (
                                        <div key={index} className="\">
                                            <p>{`${product.product.name} - ${product.total?.toLocaleString()} ฿`}</p>
                                        </div>
                                    ))
                                }
                            </TableCell>
                            <TableCell style={{ width: '10%' }}>{item.total?.toLocaleString() + " ฿"}</TableCell>
                            <TableCell style={{ width: '10%' }}>{item.sellerId}</TableCell>
                            <TableCell style={{ width: '15%' }}>{item.note}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}