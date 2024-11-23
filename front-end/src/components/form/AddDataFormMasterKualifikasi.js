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

export default function AddDataFormMasterKualifikasi({ onSubmit, initialData }) {
  const [newData, setNewDataPelayanan] = useState({ nama_kualifikasi: ""});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

    // Retrieve token from local storage
  const token = localStorage.getItem('token');


  useEffect(() => {

    if (initialData) {
    console.log("initialData" , initialData);
      setNewDataPelayanan({
        nama_kualifikasi: initialData.nama_kualifikasi || ""
      });
    }
  }, [initialData]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewDataPelayanan({ ...newData, [name]: value });
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
      console.log("Kick 1");

      console.log("initialData",initialData);
        response = await axios.put(`${process.env.REACT_APP_API_BASE_URL_BACKEND}/master_kualifikasi/${initialData.kualifikasi_id}`, {
          nama_kualifikasi: newData.nama_kualifikasi
        },{
                headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
      } else {
        // Add new data
        response = await axios.post(`${process.env.REACT_APP_API_BASE_URL_BACKEND}/master_kualifikasi`, {
          nama_kualifikasi: newData.nama_kualifikasi
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
        <FormControl id="nama_kualifikasi" mb="4">
          <FormLabel>Nama Kualifikasi</FormLabel>
          <Input
            name="nama_kualifikasi"
            value={newData.nama_kualifikasi}
            onChange={handleFormChange}
            placeholder="Masukkan Nama Kualifikasi"
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
