"use client";
import { useRouter, usePathname } from "next/navigation";
import { BoxIcon, CannabisLogo, DashboardIcon, LogOutIcon, ManageIcon, OrderIcon, ShopIcon } from "./icons";
import { useEffect, useState } from "react";
import { cn } from "@/utils/twHelper";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Sidebar() {
    const router = useRouter();
    const pathName = usePathname();

    const { data: session } = useSession();    

    const [activeMenu, setActiveMenu] = useState<number>(0);

    const menuClassName = "p-3 rounded-md hover:bg-gray-hover hover:cursor-pointer flex items-center justify-center";

    const handleNavigate = (path: string) => {
        router.push(path);
    };

    useEffect(() => {
        // Check the current path and update active menu accordingly
        if (pathName === "/shop") {
            setActiveMenu(1);
        } else if (pathName === "/stock") {
            setActiveMenu(3);
        } else if (pathName === "/orders") {
            setActiveMenu(2);
        } else if (pathName === "/manage") {
            setActiveMenu(4);
        } else {
            setActiveMenu(0);
        }
    }, [pathName]);

    return (
        <>
            {pathName !== "/login" && <div className="hidden md:block">
                {/* <div className="flex flex-col w-64 h-screen bg-gradient-to-b from-[#98e393] to-[#9dde9b]"> */}
                <div className="flex flex-col px-4 pt-4 h-screen bg-[#2a2a2d]">
                    <button onClick={() => { handleNavigate("/") }} className="flex items-center justify-center">
                        {/* <div
                            className="p-3 bg-cannabis rounded-md cursor-pointer"

                        >
                            <CannabisLogo width={45} height={45} />
                        </div> */}
                        <img src="/Image/broccolilab_logo.jpg" alt="logo" className="w-20 h-20 rounded-md" />
                    </button>
                    <div className="border-b border-gray-400 mt-6"></div>
                    <div className="flex flex-col py-6 gap-4 justify-between h-full">
                        <div className="flex flex-col gap-4">
                            <button
                                className={
                                    cn(`${menuClassName}`, activeMenu === 1 && "bg-gray-hover")
                                }
                                onClick={() => { handleNavigate("/shop") }}
                            >
                                <div className="flex flex-col items-center justify-center">
                                    <ShopIcon width={45} height={45} color="#a3a5b6" />
                                    <p className="text-xs font-bold">SHOP</p>
                                </div>
                            </button>
                            <button
                                className={
                                    cn(`${menuClassName}`, activeMenu === 2 && "bg-gray-hover")
                                }
                                onClick={() => { handleNavigate("/orders") }}
                            >
                                <div className="flex flex-col items-center justify-center">
                                    <OrderIcon width={35} height={45} color="#a3a5b6" />
                                    <p className="text-xs font-bold">ORDERS</p>
                                </div>
                            </button>
                            {(session?.user.role === "manager" || session?.user.role === "owner") && <button
                                className={
                                    cn(`${menuClassName}`, activeMenu === 3 && "bg-gray-hover")
                                }
                                onClick={() => { handleNavigate("/stock") }}
                            >
                                <div className="flex flex-col items-center justify-center">
                                    <BoxIcon width={35} height={45} color="#a3a5b6" />
                                    <p className="text-xs font-bold">STOCK</p>
                                </div>
                            </button>}
                            {session?.user.role === "owner" && <button
                                className={
                                    cn(`${menuClassName}`, activeMenu === 4 && "bg-gray-hover")
                                }
                                onClick={() => { handleNavigate("/manage") }}
                            >
                                <div className="flex flex-col items-center justify-center">
                                    <ManageIcon width={35} height={45} color="#a3a5b6" />
                                    <p className="text-xs font-bold">MANAGE</p>
                                </div>
                            </button>}
                            {/* <button
                                className={
                                    cn(`${menuClassName}`, activeMenu === 4 && "bg-gray-hover")
                                }
                                onClick={() => { handleNavigate("/dashboard") }}
                            >
                                <DashboardIcon width={35} height={45} color="#a3a5b6" />
                            </button> */}
                        </div>
                        <div role="button" onClick={() => { signOut() }} className={`${menuClassName} hover:bg-red-600`}>
                            <LogOutIcon width={35} height={45} color="#a3a5b6" />
                        </div>
                    </div>
                </div>
            </div>
            }
        </>
    )
}