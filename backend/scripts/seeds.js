const mongoose = require("mongoose");
const connection = process.env.MONGODB_URI;
mongoose.connect(connection);

const User = mongoose.model("User");
const Item = mongoose.model("Item");
const Comment = mongoose.model("Comment");

const options = { upsert: true, new: true };
async function seedDatabase() {
  for (let i = 0; i < 100; i++) {
    const user = { username: `user${i}`, email: `user${i}@gmail.com` };
    const options = { upsert: true, new: true };
    const createdUser = await User.findOneAndUpdate(user, {}, options);
    
    const item = {
      slug: `slug${i}`,
      title: `title ${i}`,
      description: `description ${i}`,
      seller: createdUser,
    };
    const createdItem = await Item.findOneAndUpdate(item, {}, options);
    
    if (!createdItem?.comments?.length) {
      let commentIds = [];
      for (let j = 0; j < 100; j++) {
        const comment = new Comment({
          body: `body ${j}`,
          seller: createdUser,
          item: createdItem,
        });
        await comment.save();
        commentIds.push(comment._id);
      }
      createdItem.comments = commentIds;
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
