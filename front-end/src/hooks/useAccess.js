// hooks/useAccess.js
import { useState, useEffect } from 'react';

const useAccess = () => {
  const [access, setAccess] = useState({
    create: false,
    read: false,
    update: false,
    delete: false,
  });

  const validateAccess = (requiredAccess) => {
    const { create, read, update, delete: del } = access;
    const { create: reqCreate, read: reqRead, update: reqUpdate, delete: reqDelete } = requiredAccess;

    return (
      (!reqCreate || create) &&
      (!reqRead || read) &&
      (!reqUpdate || update) &&
      (!reqDelete || del)
    );
  };

  useEffect(() => {
    // Retrieve access from localStorage
    const storedAccess = localStorage.getItem('hak_akses');
    if (storedAccess) {
      const parsedAccess = JSON.parse(storedAccess);
      setAccess(parsedAccess);
    }
  }, []);

  return { access, setAccess, validateAccess };
};

export default useAccess;
