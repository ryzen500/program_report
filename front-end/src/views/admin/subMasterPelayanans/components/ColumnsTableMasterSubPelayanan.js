import React, { useMemo, useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import {
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  IconButton,
  Button,
  ButtonGroup,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import AddDataFormSubMasterPelayanan from "components/form/AddDataFormSubMasterPelayanan";
import useAccess from "../../../../hooks/useAccess"; // Sesuaikan dengan path hooks/useAccess.js

export default function ColumnsTable(props) {
  const { columnsData } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormVisible, setFormVisible] = useState(false);
  const [editData, setEditData] = useState(null);

  const { access, validateAccess } = useAccess(); // Ambil access dan validateAccess dari useAccess hook
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL_BACKEND}/submaster_pelayanan`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(() => columnsData, [columnsData]);

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 5 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = tableInstance;

  const { pageIndex, pageSize } = state;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const handleEditClick = async (row) => {
    console.log("Edit clicked for row:", row.subpelayanan_id);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL_BACKEND}/submaster_pelayanan/${row.subpelayanan_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const dataToEdit = response.data;
      setEditData(dataToEdit);
      setFormVisible(true);
    } catch (error) {
      console.error("Failed to fetch data for edit:", error);
    }
  };

  const handleDeleteClick = async (row) => {
    console.log("Delete clicked for row:", row);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${process.env.REACT_APP_API_BASE_URL_BACKEND}/submaster_pelayanan/${row.subpelayanan_id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );
          Swal.fire("Deleted!", "Data kamu berhasil Dihapus .", "success");
          fetchData();
        } catch (error) {
          console.error("Failed to delete data:", error);
        }
      }
    });
  };

  const handleAddClick = () => {
    setFormVisible(!isFormVisible);
    setEditData(null);
  };

  const handleFormSubmit = async (newData) => {
    console.log("Form submitted with data:", newData);
    try {
      let response;
      console.log("Edit ", newData);

      // if (editData) {
      //   response = await axios.put(`http://localhost/program_report/back-end/index.php/api/hak_akses/${editData[0].hak_akses_id}`, newData);
      // } else {
      //   response = await axios.post('http://localhost/program_report/back-end/index.php/api/hak_akses', newData);
      // }
      Swal.fire('Success!', 'Data has been saved successfully.', 'success');
      fetchData();
      setFormVisible(false);
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  };

  return (
    <>
      <Flex justify="flex-start" mb="16px">
        {validateAccess({ create: true }) && ( // Hanya tampilkan tombol tambah jika punya akses create
          <IconButton
            colorScheme="green"
            aria-label="Add"
            icon={<FaPlus />}
            onClick={handleAddClick}
          />
        )}
      </Flex>
      {isFormVisible ? (
        <AddDataFormSubMasterPelayanan onSubmit={handleFormSubmit} initialData={editData} />
      ) : (
        <>
          <Table
            {...getTableProps()}
            variant="simple"
            backgroundColor="white"
            color="gray.500"
            mb="24px"
          >
            <Thead>
              {headerGroups.map((headerGroup, index) => (
                <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  <Th>No.</Th>
                  {headerGroup.headers.map((column, index) => (
                    <Th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      pe="10px"
                      key={index}
                      borderColor={borderColor}
                    >
                      <Flex
                        justify="space-between"
                        align="center"
                        fontSize={{ sm: "10px", lg: "12px" }}
                        color="gray.400"
                      >
                        {column.render("Header")}
                      </Flex>
                    </Th>
                  ))}
                  <Th>Action</Th>
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {page.map((row, index) => {
                prepareRow(row);
                return (
                  <Tr {...row.getRowProps()} key={index}>
                    <Td>{pageIndex * pageSize + index + 1}</Td>
                    {row.cells.map((cell, index) => {
                      let data = cell.render("Cell");

                      if (cell.column.Header === "Nama Master Pelayanan") {
                        data = (
                          <Flex align="center">
                            <Text color={textColor} fontSize="sm" fontWeight="700">
                              {cell.value}
                            </Text>
                          </Flex>
                        );
                      } else if (cell.column.Header === "Nama  Master SubPelayanan") {
                        data = (
                          <Flex align="center">
                            <Text
                              me="10px"
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {cell.value}
                            </Text>
                          </Flex>
                        );
                      }
                      return (
                        <Td
                          {...cell.getCellProps()}
                          key={index}
                          fontSize={{ sm: "14px" }}
                          minW={{ sm: "150px", md: "200px", lg: "auto" }}
                          borderColor="transparent"
                        >
                          {data}
                        </Td>
                      );
                    })}
                    <Td>
                      {validateAccess({ update: true }) && ( // Hanya tampilkan tombol edit jika punya akses update
                        <IconButton
                          colorScheme="blue"
                          aria-label="Edit"
                          icon={<FaEdit />}
                          mr={2}
                          onClick={() => handleEditClick(row.original)}
                        />
                      )}
                      {validateAccess({ delete: true }) && ( // Hanya tampilkan tombol delete jika punya akses delete
                        <IconButton
                          colorScheme="red"
                          aria-label="Delete"
                          icon={<FaTrash />}
                          onClick={() => handleDeleteClick(row.original)}
                        />
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
          <Flex justifyContent="space-between" m={4} alignItems="center">
            <ButtonGroup>
              <IconButton
                onClick={() => gotoPage(0)}
                isDisabled={!canPreviousPage}
                icon={<FaAngleDoubleLeft />}
                aria-label="First Page"
              />
              <IconButton
                onClick={() => previousPage()}
                isDisabled={!canPreviousPage}
                icon={<FaAngleLeft />}
                aria-label="Previous Page"
              />
              <IconButton
                onClick={() => nextPage()}
                isDisabled={!canNextPage}
                icon={<FaAngleRight />}
                aria-label="Next Page"
              />
              <IconButton
                onClick={() => gotoPage(pageOptions.length - 1)}
                isDisabled={!canNextPage}
                icon={<FaAngleDoubleRight />}
                aria-label="Last Page"
              />
            </ButtonGroup>
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
            <Flex alignItems="center">
              <span>Go to page: </span>
              <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
                style={{ width: '50px', marginLeft: '5px' }}
              />
            </Flex>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[5, 10, 20].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </Flex>
        </>
      )}
    </>
  );
}
