import React, { useEffect, useState } from 'react';
import { useFormContext, useForm } from 'react-hook-form';
import axios from 'axios';
import { Button, FormControl, FormLabel, Select, Input } from '@chakra-ui/react';
import Swal from 'sweetalert2';

const Step1 = ({ nextStep }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useFormContext();
  const [rumahSakitOptions, setRumahSakitOptions] = useState([]);
  const [noFormulir, setNoFormulir] = useState('');

  const selectedRumahSakit = watch('rumahSakit'); // Watch for changes in the rumahSakit selection

  // Retrieve token from local storage
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    // Ambil data rumah sakit dari API
    axios.get(`${process.env.REACT_APP_API_BASE_URL_BACKEND}/rumah_sakit`, {
          headers: {
                'Authorization': `Bearer ${token}`,
            },
      })
      .then((response) => {
        setRumahSakitOptions(response.data); // Sesuaikan dengan struktur data yang diterima dari API
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [token]);

  useEffect(() => {
    if (selectedRumahSakit) {
      // Fetch noformulir from API based on the selected rumah sakit
      axios.post(`http://localhost/program_report/back-end/index.php/api/getFormulir`,{
       kode_rumahsakit: selectedRumahSakit
      }, {
          headers: {
                'Authorization': `Bearer ${token}`,
            },
      })
        .then((response) => {
          setNoFormulir(response.data.noformulir); // Update noformulir state with the received data
          setValue('noformulir', response.data.noformulir); // Set form value for noformulir
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [selectedRumahSakit, token, setValue]);

  const onSubmit = (data) => {
    nextStep();
  };

  const onError = (errors) => {
    if (errors.noformulir) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errors.noformulir.message,
      });
    } else if (errors.rumahSakit) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errors.rumahSakit.message,
      });
    } else if (errors.tanggal) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errors.tanggal.message,
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <FormControl mt={4} isInvalid={errors.noformulir}>
          <FormLabel>No Formulir</FormLabel>
          <Input type="text" value={noFormulir} readOnly {...register('noformulir', { required: 'No Formulir is required' })} />
        </FormControl>

        <FormControl isInvalid={errors.rumahSakit}>
          <FormLabel>Pilih Rumah Sakit</FormLabel>
          <Select {...register('rumahSakit', { required: 'Pilih Rumah Sakit is required' })}>
            {rumahSakitOptions.map((rumahSakit) => (
              <option key={rumahSakit.kode_rumahsakit} value={rumahSakit.kode_rumahsakit}>{rumahSakit.nama_rumahsakit}</option>
            ))}
          </Select>
        </FormControl>

        <FormControl mt={4} isInvalid={errors.tanggal}>
          <FormLabel>Tanggal</FormLabel>
          <Input type="date" {...register('tanggal', { required: 'Tanggal is required' })} />
        </FormControl>
        
        <Button mt={4} type="submit">Next</Button>
      </form>
    </div>
  );
};

export default Step1;
