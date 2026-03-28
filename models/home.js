const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema({
  houseName: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  rating: { type: String, required: true },
  photo: { type: String },
  description: { type: String },
});

// homeSchema.pre('findOneAndDelete', async function(next){
  
//   const homeid = this.getQuery()._id;
//   await Favourite.deleteMany({houseId : homeid});
//   next();
// });

module.exports = mongoose.model("Home", homeSchema);
