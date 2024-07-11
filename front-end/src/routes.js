import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
} from "react-icons/md";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/dataTables";
import RumahSakitTables from "views/admin/rumahSakits";
import MasterPelayanans from "views/admin/masterPelayanans";
import SubMasterPelayanans from "views/admin/subMasterPelayanans";
import ReportPelayanan from "views/admin/reportPelayanan";

import TransaksiPelayanans from "views/admin/transaksiPelayanans";


import RTL from "views/admin/rtl";

// Auth Imports
import SignInCentered from "views/auth/signIn";

const routes = [
  {
    name: " Dashboard",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    categories:"dashboard",

    component: MainDashboard,
  },
  // {
  //   name: "NFT Marketplace",
  //   layout: "/admin",
  //   path: "/nft-marketplace",
  //   icon: (
  //     <Icon
  //       as={MdOutlineShoppingCart}
  //       width='20px'
  //       height='20px'
  //       color='inherit'
  //     />
  //   ),
  //   component: NFTMarketplace,
  //   secondary: true,
  // },

   {
    name: "Master Hak Akses",
    layout: "/admin",
    path: "/master-hak-akses",
      icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    categories:"master",

    component: DataTables,
  },

     {
    name: "Master Rumah Sakit",
    layout: "/admin",
    path: "/master-rumah-sakit",
      icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    categories:"master",

    component: RumahSakitTables,
  },


     {
    name: "Master Pelayanan",
    layout: "/admin",
    path: "/master-pelayanan",
    categories:"master",

      icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    component: MasterPelayanans,
  },


     {
    name: " Master SubPelayanan",
    layout: "/admin",
    path: "/master-subpelayanan",
      icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    component: SubMasterPelayanans,
    categories:"master",

  },


     {
    name: "Transaksi Pelayanan",
    layout: "/admin",
    path: "/transaksi-pelayanan",
      icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    categories:"transaksi",

    component: TransaksiPelayanans,

  },
  // {
  //   name: "Data Tables",
  //   layout: "/admin",
  //   icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
  //   path: "/data-tables",
  //   component: DataTables,
  // },
  {
    name: "Laporan Pelayanan",
    layout: "/admin",
    path: "/profile",
    icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
    categories:"laporan",
    component: ReportPelayanan,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
    component: SignInCentered,
  },
  // {
  //   name: "RTL Admin",
  //   layout: "/rtl",
  //   path: "/rtl-default",
  //   icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
  //   component: RTL,
  // },
];

export default routes;
