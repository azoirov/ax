const calcRate = (): any[] => {
  return [
    {
      $unwind: {
        path: "$rates"
      }
    },
    {
      $group: {
        _id: {
          _id: "$_id",
          title: "$title",
          content: "$content",
          author: "$author",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
        },
        rates: {
          $push: "$rates"
        },
        rate: {
          $sum: "$rates.rate"
        },
        count: {
          $sum: 1
        }
      }
    },
    {
      $project: {
        _id: "$_id._id",
        title: "$_id.title",
        content: "$_id.content",
        author: "$_id.author",
        rates: "$rates",
        createdAt: "$_id.createdAt",
        updatedAt: "$_id.updatedAt",
        rate: {
          $round: [{
            $divide: ["$rate", "$count"]
          }, 1],
        },
        count: "$count",
      }
    }
  ]
}

export default calcRate