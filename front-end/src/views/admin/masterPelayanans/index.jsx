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
import ColumnsTableMasterPelayanan from "views/admin/masterPelayanans/components/ColumnsTableMasterPelayanan.js";
import ComplexTable from "views/admin/dataTables/components/ComplexTable";
import {
 columnsDataMasterPelayanan
} from "views/admin/dataTables/variables/columnsData";
import tableDataDevelopment from "views/admin/dataTables/variables/tableDataDevelopment.json";
import tableDataCheck from "views/admin/dataTables/variables/tableDataCheck.json";
import tableDataColumns from "views/admin/dataTables/variables/tableDataColumns.json";
import tableDataComplex from "views/admin/dataTables/variables/tableDataComplex.json";
import React, {useEffect,useState} from "react";
import { fetchDataMasterPelayanan } from 'api/api.js';
export default function Settings() {
  // Chakra Color Mode


  const [tableDataMasterPelayanan, setTableDataMasterPelayanan] = useState([]);
  const token = "pHjjnMh9jSHr76h1EYcG6Wn/CyizGqBvg1YkytaiYn1sp+Mlclt8N90X5FWW2zoWNbentzn7FtFGlDlY/Pc2yg=="; // Ganti dengan token yang sebenarnya

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchDataMasterPelayanan(token);
        setTableDataMasterPelayanan(data);
      } catch (error) {
        // Tangani error di sini jika diperlukan
      }
    };

    getData();
  }, [token]);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid>
      
        <ColumnsTableMasterPelayanan
          columnsData={columnsDataMasterPelayanan}
          tableData={tableDataMasterPelayanan}
        />
        
      </SimpleGrid>
    </Box>
  );
}
