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
import query from '../queries/fetchOrganization'

export default function EditRoleDialog(props) {
  const {open, edit, rolePerson, onClose, organizationId} = props
  const [title, setTitle] = React.useState("");
  const [person, setPerson] = React.useState(null);
  const [errors, setErrors] = React.useState([]);

  const resetFields = () => {
    setTitle("")
    setPerson(null)
    setErrors([])
  }

  const fireClose = () => {
    onClose();
  }

  React.useEffect(() => {
    if(edit && rolePerson){
      setTitle(rolePerson.title)
      setPerson(rolePerson.person)
    } else {
      resetFields();
    }
  }, [edit, rolePerson]);

  const validate = () => {
    let errs = [];

    if(!(title && title.length && title.length && title.length > 0)){
      errs.push({
        field: "title",
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
    resetFields()
    fireClose()
  };

  const [addRole, {addData}] = useMutation(gql`
    mutation AddRole($organizationId: ID!, $title: String!, $personId: ID) {
      addRole(organizationId: $organizationId, title: $title, personId: $personId) {
        roles {
          title
          person {
            id
            firstName
            lastName
          }
        }
      }
    }
  `);

  const [updateRole, {updateData}] = useMutation(gql`
    mutation UpdateRole($personId: ID, $organizationId: ID!, $roleId: ID!, $title: String!) {
      updateRole(roleId: $roleId, organizationId: $organizationId, title: $title, personId: $personId) {
        id
        roles {
          id
          title
          person {
            id
          }
        }
      }
    }
  `);

  const onSubmit = (e) => {
    e.preventDefault();
    if(!validate()){
      return;
    }

    let mutation = addRole;

    let variables = {
      organizationId, title
    }

    variables.personId = person ? person.id : null;

    if(edit) {
      mutation = updateRole;
      variables.roleId = rolePerson.id;

      console.log(variables)
    }

    mutation({ variables,
      refetchQueries: [{query: query, variables: {id: organizationId}}]
    })
    .then(() => {
      fireClose();
    })
    .catch(err => console.log(err));

    resetFields();
  }

  return (
    <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{ edit ? 'Modifica' : 'Crea' } un ruolo</DialogTitle>
      <DialogContent>
        <form>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            error={ hasErrors('title') }
            helperText={ errorMessage('title') }
            label="Ruolo"
            type="text"
            required
            onChange={ (e) => setTitle(e.target.value)}
            defaultValue= { title }
            fullWidth
          />
          <Autocomplete
            id="autocomplete"
            options={ props.people || [] }
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            getOptionSelected = {(option, value) => option.id == value.id}
            style={{ width: '450px' }}
            renderInput={(params) => <TextField {...params} label="Titolare (opzionale)" variant="outlined" />}
            onChange={ (e, value) => setPerson(value)}
            value = { person }
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Annulla
        </Button>
        <Button onClick={onSubmit} color="primary">
          { edit ? 'Modifica' : 'Inserisci'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
