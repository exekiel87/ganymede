module.exports = {
    up: (db) => {
        return db.createCollection('products', {
                validator: {
                    $jsonSchema:{
                        bsonType: 'object',
                        required: ['sku', 'name', 'price','categoryId'],
                        properties:{
                            sku:{
                                bsonType: 'string',                                        
                            },
                            name:{
                                bsonType: 'string'
                            },
                            price:{
                                bsonType: 'number'
                            },
                            originalPrice:{
                                bsonType: 'number'
                            },
                            categoryId:{
                                bsonType: 'objectId'
                            },
                            description:{
                                bsonType: 'string'
                            },
                            images:{
                                bsonType: 'array',
                                items: {
                                    bsonType: 'string'
                                }
                            },
                            relatedQueries:{
                                bsonType: 'array',
                                items: {
                                    bsonType: 'string'
                                }
                            }
                        }
                    }                                                        
                }        
            });
    },
    down: (db) => {
        return db.dropCollection('products');
    }
};
