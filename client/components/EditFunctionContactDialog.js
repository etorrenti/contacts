import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import { useMutation } from "@apollo/react-hooks";
import gql from 'graphql-tag';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import query from '../queries/fetchOrganization';

export default function EditFunctionContactDialog(props) {
  console.log("EditFunctionContactDialog", props)

  const {open, edit, contactObj, functionId, organizationId, onClose} = props;
  const [value, setValue] = React.useState("");
  const [contactType, setContactType] = React.useState("TELEPHONE");
  const [errors, setErrors] = React.useState([]);

  const resetFields = () => {
    setValue("")
    setContactType("TELEPHONE")
    setErrors([])
  }

  const fireClose = () => {
    resetFields()
    onClose();
  }

  const [addContact, { addData }] = useMutation(gql `
    mutation AddContactToFunction($functionId: ID!, $contact: String!, $contactType: String!){
      addContactToFunction(functionId: $functionId, contact: $contact, contactType: $contactType){
        id, contacts{
          contactType, value
        }
      }
    }
  `);

  const [updateContact, {updateData}] = useMutation(gql`
    mutation UpdateContactToFunction($functionId: ID!, $contactId: ID!, $contact: String!, $contactType: String!){
      updateContactInFunction(functionId: $functionId, contactId: $contactId, contact: $contact, contactType: $contactType){
        id, contacts{
          id, contactType, value
        }
      }
    }
  `);

  React.useEffect(() => {
    if(edit && contactObj){
      setValue(contactObj.value)
      setContactType(contactObj.contactType)
    } else {
      resetFields();
    }
  }, [edit, contactObj]);

  const validate = () => {
    let errs = [];

    if(!(value && value.length && value.length && value.length > 0)){
      errs.push({
        field: "value",
        message: "Inserisci il contatto"
      })
    }

    if(!(contactType && contactType.length && contactType.length && contactType.length > 0)){
      errs.push({
        field: "contactType",
        message: "Seleziona il tipo di contatto"
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
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if(!validate()){
      return;
    }

    let mutation = addContact;

    let variables = {
      contactType, functionId
    }
    variables.contact = value;

    if(edit) {
      mutation = updateContact;
      variables.contactId = contactObj.id;
    }

    mutation({ variables,
      refetchQueries: [{query: query, variables: {id: organizationId}}]
    })
    .then(() => {
      fireClose();
    })
    .catch(err => console.log(err));
  }

  return (
    <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{ edit ? 'Modifica' : 'Crea' } un contatto</DialogTitle>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <TextField
            margin="dense"
            id="value"
            error={ hasErrors('value') }
            helperText={ errorMessage('value') }
            label="Contatto"
            type="text"
            required
            defaultValue={value}
            onChange={ (e) => setValue(e.target.value)}
            fullWidth
          />

          <InputLabel id="type-label">Tipo</InputLabel>
          <Select
            labelId="type-label"
            id="type"
            value={ contactType }
            required
            defaultValue= {contactType}
            fullWidth
            onChange={ (e) => setContactType(e.target.value) }
          >
            { ["TELEPHONE", "MOBILE", "EMAIL"].map(t => <MenuItem key={`select_t_${t}`} value={t}>{t}</MenuItem>) }
          </Select>
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
