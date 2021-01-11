module.exports = function(models, options){
    const Products = models.products;
    
    function findAllByCategory(categoryId){
        return Products.findAllByCategory(categoryId);
    }

    function countAllByCategory(categoryId){
        return Products.countAllByCategory(categoryId);
    }

    function insertMany(list){
        return Products.insertMany(list);
    }
    
    return {
        findAllByCategory,
        countAllByCategory,
        insertMany
    }
}
