import React, { useContext, useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Paper,
  Popover,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SearchContext from "../Context/SearchContext";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const AlertMessage = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "info-popover" : undefined;

  return (
    <Box component="span">
      <InfoOutlinedIcon
        color="info"
        onClick={handleClick}
        sx={{ cursor: "pointer" }}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography>
            Please refresh the page and try again if the data doesn't appear.
          </Typography>
        </Box>
      </Popover>
    </Box>
  );
};

const Search = () => {
  const { setSearchValue } = useContext(SearchContext);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearchValue(inputValue);
    setInputValue("");
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      paddingY="20px"
      width="100%"
    >
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: "500px",
          margin: "0 auto",
        }}
        onSubmit={handleSubmit}
      >
        <Box sx={{ p: "8px" }}>
          <AlertMessage />
        </Box>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search User"
          inputProps={{ "aria-label": "search user" }}
          value={inputValue}
          onChange={handleInputChange}
        />
      </Paper>
        {/* <IconButton type="submit" sx={{ p: "8px" }} aria-label="search">
          <SearchIcon />
        </IconButton> */}
    </Box>
  );
};

export default Search;
