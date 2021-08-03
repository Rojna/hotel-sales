export const getUrl=()=>{ 
    var urlPath = window.location.href;
    if(urlPath.indexOf("localhost") != -1) {
        return {
            baseUrl : "",
            urlRoot : "https://accorstaging.wpstaging.io/",
            googleApiUrl: "https://script.google.com/macros/s/AKfycbxKQYwf3YcGvBwxeV4RTnlFN4j-Fjt37ngupqITDjjuu58wwBBd038719XOGjwHWueRVg/exec"
        };
    } else if(window.location.host.indexOf("dev-hotelsales") != -1) {
        return {
            baseUrl : "https://dev-hotelsales.accorplus.com",
            urlRoot : "https://accorstaging.wpstaging.io/",
            googleApiUrl: "https://script.google.com/macros/s/AKfycbxKQYwf3YcGvBwxeV4RTnlFN4j-Fjt37ngupqITDjjuu58wwBBd038719XOGjwHWueRVg/exec"
        };
    } else {
        return {
            baseUrl : "https://hotelsales.accorplus.com",
            urlRoot : "https://www.accorplus.com/",
            googleApiUrl: "https://script.google.com/macros/s/AKfycbwGi74McDnkf5UtNYZiD8VXqDvCmwPe-gOXno7sQNY9ohdBOy7ViwjxH_jv_ym2-nS8/exec"
        };
    }
}

export const getCountry = (countryCode, countryArray) => {
    for(var i = 0; i < countryArray.length; i++) {
        if(countryArray[i].indexOf(countryCode) !== -1) {
            return {"country_code" : countryArray[i]};
        }
    }
    
    return {"country_code" : "en"};
}

export const setLanguage = (region, benefitsData) => {
    console.log("setBenefits() :: region", region);
    console.log("setBenefits() :: region", benefitsData); 
    //manipulate region to fit JSON feed
   if( benefitsData ) {
        var found = false;
        for (const [key, value] of Object.entries(benefitsData)) {
                if(key.indexOf(region) > -1) {
                    found = true;
                    console.log("country found 1 :: key", key);
                    console.log("country found 1", benefitsData[key]);
                    return(value);
                }
        }
        if(!found) {
            console.log("country not found");
            return(benefitsData['au']);
        }
    }
}

export const setBenefits = (region, benefitsData) => {
    console.log("setBenefits() :: region", region);
    //manipulate region to fit JSON feed
   if( benefitsData ) {
        var found = false;
        for(var i = 0; i < benefitsData.length; i++) {
            console.log("data", benefitsData[i]);
            for(var key in benefitsData[i]) {
                console.log("key", key);
                if(key.toUpperCase().indexOf(region) > -1) {
                    found = true;
                    console.log("country found 1 :: key", key);
                    console.log("country found 1", benefitsData[i][key]);
                    return(benefitsData[i][key]);
                }
            }
        }

        if(!found) {
            console.log("country not found");
            for(var i = 0; i < benefitsData.length; i++) {
                console.log("data", benefitsData[i]);
                for(var key in benefitsData[i]) {
                    console.log("key", key);
                    if(key.indexOf("row") > -1) {
                        found = true;
                        console.log("country found 2 :: key", key);
                        console.log("country found 2", benefitsData[i].row);
                       return(benefitsData[i].row);
                    }
                }
            }
        }
    }
}

export const getFromSession = (key) => {
    return (localStorage.getItem(key));
}

