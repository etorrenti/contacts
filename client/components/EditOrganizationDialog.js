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

import query from '../queries/fetchOrganizations';

export default function EditOrganizationDialog(props) {
  console.log("EditOrganizationDialog", props)

  const {open, edit, organization, onClose} = props;
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [prov, setProv] = React.useState("");
  const [state, setState] = React.useState("");

  const [errors, setErrors] = React.useState([]);

  const resetFields = () => {
    setName("")
    setDescription("")
    setAddress("")
    setCity("")
    setProv("")
    setState("")
    setErrors([])
  }

  const fireClose = () => {
    onClose();
  }

  const [addOrganization, { addData }] = useMutation(gql `
    mutation AddOrganization($name: String!, $description: String, $address: String, $city: String, $prov: String, $state: String){
      addOrganization(name: $name, description: $description, address: $address, city: $city, prov: $prov, state: $state){
        id, name, description, address, city, prov, state
      }
    }
  `);

  const [updateOrganization, {updateData}] = useMutation(gql`
    mutation UpdateOrganization($id: ID!, $name: String!, $description: String, $address: String, $city: String, $prov: String, $state: String){
      updateOrganization(id: $id, name: $name, description: $description, address: $address, city: $city, prov: $prov, state: $state){
        id, name, description, address, city, prov, state
      }
    }
  `);

  React.useEffect(() => {
    if(edit && organization){
      setName(organization.name)
      setDescription(organization.description)
      setAddress(organization.address)
      setCity(organization.city)
      setProv(organization.prov)
      setState(organization.state)
    } else {
      resetFields();
    }
  }, [edit, organization]);

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
    // resetFields()
    fireClose()
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if(!validate()){
      return;
    }

    let mutation = addOrganization;

    let variables = {
      name, description, address, city, prov, state
    }

    if(edit) {
      mutation = updateOrganization;
      variables.id = organization.id;
    }

    mutation({ variables,
      refetchQueries: [{query: query}]
    })
    .then(() => {
      fireClose();
    })
    .catch(err => console.log(err));
  }

  return (
    <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{ edit ? 'Modifica' : 'Crea' } organizzazione</DialogTitle>
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
            required
          />
          <TextField
            margin="dense"
            id="description"
            error={ hasErrors('description') }
            helperText={ errorMessage('description') }
            label="Descrizione"
            type="text"
            onChange={ (e) => setDescription(e.target.value)}
            defaultValue= {description}
            fullWidth
          />
          <TextField
            margin="dense"
            id="address"
            error={ hasErrors('address') }
            helperText={ errorMessage('address') }
            label="Indirizzo"
            type="text"
            onChange={ (e) => setAddress(e.target.value)}
            defaultValue= {address}
            fullWidth
          />
          <TextField
            margin="dense"
            id="city"
            error={ hasErrors('city') }
            helperText={ errorMessage('city') }
            label="Comune"
            type="text"
            onChange={ (e) => setCity(e.target.value)}
            defaultValue= {city}
            fullWidth
          />
          <TextField
            margin="dense"
            id="prov"
            error={ hasErrors('prov') }
            helperText={ errorMessage('prov') }
            label="Provincia"
            type="text"
            onChange={ (e) => setProv(e.target.value)}
            defaultValue= {prov}
            fullWidth
          />
          <TextField
            margin="dense"
            id="state"
            error={ hasErrors('state') }
            helperText={ errorMessage('state') }
            label="Stato"
            type="text"
            onChange={ (e) => setState(e.target.value)}
            defaultValue= {state}
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
