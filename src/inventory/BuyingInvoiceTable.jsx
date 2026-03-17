import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button
} from "@mui/material";
import { API_BASE_URL } from "../utils/constants";

const BuyingInvoiceTable = ({ invoices }) => {

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Buying Invoices
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="center">PDF</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice._id}>
              <TableCell>{invoice.name}</TableCell>
              <TableCell>{formatDate(invoice.date)}</TableCell>

              <TableCell align="center">
                <Button
                  variant="contained"
                  size="small"
                  href={`${API_BASE_URL}/inventory/invoice/${invoice._id}`}
                  target="_blank"
                >
                  View
                </Button>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BuyingInvoiceTable;