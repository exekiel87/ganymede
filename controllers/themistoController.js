module.exports = function(models, options){

    const Orders = models.orders;
    const Products = models.products;

    function orderProcessingAction(_id){
        return Orders.updateOne(_id,{status:'processing'});
    }

    async function orderCompletedAction(_id, productsData){
        const orderUpdated = Orders.updateOne(_id,{status:'fulfilled'});

        const products = await setCategoryToAll(productsData);

        const productsInserted = Products.insertMany(products);

        return Promise.all([orderUpdated, productsInserted]);
    }

    async function setCategoryToAll(productsData){
        const products = [...productsData];
        let url;
        let product;
        let categoryId;

        for(productData of products){
            url = productData.categoryURL;
            product = {...productData};

            delete product.categoryURL;

            category = await Categories.findOne(url);            

            if(category){
                categoryId = category._id;
            }else {
                result = await Categories.insertOne({url});
                categoryId = result.insertedId;
            }

            product.categoryId = categoryId;

            products.push(product);
        }

        return products;
    }

    function orderFailAction(_id){
        return Orders.updateOne(_id,{status:'failed'});
    }

    function orderInvalidAction(_id){
        return Orders.updateOne(_id,{status:'failed'});
    }

    return {
        orderProcessingAction,
        orderCompletedAction,
        orderFailAction,
        orderInvalidAction
    }
}
