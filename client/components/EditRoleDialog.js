import React from 'react';
import {graphql} from 'react-apollo';
import { useMutation } from "@apollo/react-hooks";
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function EditRoleDialog(props) {

  const {open, edit, rolePerson, onClose} = props
  const [role, setRole] = React.useState("");
  const [person, setPerson] = React.useState(null);
  const [errors, setErrors] = React.useState([]);

  const resetFields = () => {
    setRole("")
    setPerson(null)
    setErrors([])
  }

  const fireClose = () => {
    onClose();
  }

  React.useEffect(() => {
    if(edit && rolePerson){
      setRole(rolePerson.title)
      setPerson(rolePerson.person)
    } else {
      resetFields();
    }
  }, [edit, rolePerson]);

  const validate = () => {
    let errs = [];

    if(!(role && role.length && role.length && role.length > 0)){
      errs.push({
        field: "role",
        message: "Scegli un ruolo"
      })
    }

    setErrors(errs);
    return errs.length == 0;
  }

  const hasErrors = (field) => {
    return errors.findIndex( x => x.field == field) >= 0;
  }

  const errorMessage = (field) => {
    const i = errors.findIndex( x => x.field == field);
    if(i < 0){
      return null;
    }

    return errors[i].message;
  }

  const handleCancel = () => {
    if(props.cancelCallback) {
      props.cancelCallback();
    }
  };

  const handleAdd = () => {
    const ok = validate();

    if(ok && props.addCallback) {
      props.addCallback({role, person});
    }
  };

  return (
    <Dialog open={props.open} onClose={handleCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Modifica Ruolo</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Crea un ruolo nell'organizzazione
        </DialogContentText>
        <form>
          <TextField
            autoFocus
            margin="dense"
            id="role"
            error={ hasErrors('role') }
            helperText={ errorMessage('role') }
            label="Ruolo"
            type="text"
            required
            onChange={ (e) => setRole(e.target.value)}
            fullWidth
          />
          <Autocomplete
            id="autocomplete"
            options={ props.people || [] }
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            style={{ width: '450px' }}
            renderInput={(params) => <TextField {...params} label="Titolare (opzionale)" variant="outlined" />}
            onChange={ (e, value) => setPerson(value)}
          />
        </form>
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
  );
}
