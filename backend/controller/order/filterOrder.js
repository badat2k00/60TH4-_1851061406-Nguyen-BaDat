db.products.find({
  createdAt: {
      $gte: new Date('2023-01-01'),
      $lt: new Date('2023-02-01')
    }
  })