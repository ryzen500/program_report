import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Text, VStack, Button } from '@chakra-ui/react';
import * as XLSX from 'xlsx';

function ReportPelayanan({ groupedData }) {
  let newDate = new Date();
  let year = newDate.getFullYear();
  let yearPrevious = newDate.getFullYear() - 1;

  if (!groupedData || Object.keys(groupedData).length === 0) {
    return <Text>No data available</Text>;
  }

  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    Object.keys(groupedData).forEach((mainService) => {
      const wsData = [];
      wsData.push([
        'No',
        'Jenis Layanan',
        'Parameter',
        `Tahun ${yearPrevious}`,
        `Rt2/Bln`,
        ...[...Array(12).keys()].map((i) => `${i + 1}`),
        'Jml/Rt',
      ]);

      let index = 1;
      Object.keys(groupedData[mainService]).forEach((subServiceKey, subIndex) => {
        const subService = groupedData[mainService][subServiceKey];
        wsData.push([
          `${index}.${subIndex + 1}`,
          subService.nama_subpelayanan,
          'Jumlah Pemeriksaan',
          subService.jumlahTahun.toFixed(2),
          typeof subService.rataRataBulan === 'number'
            ? subService.rataRataBulan.toFixed(2)
            : 'N/A',
          ...subService.bulanTahunDepan.map((jumlah) => jumlah.toFixed(2)),
          subService.jumlah.toFixed(2),
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, mainService);
    });

    XLSX.writeFile(wb, `report_pelayanan_${year}.xlsx`);
  };

  return (
    <VStack spacing={4} align="stretch">
      {Object.keys(groupedData).map((mainService, mainIndex) => (
        <Box
          key={mainService}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p={4}
          boxShadow="md"
        >
          <Text fontSize="xl" mb={4} fontWeight="bold">
            {mainService}
          </Text>
          <Box overflowX="auto">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th rowSpan={2}>No</Th>
                  <Th rowSpan={2}>Jenis Layanan</Th>
                  <Th rowSpan={2}>Parameter</Th>
                  <Th colSpan={2} textAlign="center">
                    Tahun {yearPrevious}
                  </Th>
                  <Th colSpan={12} textAlign="center">
                    Capaian Tiap Bulan Tahun {year}
                  </Th>
                  <Th rowSpan={2}>Jml/Rt</Th>
                </Tr>
                <Tr>
                  <Th>1 Thn</Th>
                  <Th>Rt2/Bln</Th>
                  {[...Array(12).keys()].map((i) => (
                    <Th key={i + 1}>{i + 1}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {Object.keys(groupedData[mainService]).map(
                  (subServiceKey, subIndex) => {
                    const subService = groupedData[mainService][subServiceKey];
                    return (
                      <Tr key={subServiceKey}>
                        <Td>{`${mainIndex + 1}.${subIndex + 1}`}</Td>
                        <Td>{subService.nama_subpelayanan}</Td>
                        <Td>Jumlah Pemeriksaan</Td>
                        <Td>{subService.jumlahTahun.toFixed(2)}</Td>
                        <Td>
                          {typeof subService.rataRataBulan === 'number'
                            ? subService.rataRataBulan.toFixed(2)
                            : 'N/A'}
                        </Td>
                        {subService.bulanTahunDepan.map((jumlah, i) => (
                          <Td key={i}>{jumlah.toFixed(2)}</Td>
                        ))}
                        <Td>{subService.jumlah.toFixed(2)}</Td>
                      </Tr>
                    );
                  }
                )}
              </Tbody>
            </Table>
          </Box>
        </Box>
      ))}
      <Button colorScheme="teal" onClick={handleExport}>
        Print to Excel
      </Button>
    </VStack>
  );
}

export default ReportPelayanan;
