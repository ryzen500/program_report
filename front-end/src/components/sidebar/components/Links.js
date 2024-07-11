// chakra imports
import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MdBarChart } from "react-icons/md"; // Import specific icons instead of all

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
          <Box>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              px="10px"
              py="5px"
            >
              <Flex alignItems="center">
                {/* Use MdBarChart directly */}
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
              {activeRoute(route.path.toLowerCase()) && (
                <Box h="36px" w="4px" bg={brandColor} borderRadius="5px" />
              )}
            </Flex>
          </Box>
        </NavLink>
      ));
  };

  return (
    <Stack direction="column">
      <Text fontSize="md" color={activeColor}>
</Text>
      <Text fontSize="md" color={activeColor} fontWeight="bold" mx="auto" ps={{ sm: "10px", xr: "16px" }} pt="18px" pb="12px">
  Dashboard
</Text>

      {renderCategoryLinks("dashboard")}
      <Text fontSize="md" color={activeColor} fontWeight="bold" mx="auto" ps={{ sm: "10px", xl: "16px" }} pt="18px" pb="12px">
        Master
      </Text>
      {renderCategoryLinks("master")}
      <Text fontSize="md" color={activeColor} fontWeight="bold" mx="auto" ps={{ sm: "10px", xl: "16px" }} pt="18px" pb="12px">
        Transaksi
      </Text>
      {renderCategoryLinks("transaksi")}


      <Text fontSize="md" color={activeColor} fontWeight="bold" mx="auto" ps={{ sm: "10px", xl: "16px" }} pt="18px" pb="12px">
        Laporan
      </Text>
      {renderCategoryLinks("laporan")}
    </Stack>
  );
}

export default Links;
