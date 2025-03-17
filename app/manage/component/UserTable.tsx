import { IShop, IUser } from "@/interface/general.interface";
import { cn } from "@/utils/twHelper";
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell
} from "@heroui/react"

interface UserTableProps {
    users: IUser[];
    shops: IShop[];
    handleSelectUser: (user: IUser) => void;
}

export default function UserTable({ users, shops, handleSelectUser }: UserTableProps) {
    const tableHeaderClass = "text-cannabis";

    const getShopName = (shopId: string[]) => {
        return (
            <div className="flex flex-row gap-1">
                {shopId.map(id => (
                    <span className="text-xs bg-cannabis text-black rounded-md px-2 text-nowrap" key={id}>{shops.find(shop => shop.id === id)?.name}</span>
                ))}
            </div>
        );
    };

    return (
        <div>
            <Table aria-label="Example static collection table" style={{ width: '100%' }}>
                <TableHeader>
                    <TableColumn className={`${tableHeaderClass}`} >NAME</TableColumn>
                    <TableColumn className={`${tableHeaderClass}`} >ROLE</TableColumn>
                    <TableColumn className={`${tableHeaderClass}`} >E-MAIL</TableColumn>
                    <TableColumn className={`${tableHeaderClass}`} >SHOP</TableColumn>
                    <TableColumn className={`${tableHeaderClass}`} >{""}</TableColumn>
                </TableHeader>
                <TableBody>
                    {users.map((user, index) => (
                        <TableRow
                            key={user.id}
                            className={
                                cn("cursor-pointer hover:bg-gray-hover", index % 2 !== 0 && "bg-[#2a2a2d]")
                            }
                            onClick={() => { handleSelectUser(user) }}
                        >
                            <TableCell style={{ width: '15%' }}>{user.name}</TableCell>
                            <TableCell style={{ width: '10%' }} className="capitalize">{user.role}</TableCell>
                            <TableCell style={{ width: '15%' }}>{user.email}</TableCell>
                            <TableCell style={{ width: '30%' }}>{getShopName(user.shopId)}</TableCell>
                            <TableCell style={{ width: '3%' }}>
                                <div className={cn("w-[10px] h-[10px] rounded-full bg-green-500", user.isActive == false && "bg-red-500")}></div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}