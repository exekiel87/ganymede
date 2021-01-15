module.exports = function(models){

    const Orders = models.orders;
    const Categories = models.categories;
    const Products = models.products;

    async function saveProducts(_id, productsData){
        const orderUpdated = Orders.updateOne(_id,{status:'fulfilled'});
        
        const products = await setCategoryToAll(productsData);
        
        const productsInserted = Products.insertMany(products);
        
        return await Promise.all([orderUpdated, productsInserted]);
    }

    async function setCategoryToAll(productsData){
        const products = [];
        let url;
        let product;
        let categoryId;

        for(productData of productsData){
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

    return {
        saveProducts
    }
}