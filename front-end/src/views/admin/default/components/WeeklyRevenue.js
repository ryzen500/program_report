import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApexCharts from 'react-apexcharts';
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdBarChart, MdOutlineCalendarToday } from "react-icons/md";
import { RiArrowUpSFill } from "react-icons/ri";
const WeeklyChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');


  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get("http://localhost/program_report/back-end/index.php/api/weekly_chart", {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const { series } = response.data;

          if (series && series.length > 0) {
            setChartData(series);
            setLoading(false);
          } else {
            console.error('Invalid data format from server:', response.data);
            setLoading(false);
          }
        } else {
          console.error('Failed to fetch data:', response.statusText);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchChartData();
  }, [token]);

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
    return <p>Loading...</p>;
  }

  // Assuming categories are fixed (months)
  const categories = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  const options = {
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories: categories,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '300px', // Adjust the width of bars
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63'],
    },
    title: {
      text: 'Sub Pelayanan Chart',
      align: 'center',
      margin: 60,
      style: {
        fontSize: '20px',
      },
    },
  };

  const series = chartData.map(item => ({
    name: item.name, // Assuming 'name' corresponds to nama_subpelayanan
    data: item.data, // Array of total transaksi for each month
  }));

  return (

      <Card
      justifyContent='center'
      align='center'
      direction='column'
      w='100%'
      mb='0px'>
      <Box h='400px' mt='auto'>
           <ApexCharts options={options} series={series} type="bar" height={400} />
      </Box>
    </Card>
  
  );
};

export default WeeklyChart;
