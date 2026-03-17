import {
  Typography, Box, 
  AppBar, Toolbar, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, CssBaseline
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InvoiceGenerator from './invoice/InvoiceGenerator';
import SalesView from './sales/SalesView';
import { Link, Route, Routes } from 'react-router-dom';
import BuyingInvoiceView from './inventory/BuyingInvoiceView';
import BuyingInvoiceUpload from './inventory/BuyingInvoiceUpload';
import InventoryList from './inventory/InventoryList';
import AddInventory from './inventory/AddInventory';
import EditInventory from './inventory/EditInventory';
import QuotationGenerator from './quotation/QuotationGenerator';

const drawerWidth = 240;

const App = () => {

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* --- TOP HEADER BAR --- */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#0d1013' }}>
        <Toolbar>
          <img src="/images/deco_logo.svg" height={'80px'} width={'160px'} />
          <Typography variant="h6" noWrap component="div">
            Deco Sales & Service
          </Typography>
        </Toolbar>
      </AppBar>

      {/* --- SIDEBAR --- */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar /> {/* Spacer to push content below the AppBar */}
        <Box sx={{ overflow: 'auto', marginTop: '15px' }}>
          <List>
            <Link to="/sales">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <ReceiptIcon color="primary" />
                </ListItemIcon>
                
                  <ListItemText primary="Sales" />
                
              </ListItemButton>
            </ListItem>
            </Link>
             <Link to="/quotation">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <ReceiptIcon color="primary" />
                </ListItemIcon>
                
                  <ListItemText primary="Quotation" />
                
              </ListItemButton>
            </ListItem>
            </Link>
             <Link to="/inventory-invoice">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <ReceiptIcon color="primary" />
                </ListItemIcon>
                
                  <ListItemText primary="Inventory Invoices" />
                
              </ListItemButton>
            </ListItem>
            </Link>
             <Link to="/inventory">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <ReceiptIcon color="primary" />
                </ListItemIcon>
                
                  <ListItemText primary="Inventory management" />
                
              </ListItemButton>
            </ListItem>
            </Link>
          </List>
        </Box>
      </Drawer>

      {/* --- MAIN CONTENT AREA --- */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh', minWidth: '85vw' }}>
        <Toolbar /> {/* Spacer to push content below the AppBar */}
    <Routes>
        <Route path="/" element={<SalesView />} />
        <Route path="/sales" element={<SalesView />} />
        <Route path="/quotation" element={<QuotationGenerator />} />
        <Route path="/inventory-invoice" element={<BuyingInvoiceView />} />
        <Route path="/inventory-invoice-upload" element={<BuyingInvoiceUpload />} />
        <Route path="/generate-invoice/:id" element={<InvoiceGenerator />} />
          <Route path="/inventory" element={<InventoryList />} />

        <Route path="/inventory/add" element={<AddInventory />} />

        <Route path="/inventory/edit/:id" element={<EditInventory />} />
      </Routes>
        
      </Box>
    </Box>
  );
};

export default App;