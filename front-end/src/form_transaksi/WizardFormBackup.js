import React, { useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form'; // Import useFormContext
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Box, Flex, Text, Circle, Button } from '@chakra-ui/react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';
import Step7 from './Step7';
import Step8 from './Step8';

const WizardForm = () => {
  const methods = useForm();
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false); // State to manage form submission state

  // Retrieve token from local storage
  const token = localStorage.getItem('token');

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const onSubmit = async () => {
    const formData = methods.getValues(); // Get all form data

    try {
      // setIsSubmitting(true); // Set submitting state to true

      // const endpoint = 'http://localhost/program_report/back-end/index.php/api/transaksi_pelayanan'; // Replace with your actual API endpoint

      // const response = await axios.post(endpoint, formData, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      console.log("Form Data ", formData);
      // console.log('Data saved successfully:', response.data);
      // setIsSubmitting(false); // Reset submitting state
      // history.push('/success'); // Navigate to success page or handle success state
    } catch (error) {
      console.error('Error saving data:', error);
      // setIsSubmitting(false); // Reset submitting state on error
      // Handle error state, show message to user, etc.
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 nextStep={nextStep} />;
      case 2:
        return <Step2 prevStep={prevStep} nextStep={nextStep} />;
      case 3:
        return <Step3 prevStep={prevStep} nextStep={nextStep} />;
      case 4:
        return <Step4 prevStep={prevStep} nextStep={nextStep} />;
      case 5:
        return <Step5 prevStep={prevStep} nextStep={nextStep} />;
      case 6:
        return <Step6 prevStep={prevStep} nextStep={nextStep} />;
      case 7:
        return <Step7 prevStep={prevStep} nextStep={nextStep} />;
      case 8:
        return <Step8 prevStep={prevStep} onSubmit={onSubmit} isSubmitting={isSubmitting} />;
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
          {/* Display button to log all form values */}
          {currentStep === 8 && (
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
    { step: 8, title: 'Step 8' }
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

export default WizardForm;
