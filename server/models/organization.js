const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrganizationSchema = new Schema({
  name: { type: String },
  description: { type: String },
  address: { type: String },
  prov: { type: String },
  state: { type: String },
  location: [Number]
});

// SongSchema.statics.addLyric = function(id, content) {
//   const Lyric = mongoose.model('lyric');
//
//   return this.findById(id)
//     .then(song => {
//       const lyric = new Lyric({ content, song })
//       song.lyrics.push(lyric)
//       return Promise.all([lyric.save(), song.save()])
//         .then(([lyric, song]) => song);
//     });
// }
//
// SongSchema.statics.findLyrics = function(id) {
//   return this.findById(id)
//     .populate('lyrics')
//     .then(song => song.lyrics);
// }

mongoose.model('organization', OrganizationSchema);
