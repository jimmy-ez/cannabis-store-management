import { IProduct } from "@/interface/product.interface";
import { cn } from "@/utils/twHelper";
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell
} from "@nextui-org/table";

interface CannabisTableProps {
    products: IProduct[];
    handleSelectProduct: (product: IProduct) => void;
}

export default function CannabisTable({ products, handleSelectProduct }: CannabisTableProps) {
    const tableHeaderClass = "text-cannabis";
    return (
        <div>
            <Table aria-label="Example static collection table" style={{ width: '100%' }}>
                <TableHeader>
                    <TableColumn className={`${tableHeaderClass}`} >NAME</TableColumn>
                    <TableColumn className={`${tableHeaderClass}`} >TYPE</TableColumn>
                    <TableColumn className={`${tableHeaderClass}`} >MEASURE</TableColumn>
                    {/* <TableColumn className={`${tableHeaderClass}`} >TASTE</TableColumn> */}
                    {/* <TableColumn className={`${tableHeaderClass}`} >FEELING</TableColumn> */}
                    <TableColumn className={`${tableHeaderClass}`} >COST</TableColumn>
                    <TableColumn className={`${tableHeaderClass}`} >LOCAL PRICE</TableColumn>
                    <TableColumn className={`${tableHeaderClass}`} >PRICE</TableColumn>
                    <TableColumn className={`${tableHeaderClass}`} >{`STOCK (g.)`}</TableColumn>
                    <TableColumn className={`${tableHeaderClass}`} >{""}</TableColumn>
                </TableHeader>
                <TableBody>
                    {products.map((product, index) => (
                        <TableRow
                            key={product.id}
                            className={
                                cn("cursor-pointer hover:bg-gray-hover", index % 2 !== 0 && "bg-[#2a2a2d]")
                            }
                            onClick={() => { handleSelectProduct(product) }}
                        >
                            <TableCell style={{ width: '15%' }}>{product.name}</TableCell>
                            <TableCell style={{ width: '5%' }}>
                                <div
                                    className={
                                        cn(
                                            "w-[65px] flex justify-center items-center rounded-md",
                                            product.cannabis?.type === "indica" && "bg-orange-700",
                                            product.cannabis?.type === "sativa" && "bg-green-700",
                                            product.cannabis?.type === "hybrid" && "bg-purple-700"
                                        )
                                    }
                                >
                                    <p className="uppercase font-bold text-xs">{product.cannabis?.type}</p>
                                </div>
                            </TableCell>
                            <TableCell style={{ width: '10%' }}>
                                <div className="flex flex-row gap-2">
                                    <div className="bg-gray-700 w-[70px] flex justify-center rounded-md py-1 items-center">
                                        <p className="text-xs font-semibold">{`THC: ${product.cannabis?.thc}`}</p>
                                    </div>
                                    <div className="bg-gray-700 w-[70px] flex justify-center rounded-md py-1 items-center">
                                        <p className="text-xs font-semibold">{`CBD: ${product.cannabis?.cbd}`}</p>
                                    </div>
                                </div>
                            </TableCell>
                            {/* <TableCell style={{ width: '15%' }}>
                                <p className="overflow-hidden text-ellipsis">{product.cannabis?.taste ?? "-"}</p>
                            </TableCell>
                            <TableCell style={{ width: '15%' }}>
                                <p className="overflow-hidden text-ellipsis">{product.cannabis?.feeling ?? "-"}</p>
                            </TableCell> */}
                            <TableCell style={{ width: '5%' }}>{product.cost ?? "-"}</TableCell>
                            <TableCell style={{ width: '5%' }}>{product.localPrice ?? "-"}</TableCell>
                            <TableCell style={{ width: '5%' }}>{product.price}</TableCell>
                            <TableCell style={{ width: '5%' }}>{product.stock ?? "x"}</TableCell>
                            <TableCell style={{ width: '3%' }}>
                                <div className={cn("w-[10px] h-[10px] rounded-full bg-green-500", product.isActive == false && "bg-red-500")}></div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}