import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useColorModeValue,
  Text
} from "@chakra-ui/react";
import axios from "axios";

export default function AddDataFormRumahSakit({ onSubmit, initialData }) {
  const [newData, setNewDataRumahSakit] = useState({ nama_rumahsakit: "", kode_bpjs_rumahsakit: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Retrieve token from local storage
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (initialData) {
      setNewDataRumahSakit({
        nama_rumahsakit: initialData[0].nama_rumahsakit || "",
        kode_bpjs_rumahsakit: initialData[0].kode_bpjs_rumahsakit || ""
      });
    }
  }, [initialData]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewDataRumahSakit({ ...newData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
      let response;

    try {


      console.log("initialData",initialData);
      console.log("newData",newData);
  if (initialData) {
        // Edit existing data


      console.log("initialData",initialData[0].kode_rumahsakit);
        response = await axios.put(`${process.env.REACT_APP_API_BASE_URL_BACKEND}/rumah_sakit/${initialData[0].kode_rumahsakit}`, {
          nama_rumahsakit: newData.nama_rumahsakit,
          kode_bpjs_rumahsakit: newData.kode_bpjs_rumahsakit,
        },{
                headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
      } else {
        // Add new data
        response = await axios.post(`${process.env.REACT_APP_API_BASE_URL_BACKEND}/rumah_sakit`, {
          nama_rumahsakit: newData.nama_rumahsakit,
          kode_bpjs_rumahsakit: newData.kode_bpjs_rumahsakit,
        },{
                headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
      }
      onSubmit(response.data);
      // setNewData({ nama_hak_akses: "", nama_lain_hak_akses: "" });
    } catch (error) {
      setError("Failed to save data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cardBackground = useColorModeValue("white");

  return (
    <Box mb="16px" p="4" borderWidth="1px" borderRadius="md" backgroundColor={cardBackground}>
      <form onSubmit={handleFormSubmit}>
        <FormControl id="nama_rumahsakit" mb="4">
          <FormLabel>Nama Rumah Sakit</FormLabel>
          <Input
            name="nama_rumahsakit"
            value={newData.nama_rumahsakit}
            onChange={handleFormChange}
            placeholder="Masukkan Nama Rumah Sakit"
            isDisabled={loading}
          />
        </FormControl>
        <FormControl id="kode_bpjs_rumahsakit" mb="4">
          <FormLabel>Kode BPJS Rumah Sakit </FormLabel>
          <Input
            name="kode_bpjs_rumahsakit"
            value={newData.kode_bpjs_rumahsakit}
            onChange={handleFormChange}
            placeholder="Masukkan Kode BPJS Rumah Sakit"
            isDisabled={loading}
          />
        </FormControl>
        <Button type="submit" colorScheme="blue" isLoading={loading}>
          Simpan
        </Button>
        {error && <Text color="red.500" mt="4">{error}</Text>}
      </form>
    </Box>
  );
}
