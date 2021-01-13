const {fork} = require('child_process');
const {themisto: themistoEnv} = require('./configs/config');
const child =   fork(
                    'themisto',
                    {
                        stdio:'ignore', 
                        env: themistoEnv
                    }
                );

//const result = child.send({id:'1', query:"electronicos", provider:'easy'}, (err) =>{console.log(err || 'no error')});

//if(!result){
    //avisar que no se pudo enviar
//}

module.exports = child;