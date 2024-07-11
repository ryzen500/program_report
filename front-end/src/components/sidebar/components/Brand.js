import React from "react";

// Chakra imports
import { Flex, useColorModeValue, Heading, Image } from "@chakra-ui/react";

// Custom components
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  // Chakra color mode
  let textColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column' py='20px'>
      <Flex align='center' justify='center' my='12px' px='10px'>
        <Image src='/images.png' alt='Yayasan Bala Keselamatan Logo' h='40px' mr='10px' />
        <Heading color={textColor} fontSize='2xl' h='40px' display='flex' alignItems='center'>
          Yayasan Bala Keselamatan
        </Heading>
      </Flex>
      <HSeparator/>
    </Flex>
  );
}

export default SidebarBrand;
