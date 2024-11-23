import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, FormControl, FormLabel, Select, Input } from '@chakra-ui/react';
import Swal from 'sweetalert2';

const Step1 = ({ nextStep, initialData }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useFormContext();
  const [rumahSakitOptions, setRumahSakitOptions] = useState([]);
  const [rumahSakitLogin, setRumahSakitLogin] = useState('');

  const { id } = useParams(); // Get the id from the URL

  // const selectedRumahSakit = watch('rumahSakit'); // Watch for changes in the rumahSakit selection

  // Retrieve token from local storage
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    // Retrieve rumah sakit login from local storage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.rumahsakit_id) {
      setRumahSakitLogin(user.rumahsakit_id);
      setValue('rumahSakit', user.rumahsakit_id); // Set initial value of rumahSakit in the form
    }

    // Fetch rumah sakit options from API
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
  }, [token, setValue]);

  useEffect(() => {
    if (!id) {
      // Fetch noformulir from API based on the selected rumah sakit or rumah sakit login if not editing
      const kodeRumahSakit = rumahSakitLogin;
      axios.post(`http://localhost/program_report/back-end/index.php/api/noformulirsdm`, {
        kode_rumahsakit: kodeRumahSakit
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then((response) => {
        setValue('noformulir', response.data.noformulir); // Set form value for noformulir
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  }, [rumahSakitLogin, token, setValue]);

  useEffect(() => {
    if (initialData) {
      // Set initial values from initialData when editing
      setValue('noformulir', initialData[0].noformulir);
      setValue('rumahSakit', rumahSakitLogin);
      setValue('tanggal', initialData[0].tanggal_transaksi);

      console.log("initialData ", rumahSakitLogin);
    }
  }, [initialData, setValue]);

  const onSubmit = (data) => {
    console.log("data", data);
    nextStep();
  };

  const onError = (errors) => {
    console.log(errors);
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
          <Input type="text" readOnly {...register('noformulir', { required: 'No Formulir is required' })} />
        </FormControl>

        <FormControl isInvalid={errors.rumahSakit}>
          <FormLabel>Pilih Rumah Sakit</FormLabel>
          <Select defaultValue={initialData ? initialData[0].rumahSakit : ''} {...register('rumahSakit', { required: 'Pilih Rumah Sakit is required' })}>
            {rumahSakitOptions.map((rumahSakit) => (
              <option key={rumahSakit.kode_rumahsakit} value={rumahSakit.kode_rumahsakit}>{rumahSakit.nama_rumahsakit}</option>
            ))}
          </Select>
        </FormControl>

        <FormControl mt={4} isInvalid={errors.tanggal}>
          <FormLabel>Tanggal</FormLabel>
          <Input type="date" defaultValue={initialData ? initialData[0].tanggal : ''} {...register('tanggal', { required: 'Tanggal is required' })} />
        </FormControl>
        
        <Button mt={4} type="submit">Next</Button>
      </form>
    </div>
  );
};

export default Step1;
