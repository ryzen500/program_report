// Chakra imports
import { Box, Flex } from "@chakra-ui/react";
import PropTypes from "prop-types";
import React from "react";
import FixedPlugin from "components/fixedPlugin/FixedPlugin";

function AuthIllustration({ children, illustrationBackground }) {
  return (
    <Flex
      position="relative"
      minH="100vh"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      bgImage={illustrationBackground}
      bgSize="cover"
      bgPosition="center"
      w="100%"
      h="100%"
    >
      <Flex
        w="100%"
        maxW="500px"
        mx="auto"
        pt="0px"
        px={{ lg: "30px", xl: "0px" }}
        ps={{ xl: "70px" }}
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        {children}
      </Flex>
      <FixedPlugin />
    </Flex>
  );
}

AuthIllustration.propTypes = {
  illustrationBackground: PropTypes.string,
  image: PropTypes.any,
};

export default AuthIllustration;
