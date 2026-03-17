import { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import {
  Container, Grid, Card, CardContent, Typography, TextField,
  Button, IconButton, Divider, Box, Paper,
  Checkbox, FormControlLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ReceiptSharp from '@mui/icons-material/ReceiptSharp';

import { numberToWords } from '../utils';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { API_BASE_URL } from "../utils/constants";


const QuotationGenerator = () => {
  const quotationRef = useRef();

  // Primary quotation Data State
  const [data, setData] = useState({
    gstNeeded: true,

    // Company Details
    companyName: 'Deco Sales & Service',
    companyAddress: `Flat No. 14/23, 1st Floor, Yacob Garden Lane, Perambur Barracks Road Junction, Chennai-600012`,
    companyEmail: 'decosalesandservice@gmail.com',
    bankName: 'HDFC Bank',
    accountName: 'DECO SALES AND SERVICES',
    accountNo: '50200116084359',
    ifscCode: 'HDFC0005607',
    gstNumber: '33CCWPR5804F1Z9',
    companyMobile: '6374504735/9361287283',
    discount: 0,
    amountPaid: 0,
    sameAsBillingAddress: false,
  });

  // Dynamic Array for Sale Items
  const [items, setItems] = useState([
  ]);

  // Handlers
  const handleDataChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    if(e.target.name === 'sameAsBillingAddress') {
      if(e.target.checked) {
        setData({
          ...data,
          sameAsBillingAddress: true,
          shipName: data.buyerName,
          shipAddress: data.buyerAddress,
          shipPhone: data.buyerPhone
        });
        return;
      }
    }

    setData({ ...data, [e.target.name]: e.target.checked });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { item: '', serialNo: '', description: '', quantity: 1, rate: 0, isService: false }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // Calculations
  const calculateSubTotal = () => items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
  const discountedTotal = calculateSubTotal() - data.discount;
  const gstAmount = () => discountedTotal * 0.18;
  const grandTotal = discountedTotal + (data.gstNeeded ? gstAmount() : 0);
  const balanceDue = grandTotal - data.amountPaid;

  // PDF Generation
  const handleDownloadPdf = () => {
    const element = quotationRef.current;
    const opt = {
      margin: 0.5,
      filename: `QUOTATION.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };
  

  return (

    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Grid container spacing={4}>

        {/* --- LEFT COLUMN: MUI INPUT FORM --- */}
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" fontWeight="bold">Generate Quotation</Typography>
            <Button variant="contained" color="primary" startIcon={<PictureAsPdfIcon />} onClick={handleDownloadPdf}>
              Export PDF
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      

            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" color="primary">Sales & Service Items</Typography>
                  <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddItem} size="small" variant="outlined">Add Item</Button>
                </Box>

                {items.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                    <TextField
                      sx={{ width: '300px' }} label="Item Name" size="small"
                      value={item.itemName} onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Item Description"
                      size="small"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      multiline
                      minRows={2}
                      maxRows={4}
                    />
                    <TextField
                      sx={{ width: '300px' }} label="Item HSN/SAC" size="small"
                      value={item.serialNo} onChange={(e) => handleItemChange(index, 'serialNo', e.target.value)}
                    />
                    <TextField
                      label="quantity" size="small" sx={{ width: '100px' }}
                      value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                    />
                    <TextField
                      label="Rate (₹)" size="small" sx={{ width: '200px' }}
                      value={item.rate} onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value))}
                    />
                    <FormControlLabel sx={{ width: '100px' }} control={<Checkbox name="isService" checked={item.isService} onChange={(e) => handleItemChange(index, 'isService', e.target.checked)} />} label="Service Item" />
                    <IconButton color="error" onClick={() => handleRemoveItem(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </CardContent>
            </Card>

          </Box>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper elevation={4} sx={{ p: 4, backgroundColor: '#fff', minHeight: '800px', fontFamily: 'sans-serif' }} ref={quotationRef}>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h4" fontWeight="bold"><img src='/images/logo.png' width={'200px'} height={'150px'}></img></Typography>
              <Typography variant="h6" sx={{ letterSpacing: 2 }}>Quotation</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, fontSize: '14px' }}>
              <Box sx={{ width: '45%' }}>
                <strong>{data.companyName}</strong><br />
                <Box sx={{ width: '250px', my: 1 }}>{data.companyAddress}</Box>
                <Box sx={{ width: '250px', my: 1 }}>{data.companyEmail}</Box>
                <Box sx={{ width: '250px', my: 1 }}>{data.companyMobile}</Box>
              </Box>
              <Box>
                <table style={{ textAlign: 'left' }}>
                  <tbody>
                    <tr><td>GST No:</td><td>: {data.gstNumber}</td></tr>
                  </tbody>
                </table>
              </Box>
            </Box>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #000', borderTop: '2px solid #000' }}>
                  <th style={{ textAlign: 'left', padding: '10px 5px' }}>S.no</th>
                  <th style={{ textAlign: 'left', padding: '10px 5px' }}>Item</th>
                  <th style={{ textAlign: 'left', padding: '10px 5px' }}>Description</th>
                  <th style={{ textAlign: 'left', padding: '10px 5px' }}>HSN/SAC No</th>
                  <th style={{ textAlign: 'center', padding: '10px 5px' }}>quantity</th>
                  <th style={{ textAlign: 'right', padding: '10px 5px' }}>Rate</th>
                  <th style={{ textAlign: 'right', padding: '10px 5px' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px 5px' }}>{index + 1}</td>
                    <td style={{ padding: '10px 5px', maxWidth: '300px' }}>{item.itemName}</td>
                    <td style={{ padding: '10px 5px', maxWidth: '300px' }}>{item.description}</td>
                    <td style={{ padding: '10px 5px' }}>{item.serialNo}</td>
                    <td style={{ textAlign: 'center', padding: '10px 5px' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right', padding: '10px 5px' }}>{item.rate.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', padding: '10px 5px' }}>{(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3, fontSize: '14px' }}>
              <table style={{ minWidth: '250px' }}>
                <tbody>
                  <tr><td style={{ padding: '4px' }}>Total</td><td style={{ textAlign: 'right', padding: '4px' }}>{calculateSubTotal().toFixed(2)}</td></tr>
                  <tr><td style={{ padding: '4px' }}>Discount</td><td style={{ textAlign: 'right', padding: '4px' }}>{Number(data.discount).toFixed(2)}</td></tr>
               
                   {data.gstNeeded && data.buyerAddress?.toLowerCase().includes('chennai') && (
                    <tr style={{ borderTop: '1px solid #000', borderBottom: '1px solid #000' }}>
                       <td style={{ padding: '8px 4px' }}><strong>CGST (9%)</strong></td>
                      <td style={{ textAlign: 'right', padding: '8px 4px' }}><strong>{gstAmount().toFixed(2)/2}</strong></td>
                    </tr>
                  )}
                   {data.gstNeeded &&  data.buyerAddress?.toLowerCase().includes('chennai') && (
                    <tr style={{ borderTop: '1px solid #000', borderBottom: '1px solid #000' }}>
                       <td style={{ padding: '8px 4px' }}><strong>SGST (9%)</strong></td>
                      <td style={{ textAlign: 'right', padding: '8px 4px' }}><strong>{gstAmount().toFixed(2)/2}</strong></td>
                    </tr>
                  )}
                    {data.gstNeeded  &&  !data.buyerAddress?.toLowerCase().includes('chennai') && (
                    <tr style={{ borderTop: '1px solid #000', borderBottom: '1px solid #000' }}>
                       <td style={{ padding: '8px 4px' }}><strong>IGST (18%)</strong></td>
                      <td style={{ textAlign: 'right', padding: '8px 4px' }}><strong>{gstAmount().toFixed(2)}</strong></td>
                    </tr>
                  )}
                  <tr style={{ borderTop: '1px solid #000', borderBottom: '1px solid #000' }}>
                    <td style={{ padding: '8px 4px' }}><strong>Grand Total</strong></td>
                    <td style={{ textAlign: 'right', padding: '8px 4px' }}><strong>{grandTotal.toFixed(2)}</strong></td>
                  </tr>
                  <tr><td style={{ padding: '4px', paddingTop: '8px' }}>Amount Paid</td><td style={{ textAlign: 'right', padding: '4px', paddingTop: '8px' }}>{Number(data.amountPaid).toFixed(2)}</td></tr>
                  <tr><td style={{ padding: '4px' }}>Balance Due</td><td style={{ textAlign: 'right', padding: '4px' }}>{balanceDue.toFixed(2)}</td></tr>
                </tbody>
              </table>
            </Box>

            <Box sx={{ fontSize: '14px', mb: 4 }}>
              <strong>Total In Words:</strong> {numberToWords(data.amountPaid)}<br /><br />
              <strong>Hoping to work with you.</strong>
            </Box>

            <Box sx={{ fontSize: '14px', mb: 3 }}>
              <strong>Bank Details</strong><br />
              Bank Name: {data.bankName},<br />
              Account Name: {data.accountName},<br />
              Account No: {data.accountNo},<br />
              IFSC Code: {data.ifscCode}
            </Box>

            <Box sx={{ fontSize: '12px', mb: 5, color: '#444' }}>
              <strong>Terms & Conditions</strong><br />
              • All Prices in Indian Rupees<br />
              1. Service Warranty 3 Months<br />
              2. No Hardware Warranty<br />
              3. Material Return not accepted<br />
              4. No Warranty for Display, ABCD Panel/Keyboard/Battery<br />
              5. Replacement/Testing Warranty 7 Days<br />
              6. Replacement Warranty Covers only material in purchase condition<br />
              7. Warranty Covers only if seal not removed
            </Box>

          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default QuotationGenerator;