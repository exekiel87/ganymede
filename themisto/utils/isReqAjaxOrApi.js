function isReqAjaxOrApi(req)
{
    if(!!req.accepts('application/json') || !req.accepts('html') || !!req.xhr){
        return true;
    }
    return false;
}

module.exports = isReqAjaxOrApi