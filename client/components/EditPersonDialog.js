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

import query from '../queries/fetchPeople';

export default function EditPersonDialog(props) {
  console.log("EditPersonDialog", props)

  const {open, edit, person, onClose} = props;
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [contactType, setContactType] = React.useState("TELEPHONE");
  const [errors, setErrors] = React.useState([]);

  const resetFields = () => {
    setFirstName("")
    setLastName("")
    setTitle("")
    setContact("")
    setContactType("TELEPHONE")
    setErrors([])
  }

  const fireClose = () => {
    onClose();
  }

  const [addPerson, { addData }] = useMutation(gql `
    mutation AddPerson($firstName: String!, $lastName: String!, $contact: String!, $contactType: String!, $title: String) {
      addPerson(firstName: $firstName, lastName: $lastName, contact: $contact, contactType: $contactType, title: $title) {
        id
      }
    }
  `);

  const [updatePerson, {updateData}] = useMutation(gql`
    mutation UpdatePerson($personId: ID!, $firstName: String!, $lastName: String!, $title: String){
      updatePerson(id: $personId, firstName: $firstName, lastName: $lastName, title: $title){
        id, firstName, lastName, title
      }
    }
  `);

  React.useEffect(() => {
    if(edit && person){
      setTitle(person.title)
      setFirstName(person.firstName)
      setLastName(person.lastName)
    } else {
      resetFields();
    }
  }, [edit, person]);

  const validate = () => {
    let errs = [];

    if(!(firstName && firstName.length && firstName.length && firstName.length > 0)){
      errs.push({
        field: "firstName",
        message: "Inserisci il nome"
      })
    }

    if(!(lastName && lastName.length && lastName.length && lastName.length > 0)){
      errs.push({
        field: "lastName",
        message: "Inserisci il cognome"
      })
    }

    if(!edit) {
      if(!(contact && contact.length && contact.length && contact.length > 0)){
        errs.push({
          field: "contact",
          message: "Inserisci il contatto"
        })
      }

      if(!(contactType && contactType.length && contactType.length && contactType.length > 0)){
        errs.push({
          field: "contactType",
          message: "Inserisci il tipo di contatto"
        })
      }
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

    let mutation = addPerson;

    let variables = {
      firstName, lastName, title
    }

    if(edit) {
      mutation = updatePerson;
      variables.personId = props.person.id;
    } else {
      variables.contact = contact;
      variables.contactType = contactType;
    }

    mutation({ variables,
      refetchQueries: [{query: query}]
    })
    .then(() => {
      fireClose();
      // resetFields();
    })
    .catch(err => console.log(err));
  }

  const renderContactField = () => {
    if(!edit) {
      return <TextField
        margin="dense"
        id="contact"
        error={ hasErrors('contact') }
        helperText={ errorMessage('contact') }
        label="Contatto"
        type="text"
        required
        onChange={ (e) => setContact(e.target.value)}
        fullWidth
      />
    } else {
      return null;
    }
  }

  return (
    <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{ edit ? 'Modifica' : 'Crea' } una persona</DialogTitle>
      <DialogContent>
        <form>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            error={ hasErrors('title') }
            helperText={ errorMessage('title') }
            label="Titolo"
            placeholder="Sig."
            type="text"
            onChange={ (e) => setTitle(e.target.value)}
            defaultValue= {title}
            fullWidth
          />
          <TextField
            margin="dense"
            id="firstName"
            error={ hasErrors('firstName') }
            helperText={ errorMessage('firstName') }
            label="Nome"
            type="text"
            required
            onChange={ (e) => setFirstName(e.target.value)}
            defaultValue= { firstName }
            fullWidth
          />
          <TextField
            margin="dense"
            id="firstName"
            error={ hasErrors('lastName') }
            helperText={ errorMessage('lastName') }
            label="Cognome"
            type="text"
            required
            onChange={ (e) => setLastName(e.target.value)}
            defaultValue= { lastName }
            fullWidth
          />

          { renderContactField() }
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
