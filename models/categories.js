const mongodb = require('mongodb');

module.exports = function(db){
    const Categories = db.collection('categories');

    function insertOne(doc){
        return Categories.insertOne(doc);
    }

    function findOne(url){
        return Orders.findOne({url});
    }   

    return {
        insertOne,
        findOne
    }
}
