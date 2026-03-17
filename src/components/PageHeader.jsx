import { Typography, Box } from "@mui/material";

const PageHeader = ({ title }) => {
  return (
    <Box mb={3}>
      <Typography variant="h5" fontWeight={600}>
        {title}
      </Typography>
    </Box>
  );
}

export default PageHeader