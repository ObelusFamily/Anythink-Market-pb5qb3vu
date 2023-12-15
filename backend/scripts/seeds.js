//TODO: seeds script should come here, so we'll be able to put some data in our local env
const mongoose = require("mongoose");
const connectionUri = "mongodb://localhost:27017/anythink-market";
mongoose.connect(connectionUri);

const User = mongoose.model("User");
const Item = mongoose.model("Item");
const Comment = mongoose.model("Comment");
const options = { upsert: true, new: true };
async function seedDatabase() {
  for (let i = 0; i < 100; i++) {
    const user = {
      username: `user${i}`,
      email: `user${i}gmail.com`,
    };

    const createdUser = await User.findAndUpdate(user, {}, options);

    const item = {
      slug: `item${i}`,
      description: `description${i}`,
      seller: createdUser,
      title: `title${i}`,
    };

    const createdItem = await Item.findAndUpdate(item, {}, options);

    if (!createdItem?.comments?.length) {
      let commentsIds = [];
      for (let j = 0; j < 100; j++) {
        const comment = new Comment({
          body: `awesome comment${j}}`,
          seller: createdUser,
          item: createdItem,
        });
        await comment.save();
        commentsIds.push(comment._id);
      }
      createdItem.comments = commentsIds;
      await createdItem.save();
    }
  }
}

seedDatabase()
  .then(() => {
    console.log("Finished db seeding");
    process.exit(0);
  })
  .catch((err) => {
    console.err(`Error running db seed: ${err.message}`);
    process.exit(1);
  });