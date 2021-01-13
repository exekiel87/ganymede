module.exports = {
    up: (db) => {
        return db.createCollection('categories', {
                validator: {
                    $jsonSchema:{
                        bsonType: 'object',
                        required: ['url'],
                        properties:{
                            url:{
                                bsonType: 'string',                                        
                            }
                        }
                    }                                                        
                }        
            });
    },
    down: (db) => {
        return db.dropCollection('categories');
    }
};
