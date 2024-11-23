import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Checkbox,
  useColorModeValue,
  Text
} from "@chakra-ui/react";
import axios from "axios";

export default function AddDataForm({ onSubmit, initialData }) {
  const [newData, setNewData] = useState({ 
    nama_hak_akses: "", 
    nama_lain_hak_akses: "",
    create: false,
    read: true,
    update: false,
    delete: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (initialData) {
      setNewData({
    nama_hak_akses: initialData[0].nama_hak_akses || "",
        nama_lain_hak_akses: initialData[0].nama_lain_hak_akses || "",
        create: initialData.create !== undefined ? initialData.create : false,
        read: initialData.read !== undefined ? initialData.read : true,
        update: initialData.update !== undefined ? initialData.update : false,
        delete: initialData.delete !== undefined ? initialData.delete : false
      });
    }
  }, [initialData]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewData({ 
      ...newData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    let response;

    try {
      const requestData = {
        nama_hak_akses: newData.nama_hak_akses,
        nama_lain_hak_akses: newData.nama_lain_hak_akses,
        create: newData.create,
        read: newData.read,
        update: newData.update,
        delete: newData.delete
      };

      if (initialData) {
        response = await axios.put(`${process.env.REACT_APP_API_BASE_URL_BACKEND}/hak_akses/${initialData[0].hak_akses_id}`, requestData, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } else {
        response = await axios.post(`${process.env.REACT_APP_API_BASE_URL_BACKEND}/hak_akses`, requestData, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
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
        <FormControl id="nama_hak_akses" mb="4">
          <FormLabel>Nama Hak Akses</FormLabel>
          <Input
            name="nama_hak_akses"
            value={newData.nama_hak_akses}
            onChange={handleFormChange}
            placeholder="Masukkan Nama Hak Akses"
            isDisabled={loading}
          />
        </FormControl>
        <FormControl id="nama_lain_hak_akses" mb="4">
          <FormLabel>Nama Lain Hak Akses</FormLabel>
          <Input
            name="nama_lain_hak_akses"
            value={newData.nama_lain_hak_akses}
            onChange={handleFormChange}
            placeholder="Masukkan Nama Lain Hak Akses"
            isDisabled={loading}
          />
        </FormControl>
        <FormControl id="create" mb="4">
          <Checkbox
            name="create"
            isChecked={newData.create}
            onChange={handleFormChange}
            isDisabled={loading}
          >
            Create
          </Checkbox>
        </FormControl>
        <FormControl id="read" mb="4">
          <Checkbox
            name="read"
            isChecked={newData.read}
            onChange={handleFormChange}
            isDisabled={loading}
          >
            Read
          </Checkbox>
        </FormControl>
        <FormControl id="update" mb="4">
          <Checkbox
            name="update"
            isChecked={newData.update}
            onChange={handleFormChange}
            isDisabled={loading}
          >
            Update
          </Checkbox>
        </FormControl>
        <FormControl id="delete" mb="4">
          <Checkbox
            name="delete"
            isChecked={newData.delete}
            onChange={handleFormChange}
            isDisabled={loading}
          >
            Delete
          </Checkbox>
        </FormControl>
        <Button type="submit" colorScheme="blue" isLoading={loading}>
          Simpan
        </Button>
        {error && <Text color="red.500" mt="4">{error}</Text>}
      </form>
    </Box>
  );
}
