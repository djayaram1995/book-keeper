import { Grid, TextField, Button } from "@mui/material";
import { useState } from "react";

const InventoryForm = ({ initialValues, onSubmit }) => {

  const [form, setForm] = useState(initialValues);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  return (

    <Grid container spacing={2}>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Item Name"
          name="itemName"
          value={form.itemName}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="SKU"
          name="sku"
          value={form.sku}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Available Quantity"
          name="availableQuantity"
          type="number"
          value={form.availableQuantity}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Procurement Price"
          name="procurementPrice"
          type="number"
          value={form.procurementPrice}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Selling Price"
          name="sellingPrice"
          type="number"
          value={form.sellingPrice}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          onClick={() => onSubmit(form)}
        >
          Save
        </Button>
      </Grid>

    </Grid>
  );
}


export default InventoryForm;