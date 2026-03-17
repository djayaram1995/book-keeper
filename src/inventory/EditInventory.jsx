import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

import InventoryForm from "../components/InventoryForm";
import PageHeader from "../components/PageHeader";

import {
  getInventoryById,
  updateInventory
} from "../api/inventoryApi";

export default function EditInventory() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [item, setItem] = useState(null);

  useEffect(() => {

    getInventoryById(id).then((res) => {
      setItem(res.data);
    });

  }, [id]);

  const handleSubmit = async (data) => {

    await updateInventory(id, data);

    navigate("/");

  };

  if (!item) return null;

  return (

    <Box p={3}>

      <PageHeader title="Edit Inventory Item" />

      <InventoryForm
        initialValues={item}
        onSubmit={handleSubmit}
      />

    </Box>

  );
}