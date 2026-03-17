import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";

import InventoryTable from "../components/InventoryTable";
import PageHeader from "../components/PageHeader";

import {
  getInventory,
  deleteInventory
} from "../api/inventoryApi";

export default function InventoryList() {

  const [items, setItems] = useState([]);

  const navigate = useNavigate();

  const loadData = async () => {

    const res = await getInventory();

    setItems(res.data);

  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {

    await deleteInventory(id);

    loadData();

  };

  return (

    <Box p={3}>

      <PageHeader title="Inventory" />

      <Button
        variant="contained"
        onClick={() => navigate("/inventory/add")}
        sx={{ mb: 2 }}
      >
        Add Item
      </Button>

      <InventoryTable
        rows={items}
        onDelete={handleDelete}
        onEdit={(id) => navigate(`/inventory/edit/${id}`)}
      />

    </Box>

  );
}