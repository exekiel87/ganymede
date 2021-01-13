module.exports = {
    up: (db) => {
        return db.createCollection('orders', {
                validator: {
                    $jsonSchema: {
                        bsonType: 'object',
                        required: ['query', 'provider','callbackUrl','status'],
                        properties:{
                            query:{
                                bsonType: 'string'
                            },
                            provider:{
                                bsonType: 'string'
                            },
                            options:{
                                bsonType: 'object'
                            },
                            callbackUrl:{
                                bsonType: 'string',
                            },
                            status:{
                                bsonType: 'string'
                            },
                            products:{
                                bsonType: 'array',
                                items:{
                                    bsonType: 'objectId'
                                }
                            }
                        },
                        
                    }
                }
            });
    },
    down: (db) => {
        return db.dropCollection('orders');
    }
};
