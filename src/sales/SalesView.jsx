import { Box, Button, Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

import ReceiptSharp from '@mui/icons-material/ReceiptSharp';
import { incrementInvoiceId, getCurrentYear } from "../utils";
import InvoiceTable from "../invoice/InvoiceTable";

const SalesView = () => {
    const [salesData, setSalesData] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`${API_BASE_URL}/items/sales`)
            .then(response => {
                console.log('Sales data:', response.data);
                setSalesData(response.data);
            })
            .catch(error => {
                console.error('Error fetching sales data:', error);
            });
    }, []);
    const handleGenerateInvoice = () => {
        if (salesData.length) {
            const invoiceYear = salesData[0].invoiceId.split('/')[1];
            const currentYear = getCurrentYear();
            if (invoiceYear !== currentYear) {
                navigate(`/generate-invoice/DECO~${currentYear}~00001`);
                return;
            }
            navigate(`/generate-invoice/${incrementInvoiceId(salesData[0].invoiceId).replaceAll('/', '~')}`);
        } else {
            navigate(`/generate-invoice/DECO~${getCurrentYear()}~00001`);
        }
    }
    return (
        <Container maxWidth="xl" sx={{ py: 2 }}>
            <Grid item xs={12} md={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" fontWeight="bold">Sales</Typography>
                    <Button variant="contained" color="primary" startIcon={<ReceiptSharp />} onClick={handleGenerateInvoice}>
                        Generate Invoice
                    </Button>
                </Box>
            </Grid>
             <Grid item xs={12} md={12}>
                <InvoiceTable data={salesData} />
             </Grid>
        </Container>
    );
}
export default SalesView;