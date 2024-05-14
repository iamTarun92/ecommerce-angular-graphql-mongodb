const aggregateQuery = [
  // How may users are active with count
  [
    {
      $match: {
        isActive: true,
      },
    },
    {
      $count: "isActive",
    },
  ],
  // What is the average age of all users
  [
    {
      $group: {
        _id: null,
        averageAge: {
          $avg: "$age",
        },
      },
    },
  ],
  // What is the total sum of all users
  [
    {
      $group: {
        _id: null,
        ageSum: {
          $sum: "$age",
        },
      },
    },
  ],
  // What is the average age of all users based on gender
  [
    {
      $group: {
        _id: "$gender",
        averageAge: {
          $avg: "$age",
        },
      },
    },
  ],
  // What is the total sum of all users age based on gender
  [
    {
      $group: {
        _id: "$gender",
        ageSum: {
          $sum: "$age",
        },
      },
    },
  ],
  // list the top 5 most common favorite fruits among users
  [
    {
      $group: {
        _id: "$favoriteFruit",
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
    {
      $limit: 1,
    },
  ],
  //   find the total number of males and females
  [
    {
      $group: {
        _id: "$gender",
        count: { $sum: 1 },
      },
    },
  ],
  // which compnay has the highest number of the registerd users
  [
    {
      $group: {
        _id: "$company.location.country",
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
    {
      $limit: 1,
    },
  ],
  //
  [
    {
      $unwind: {
        path: "$tags",
      },
    },
    {
      $group: {
        _id: "$_id",
        numOfTags: {
          $sum: 1,
        },
      },
    },
    {
      $group: {
        _id: null,
        avgOfTags: {
          $avg: "$numOfTags",
        },
      },
    },
  ],
  [
    {
      $addFields: {
        numberOfTags: {
          $size: {
            $ifNull: ["$tags", []],
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        averageNumberOfTags: {
          $avg: "$numberOfTags",
        },
      },
    },
  ],
];
