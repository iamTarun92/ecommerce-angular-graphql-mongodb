// Validation Query
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "password"],
      properties: {
        username: {
          bsonType: "string",
          description: "Username must be a string and is required",
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "Email must be a valid email address and is required",
        },
        password: {
          bsonType: "string",
          description: "Password must be a string and is required",
        },
      },
    },
  },
  validationAction: "error", // or "warn" or "off"
});
db.runCommand({
  collMod: "users",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "password"],
      properties: {
        username: {
          bsonType: "string",
          description: "Username must be a string and is required",
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "Email must be a valid email address and is required",
        },
        password: {
          bsonType: "string",
          description: "Password must be a string and is required",
        },
      },
    },
  },
  validationAction: "error", // or "warn" or "off"
});

// Read Query
db.myCollection.find({ age: 12 });
db.myCollection.find({ age: 12 }).count();
db.myCollection.find({ age: 12 }).size();
db.myCollection.find({ age: 12 }).forEach((element) => {
  printjson(element);
});
db.myCollection.find({ age: 12 }).toArray(); // It return all data at one time
db.myCollection.find({ age: 12 }).limit(5);
db.myCollection.find({ age: 12 }).skip(5);
db.myCollection.find({ age: { $lt: 12 } });
db.myCollection.find({ age: { $gt: 5, $lt: 12 } });
db.myCollection.find({ age: { $lt: 12 }, age: { $gt: 5 } }); // age: { $gt: 5 } will only work bcz we have same key name
db.myCollection.find({ age: { $exists: true, $type: 8 } }); // To check if key is exists with value type
db.myCollection.find({ $expr: { $gt: [$spent, $budget] } });
db.myCollection.find({ experience: { $size: 3 } }); // which student has 3 company experience
db.myCollection.find({
  $and: [
    { experience: { $exists: ture } },
    { $expr: { $gte: [{ $size: "$experience" }, 3] } },
  ],
}); // without and opertor error will come bcz maybe some document has not experience key
db.myCollection.find({ tags: ["A", "B"] }); // Select only value "A B" not "B A" into array
db.myCollection.find({ tags: { $all: ["A", "B"] } }); // Select all value "A B" or "B A" condition here A,B both should available in array
db.myCollection.find({ tags: { $in: ["A", "B"] } }); // Select all value "A B" or "B A"

// Create Query
db.myCollection.insertMany(
  [
    { _id: "A", name: "A" },
    { _id: "A", name: "B" },
    { _id: "C", name: "C" },
  ],
  {
    ordered: false, // duplicate entry avoid and next entry will be add
  }
);

// Update Query
db.myCollection.updateOne({ item: "canvas" }, { max: { qty: 200 } });
db.myCollection.updateOne(
  { item: "canvas" },
  { $set: { qty: 200 } },
  { upsert: true }
); // create new entry if filter is not found into collection

// Aggregate Query
db.orders.aggregate([
  {
    $match: { size: "small" },
  },
  {
    // $group: { _id: "$size", sizes: { $push: "$size" } },
    $group: { _id: "$size", sizes: { $push: "$$ROOT" } },
  },
]);
db.marks.aggregate([
  {
    $lookup: {
      from: "students",
      localField: "student_id",
      foreignField: "_id",
      as: "student_id",
    },
  },
  {
    $lookup: {
      from: "subjects",
      localField: "subject_id",
      foreignField: "_id",
      as: "subject_id",
    },
  },
  {
    $lookup: {
      from: "exams",
      localField: "exam_id",
      foreignField: "_id",
      as: "exam_id",
    },
  },
  {
    $group: {
      _id: null,
      students: {
        $push: "$student_id",
      },
      subjects: {
        $push: "$subject_id",
      },
      exams: {
        $push: "$exam_id",
      },
    },
  },
]);
db.users.aggregate([
  [
    {
      $group: {
        _id: null,
        names: {
          $push: "$name",
        },
        ages: {
          $push: "$age",
        },
        ageSum: {
          $sum: "$age",
        },
        averageAge: {
          $avg: "$age",
        },
      },
    },
  ],
]);
