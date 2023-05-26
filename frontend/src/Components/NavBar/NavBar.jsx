import React, { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import apidata from '../../data/apidataDbmanager';
import apidataAudience from '../../data/apidataAudience';
import apidataDirector from '../../data/apidataDirector';

export default function NavBar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedPage, setSelectedPage] = useState("Please Select A Functionality");
  

  
  async function handleMenuItemClick (page, index) {
    const type = await localStorage.getItem("type");
    console.log(type, "bu")
    navigate(`/api/${type}/${page}`)
    setSelectedPage(page);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup fullWidth sx={{ height: '60px' }} variant="contained" ref={anchorRef} aria-label="split button">
        <Button
          size="large"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        > {selectedPage}
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 2,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow 
            {...TransitionProps}
            style={{
              
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper sx={{ width: 250 }}>
              <ClickAwayListener  onClickAway={handleClose}>
                <MenuList  id="split-button-menu" autoFocusItem>
                  {localStorage.getItem("type") === "db-manager" && Object.keys(apidata).map((key, index) => (
                    <MenuItem
                      sx={{ justifyContent: 'center' }}
                      key={key}
                      selected={key === selectedPage}
                      onClick={() => handleMenuItemClick(key, index)}
                    >
                      {apidata[key].name}
                    </MenuItem>
                  ))}
                  {localStorage.getItem("type") === "director" && Object.keys(apidataDirector).map((key, index) => (
                    <MenuItem
                      sx={{ justifyContent: 'center' }}
                      key={key}
                      selected={key === selectedPage}
                      onClick={() => handleMenuItemClick(key, index)}
                    >
                      {apidataDirector[key].name}
                    </MenuItem>
                  ))}
                  {localStorage.getItem("type") === "audience" && Object.keys(apidataAudience).map((key, index) => (
                    <MenuItem
                      sx={{ justifyContent: 'center' }}
                      key={key}
                      selected={key === selectedPage}
                      onClick={() => handleMenuItemClick(key, index)}
                    >
                      {apidataAudience[key].name}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
} 