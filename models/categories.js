const mongodb = require('mongodb');

module.exports = function(db){
    const Categories = db.collection('categories');

    function insertOne(doc){
        return Categories.insertOne(doc);
    }

    function findOne(url){
        return Categories.findOne({url});
    }   

    return {
        insertOne,
        findOne
    }
}
