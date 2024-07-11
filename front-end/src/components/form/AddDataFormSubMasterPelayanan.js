import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useColorModeValue,
  Text
} from "@chakra-ui/react";
import axios from "axios";

export default function AddDataFormRumahSakit({ onSubmit, initialData }) {
  const [newData, setNewDataPelayanan] = useState({ nama_subpelayanan: "", pelayanan_id: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pelayananList, setPelayananList] = useState([]);


  // Retrieve token from local storage
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPelayananList = async () => {
      try {

        console.log("token ",token);
        const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL_BACKEND}/master_pelayanan`,{
                headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
      );
      	// console.log("Dropdown List pelayanan",response);
        setPelayananList(response.data);
      } catch (error) {
        console.log("Fuck");
        setError("Failed to fetch pelayanan list. Please try again.");
      }
    };

    fetchPelayananList();

    if (initialData) {
     	console.log(initialData);
      setNewDataPelayanan({
        nama_subpelayanan: initialData.nama_subpelayanan || "",
        pelayanan_id: initialData.pelayanan_id || ""
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
      if (initialData) {
        // Edit existing data
      
      console.log(initialData);
      // let response
      	  response = await axios.put(`${process.env.REACT_APP_API_BASE_URL_BACKEND}/submaster_pelayanan/${initialData.subpelayanan_id}`, {
          nama_subpelayanan: newData.nama_subpelayanan,
          pelayanan_id: newData.pelayanan_id
        },{
                headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
      } else {
        // Add new data
        response = await axios.post(`${process.env.REACT_APP_API_BASE_URL_BACKEND}/submaster_pelayanan`, {
          nama_subpelayanan: newData.nama_subpelayanan,
          pelayanan_id: newData.pelayanan_id
        },{
                headers: {
                'Authorization': `Bearer ${token}`,
            },        });
      }
      onSubmit(response.data);
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
        <FormControl id="nama_subpelayanan" mb="4">
          <FormLabel>Nama Subpelayanan</FormLabel>
          <Input
            name="nama_subpelayanan"
            value={newData.nama_subpelayanan}
            onChange={handleFormChange}
            placeholder="Masukkan Nama Subpelayanan"
            isDisabled={loading}
          />
        </FormControl>

        <FormControl id="pelayanan_id" mb="4">
          <FormLabel>Pelayanan</FormLabel>
          <Select
            name="pelayanan_id"
            value={newData.pelayanan_id}
            onChange={handleFormChange}
            placeholder="Pilih Pelayanan"
            isDisabled={loading}
          >
            {pelayananList.map((pelayanan) => (
              <option key={pelayanan.pelayanan_id} value={pelayanan.pelayanan_id}>
                {pelayanan.nama_pelayanan}
              </option>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" colorScheme="blue" isLoading={loading}>
          Simpan
        </Button>
        {error && <Text color="red.500" mt="4">{error}</Text>}
      </form>
    </Box>
  );
}
