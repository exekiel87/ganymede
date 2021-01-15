//el work depende del provider

const {fork} = require('child_process');

const child = fork('index.js',{stdio:'inherit', env:{NODE_ENV:'develop'}});

//child.on('error', () =>{});

const result = child.send({id:'1', query:"electronicos", provider:'easy'}, (err) =>{});

if(!result){
    //avisar que no se pudo enviar
}

child.on('message', (res) => {
    if(res.type === 1){
        console.log(res.data.products.length);
    }else{
        console.log("message: ", JSON.stringify(res));    
    }
});