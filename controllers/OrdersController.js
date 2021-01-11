module.exports = function(models, options){

    const Orders = models.orders;

    function insertOneAction(search){
               
        return Orders.insertOne(search);
    }

    function findOneAction(_id){
        return Orders.findOne(_id);
    }

    function findAllAction(){
        return Orders.findAll();
    }

    return {
        insertOneAction,
        findOneAction,
        findAllAction
    }
}
