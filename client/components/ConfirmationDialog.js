import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ConfirmationDialog(props) {
  const [open, setOpen] = useState(false);
  var isOpen = props.open;

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  function fireNo(){
    setOpen(false);
    if(props.onNo){
      props.onNo();
    }
  };

  function fireYes(){
    if(props.onYes){
      props.onYes(props.token);
    }
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={fireNo}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{ props.title }</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          { props.children }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={fireNo} color="primary" autoFocus>
          No
        </Button>
        <Button onClick={fireYes} color="primary">
          Sì
        </Button>
      </DialogActions>
    </Dialog>
  );
}
