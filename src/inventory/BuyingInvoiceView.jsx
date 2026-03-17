import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";


import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import ReceiptSharp from '@mui/icons-material/ReceiptSharp';
import BuyingInvoiceTable from "./BuyingInvoiceTable";
import { Link } from "react-router-dom";

const BuyingInvoiceView = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        axios.get(`${API_BASE_URL}/inventory/invoice`)
            .then(response => {
                console.log('Buying invoices:', response.data);
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching buying invoices:', error);
                setData([]);
            });
    }, []);

    return (
        <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
   <Typography variant="h4" gutterBottom>
                Buying Invoice View
            </Typography>
            <Link to="/inventory-invoice-upload" style={{ textDecoration: 'none' }}>
             <Button variant="contained" color="primary" startIcon={<ReceiptSharp />}>
                        Upload Invoice
                    </Button>
                    </Link>
              </Box>
         
            <BuyingInvoiceTable invoices={data} />
        </Box>
    );
};

export default BuyingInvoiceView;