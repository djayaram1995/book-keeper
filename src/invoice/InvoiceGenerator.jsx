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


const InvoiceGenerator = () => {
  const invoiceRef = useRef();

  const { id } = useParams();
  const [invoiceStatus, setInvoiceStatus] = useState(false);
  // Primary Invoice Data State
  const [data, setData] = useState({
    invoiceNumber: id.replaceAll('~', '/'),
    invoiceDate: moment().format('YYYY-MM-DD'),
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
    const element = invoiceRef.current;
    const opt = {
      margin: 0.5,
      filename: `${data.invoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };
  const createInvoice = () => {
    if(grandTotal <=0 || data.amountPaid < 0 || data.discount < 0 
      || !data.buyerName || !data.buyerAddress || !data.buyerPhone
      || !data.shipName || !data.shipAddress || !data.shipPhone || items.length === 0
      || items.some(item => !item.itemName || !item.description || !item.serialNo || item.quantity <= 0 || item.rate < 0)
      ) {
      return;
    }
    axios.post(`${API_BASE_URL}/items/sales`, {
      invoiceId: data.invoiceNumber,
      date: data.invoiceDate,
      gstNeeded: data.gstNeeded,
      items,
      totalAmount: grandTotal,
      discount: data.discount,
      tax: gstAmount(),
      preTaxAmount: discountedTotal,
      paidAmount: data.amountPaid,
      buyerName: data.buyerName,
      buyerAddress: data.buyerAddress,
      buyerPhone: data.buyerPhone,
      shipName: data.shipName,
      shipAddress: data.shipAddress,
      shipPhone: data.shipPhone,
      status: 'paid'
    }).then(res => {
      console.log('Invoice created successfully:', res.data);
      setInvoiceStatus(true);
    })
  }

  return (

    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Grid container spacing={4}>

        {/* --- LEFT COLUMN: MUI INPUT FORM --- */}
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" fontWeight="bold">Generate Invoice</Typography>
            <Button disabled={!invoiceStatus} variant="contained" color="primary" startIcon={<PictureAsPdfIcon />} onClick={handleDownloadPdf}>
              Export PDF
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* Invoice Details */}
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>Invoice Details</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}><TextField fullWidth label="Invoice Number" name="invoiceNumber" value={data.invoiceNumber} onChange={handleDataChange} size="small" /></Grid>
                  <Grid item xs={6}><TextField fullWidth label="Invoice Date" name="invoiceDate" type="date" value={data.invoiceDate} onChange={handleDataChange} size="small" InputLabelProps={{ shrink: true }} /></Grid>
                  <Grid item xs={6}><FormControlLabel control={<Checkbox name="gstNeeded" checked={data.gstNeeded} onChange={handleCheckboxChange} />} label="GST Needed" /></Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Buyer & Shipping Details */}
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>Buyer & Shipping</Typography>
                <Grid container spacing={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}><Typography variant="subtitle2" color="textSecondary">Bill To:</Typography></Grid>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="Buyer Name" name="buyerName" value={data.buyerName} onChange={handleDataChange} size="small" /></Grid>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="Buyer Address" name="buyerAddress"
                      sx={{ width: '400px' }}
                      multiline
                      minRows={2}
                      maxRows={4} value={data.buyerAddress} onChange={handleDataChange} size="large" /></Grid>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="Buyer Mobile" name="buyerPhone" value={data.buyerPhone} onChange={handleDataChange} size="small" /></Grid>

                  </Grid>

                  <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={12}><Typography variant="subtitle2" color="textSecondary">Ship To:</Typography></Grid>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="" name="shipName" value={data.shipName} onChange={handleDataChange} size="small" /></Grid>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="" name="shipAddress"
                      sx={{ width: '400px' }}
                      multiline
                      minRows={2}
                      maxRows={4} value={data.shipAddress} onChange={handleDataChange} size="large" /></Grid>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="" name="shipPhone" value={data.shipPhone} onChange={handleDataChange} size="small" /></Grid>
                     <Grid item xs={6}><FormControlLabel control={<Checkbox name="sameAsBillingAddress" checked={data.sameAsBillingAddress} onChange={handleCheckboxChange} />} label="Same as Billing Address" /></Grid>
                  </Grid>

                </Grid>
              </CardContent>
            </Card>

            {/* Dynamic Items Array */}
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

            {/* Discount & Payment Details */}
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>Payment Settings & Generate Invoice</Typography>
                <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, fontSize: '14px' }}>
                  <Grid item xs={12} sm={6} sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                    <Grid item xs={4}><TextField width={'200px'} label="Discount Amount" name="discount" value={data.discount} onChange={handleDataChange} size="small" /></Grid>
                    <Grid item xs={4}><TextField width={'200px'} label="Amount Paid" name="amountPaid"  value={data.amountPaid} onChange={handleDataChange} size="small" /></Grid>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Button disabled={invoiceStatus} variant="contained" color="primary" startIcon={<ReceiptSharp />} onClick={createInvoice}>
                      Generate Invoice
                    </Button>
                  </Grid>
                </Grid>
                {invoiceStatus && (
                  <Typography color="primary" gutterBottom>
                    Invoice Generated Successfully. Please download invoice by clicking the button above
                  </Typography>
                )}
              </CardContent>
            </Card>

          </Box>
        </Grid>

        {/* --- RIGHT COLUMN: HTML INVOICE PREVIEW --- */}
        <Grid item xs={12} md={7}>
          <Paper elevation={4} sx={{ p: 4, backgroundColor: '#fff', minHeight: '800px', fontFamily: 'sans-serif' }} ref={invoiceRef}>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h4" fontWeight="bold"><img src='/images/logo.png' width={'200px'} height={'150px'}></img></Typography>
              <Typography variant="h6" sx={{ letterSpacing: 2 }}>INVOICE</Typography>
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
                    <tr><td style={{ paddingRight: '20px' }}>Invoice Number</td><td>: {data.invoiceNumber}</td></tr>
                    <tr><td>Invoice Date</td><td>: {data.invoiceDate}</td></tr>
                    <tr><td>GST No:</td><td>: {data.gstNumber}</td></tr>
                  </tbody>
                </table>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, fontSize: '14px' }}>
              <Box>
                <strong>Bill To</strong><br />
                {data.buyerName}<br />
                {data.buyerAddress}<br />
                {data.buyerPhone}
              </Box>
              <Box>
                <strong>Ship To</strong><br />
                {data.shipName}<br />
                {data.shipAddress}<br />
                {data.shipPhone}
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
              <strong>Thanks for your business.</strong>
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

            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', mt: 6 }}>
              <Box>
                <br /><br />
                Customer Signature<br />
                <span style={{ fontSize: '12px' }}>(Material Received with Good Condition)</span>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                Thanking you and assuring you the best of our services at all times<br />
                With Regards,<br /><br /><br />
                <strong>Authorized Signature</strong>
              </Box>
            </Box>

          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default InvoiceGenerator;