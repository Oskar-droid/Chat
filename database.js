const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

// MongoDb
mongoose.connect("mongodb://localhost:27017/webdevchat", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const messageSchema = new mongoose.Schema({
  user: Object,
  message: Object,
});

const Messages = mongoose.model("Messages", messageSchema);

module.exports = {
  Messages,
}
