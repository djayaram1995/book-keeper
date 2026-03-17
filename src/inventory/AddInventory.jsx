import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import InventoryForm from "../components/InventoryForm";
import PageHeader from "../components/PageHeader";

import { createInventory } from "../api/inventoryApi";

export default function AddInventory() {

  const navigate = useNavigate();

  const handleSubmit = async (data) => {

    await createInventory(data);

    navigate("/");

  };

  return (

    <Box p={3}>

      <PageHeader title="Add Inventory Item" />

      <InventoryForm
        initialValues={{
          itemName: "",
          sku: "",
          availableQuantity: 0,
          procurementPrice: 0,
          sellingPrice: 0
        }}
        onSubmit={handleSubmit}
      />

    </Box>
  );
}