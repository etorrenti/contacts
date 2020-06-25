import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function AddRoleDialog(props) {
  const [role, setRole] = React.useState("");
  const [person, setPerson] = React.useState(null);

  const handleCancel = () => {
    if(props.cancelCallback) {
      props.cancelCallback();
    }
  };

  const handleAdd = () => {
    if(props.addCallback) {
      props.addCallback({role, person});
    }
  };

  return (
    <div>
      <Dialog open={props.open} onClose={handleCancel} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Modifica Ruolo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Crea un ruolo nell'organizzazione
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="role"
            label="Ruolo"
            type="text"
            onChange={ (e) => setRole(e.target.value)}
            fullWidth
          />
          <Autocomplete
            id="autocomplete"
            options={ props.people || [] }
            getOptionLabel={(option) => option.title}
            style={{ width: '450px' }}
            renderInput={(params) => <TextField {...params} label="Titolare (opzionale)" variant="outlined" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Annulla
          </Button>
          <Button onClick={handleAdd} color="primary">
            Inserisci
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
