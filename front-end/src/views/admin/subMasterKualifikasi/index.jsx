/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";
import DevelopmentTable from "views/admin/dataTables/components/DevelopmentTable";
import CheckTable from "views/admin/dataTables/components/CheckTable";
import ColumnsTableMasterSubPelayanan from "views/admin/subMasterKualifikasi/components/ColumnsTableMasterSubPelayanan";
import ComplexTable from "views/admin/dataTables/components/ComplexTable";
import {
 columnsDataSubMasterKualifikasi
} from "views/admin/dataTables/variables/columnsData";
import tableDataDevelopment from "views/admin/dataTables/variables/tableDataDevelopment.json";
import tableDataCheck from "views/admin/dataTables/variables/tableDataCheck.json";
import tableDataColumns from "views/admin/dataTables/variables/tableDataColumns.json";
import tableDataComplex from "views/admin/dataTables/variables/tableDataComplex.json";
import React, {useEffect,useState} from "react";
import { fetchDataSubMasterPelayanan } from 'api/api.js';
export default function Settings() {
  // Chakra Color Mode


  const [tableDataPelayanan, setTableDataSubMasterPelayanan] = useState([]);


  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid>
      
        <ColumnsTableMasterSubPelayanan
          columnsData={columnsDataSubMasterKualifikasi}
          // tableData={tableDataPelayanan}
        />
        
      </SimpleGrid>
    </Box>
  );
}
