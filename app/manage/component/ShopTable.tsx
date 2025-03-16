import { IShop } from "@/interface/general.interface";
import { cn } from "@/utils/twHelper";
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell
} from "@heroui/react"

interface ShopTableProps {
    shops: IShop[];
    handleSelectShop: (shop: IShop) => void;
}

export default function ShopTable({ shops, handleSelectShop }: ShopTableProps) {
    const tableHeaderClass = "text-cannabis";
    return (
        <div>
            <Table aria-label="Example static collection table" style={{ width: '100%' }}>
                <TableHeader>
                    <TableColumn className={`${tableHeaderClass}`} >NAME</TableColumn>
                    <TableColumn className={`${tableHeaderClass}`} >{""}</TableColumn>
                </TableHeader>
                <TableBody>
                    {shops.map((shop, index) => (
                        <TableRow
                            key={shop.id}
                            className={
                                cn("cursor-pointer hover:bg-gray-hover", index % 2 !== 0 && "bg-[#2a2a2d]")
                            }
                            onClick={() => { handleSelectShop(shop) }}
                        >
                            <TableCell style={{ width: '15%' }}>{shop.name}</TableCell>

                            <TableCell style={{ width: '3%' }}>
                                <div className={cn("w-[10px] h-[10px] rounded-full bg-green-500", shop.isActive == false && "bg-red-500")}></div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}