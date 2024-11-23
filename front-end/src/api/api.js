import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL_BACKEND;

export const fetchData = async (token) => {
    const url = `${API_BASE_URL}/hak_akses`;
    console.log('Request URL:', url);
    console.log('Token:', token);
    try {
        const response = await axios.get(url,{
            headers: {
                'Authorization': `bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        console.log('Response:', response); // Log entire response object
        console.log('Response Data:', response.data); // Log response data
        
        return response.data;
    } catch (error) {
        // console.error('Error fetching data:', error);
        // throw error;
    }
};

// export const fetchDataRumahSakit = async (token) => {
//     const url = `${API_BASE_URL}/rumah_sakit`;
//     console.log('Request URL:', url);
//     console.log('Token:', token);
//     try {
//         const response = await axios.get(url,  {},{
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json',
//             },
//         });

//         console.log('Response:', response); // Log entire response object
//         console.log('Response Data:', response.data); // Log response data
        
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         throw error;
//     }
// };


export const fetchDataRumahSakit = async (token) => {
    const url = `${API_BASE_URL}/rumah_sakit`;
    
    // const url = 
     console.log('Request URL:', url);
    console.log('Token Lalala:', token);
    console.log('TEST')
    try {
        const response = await axios.get(url,{
            params:{"Authorization": `Bearer TSany`},
            headers: {
                'Authorization': "Bearer Tsany",
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        console.log('Response:', response); // Log entire response object
        console.log('Response Data:', response.data); // Log response data
        
        return response.data;
    } catch (error) {
        // console.error('Error fetching data:', error);
        // throw error;
    }
};

export const fetchDataMasterPelayanan = async (token) => {
    const url = `${API_BASE_URL}/master_pelayanan`;
    console.log('Request URL:', url);
    console.log('Token:', token);
    try {
        const response = await axios.get(url,  {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        console.log('Response:', response); // Log entire response object
        console.log('Response Data:', response.data); // Log response data
        
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const fetchDataSubMasterPelayanan = async (token) => {
    const url = `${API_BASE_URL}/submaster_pelayanan`;
    console.log('Request URL:', url);
    console.log('Token:', token);
    try {
        console.log('kenapa',token);
        const response = await axios.get(url,  {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        console.log('Response:', response); // Log entire response object
        console.log('Response Data:', response.data); // Log response data
        
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// 
