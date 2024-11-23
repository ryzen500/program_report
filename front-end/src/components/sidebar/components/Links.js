import { Box, Flex, Stack, Text, Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MdBarChart, MdKeyboardArrowDown } from "react-icons/md"; // Import specific icons instead of all

function Links({ routes }) {
  const location = useLocation();
  const activeColor = "gray.700";
  const inactiveColor = "secondaryGray.600";
  const activeIcon = "brand.500";
  const textColor = "secondaryGray.500";
  const brandColor = "brand.500";

  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  const renderCategoryLinks = (category) => {
    return routes
      .filter((route) => route.categories === category)
      .map((route, index) => (
        <NavLink key={index} to={route.layout + route.path}>
          <MenuItem>
            <Flex alignItems="center">
              <MdBarChart
                width="20px"
                height="20px"
                color={activeRoute(route.path.toLowerCase()) ? activeIcon : textColor}
                mr="18px"
              />
              <Text
                color={activeRoute(route.path.toLowerCase()) ? activeColor : textColor}
                fontWeight={activeRoute(route.path.toLowerCase()) ? "bold" : "normal"}
              >
                {route.name}
              </Text>
            </Flex>
          </MenuItem>
        </NavLink>
      ));
  };

  return (
    <Stack direction="column">
      <Menu>
        <MenuButton as={Button} rightIcon={<MdKeyboardArrowDown />}>
          Dashboard
        </MenuButton>
        <MenuList>
          {renderCategoryLinks("dashboard")}
        </MenuList>
      </Menu>

      <Menu>
        <MenuButton as={Button} rightIcon={<MdKeyboardArrowDown />}>
          Master IT
        </MenuButton>
        <MenuList>
          {renderCategoryLinks("masterIT")}
        </MenuList>
      </Menu>

            <Menu>
        <MenuButton as={Button} rightIcon={<MdKeyboardArrowDown />}>
          Master Pelayanan
        </MenuButton>
        <MenuList>
          {renderCategoryLinks("masterPelayanan")}
        </MenuList>
      </Menu>




            <Menu>
        <MenuButton as={Button} rightIcon={<MdKeyboardArrowDown />}>
          Master SDM
        </MenuButton>
        <MenuList>
          {renderCategoryLinks("masterSDM")}
        </MenuList>
      </Menu>

      <Menu>
        <MenuButton as={Button} rightIcon={<MdKeyboardArrowDown />}>
          Transaksi
        </MenuButton>
        <MenuList>
          {renderCategoryLinks("transaksi")}
        </MenuList>
      </Menu>

      <Menu>
        <MenuButton as={Button} rightIcon={<MdKeyboardArrowDown />}>
          Laporan
        </MenuButton>
        <MenuList>
          {renderCategoryLinks("laporan")}
        </MenuList>
      </Menu>
    </Stack>
  );
}

export default Links;
