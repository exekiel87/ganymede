const mongodb = require('mongodb');

module.exports = function(db){
    const Orders = db.collection('orders');

    function insertOne(search){
        return Orders.insertOne(search);
    }

    function findOne(_id){
        _id = new mongodb.ObjectID(_id);

        return Orders.findOne({_id});
    }

    function findAll(){
        return Orders.find();
    }

    return {
        insertOne,
        findOne,
        findAll
    }
}
