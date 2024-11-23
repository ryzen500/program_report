import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

function ReportPelayanan({ groupedData }) {
 
  let newDate  = new Date();

  let year = newDate.getFullYear();
  let yearPrevious  = newDate.getFullYear() - 1;

  if (!groupedData || Object.keys(groupedData).length === 0) {
    return <p>No data available</p>;
  }

  return (
    <div>
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th rowSpan={2}>No</Th>
            <Th rowSpan={2}>Jenis Layanan</Th>
            <Th rowSpan={2}>Parameter</Th>
            <Th colSpan={2} textAlign="center">Tahun {yearPrevious}</Th>
            <Th colSpan={12} textAlign="center">Capaian Tiap Bulan Tahun {year}</Th>
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
          {Object.keys(groupedData).map((mainService, mainIndex) => (
            <React.Fragment key={mainService}>
              <Tr>
                <Td>{mainIndex + 1}</Td>
                <Td colSpan={16}>{mainService}</Td>
              </Tr>
              {groupedData[mainService].map((subService, subIndex) => (
                <Tr key={subService.nama_subpelayanan}>
                  <Td> {${mainIndex + 1}.${subIndex + 1}}</Td>
                  <Td>{subService.nama_subpelayanan}</Td>
                  <Td>Jumlah Pemeriksaan</Td>
                  <Td>{subService.jumlahTahun}</Td>
                  <Td>{typeof subService.rataRataBulan === 'number' ? subService.rataRataBulan.toFixed(2) : 'N/A'}</Td>
                  {subService.bulanTahunDepan.map((jumlah, i) => (
                    <Td key={i}>{jumlah}</Td>
                  ))}
                  <Td>{subService.jumlah}</Td>
                </Tr>
              ))}
            </React.Fragment>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}

export default ReportPelayanan;