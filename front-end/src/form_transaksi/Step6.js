import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import axios from 'axios';
import { Button, Box, FormControl, FormLabel, Input, Heading } from '@chakra-ui/react';
import Swal from 'sweetalert2';

const Step6 = ({ prevStep, nextStep }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useFormContext();
  const poliklinik = watch('poliklinik');
  const [subPelayananOptions, setSubPelayananOptions] = useState([]);

  // Retrieve token from local storage
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Ambil data subpelayanan dari API berdasarkan poliklinik yang dipilih
    axios.get(`${process.env.REACT_APP_API_BASE_URL_BACKEND}/submaster_pelayananDetail/11`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        setSubPelayananOptions(response.data); // Sesuaikan dengan struktur data yang diterima dari API
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [poliklinik, token]);

  const onSubmit = (data) => {
    nextStep();
  };

  const onError = (errors) => {
    if (errors.subPelayanan) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all required fields.',
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Box>
          <Heading as="h1" size="md" mb={4}>FisioTerapi</Heading>
          {subPelayananOptions.map((subPelayanan, index) => (
            <CardInput key={index} subPelayanan={subPelayanan} register={register} errors={errors} />
          ))}
        </Box>
        <Button mt={4} onClick={prevStep}>Back</Button>
        <Button mt={4} type="submit">Next</Button>
      </form>
    </div>
  );
};

const CardInput = ({ subPelayanan, register, errors }) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p="4" m="4">
      <Heading as="h4" size="md" mb={4}>{subPelayanan.nama_subpelayanan}</Heading>
      <FormControl>
        <Input {...register(`subPelayanan[${subPelayanan.subpelayanan_id}].subpelayanan_id`)} value={subPelayanan.subpelayanan_id} type="hidden" />
        <Input {...register(`subPelayanan[${subPelayanan.subpelayanan_id}].pelayanan_id`)} value={subPelayanan.pelayanan_id} type="hidden" />
        <Input {...register(`subPelayanan[${subPelayanan.subpelayanan_id}].keterangan`)} value={subPelayanan.nama_pelayanan} type="hidden" />
      </FormControl>
      <FormControl mt={4} isInvalid={errors.subPelayanan?.[subPelayanan.subpelayanan_id]?.jumlah}>
        <FormLabel>Jumlah</FormLabel>
        <Input 
          {...register(`subPelayanan[${subPelayanan.subpelayanan_id}].jumlah`, { 
            required: 'Jumlah is required', 
            valueAsNumber: true 
          })} 
          defaultValue={1} 
          type="number" 
        />
      </FormControl>
    </Box>
  );
};

export default Step6;
