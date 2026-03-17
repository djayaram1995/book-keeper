import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper
} from "@mui/material";


import axios from "axios";
import moment from "moment";
import { API_BASE_URL } from "../utils/constants";
import { Link } from "react-router-dom";

const BuyingInvoiceUpload = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!name || !date || !file) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("date", date);
    formData.append("pdf", file);

    try {
      setLoading(true);

      await axios.post(
        `${API_BASE_URL}/inventory/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Invoice uploaded successfully");

      setName("");
      setDate(moment().format("YYYY-MM-DD"));
      setFile(null);

    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, margin: "auto" }}>
        <Typography variant="h6" mb={3}>
          Upload Buying Invoice
        </Typography>

        <Box display="flex" flexDirection="column" gap={3}>
          
          <TextField
            label="Invoice Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
<TextField fullWidth label="Invoice Date" name="invoiceDate" type="date"  value={date}   onChange={(e) => setDate(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
        
          <Button
            variant="outlined"
            component="label"
          >
            Upload PDF
            <input
              type="file"
              hidden
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </Button>

          {file && (
            <Typography variant="body2">
              Selected: {file.name}
            </Typography>
          )}

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Submit"}
          </Button>
          <Link to="/inventory-invoice" style={{ textDecoration: 'none' }}>
             <Button variant="contained" sx={{ width: '100%' }}>
                        Back to Invoices
                    </Button>
                    </Link>

        </Box>
      </Paper>
  );
};

export default BuyingInvoiceUpload;