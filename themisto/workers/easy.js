const puppeteer = require('puppeteer');

module.exports = function(){
    let browser;    
    let page;
    let query;

    async function searchEasyProducts(data){
        query = data.query;
        
        browser = await puppeteer.launch();    
        page = await browser.newPage();

        const links = await getLinks();

        let product;
        let products = [];

        for(link of links){
            product = await getProduct(link);
            //product.relatedQueries = relatedQueries;

            products.push(product);
        }                            
    
        await browser.close();
        
        return products;
    }

    async function getRelatedQueries(){
        //probar con enviarle información como si fuera la página que lo pidiera, ver headers que envía
        /*
        await page.goto(`https://www.easy.com.ar/
        webapp/wcs/stores/servlet/es/AutoSuggestView
        ?coreName=MC_10001_CatalogEntry_es_ES
        &serverURL=http%3a%2f%2fsearch.easy.com.ar%3a3737%2fsolr%2fMC_10001_CatalogEntry_es_ES
        &showHeader=true&term=${query}`);
    
        await page.waitForSelector('#suggestedKeywordResults li a');
    
        const relatedQueries = await page.evaluate(()=>{
        let queries = document.querySelectorAll('#suggestedKeywordResults li a');
        
        queries = Array.from(queries).map(e=> e.title);
        
        return queries;
        });*/
    }
    
    async function getLinks(){
        await page.goto('https://easy.com.ar');
        await page.type('#SimpleSearchForm_SearchTerm', query);
        await page.click('#WC_CachedHeaderDisplay_button_1');    
        await page.waitForSelector('.dojoDndItem a');
        await page.waitForTimeout(10000);

        const links = await page.evaluate(() => {
            const elements = document.querySelectorAll('.dojoDndItem a');
        
            const links = [];
                
            for(let element of elements){
                links.push(element.href);        
            }
                
            return links;
        });

        return links;
    }
    
    async function getProduct(link){
        await page.goto(link);
        await page.waitForSelector('.product-right .price-e');
        await page.waitForTimeout(10000);

        const product = await page.evaluate(() => {
            let sku = document.querySelectorAll('.prod-sku span');
            sku = (sku && sku.length && sku[1] && sku[1].innerText) || '';

            let name = document.querySelector('.product-all>.product-right>.prod-title');
            name = (name && name.innerText) || ''; 

            let price = document.querySelector('#tarj-mas-edit');

            price = (price && price.innerText) || '';
            price = price.replace('.','');
            price = price.replace(',','.');

            price = Number.parseFloat(price);
            
            let originalPrice = document.querySelector('.product-all .product-right .regular-price h4');
            originalPrice = (originalPrice && originalPrice.innerText)  || '';
            
            originalPrice = originalPrice.replace('.','');
            originalPrice = originalPrice.replace(',','.');

            originalPrice = Number.parseFloat(originalPrice);
            
            if(price === NaN){
                price = originalPrice;
                originalPrice = null;
            }
            
            let categories = document.querySelectorAll('#WC_BreadCrumbTrailDisplay_div_1 li a');
            
            let categoryURL = (categories.length && categories[categories.length - 1].href) || undefined;
            
            let description = document.querySelector('.product-longdescription>div');
            description = (description && description.innerText) || '';
            
            let images = document.querySelectorAll('#fotorama-p .fotorama__stage__shaft img');
            
            images = Array.from(images).map(e => e.src);
            
            const product = {
                sku,
                name,
                price,
                categoryURL,
                description,
                images
            };
            
            if(originalPrice !== null){
                product.originalPrice = originalPrice;
            }
            
            return product;
        });      
        
        return product;
    }

    return {
        searchEasyProducts
    }
}