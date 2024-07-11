import React from "react";
import { Icon } from "@chakra-ui/react";
import { MdBarChart, MdPerson, MdHome, MdLock, MdOutlineShoppingCart } from "react-icons/md";
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/dataTables";
import RumahSakitTables from "views/admin/rumahSakits";
import MasterPelayanans from "views/admin/masterPelayanans";
import SubMasterPelayanans from "views/admin/subMasterPelayanans";
import TransaksiPelayanans from "views/admin/transaksiPelayanans";
import RTL from "views/admin/rtl";
import SignInCentered from "views/auth/signIn";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  {
    name: "Master Hak Akses",
    layout: "/admin",
    path: "/master-hak-akses",
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    component: DataTables,
    category: "master",
  },
  {
    name: "Master Rumah Sakit",
    layout: "/admin",
    path: "/master-rumah-sakit",
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    component: RumahSakitTables,
    category: "master",
  },
  {
    name: "Master Pelayanan",
    layout: "/admin",
    path: "/master-pelayanan",
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    component: MasterPelayanans,
    category: "master",
  },
  {
    name: "Master SubPelayanan",
    layout: "/admin",
    path: "/master-subpelayanan",
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    component: SubMasterPelayanans,
    category: "master",
  },
  {
    name: "Transaksi Pelayanan",
    layout: "/admin",
    path: "/transaksi-pelayanan",
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    component: TransaksiPelayanans,
    category: "transaksi",
  },
];

export default routes;
