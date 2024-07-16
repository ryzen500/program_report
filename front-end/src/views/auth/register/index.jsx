import React, { useState, useEffect } from "react";
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
import Select from "react-select";  // Import react-select
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import Swal from "sweetalert2";

function Register() {
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const [namaUser, setNamaUser] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rumahSakitOptions, setRumahSakitOptions] = useState([]);
  const [selectedRumahSakit, setSelectedRumahSakit] = useState(null);
  const [hakAkses, setHakAkses] = useState("");

  const history = useHistory();

  useEffect(() => {
    const fetchRumahSakit = async () => {
      try {
        const response = await axios.get(`http://localhost/program_report/back-end/index.php/api/data_rumah_sakit`);
        const options = response.data.map(rs => ({ value: rs.kode_rumahsakit, label: rs.nama_rumahsakit }));
        setRumahSakitOptions(options);
      } catch (error) {
        console.error('Error fetching rumah sakit options:', error);
      }
    };

    fetchRumahSakit();
  }, []);

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL_BACKEND}/register`, {
        nama_user: namaUser,
        username,
        password,
        rumahsakit_id: selectedRumahSakit.value,
        hak_akses_id: 23
      });

      console.log("Response ", response);
      Swal.fire('Success!', 'Registration successful.', 'success').then(() => {
        history.push('/sign-in'); // Change to your dashboard route
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Registration failed', 'error');
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
            Register
          </Heading>
        </Box>
        <FormControl>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            mb="8px"
          >
            Nama User<Text color={brandStars}>*</Text>
          </FormLabel>
          <Input
            isRequired={true}
            variant="auth"
            fontSize="sm"
            type="text"
            placeholder="Masukkan Nama User"
            mb="24px"
            fontWeight="500"
            size="lg"
            value={namaUser}
            onChange={(e) => setNamaUser(e.target.value)}
          />
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
          <FormLabel
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            display="flex"
          >
            Rumah Sakit<Text color={brandStars}>*</Text>
          </FormLabel>
          <Select
            placeholder="Pilih Rumah Sakit"
            mb="24px"
            options={rumahSakitOptions}
            value={selectedRumahSakit}
            onChange={setSelectedRumahSakit}
            isSearchable
          />
          <FormLabel
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            display="flex"
          >
            Hak Akses<Text color={brandStars}>*</Text>
          </FormLabel>
          <Select
            placeholder="Pilih Hak Akses"
            mb="24px"
            onChange={(e) => setHakAkses(e.target.value)}
          >
            <option value="1">Admin</option>
            <option value="2">User</option>
            <option value="3">Guest</option>
            {/* Add other hak akses options as needed */}
          </Select>
          <Button
            fontSize="sm"
            variant="brand"
            fontWeight="500"
            w="100%"
            h="50"
            mb="24px"
            onClick={handleRegister}
          >
            Register
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
            Sudah punya akun?
            <NavLink to="/auth/sign-in">
              <Text color={textColorBrand} as="span" ms="5px" fontWeight="500">
                Sign In
              </Text>
            </NavLink>
          </Text>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default Register;
