export const getUrl=()=>{ 
    var urlPath = window.location.href;
    if(urlPath.indexOf("localhost") != -1) {
        return {
            baseUrl : "",
            urlRoot : "https://uat-new.accorplus.com/"
        };
    } else if(window.location.host.indexOf("dev-hotelsales") != -1) {
        return {
            baseUrl : "https://dev-hotelsales.accorplus.com",
            urlRoot : "https://uat-new.accorplus.com/"
        };
    } else {
        return {
            baseUrl : "https://hotelsales.accorplus.com",
            urlRoot : "https://www.accorplus.com/"
        };
    }
}
