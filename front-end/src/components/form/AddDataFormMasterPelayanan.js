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
  const [newData, setNewDataPelayanan] = useState({ nama_pelayanan: ""});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

    // Retrieve token from local storage
  const token = localStorage.getItem('token');


  useEffect(() => {
    if (initialData) {
      setNewDataPelayanan({
        nama_pelayanan: initialData[0].nama_pelayanan || ""
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

      console.log("initialData",initialData[0].pelayanan_id);
        response = await axios.put(`http://localhost/program_report/back-end/index.php/api/master_pelayanan/${initialData[0].pelayanan_id}`, {
          nama_pelayanan: newData.nama_pelayanan
        },{
                headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
      } else {
        // Add new data
        response = await axios.post("http://localhost/program_report/back-end/index.php/api/master_pelayanan", {
          nama_pelayanan: newData.nama_pelayanan
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
        <FormControl id="nama_pelayanan" mb="4">
          <FormLabel>Nama Pelayanan</FormLabel>
          <Input
            name="nama_pelayanan"
            value={newData.nama_pelayanan}
            onChange={handleFormChange}
            placeholder="Masukkan Nama Pelayanan"
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
