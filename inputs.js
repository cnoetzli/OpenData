function EinAusgaben() {
    if (document.getElementById("einaus").value == "1"){
        EinAus = 1;
    } else {
        EinAus = 0;
    }
    updateVisualization(Year,EinAus,1);
}

function newYear() {
    var currentYear = document.getElementById("year").value;
    switch (currentYear){
        case "0":
            Year = 0;
            yearString = "(2007)";
            break;
        case "1":
            Year = 1;
            yearString = "(2008)";
            break;
        case "2":
            Year = 2;
            yearString = "(2009)";
            break;
        case "3":
            Year = 3;
            yearString = "(2010)";
            break;
        case "4":
            Year = 4;
            yearString = "(2011)";
            break;
        case "5":
            Year = 5;
            yearString = "(2012)";
            break;
        case "6":
            Year = 6;
            yearString = "(2013)";
            break;
        case "7":
            Year = 7;
            yearString = "(2014)";
            break;
        case "8":
            Year = 8;
            yearString = "(2015)";
            break;
        case "9":
            Year = 9;
            yearString = "(2016)";
            break;
        case "10":
            Year = 10;
            yearString = "(2017)";
            break;
    }
    updateVisualization(Year,EinAus,1);
}


function EinAusgaben2() {
    if (document.getElementById("einaus2").value == "1"){
        EinAus2  = 1;
    } else {
        EinAus2 = 0;
    }
    updateVisualization(Year2,EinAus2,2);
}

function newYear2() {
    var currentYear = document.getElementById("year2").value;
    switch (currentYear){
        case "0":
            Year2 = 0;
            yearString2 = "(2007)";
            break;
        case "1":
            Year2 = 1;
            yearString2 = "(2008)";
            break;
        case "2":
            Year2 = 2;
            yearString2 = "(2009)";
            break;
        case "3":
            Year2 = 3;
            yearString2 = "(2010)";
            break;
        case "4":
            Year2 = 4;
            yearString2 = "(2011)";
            break;
        case "5":
            Year2 = 5;
            yearString2 = "(2012)";
            break;
        case "6":
            Year2 = 6;
            yearString2 = "(2013)";
            break;
        case "7":
            Year2 = 7;
            yearString2 = "(2014)";
            break;
        case "8":
            Year2 = 8;
            yearString2 = "(2015)";
            break;
        case "9":
            Year2 = 9;
            yearString2 = "(2016)";
            break;
        case "10":
            Year2 = 10;
            yearString2 = "(2017)";
            break;
    }
    updateVisualization(Year2,EinAus2,2);
}

function EinAusgaben3() {
    if (document.getElementById("einaus3").value == "1"){
        EinAus3  = 1;
    } else {
        EinAus3 = 0;
    }
    updateVisualization(Year3,EinAus3,1);
    updateVisualization(Year3,EinAus3,2);
}

function newYear3() {
    var currentYear = document.getElementById("year3").value;
    switch (currentYear){
        case "0":
            Year3 = 0;
            yearString = "(2007)";
            yearString2 = "(2007)";
            break;
        case "1":
            Year3 = 1;
            yearString = "(2008)";
            yearString2 = "(2008)";
            break;
        case "2":
            Year3 = 2;
            yearString = "(2009)";
            yearString2 = "(2009)";
            break;
        case "3":
            Year3 = 3;
            yearString = "(2010)";
            yearString2 = "(2010)";
            break;
        case "4":
            Year3 = 4;
            yearString = "(2011)";
            yearString2 = "(2011)";
            break;
        case "5":
            Year3 = 5;
            yearString = "(2012)";
            yearString2 = "(2012)";
            break;
        case "6":
            Year3 = 6;
            yearString = "(2013)";
            yearString2 = "(2013)";
            break;
        case "7":
            Year3 = 7;
            yearString = "(2014)";
            yearString2 = "(2014)";
            break;
        case "8":
            Year3 = 8;
            yearString = "(2015)";
            yearString2 = "(2015)";
            break;
        case "9":
            Year3 = 9;
            yearString = "(2016)";
            yearString2 = "(2016)";
            break;
        case "10":
            Year3 = 10;
            yearString = "(2017)";
            yearString2 = "(2017)";
            break;
    }
    updateVisualization(Year3,EinAus3,1);
    updateVisualization(Year3,EinAus3,2);
}