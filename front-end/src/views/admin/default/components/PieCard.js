import {
  Box,
  Flex,
  Text,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import ReactApexChart from "react-apexcharts";
import { VSeparator } from "components/separator/Separator";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Conversion(props) {
  const { ...rest } = props;

  // Chakra Color Mode
  const token = localStorage.getItem('token');

  const [labels, setLabels] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL_BACKEND}/pie_chart`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      console.log("Response ", response.data);
      setLabels(response.data.labels);
      setSeries(response.data.series);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  const pieChartOptions = {
    labels: labels,
    dataLabels: {
      enabled: true,
    },
    colors: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
    legend: {
      position: 'right',
      offsetY: 0,
      height: 230,
    },
  };

  return (
    <Card p='20px' align='center' direction='column' w='100%' {...rest}>
      <Flex
        px={{ base: "0px", "2xl": "10px" }}
        justifyContent='space-between'
        alignItems='center'
        w='100%'
        mb='8px'>
        <Text color={textColor} fontSize='md' fontWeight='600' mt='4px'>
          Pelayanan Chart
        </Text>
        <Select
          fontSize='sm'
          variant='subtle'
          defaultValue='monthly'
          width='unset'
          fontWeight='700'>
          <option value='daily'>Daily</option>
          <option value='monthly'>Monthly</option>
          <option value='yearly'>Yearly</option>
        </Select>
      </Flex>

      <ReactApexChart
        options={pieChartOptions}
        series={series}
        type="pie"
        height="100%"
        width="100%"
      />
     
    </Card>
  );
}
