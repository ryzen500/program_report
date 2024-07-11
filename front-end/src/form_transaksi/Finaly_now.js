import React from 'react';
import { Button } from '@chakra-ui/react';

const Step8 = ({ prevStep, onSubmit, isSubmitting }) => {
  return (
    <>
      <Button onClick={prevStep} disabled={isSubmitting}>Back</Button>
    </>
  );
};

export default Step8;
