import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  TableContainer
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const InventoryTable = ({ rows, onDelete, onEdit }) => {

  return (
    <TableContainer component={Paper}>

      <Table>

        <TableHead>

          <TableRow>

            <TableCell>Item</TableCell>
            <TableCell>SKU</TableCell>
            <TableCell>Available</TableCell>
            <TableCell>Procurement</TableCell>
            <TableCell>Selling</TableCell>
            <TableCell>Stock Value</TableCell>
            <TableCell align="right">Actions</TableCell>

          </TableRow>

        </TableHead>

        <TableBody>

          {rows.map((item) => (

            <TableRow key={item._id} hover>

              <TableCell>{item.itemName}</TableCell>

              <TableCell>{item.sku}</TableCell>

              <TableCell>{item.availableQuantity}</TableCell>

              <TableCell>₹{item.procurementPrice}</TableCell>

              <TableCell>₹{item.sellingPrice}</TableCell>

              <TableCell>₹{item.stockValue}</TableCell>

              <TableCell align="right">

                <IconButton onClick={() => onEdit(item._id)}>
                  <EditIcon />
                </IconButton>

                <IconButton
                  color="error"
                  onClick={() => onDelete(item._id)}
                >
                  <DeleteIcon />
                </IconButton>

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </TableContainer>
  );
}

export default InventoryTable;