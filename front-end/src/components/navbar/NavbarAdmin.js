// Chakra Imports
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, useColorModeValue } from '@chakra-ui/react';
import AdminNavbarLinks from 'components/navbar/NavbarLinksAdmin';

export default function AdminNavbar(props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const changeNavbar = () => {
      if (window.scrollY > 1) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', changeNavbar);

    return () => {
      window.removeEventListener('scroll', changeNavbar);
    };
  }, []);

  const { secondary } = props;

  // Define styles based on props and color mode
  let navbarBg = useColorModeValue('rgba(244, 247, 254, 0.2)', 'rgba(11,20,55,0.5)');

  return (
    <Box
      bg={navbarBg}
      position="fixed"
      top={0}
      right={0}
      zIndex="sticky"
      boxShadow={scrolled ? 'sm' : 'none'}
      backdropFilter="blur(20px)"
      transition="box-shadow 0.2s ease-in-out"
      px={{ base: '3', md: '6' }}
      py="2"
    >
      <Box maxW="7xl" mx="auto">
        <AdminNavbarLinks
          onOpen={props.onOpen}
          logoText={props.logoText}
          secondary={props.secondary}
          fixed={props.fixed}
          scrolled={scrolled}
        />
      </Box>
    </Box>
  );
}

AdminNavbar.propTypes = {
  brandText: PropTypes.string,
  variant: PropTypes.string,
  secondary: PropTypes.bool,
  fixed: PropTypes.bool,
  onOpen: PropTypes.func,
};
