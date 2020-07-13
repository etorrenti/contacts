import React, {Component} from 'react';
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

import query from '../queries/fetchOrganization';

export default function EditFunctionDialog(props) {
  const {open, edit, funct, organizationId, onClose} = props;
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [errors, setErrors] = React.useState([]);

  const resetFields = () => {
    setName("")
    setDescription("")
    setErrors([])
  }

  const fireClose = () => {
    onClose();
  }

  const [addFunction, { addData }] = useMutation(gql `
    mutation AddFunction($organizationId: ID!, $name: String!, $description: String){
      addFunction(organizationId: $organizationId, name: $name, description: $description) {
        id, name
      }
    }
  `);

  const [updateFunction, {updateData}] = useMutation(gql`
    mutation UpdateFunction($organizationId: ID!, $functionId: ID!, $name: String!, $description: String){
      updateFunction(organizationId: $organizationId, functionId: $functionId, name: $name, description: $description) {
        id, name
      }
    }
  `);

  React.useEffect(() => {
    if(edit && funct){
      setName(funct.name)
      setDescription(funct.description)
    } else {
      resetFields();
    }
  }, [edit, funct]);

  const validate = () => {
    let errs = [];

    if(!(name && name.length && name.length && name.length > 0)){
      errs.push({
        field: "name",
        message: "Inserisci il nome"
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
    fireClose()
    resetFields()
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if(!validate()){
      return;
    }

    let mutation = addFunction;

    let variables = {
      name, description, organizationId
    }

    if(edit) {
      mutation = updateFunction;
      variables.functionId = props.funct.id;
    }

    mutation({ variables,
      refetchQueries: [{query: query, variables: {id: organizationId}}]
    })
    .then(() => {
      fireClose();
      // resetFields();
    })
    .catch(err => console.log(err));

    resetFields();
  }

  return (
    <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{ edit ? 'Modifica' : 'Crea' } una funzione</DialogTitle>
      <DialogContent>
        <form>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            error={ hasErrors('name') }
            helperText={ errorMessage('name') }
            label="Nome"
            type="text"
            onChange={ (e) => setName(e.target.value)}
            defaultValue= {name}
            fullWidth
          />
          <TextField
            margin="dense"
            id="description"
            error={ hasErrors('description') }
            helperText={ errorMessage('description') }
            label="Descrizione"
            type="text"
            required
            onChange={ (e) => setDescription(e.target.value)}
            defaultValue= { description }
            fullWidth
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
  )
}
