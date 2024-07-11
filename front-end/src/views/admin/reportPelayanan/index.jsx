import React, { useEffect, useState } from "react";
import axios from "axios";
import ReportPelayanan from 'report/ReportPelayanan.js';
import ColumnsTable from "views/admin/dataTables/components/ColumnsTable";


export default function Settings() {
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL_BACKEND}/report_data/2023`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("API Response:", response.data); // Debug log

        if (Array.isArray(response.data)) {
          const formattedData = formatData(response.data);
          setGroupedData(formattedData);
        } else {
          console.error("Received data is not an array:", response.data);
          throw new Error("Data format is incorrect");
        }
      } catch (error) {
        setError("There was an error fetching the data!");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const formatData = (data) => {
    const grouped = data.reduce((acc, curr) => {
      const mainService = curr.nama_pelayanan;
      const subService = {
        nama_subpelayanan: curr.nama_subpelayanan,
        jumlahTahun: curr.jumlahTahun || 0,
        rataRataBulan: curr.rataRataBulan || 0,
        bulanTahunDepan: curr.bulanTahunDepan ? curr.bulanTahunDepan : Array(12).fill(0),
        jumlah: curr.jumlah || 0,
      };

      if (!acc[mainService]) {
        acc[mainService] = [];
      }
      acc[mainService].push(subService);

      return acc;
    }, {});
    return grouped;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="App">
      {/*<h1>Report Data</h1>*/}
      {/*<ReportPelayanan groupedData={groupedData} />*/}
    </div>
  );
}
