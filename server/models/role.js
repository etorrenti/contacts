const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  title: { type: String },
  person:{
    type: Schema.Types.ObjectId,
    ref: 'person'
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'organization'
  }
},
{
  usePushEach: true
});

mongoose.model('role', RoleSchema);
