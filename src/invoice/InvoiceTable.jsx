import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  Typography
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function Row({ row }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell>{row.invoiceId}</TableCell>
        <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
        <TableCell>{row.buyerName}</TableCell>
        <TableCell>{row.buyerAddress}</TableCell>
        <TableCell>{row.buyerPhone}</TableCell>
        <TableCell>{row.gstNeeded ? 'Yes' : 'No'}</TableCell>
        <TableCell>₹{row.gstNeeded ? row.tax : 0}</TableCell>
        <TableCell>₹{row.totalAmount}</TableCell>
        <TableCell>₹{row.paidAmount}</TableCell>
        <TableCell>{row.items.filter((item) => item.isService).length}</TableCell>
        <TableCell>{row.items.filter((item) => !item.isService).length}</TableCell>
      </TableRow>

      {/* Collapsible Items */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Items
              </Typography>

              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>Item</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Serial No</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Rate</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Is Service</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {row.items.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.serialNo}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">₹{item.rate}</TableCell>
                      <TableCell align="right">
                        ₹{item.quantity * item.rate}
                      </TableCell>
                        <TableCell align="right">{item.isService ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function InvoiceTable({ data }) {
  return (
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#1976d2" }}>
            <TableCell />
            <TableCell sx={{ color: "white" }}>Invoice</TableCell>
            <TableCell sx={{ color: "white" }}>Date</TableCell>
            <TableCell sx={{ color: "white" }}>Buyer</TableCell>
            <TableCell sx={{ color: "white" }}>Address</TableCell>
            <TableCell sx={{ color: "white" }}>Phone</TableCell>
            <TableCell sx={{ color: "white" }}>GST Added</TableCell>
            <TableCell sx={{ color: "white" }}>Tax</TableCell>
            <TableCell sx={{ color: "white" }}>Total</TableCell>
            <TableCell sx={{ color: "white" }}>Paid</TableCell>
            <TableCell sx={{ color: "white" }}>Total Services</TableCell>
            <TableCell sx={{ color: "white" }}>Total Sales</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row) => (
            <Row key={row._id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}