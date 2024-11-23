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
import AddDataFormMasterKualifikasi from "components/form/AddDataFormMasterKualifikasi";
import useAccess from "../../../../hooks/useAccess"; // Adjust the path as needed

export default function ColumnsTableMasterPelayanan(props) {
  const { columnsData } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormVisible, setFormVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState(null);

  const { access, validateAccess } = useAccess();
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL_BACKEND}/master_kualifikasi`,{
              headers: {
              'Authorization': `Bearer ${token}`,
          },
      }
      );
      setData(response.data);
      setError(null); // Reset error state on successful fetch
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No Data Available");
        setData([]);
      } else {
        console.error("Failed to fetch data:", error);
        setError("Failed to fetch data");
      }
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
    pageCount,
  } = tableInstance;

  const { pageIndex, pageSize } = state;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const handleEditClick = async (row) => {
    console.log("Edit clicked for row:", row.kualifikasi_id);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL_BACKEND}/master_kualifikasi/${row.kualifikasi_id}`,{
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
          await axios.delete(
            `${process.env.REACT_APP_API_BASE_URL_BACKEND}/master_kualifikasi/${row.kualifikasi_id}`,{
                  headers: {
                  'Authorization': `Bearer ${token}`,
              },
          }
          );
          Swal.fire("Deleted!", "Your data has been deleted.", "success");
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

      // Uncomment and adjust the URL and data as needed for your API
      // if (editData) {
      //   response = await axios.put(`${process.env.REACT_APP_API_BASE_URL_BACKEND}/master_kualifikasi/${editData.kualifikasi_id}`, newData, {
      //     headers: {
      //       'Authorization': `Bearer ${token}`,
      //     },
      //   });
      // } else {
      //   response = await axios.post(`${process.env.REACT_APP_API_BASE_URL_BACKEND}/master_kualifikasi`, newData, {
      //     headers: {
      //       'Authorization': `Bearer ${token}`,
      //     },
      //   });
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
        {validateAccess({ create: true }) && (
          <IconButton
            colorScheme="green"
            aria-label="Add"
            icon={<FaPlus />}
            onClick={handleAddClick}
          />
        )}
      </Flex>
      {isFormVisible ? (
        <AddDataFormMasterKualifikasi onSubmit={handleFormSubmit} initialData={editData} />
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
                  {data.length === 0 ? (
                    <Tr>
                      <Td colSpan={columns.length + 2} textAlign="center">
                        No Data Available
                      </Td>
                    </Tr>
                  ) : (
                    page.map((row, index) => {
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
                              isDisabled={!access.update} // Disable edit button if update access is false
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
                    })
                  )}
                </Tbody>
              </Table>
              <Flex justify="space-between" align="center">
                <ButtonGroup>
                  <IconButton
                    icon={<FaAngleDoubleLeft />}
                    onClick={() => gotoPage(0)}
                    isDisabled={!canPreviousPage}
                    aria-label="First page"
                  />
                  <IconButton
                    icon={<FaAngleLeft />}
                    onClick={() => previousPage()}
                    isDisabled={!canPreviousPage}
                    aria-label="Previous page"
                  />
                </ButtonGroup>
                <Text>
                  Page {pageIndex + 1} of {pageOptions.length}
                </Text>
                <ButtonGroup>
                  <IconButton
                    icon={<FaAngleRight />}
                    onClick={() => nextPage()}
                    isDisabled={!canNextPage}
                    aria-label="Next page"
                  />
                  <IconButton
                    icon={<FaAngleDoubleRight />}
                    onClick={() => gotoPage(pageCount - 1)}
                    isDisabled={!canNextPage}
                    aria-label="Last page"
                  />
                </ButtonGroup>
              </Flex>
            </>
          )}
        </>

  );
}
