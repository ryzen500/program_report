import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Flex, Circle, Button } from '@chakra-ui/react';
import Swal from 'sweetalert2';
import Step1 from './TransaksiSDM/Step1';
import Step2 from './TransaksiSDM/Step2';
import Step3 from './TransaksiSDM/Step3';
import Step4 from './TransaksiSDM/Step4';
import Step5 from './TransaksiSDM/Step5';
import Step6 from './TransaksiSDM/Step6';
import Step7 from './TransaksiSDM/Step7';
import Step8 from './TransaksiSDM/Step8';
import Step9 from './TransaksiSDM/Step9';
import Step10 from './TransaksiSDM/Step10';
import Step11 from './TransaksiSDM/Step11';
import Step12 from './TransaksiSDM/Step12';

const WizardFormSDM = () => {
  const methods = useForm();
  const { id } = useParams(); // Get the id from the URL
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionData, setTransactionData] = useState(null); // State to hold transaction data

  // Retrieve token from local storage
  const token = localStorage.getItem('token');

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  useEffect(() => {

    console.log("Id", id);
    if (id) {
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL_BACKEND}/report_data/2023/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          const initialData = response.data;
          console.log("response", initialData);
          setTransactionData(initialData);
          // methods.reset(initialData); // Set initial data to form fields
        })
        .catch(error => {
          console.error('Error fetching transaction data:', error);
        });
    }
  }, [id, token, methods]);

  const onSubmit = async () => {
    const formData = methods.getValues();


console.log("Form Data ", formData);
    const requestBody = {
      // transaksi_id: id, // Add transactionId to the request body
      kode_rumahsakit: formData.rumahSakit,
      tanggal_transaksi: formData.tanggal,
      keterangan: formData.keterangan || '-',
      details: formData.subPelayanan.map((sub, index) => ({
        subpelayanan_id: sub.subpelayanan_id,
        pelayanan_id: sub.pelayanan_id,
        tanggal_transaksi: formData.tanggal,  
        jumlah: parseFloat(sub.jumlah),
        keterangan: sub.keterangan || `Detail description ${index + 1}`,
        kode_rumahsakit: formData.rumahSakit,
      })),
    };

    try {
      setIsSubmitting(true);

      const endpoint = id 
        ? `${process.env.REACT_APP_API_BASE_URL_BACKEND}/transaksi_pelayanan/${id}` // Edit endpoint
        : `${process.env.REACT_APP_API_BASE_URL_BACKEND}/transaksi_pelayanan`; // Add endpoint

      const method = id ? 'put' : 'post';

      const response = await axios({
        method: method,
        url: endpoint,
        data: requestBody,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Form Data', requestBody);
      setIsSubmitting(false);
      Swal.fire('Success!', 'Data has been saved successfully.', 'success');

      history.push('/success');
    } catch (error) {
      console.error('Error saving data:', error);
      setIsSubmitting(false);
      Swal.fire('Error!', 'There was an error saving the data.', 'error');
    }
  };

  const renderStep = () => {
    const stepProps = {
      prevStep,
      nextStep,
      initialData: transactionData, // Pass transactionData as initialData to each step
    };

    switch (currentStep) {
      case 1:
        return <Step1 {...stepProps} />;
      case 2:
        return <Step2 {...stepProps} />;
      case 3:
        return <Step3 {...stepProps} />;
      case 4:
        return <Step4 {...stepProps} />;
      case 5:
        return <Step5 {...stepProps} />;
      case 6:
        return <Step6 {...stepProps} />;
      case 7:
        return <Step7 {...stepProps} />;
      case 8:
        return <Step8 {...stepProps} />;
      case 9:
        return <Step9 {...stepProps} />;
      case 10:
        return <Step10 {...stepProps} />;
      case 11:
        return <Step11 {...stepProps} />;
      case 12:
        return <Step12 {...stepProps} onSubmit={onSubmit} isSubmitting={isSubmitting} />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <Box w="100%">
        <ProgressBubble currentStep={currentStep} />
        <Box mt={4}>
          {renderStep()}
          {currentStep === 12 && (
            <Button onClick={onSubmit} isLoading={isSubmitting} loadingText="Submitting...">
              Submit
            </Button>
          )}
        </Box>
      </Box>
    </FormProvider>
  );
};

const ProgressBubble = ({ currentStep }) => {
  const steps = [
    { step: 1, title: 'Step 1' },
    { step: 2, title: 'Step 2' },
    { step: 3, title: 'Step 3' },
    { step: 4, title: 'Step 4' },
    { step: 5, title: 'Step 5' },
    { step: 6, title: 'Step 6' },
    { step: 7, title: 'Step 7' },
    { step: 8, title: 'Step 8' },
    { step: 9, title: 'Step 9' },
    { step: 10, title: 'Step 10' },
    { step: 11, title: 'Step 11' },
    { step: 12, title: 'Step 12' },
  ];

  return (
    <Flex justify="center" mb={4}>
      {steps.map(({ step, title }) => (
        <Flex key={step} align="center">
          <Circle size="40px" bg={currentStep >= step ? 'blue.500' : 'gray.300'} color="white">
            {step}
          </Circle>
          {step !== steps.length && <Box h="2px" w="40px" bg="gray.300" mx={2} />}
        </Flex>
      ))}
    </Flex>
  );
};

export default WizardFormSDM;
