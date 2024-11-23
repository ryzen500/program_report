import {
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "assets/css/MiniCalendar.css";
// Custom components
import Card from "components/card/Card";

// Assets
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function MiniCalendar(props) {
  const { selectRange, ...rest } = props;
  const [value, onChange] = useState(new Date());

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  return (
    <Card
      direction='column'
      w='100%'
      px='0px'
      overflowX={{ sm: "scroll", lg: "hidden" }}
      h='400px'>  {/* Set height to match the table card */}
      <Flex px='25px' justify='center' mb='10px' align='center'>
        <Text
          color={textColor}
          fontSize='22px'
          fontWeight='700'
          lineHeight='100%'>
          Mini Calendar
        </Text>
      </Flex>
      <Flex justify='center' align='center' h='100%'>  {/* Center the calendar */}
        <Calendar
          onChange={onChange}
          value={value}
          selectRange={selectRange}
          view={"month"}
          tileContent={<Text color='brand.500'></Text>}
          prevLabel={<Icon as={MdChevronLeft} w='24px' h='24px' mt='4px' />}
          nextLabel={<Icon as={MdChevronRight} w='24px' h='24px' mt='4px' />}
          className='react-calendar'  // Add custom class for further styling if needed
        />
      </Flex>
    </Card>
  );
}
