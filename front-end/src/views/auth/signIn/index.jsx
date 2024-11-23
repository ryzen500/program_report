import React, { useState } from "react";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import Swal from "sweetalert2";

function SignIn() {
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  const handleSignIn = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL_BACKEND}/login`, {
        username,
        password
      });

      const { token, hak_akses,user } = response.data;

      // Set token and access rights in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('hak_akses', JSON.stringify(hak_akses));
      localStorage.setItem('user', JSON.stringify(user));


      Swal.fire('Success!', 'Data has been saved successfully.', 'success').then(() => {
        history.push('/dashboard'); // Change to your dashboard route
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Sign in failed', 'error');
    }
  };

  return (
    <DefaultAuth illustrationBackground="url_to_your_background_image">
      <Flex
        w={{ base: "100%", md: "420px" }}
        p={8}
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        flexDirection="column"
        alignItems="center"
        bg="white"
      >
        <Box mb={4}>
          <Heading color={textColor} fontSize="36px" mb="10px">
            Sign In
          </Heading>
        </Box>
        <Flex align="center" mb="25px" w="100%">
          <HSeparator />
          <Text color="gray.400" mx="14px">
            or
          </Text>
          <HSeparator />
        </Flex>
        <FormControl>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            mb="8px"
          >
            Username<Text color={brandStars}>*</Text>
          </FormLabel>
          <Input
            isRequired={true}
            variant="auth"
            fontSize="sm"
            type="text"
            placeholder="Masukkan Username"
            mb="24px"
            fontWeight="500"
            size="lg"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FormLabel
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            display="flex"
          >
            Password<Text color={brandStars}>*</Text>
          </FormLabel>
          <InputGroup size="md">
            <Input
              isRequired={true}
              fontSize="sm"
              placeholder="Masukkan Password"
              mb="24px"
              size="lg"
              type={show ? "text" : "password"}
              variant="auth"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement display="flex" alignItems="center" mt="4px">
              <Icon
                color={textColorSecondary}
                _hover={{ cursor: "pointer" }}
                as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                onClick={handleClick}
              />
            </InputRightElement>
          </InputGroup>
          <Flex justifyContent="space-between" align="center" mb="24px">
            <FormControl display="flex" alignItems="center">
              <Checkbox id="remember-login" colorScheme="brandScheme" me="10px" />
              <FormLabel
                htmlFor="remember-login"
                mb="0"
                fontWeight="normal"
                color={textColor}
                fontSize="sm"
              >
                Keep me logged in
              </FormLabel>
            </FormControl>
          </Flex>
          <Button
            fontSize="sm"
            variant="brand"
            fontWeight="500"
            w="100%"
            h="50"
            mb="24px"
            onClick={handleSignIn}
          >
            Sign In
          </Button>
        </FormControl>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="start"
          maxW="100%"
          mt="0px"
        >
          <Text color={textColorDetails} fontWeight="400" fontSize="14px">
            Belum terdaftar ?
            <NavLink to="/auth/sign-up">
              <Text color={textColorBrand} as="span" ms="5px" fontWeight="500">
                Mendaftar
              </Text>
            </NavLink>
          </Text>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
