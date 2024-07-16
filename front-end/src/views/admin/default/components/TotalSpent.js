import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import LineChart from "components/charts/LineChart";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdBarChart, MdOutlineCalendarToday } from "react-icons/md";
import { RiArrowUpSFill } from "react-icons/ri";

export default function TotalSpent(props) {
  const { ...rest } = props;

  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overallPercentageChange, setOverallPercentageChange] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL_BACKEND}/chart`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        setCategories(response.data.categories);
        setChartData(response.data.series);
        setOverallPercentageChange(response.data.overall_percentage_change);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const iconColor = useColorModeValue("brand.500", "white");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  const chartOptions = {
    chart: {
      toolbar: {
        show: false,
      },
      dropShadow: {
        enabled: true,
        top: 13,
        left: 0,
        blur: 10,
        opacity: 0.1,
        color: "#4318FF",
      },
    },
    colors: ["#4318FF", "#39B8FF"],
    markers: {
      size: 0,
      colors: "white",
      strokeColors: "#7551FF",
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: "circle",
      radius: 2,
      offsetX: 0,
      offsetY: 0,
      showNullDataPoints: true,
    },
    tooltip: {
      theme: "dark",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      type: "line",
    },
    xaxis: {
      type: "category",
      categories: categories,
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
      column: {
        color: ["#7551FF", "#39B8FF"],
        opacity: 0.5,
      },
    },
    color: ["#7551FF", "#39B8FF"],
  };

  return (
    <Card
      justifyContent='center'
      align='center'
      direction='column'
      w='100%'
      mb='0px'
      {...rest}>
      <Flex justify='space-between' ps='0px' pe='20px' pt='5px'>
        <Flex align='center' w='50%'>
          <Button
            bg={boxBg}
            borderRadius='50%'
            p='0px'
            me='10px'
            _hover={bgHover}
            _active={bgFocus}
            _focus={bgFocus}>
            <Icon as={MdBarChart} color={iconColor} w='20px' h='20px' />
          </Button>
          <Flex direction='column'>
            <Text color={textColor} fontSize='md' fontWeight='700'>
              Total Pemeriksaan
            </Text>
          </Flex>
        </Flex>
        <Flex align='center'>

          <Icon as={RiArrowUpSFill} color='green.500' me='4px' />
          <Text color='green.500' fontSize='xs' fontWeight='700'>
              {`Comparison: ${overallPercentageChange > 0 ? 'Increase' : 'Decrease'} of ${Math.abs(overallPercentageChange)}%`}
          </Text>
        </Flex>
      </Flex>

      <Box h='240px' mt='auto'>
        <LineChart
          chartData={chartData}
          chartOptions={chartOptions}
        />
      </Box>
    </Card>
  );
}
