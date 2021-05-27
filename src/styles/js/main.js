var countryCodes = [
    'en', 
    'en-AU', 
    'en-CN', 
    'en-FJ', 
    'en-IN', 
    'en-ID', 
    'zh-MO', 
    'en-MY', 
    'en-NZ', 
    'en-PH', 
    'en-SG', 
    'en-TW', 
    'en-TH', 
    'en-VN'
];


var autoScrollPos = getScreenPosition();
var data = null;

var urlData = baseUrlRedirect(window.location.host);

var baseUrl = urlData.baseUrl; 
var urlRoot = urlData.urlRoot;


var requestDataUrl = baseUrl + "/data/benefits.json";
//var hotelSearchCodeUrl = 'https://fylejq4tpj.execute-api.ap-southeast-2.amazonaws.com/DEV/v1/hotel/code/';
var hotelSearchCodeUrl = 'https://api.accorplus.com/v1/hotel/code/';
var hotelNameSearchUrl = baseUrl + "/data/hotel-search.json";
var priceLevelDiscount = "hotelAU";
var priceLevelDiscountNz = "hotelNZ";
var priceLevelDiscountTh = "hotelTH";

$(document).ready(function() {
    var hotelCode = searchSession("hotelCode");
    var hotelName = searchSession("hotelName");
    var staffId = searchSession("staffId");
    var staffName = searchSession("staffName");
    var hotelSearchName = searchSession("hotelSearchName");
    var hotelData = searchSession("hotelData");

    var ypos = searchSession("ed-ypos");

    console.log("ypos", ypos);
    if(ypos) {
        //$(document).scrollTop(ypos);
        $("html,body").animate({scrollTop: ypos}, 1000);
    }

    if(hotelCode){
        $("#btnLeaderBoard").removeClass( "d-none");
    }

    if(hotelCode || hotelName) {
        $('#ridCode').val(hotelCode);
        $('#hotelDetailsText').append(hotelSearchName + " - RID " + hotelCode);
        console.log("test");
        $("#btnNext").click();
    }

    if(staffId || staffName) {
        $('#staffId').val(staffId);
        $('#staffName').val(staffName);
    }

    $("#btnNext").click(function() {
        if($("#ridCode").length > 0 && (!searchSession("hotelCode") || $("#ridCode").val() == "")) {
            addError($("#ridCode"), $(".error"));
            $(".hotel-results-container").html("");
            return;
        } else if ($("#staffName").length > 0 && $("#staffName").val() == "") {
            addError($("#staffName"), $(".error"));
            return
        } else {
            removeError($("#ridCode"), $(".error"));
        }

        if($( "#ridCode" ).length) {
            var ridCode = $("#ridCode").val();
            setSession("hotelCode", ridCode);
        }

        if($( "#staffId" ).length && $( "#staffName" ).length) {
            var staffId = $("#staffId").val();
            var staffName = $("#staffName").val();
            setSession("staffId", staffId);
            setSession("staffName", staffName);
        }

        //Go to next page
        if(window.location.pathname.indexOf("employee-details") == -1) {
            setSession("ed-ypos", autoScrollPos);
            window.location.href = baseUrl + "/employee-details.html";
        } else if(window.location.pathname.indexOf("employee-details") != -1) {
            var priceLevel = "";
            var parseHotelData = JSON.parse(hotelData);
            if(parseHotelData && parseHotelData.length > 0) {
                if(parseHotelData[0].CountryCode == "AU") {
                    priceLevel = "&pricelevel=" + priceLevelDiscount;
                } else if(parseHotelData[0].CountryCode == "NZ") {
                    priceLevel = "&pricelevel=" + priceLevelDiscountNz;
                } else if(parseHotelData[0].CountryCode == "TH") {
                    priceLevel = "&pricelevel=" + priceLevelDiscountTh;
                }
            }
            window.location.href = urlRoot + searchSession("countryCode") + "/registration?hotelRIDOnlineKiosk="+searchSession("hotelCode")+"&apHotelEmployeeName="+searchSession("staffName")+"&hotelEmployee="+searchSession("staffName") + "&apHotelEmployeeId="+ searchSession("staffId") + priceLevel;
            console.log("URL", urlRoot + searchSession("countryCode") + "/registration?hotelRIDOnlineKiosk="+searchSession("hotelCode")+"&apHotelEmployeeName="+searchSession("staffName")+"&hotelEmployee="+searchSession("staffName") + "&apHotelEmployeeId="+ searchSession("staffId") + priceLevel);
            //urlParams = `?hotelRIDOnlineKiosk=${this.state.hotelRidCode}&hotelEmployee=${this.state.hotelStaffName}`;
            //console.log(`Hotel RID code = ${this.state.hotelRidCode}, Hotel Staff name = ${this.state.hotelStaffName}, Form Type = ${formType}`);
            //urlParams = `?hotelRIDOnlineKiosk=${this.state.hotelRidCode}&apHotelEmployeeId=${this.state.apStaffId}`;
        }
    });

    // We only have Back Button on the employee details page
    $("#btnBack").click(function(){
        window.location.href = baseUrl + "/index.html";
    })

    $("#btnCheck").click(function() {
        removeError($("#ridCode"), $(".error"));
        var ridCode = $("#ridCode").val();
        $.get(hotelSearchCodeUrl + '?HotelCode=' + ridCode, function( data ) {
            console.log("data.length", data.length);
            var htmlString = "";
            try {
                //var htmlStr = "Results <br />";
                var hotelString = data[0].HotelName + " - RID " + data[0].HotelCode;

                htmlString += '<h5>Result</h5>';
                htmlString += '<div class="mt-3">';
                    htmlString += '<img class="mr-2" src="'+baseUrl+'/src/images/check_box-24px 1.png" width="25">';
                    htmlString += hotelString
                htmlString += '</div>';
                $( ".hotel-results-container" ).html( htmlString );
                console.log("data", data);
                setSession("hotelData", JSON.stringify(data));
                setSession("hotelSearchName", data[0].HotelName);
                setSession("hotelCode", data[0].HotelCode);

                var country = getCountry(data[0].CountryCode, countryCodes);
                setSession("countryCode", country.country_code);

                setBenefits(data[0].CountryCode);
            } catch (e) {
                console.log("ERROR", e);
                htmlString += '<h5>Result</h5>';
                htmlString += '<div class="mt-3">';
                    htmlString += 'No results. <a data-toggle="modal" data-target="#hotelSearchModal" href="#">Click here to search the hotel.</a>';
                htmlString += '</div>';

                $( ".hotel-results-container" ).html( htmlString );
            }
        });
    });

    $("#btnModalCheck").click(function() {
        var hotelName = $("#hotelName").val().toLowerCase();
        $.get(hotelNameSearchUrl, function(data) {
            //console.log(data);
            //var results = data.filter(item => item.toLowerCase().indexOf(hotelName) > -1);
            //console.log(results);
            console.log("Search criteria: " + hotelName);
            var hotelNameResults = haystackSearch(data, hotelName);
            $("#hotelNameSearch").html(hotelNameSearchTemplate(hotelNameResults));
        });
    });

    $("#btnModalSubmit").click(function() {
        var serializedArray = $("form#hotelNameForm").serializeArray();
        setSession("hotelSearchName", serializedArray[0].value);
        $("#hotelSearchModal").modal('hide');
        
        //auto click for the check
        $("#ridCode").val(serializedArray[0].value);
        $("#btnCheck").click();
    });

    $("#btnLeaderBoard").click(function() {
        if($("#ridCode").length > 0 && (!searchSession("hotelCode") || $("#ridCode").val() == "")) {
            addError($("#ridCode"), $(".error"));
            $(".hotel-results-container").html("");
            return;
        } else {
            removeError($("#ridCode"), $(".error"));
        }

        //Go to LeaderBoard page
        window.location.href = baseUrl + "/leaderBoard/index.html";
    });

    var parseHotelData = JSON.parse(hotelData);
    if(parseHotelData) {
        console.log("parseHotelData[0]", parseHotelData[0]);
        setBenefits(parseHotelData[0].CountryCode);
    } else if(data) {
        setBenefits(data[0].au);
    }
    /*$.get(requestDataUrl, function( data ) {
        $( ".accordion-container" ).html( accordionTemplate(data[0].au) );
        //alert( "Load was performed." );
    });*/
});

function setBenefits(region) {
    console.log("setBenefits() :: region", region);
    console.log("setBenefits() :: requestDataUrl", requestDataUrl);
    //manipulate region to fit JSON feed
    $.get(requestDataUrl, function( data ) {
        //var parseData = JSON.parse(data);
        var found = false;
        for(var i=0;i<data.length;i++) {
            //console.log("data", data[i]);
            for(var key in data[i]) {
                //console.log("key", key);
                if(key.toUpperCase().indexOf(region) > -1) {
                    found = true;
                    console.log("country found 1 :: key", key);
                    console.log("country found 1", data[i][key]);
                    $( ".accordion-container" ).html( accordionTemplate(data[i][key]) );
                }
            }
        }

        if(!found) {
            console.log("country not found");
            for(var i=0;i<data.length;i++) {
                //console.log("data", data[i]);
                for(var key in data[i]) {
                    //console.log("key", key);
                    if(key.indexOf("row") > -1) {
                        found = true;
                        console.log("country found 2 :: key", key);
                        console.log("country found 2", data[i].row);
                        $( ".accordion-container" ).html( accordionTemplate(data[i].row) );
                    }
                }
            }
        }
        //alert( "Load was performed." );
    });
}

function haystackSearch(haystack, needle) {
    var searchedArray = [];
    var needles = needle.split(" ");
    for(var i=0;i<haystack.length;i++) {
        var found = [];
        for(var j=0;j<needles.length;j++){
            if(haystack[i].HotelName.toLowerCase().indexOf(needles[j]) != -1) {
                found.push(true);
            }
        }
        
        if(found.length == needles.length) {
            searchedArray.push(haystack[i]);
        }
        //search one string
        /*if(haystack[i].HotelName.toLowerCase().indexOf(needle) != -1) {
            //console.log("found needle: " + haystack[i].HotelName);
            searchedArray.push(haystack[i]);
        }*/
    }
    
    return searchedArray;
}

function searchSession(key) {
    return (localStorage.getItem(key));
}

function setSession(key, value) {
    localStorage.setItem(key, value);
}

function baseUrlRedirect(urlPath) {
    if(urlPath.indexOf("localhost") != -1) {
        return {
            baseUrl : "http://localhost/Staff-Portal/hotel",
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

function addError(element, errorElement) {
    element.addClass("border border-danger");
    errorElement.fadeIn(500);
}

function removeError(element, errorElement) {
    element.removeClass("border border-danger");
    errorElement.fadeOut(500);
}

function getCountry(countryCode, countryArray) {
    for(var i=0;i<countryArray.length;i++) {
        if(countryArray[i].indexOf(countryCode) !== -1) {
            return {"country_code": countryArray[i]};
        }
    }
    
    return {"country_code": "en"};
}

function getScreenPosition() {
    //mobile = 195
    //tablet = 301
    //desktop = 505

    var isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
    const userAgent = navigator.userAgent.toLowerCase();
    const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
    
    if(isMobile || window.innerWidth < 500) {
        return "195";
    } else if (isTablet || window.innerWidth < 900){
        return "301";
    } else {
        return "505";
    }
}

function accordionTemplate(data) {
    var htmlString = "";

    htmlString += '<div id="accordion">'
        htmlString += '<h4 class="col-12 benefits-header d-block d-md-none h4">'+data.title+'</h4>';
        htmlString += '<div class="d-flex benefits-header-container">';
            htmlString += '<h4 class="col-5 benefits-header d-none d-md-block h4">'+data.title+'</h4>';
            htmlString += '<div class="col-4 col-md-2 text-center">';
                htmlString += '<div>'+data.products.traveller.image+'</div>';
                htmlString += '<div>'+data.products.traveller.name+'</div>';
                htmlString += '<div>'+data.products.traveller.price+'</div>';
            htmlString += '</div>';
            if(data.products && data.products.explorer) {
                htmlString += '<div class="col-4 col-md-2 text-center">';
                    htmlString += '<div>'+data.products.explorer.image+'</div>';
                    htmlString += '<div>'+data.products.explorer.name+'</div>';
                    htmlString += '<div>'+data.products.explorer.price+'</div>';
                htmlString += '</div>';
            }
            if(data.products && data.products.discovery) {
                htmlString += '<div class="col-4 col-md-2 text-center">';
                    htmlString += '<div>'+data.products.discovery.image+'</div>';
                    htmlString += '<div>'+data.products.discovery.name+'</div>';
                    htmlString += '<div>'+data.products.discovery.price+'</div>';
                htmlString += '</div>';
            }
        htmlString += '</div>';

    var benefits = data.benefits;
    for(var i=0;i<benefits.length;i++){
        htmlString += '<div class="card" data-toggle="collapse" data-target="#'+ benefits[i].cid +'" aria-expanded="false" aria-controls="'+ benefits[i].cid +'">';
            htmlString += '<div class="d-flex">';
                htmlString += '<div class="mb-0 col-11 d-block d-md-none">';
                    htmlString += benefits[i].subtitle;
                htmlString += '</div>';
                htmlString += '<div class="mb-0 col-1 d-block d-md-none">';
                    htmlString += '<img src="src/images/plus-symbol.png" width="22" />';
                htmlString += '</div>';
            htmlString += '</div>';

            htmlString += '<div class="card-header d-flex" id="'+ benefits[i].hid +'">';
                htmlString += '<div class="mb-0 col-5 d-none d-md-block">';
                    htmlString += benefits[i].subtitle;
                htmlString += '</div>';
                htmlString +='<div class="col-4 col-md-2 text-center">';
                    htmlString += (benefits[i].traveller.content !== true && benefits[i].traveller.content !== false ? benefits[i].traveller.content : benefits[i].traveller.image);
                htmlString +='</div>';
                if(benefits[i] && benefits[i].explorer) {
                    htmlString +='<div class="col-4 col-md-2 text-center">';
                        htmlString += (benefits[i].explorer.content !== true && benefits[i].explorer.content !== false ? benefits[i].explorer.content : benefits[i].explorer.image);
                    htmlString +='</div>';
                }
                if(benefits[i] && benefits[i].discovery) {
                    htmlString +='<div class="col-4 col-md-2 text-center">';
                        htmlString += (benefits[i].discovery.content !== true && benefits[i].discovery.content !== false ? benefits[i].discovery.content : benefits[i].discovery.image);
                    htmlString +='</div>';
                }
                htmlString += '<div class="mb-0 col-1 d-none d-md-block">';
                    htmlString += '<img src="src/images/plus-symbol.png" width="22" />';
                htmlString += '</div>';
            htmlString += '</div>';
            htmlString += '<div id="'+ benefits[i].cid +'" class="collapse hide" aria-labelledby="'+ benefits[i].hid +'" data-parent="#accordion">';
                htmlString += '<div class="card-body col-12 col-md-6">'
                    htmlString += '<div>'+benefits[i].description+'</div>';
                    htmlString += '<div>'+benefits[i].learnmore+'</div>';
                htmlString += '</div>';
            htmlString += '</div>';
            htmlString += '<div></div>';
        htmlString += '</div>';
    }
    htmlString += '</div>';

    return htmlString;
}

function hotelNameSearchTemplate(data) {
    var htmlString = "";
    
    if(data.length <= 0) {
        htmlString += '<h4>No Results</h4>';
    } else {
        htmlString += '<h4>RESULTS</h4>';
        htmlString += '<form id="hotelNameForm">';
        for(var i=0;i<data.length;i++) {
            htmlString += '<div class="d-flex mt-2">';
                htmlString += '<div class="col-1">';
                    htmlString += '<input type="radio" name="hotelNameRadio" id="hotelNameRadio'+i+'" value="'+data[i].HotelCode+'" />';
                htmlString += '</div>';
                htmlString += '<label for="hotelNameRadio'+i+'" class="col-11">';
                    htmlString += data[i].HotelName + " - RID " + data[i].HotelCode;
                htmlString += '</label>';
            htmlString += '</div>';
        }
        htmlString += '</form>';
    }

    return htmlString;
}