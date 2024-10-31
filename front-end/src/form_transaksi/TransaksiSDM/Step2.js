import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import axios from 'axios';
import { Button, Box, FormControl, FormLabel, Input, Heading, FormErrorMessage } from '@chakra-ui/react';
import Swal from 'sweetalert2';

const Step2 = ({ prevStep, nextStep, initialData }) => {
  const { control, handleSubmit, formState: { errors } } = useFormContext();
  const poliklinik = 3;
  const [subPelayananOptions, setSubPelayananOptions] = React.useState([]);
  const token = localStorage.getItem('token');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        let transaksiId;

        if (initialData) {
          transaksiId = initialData[0].transaksi_id;
          const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL_BACKEND}/editPoli_transaksi/${poliklinik}/${transaksiId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          setSubPelayananOptions(response.data);
        } else {
          const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL_BACKEND}/submaster_pelayananDetail/${poliklinik}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          setSubPelayananOptions(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [poliklinik, token, initialData]);

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
          <Heading as="h1" size="md" mb={4}>Poliklinik</Heading>
          {subPelayananOptions.map((subPelayanan, index) => (
            <CardInput key={index} subPelayanan={subPelayanan} control={control} errors={errors} />
          ))}
        </Box>
        <Button mt={4} onClick={prevStep}>Back</Button>
        <Button mt={4} type="submit">Next</Button>
      </form>
    </div>
  );
};

const CardInput = ({ subPelayanan, control, errors }) => {
  const formatNumber = (value) => {
    if (!value && value !== 0) {
      return ''; // Return empty string if value is undefined, null, or empty
    }
    // Format number with comma as thousands separator
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p="4" m="4">
      <Heading as="h4" size="md" mb={4}>{subPelayanan.nama_subpelayanan}</Heading>
      <FormControl>
        <Input type="hidden" {...control.register(`subPelayanan[${subPelayanan.subpelayanan_id}].subpelayanan_id`)} value={subPelayanan.subpelayanan_id} />
        <Input type="hidden" {...control.register(`subPelayanan[${subPelayanan.subpelayanan_id}].pelayanan_id`)} value={subPelayanan.pelayanan_id} />
        <Input type="hidden" {...control.register(`subPelayanan[${subPelayanan.subpelayanan_id}].keterangan`)} value={subPelayanan.nama_pelayanan} />
      </FormControl>
      <FormControl mt={4} isInvalid={errors.subPelayanan?.[subPelayanan.subpelayanan_id]?.jumlah}>
        <FormLabel>Jumlah</FormLabel>
        <Controller
          name={`subPelayanan[${subPelayanan.subpelayanan_id}].jumlah`}
          control={control}
          rules={{ required: 'Jumlah is required', valueAsNumber: true }}
          defaultValue={subPelayanan.jumlah || ''}
          render={({ field }) => (
            <Input
              {...field}
              value={formatNumber(field.value)}
              onChange={(e) => {
                const formattedValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                field.onChange(formattedValue === '' ? null : Number(formattedValue)); // Update field value
              }}
              type="text"
            />
          )}
        />
        {errors.subPelayanan?.[subPelayanan.subpelayanan_id]?.jumlah && (
          <FormErrorMessage>{errors.subPelayanan?.[subPelayanan.subpelayanan_id]?.jumlah.message}</FormErrorMessage>
        )}
      </FormControl>
    </Box>
  );
};

export default Step2;
