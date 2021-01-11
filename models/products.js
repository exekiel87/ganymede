const mongodb = require('mongodb');

module.exports = function(db){
    const Products = db.collection('products');

    function insertMany(products){
        return Products.insertMany(products);
    }

    function findAllByCategory(categoryId){
        categoryId = new mongodb.ObjectID(categoryId);

        return Products.find({categoryId});
    }

    function countAllByCategory(categoryId){
        categoryId = new mongodb.ObjectID(categoryId);

        return Products.countDocuments({categoryId});
    }

    return {
        insertMany,
        findAllByCategory,
        countAllByCategory
    }
}
