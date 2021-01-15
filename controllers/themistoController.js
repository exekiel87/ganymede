module.exports = function(models, options){

    const Orders = models.orders;
    const Products = models.products;
    const Categories = models.categories;

    function orderProcessingAction(_id){
        return Orders.updateOne(_id,{status:'processing'});
    }

    function orderFailAction(_id){
        return Orders.updateOne(_id,{status:'failed'});
    }

    function orderInvalidAction(_id){
        return Orders.updateOne(_id,{status:'failed'});
    }

    return {
        orderProcessingAction,
        orderFailAction,
        orderInvalidAction
    }
}
