const mongodb = require('mongodb');

module.exports = function(db){
    const Orders = db.collection('orders');

    function insertOne(doc){
        return Orders.insertOne(doc);
    }

    function findOne(_id){
        _id = new mongodb.ObjectID(_id);

        return Orders.findOne({_id});
    }

    function findAll(){
        return Orders.find();
    }

    function updateOne(_id, doc){
        _id = new mongodb.ObjectID(_id);
        delete doc._id;

        return Orders.updateOne({_id},{"$set":doc});
    }

    return {
        insertOne,
        findOne,
        findAll,
        updateOne
    }
}
