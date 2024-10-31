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
import AddDataFormMasterPelayanan from "components/form/AddDataFormMasterPelayanan";
import useAccess from "../../../../hooks/useAccess"; // Sesuaikan dengan path hooks/useAccess.js

export default function ColumnsTableMasterPelayanan(props) {
  const { columnsData } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormVisible, setFormVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState(null); // New state for error handling

  const { access, validateAccess } = useAccess(); // Ambil access dan validateAccess dari useAccess hook
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL_BACKEND}/transaksi_pelayanan`,{
              headers: {
              'Authorization': `Bearer ${token}`,
          },
      }
      );
      setData(response.data);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("error"); // Set error state
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
    console.log("Edit clicked for row:", row.pelayanan_id);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL_BACKEND}/master_pelayanan/${row.pelayanan_id}`,{
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
       title: "Apakah Anda Yakin?",
      text: "Anda Tidak Akan Dapat Mengembalikan Data ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL_BACKEND}/master_pelayanan/${row.pelayanan_id}`,{
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
        console.log("Edit ",newData);

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
        <AddDataFormMasterPelayanan onSubmit={handleFormSubmit} initialData={editData} />
      ) : (
        <>
          {data.length == 0 ? ( // Conditionally render error message
            <Text color="red.500" fontSize="xl" textAlign="center" my={4}>
              No Data Available
            </Text>
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
                 <Tr>
                  <Td colSpan={columns.length + 2} textAlign="center">
                    No Data Available
                  </Td>
                </Tr>
                {page.length === 0 ? (
                ): (


                )}
                  {page.map((row, index) => {
                    prepareRow(row);
                    return (
                      <Tr {...row.getRowProps()} key={index}>
                        <Td>{pageIndex * pageSize + index + 1}</Td>
                        {row.cells.map((cell, index) => {
                          let data = cell.render("Cell");

                          if (cell.column.Header === "Nama Hak Akses") {
                            data = (
                              <Flex align="center">
                                <Text color={textColor} fontSize="sm" fontWeight="700">
                                  {cell.value}
                                </Text>
                              </Flex>
                            );
                          } else if (cell.column.Header === "Nama Lain Hak Akses") {
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
                          <IconButton
                            colorScheme="blue"
                            aria-label="Edit"
                            icon={<FaEdit />}
                            mr={2}
                            onClick={() => handleEditClick(row.original)}
                            isDisabled={!access.update} // Disable delete button if delete access is false
                          />
                          <IconButton
                            colorScheme="red"
                            aria-label="Delete"
                            icon={<FaTrash />}
                            onClick={() => handleDeleteClick(row.original)}
                            isDisabled={!access.delete} // Disable delete button if delete access is false
                          />
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
                  />
                  <IconButton
                    onClick={() => previousPage()}
                    isDisabled={!canPreviousPage}
                    icon={<FaAngleLeft />}
                  />
                  <IconButton
                    onClick={() => nextPage()}
                    isDisabled={!canNextPage}
                    icon={<FaAngleRight />}
                  />
                  <IconButton
                    onClick={() => gotoPage(pageCount - 1)}
                    isDisabled={!canNextPage}
                    icon={<FaAngleDoubleRight />}
                  />
                </ButtonGroup>
                <Text>
                  Page {pageIndex + 1} of {pageOptions.length}
                </Text>
                <Flex alignItems="center">
                  <Text mr={2}>Go to page:</Text>
                  <input
                    type="number"
                    defaultValue={pageIndex + 1}
                    onChange={(e) => {
                      const page = e.target.value ? Number(e.target.value) - 1 : 0;
                      gotoPage(page);
                    }}
                    style={{ width: "50px" }}
                  />
                </Flex>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}
                >
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </Flex>
            </>
          )}
        </>
      )}
    </>
  );
}
