const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const ArticleSchema = new Schema({
  title: String,
  content: String,
  body: String,
  numberOfLikes: Number
}, { timestamps: true });

const Article=mongoose.model('Article',ArticleSchema);

module.exports=Article