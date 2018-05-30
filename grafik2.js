var width = 400,
    height = 400,
    radius = Math.min(width, height) / 2;


var menu = 0;

var EinAus = 0;
var Year =0;
var EinAus2 = 0;
var Year2 =0;
var EinAus3 = 0;
var Year3 =0;

var yearString = "(2007)";
var yearString2 = "(2007)";

var path;
var path2;
var total;
var total2;
var percentBase = 100;
var percentonoff = 0;
var percentonoff2 = 0;

var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

var y = d3.scale.sqrt()
    .range([0, radius]);

var b = {
    w: 175, h: 30, s: 3, t: 10
};

var value;
var value2;

var color = d3.scale.category20c();

var vis = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var vis2 = d3.select("#chart2").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var partition = d3.layout.partition()
    .sort(null)
    .value(function(d) { return 1; });


var tooltip = d3.select("#chart").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var tooltip2 = d3.select("#chart2").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

var arc2 = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

var node;
var root;
var root2;
var rootOriginal;

d3.json("EinAusgabenBund.json", function(error, root) {
    if (error) throw error;

    rootOriginal = root;

    newGraphic(Year,EinAus);
});

function newGraphic(currentYear,EinnahmenAusgaben){

    if(menu == 0) {
        root = rootOriginal.children[currentYear].children[0];
        root2 = rootOriginal.children[currentYear].children[1];
    }
    if(menu == 1){
        root = rootOriginal.children[0].children[0];
        root2 = rootOriginal.children[1].children[0];
    }
    if(menu == 2){
        root = rootOriginal.children[0].children[1];
        root2 = rootOriginal.children[1].children[1];
    }

    vis.selectAll("path").remove();
    vis2.selectAll("path").remove();

    percentonoff = 0;
    percentonoff2 = 0;
    yearString = "(2007)";
    yearString2 = "(2007)";

    partition = d3.layout.partition()
        .sort(null)
        .value(function(d) { return 1; });

    path = vis.datum(root).selectAll("path")
        .data(partition.nodes)
        .enter().append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return color((d.children ? d : d.parent).name);
        })
        .each(stash)
        .on("click", click)
        .on("mouseover", mouseover)
        .on('mousemove', function (d) {
            tooltip.style('top', (d3.event.layerY + 10) + 'px').style('left', (d3.event.layerX + 10) + 'px');
        })
        .on("mouseout", function (d) {
            tooltip.style("opacity", 0);
        });

    path2 = vis2.datum(root2).selectAll("path")
        .data(partition.nodes)
        .enter().append("path")
        .attr("d", arc2)
        .style("fill", function (d) {
            return color((d.children ? d : d.parent).name);
        })
        .each(stash)
        .on("click", click2)
        .on("mouseover", mouseover2)
        .on('mousemove', function (d) {
            tooltip2.style('top', (d3.event.layerY + 10) + 'px').style('left', (d3.event.layerX + 10) + 'px');
        })
        .on("mouseout", function (d) {
            tooltip2.style("opacity", 0);
        });


    total = root.value;
    total2 = root2.value;

    if(menu == 1 || menu == 2){
        document.getElementById("countsize").value = 1;
        change();
        document.getElementById("countsize2").value = 1;
        change2();
    }

    d3.select("#gesamtEinAus").text(root.name+ " " + yearString);
    d3.select("#gesamtEinAus2").text(root2.name + " " + yearString2);
    d3.select("#differenzGesamt").text("0 Mio.");

}

d3.select(self.frameElement).style("height", height + "px");



function change(){
    path.transition()
        .duration(1000)
        .attrTween("d", arcTweenZoom(root));

    /* draw heirarchy */
    var sequenceArray = getAncestors(root);
    updateBreadcrumbs(sequenceArray);

    var value = document.getElementById("countsize3").value === "0"
        ? function() { return 1; }
        : function(d) { return d.size; };

    path.data(partition.value(value).nodes)
        .transition()
        .duration(1000)
        .attrTween("d", arcTweenData);

    total = root.value;

    if(percentonoff == 0) {
        percentonoff = 1;
        d3.select("#gesamtEinAus").text(root.name + " " + yearString + ", Total: " + (root.value/ 1000000000).toPrecision(4) + " Mia.");
    } else {
        percentonoff = 0;
        d3.select("#gesamtEinAus").text(root.name+ " " + yearString);
    }

    path2.transition()
        .duration(1000)
        .attrTween("d", arcTweenZoom2(root2));

    /* draw heirarchy */
    var sequenceArray = getAncestors(root2);
    updateBreadcrumbs(sequenceArray);

    var value = document.getElementById("countsize3").value === "0"
        ? function() { return 1; }
        : function(d) { return d.size; };

    path2.data(partition.value(value).nodes)
        .transition()
        .duration(1000)
        .attrTween("d", arcTweenData2);

    total2 = root2.value;

    if(percentonoff2 == 0) {
        percentonoff2 = 1;
        d3.select("#gesamtEinAus2").text(root2.name + " " + yearString2 + ", Total: " + (root2.value/ 1000000000).toPrecision(4) + " Mia.");
    } else {
        percentonoff2 = 0;
        d3.select("#gesamtEinAus2").text(root2.name+ " " + yearString2);
    }
}

function change2(){
    node = root2;
    path2.transition()
        .duration(1000)
        .attrTween("d", arcTweenZoom2(root2));

    /* draw heirarchy */
    var sequenceArray = getAncestors(root2);
    updateBreadcrumbs(sequenceArray);

    var value = document.getElementById("countsize2").value === "0"
        ? function() { return 1; }
        : function(d) { return d.size; };

    path2.data(partition.value(value).nodes)
        .transition()
        .duration(1000)
        .attrTween("d", arcTweenData2);

    total2 = root2.value;

    if(percentonoff2 == 0) {
        percentonoff2 = 1;
        d3.select("#gesamtEinAus2").text(root.name + " " + yearString2 + ", Total: " + (root.value/ 1000000000).toPrecision(4) + " Mia.");
    } else {
        percentonoff2 = 0;
        d3.select("#gesamtEinAus2").text(root.name+ " " + yearString2);
    }
}


function click(d) {
    node = d;
    path.transition()
        .duration(1000)
        .attrTween("d", arcTweenZoom(d));

    if(percentonoff == 1) {
        d3.select("#gesamtEinAus").text(d.name + " " + yearString + ", Total: " + (d.value / 1000000000).toPrecision(4) + " Mia.");
    } else {
        d3.select("#gesamtEinAus").text(d.name+ " " + yearString);
    }
}

function click2(d) {
    node = d;
    path2.transition()
        .duration(1000)
        .attrTween("d", arcTweenZoom(d));

    if(percentonoff2 == 1) {
        d3.select("#gesamtEinAus2").text(d.name + " " + yearString2 + ", Total: " + (d.value/ 1000000000).toPrecision(4) + " Mia.");
    } else {
        d3.select("#gesamtEinAus2").text(d.name + " " + yearString2);
    }
}

function click3(d) {
    node = d;
    path2.transition()
        .duration(1000)
        .attrTween("d", arcTweenZoom(d));


    if(percentonoff2 == 1) {
        d3.select("#gesamtEinAus2").text(d.name + " " + yearString2 + ", Total: " + (d.value/ 1000000000).toPrecision(4) + " Mia.");
    } else {
        d3.select("#gesamtEinAus2").text(d.name + " " + yearString2);
    }
}

function mouseover(d){

    var val;
    var valueString;
    value = d.value;
    if(d.value > 1000000000) {
        val = (d.value / 1000000000).toPrecision(4);
        valueString = val + " Mia.";
    } else {
        if(d.value > 1000000) {
            val = (d.value / 1000000).toPrecision(5);
            valueString = val + " Mio.";
        } else {
            valueString = "< 1 Mio.";
        }
    }

    var percentage = Math.round(((100 * d.value / total) * 100) /percentBase);
    var percentageString = percentage + "%";
    var percent = Math.round(1000 * d.value / total) / 10;
    if(percentonoff == 1){
        tooltip.text(d.name + " " + valueString + " ("  + percentageString + ")")
            .style("opacity", 0.8);
    } else {
        tooltip.text(d.name)
            .style("opacity", 0.8);
    }

    var sequenceArray = getAncestors(d);
    updateBreadcrumbs(sequenceArray, valueString);

    // Fade all the segments.
    d3.selectAll("path")
        .style("opacity", 0.3);

    // Then highlight only those that are an ancestor of the current segment.
    vis.selectAll("path")
        .filter(function(node) {
            return (sequenceArray.indexOf(node) >= 0);
        })
        .style("opacity", 1);
}

function mouseover2(d){

    var val;
    var valueString;
    value2 = d.value;
    if(d.value > 1000000000) {
        val = (d.value / 1000000000).toPrecision(4);
        valueString = val + " Mia.";
    } else {
        if(d.value > 1000000) {
            val = (d.value / 1000000).toPrecision(5);
            valueString = val + " Mio.";
        } else {
            valueString = "< 1 Mio.";
        }
    }

    var percentage = Math.round(((100 * d.value / total2) * 100) /percentBase);
    var percentageString = percentage + "%";
    var percent = Math.round(1000 * d.value / total2) / 10;
    if(percentonoff2 == 1){
        tooltip2.text(d.name + " " + valueString + " ("  + percentageString + ")")
            .style("opacity", 0.8);
    } else {
        tooltip2.text(d.name)
            .style("opacity", 0.8);
    }


    var sequenceArray = getAncestors(d);
    updateBreadcrumbs(sequenceArray, valueString);

    // Fade all the segments.
    d3.selectAll("path")
        .style("opacity", 0.3);

    // Then highlight only those that are an ancestor of the current segment.
    vis2.selectAll("path")
        .filter(function(node) {
            return (sequenceArray.indexOf(node) >= 0);
        })
        .style("opacity", 1);
}

function updateVisualization(currentYear,EinnahmenAusgaben,gr){

    if(gr == 1) {
        vis.selectAll("path").remove();

        root = rootOriginal.children[currentYear].children[0];

        path = vis.datum(root).selectAll("path")
            .data(partition.nodes)
            .enter().append("path")
            .attr("d", arc)
            .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
            .each(stash)
            .on("click", click)
            .on("mouseover", mouseover)
            .on('mousemove', function(d) {
                tooltip.style('top', (d3.event.layerY + 10) + 'px').style('left', (d3.event.layerX + 10) + 'px');
            })
            .on("mouseout", function(d) {
                tooltip.style("opacity", 0);
            });

        total = root.value;
    } else {
        vis2.selectAll("path").remove();

        root2 = rootOriginal.children[currentYear].children[1];

        path2 = vis2.datum(root2).selectAll("path")
            .data(partition.nodes)
            .enter().append("path")
            .attr("d", arc)
            .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
            .each(stash)
            .on("click", click2)
            .on("mouseover", mouseover2)
            .on('mousemove', function(d) {
                tooltip2.style('top', (d3.event.layerY + 10) + 'px').style('left', (d3.event.layerX + 10) + 'px');
            })
            .on("mouseout", function(d) {
                tooltip2.style("opacity", 0);
            });

        total2 = root.value;
    }
    var valueString = getNewValue();

    if (gr == 1) {
        if(percentonoff == 1) {
            d3.select("#gesamtEinAus").text(root.name + " " + yearString + ", Total: " + (root.value/ 1000000000).toPrecision(4) + " Mia.");
        } else {
            d3.select("#gesamtEinAus").text(root.name+ " " + yearString);
        }
    } else {
        if(percentonoff2 == 1) {
            d3.select("#gesamtEinAus2").text(root2.name + " " + yearString2 + ", Total: " + (root2.value/ 1000000000).toPrecision(4) + " Mia.");
        } else {
            d3.select("#gesamtEinAus2").text(root2.name+ " " + yearString2);
        }
    }
    d3.select("#differenzGesamt").text(valueString);
}

function darstellung(m){
    switch (m){
        case 0: document.getElementById("vergleich").style.display = "none";
                document.getElementById("einzelnesJahr").style.display = "block";
                document.getElementById("einaus3").style.display = "none";
                EinAus3 = 0;
                Year3 =0;
                menu = 0;
                newGraphic(Year3,EinAus3);
                break;
        case 1: document.getElementById("vergleich").style.display = "block";
                document.getElementById("einzelnesJahr").style.display = "none";
                document.getElementById("einaus").style.display = "none";
                document.getElementById("einaus2").style.display = "none";
                EinAus3 = 0;
                Year3 =0;
                menu = 1;
                newGraphic(Year3,EinAus3);
                break;
        case 2: document.getElementById("vergleich").style.display = "block";
                document.getElementById("einzelnesJahr").style.display = "none";
                document.getElementById("einaus").style.display = "none";
                document.getElementById("einaus2").style.display = "none";
                EinAus3 = 0;
                Year3 =0;
                menu = 2;
                newGraphic(Year3,EinAus3);
                break;
    }

}

darstellung(menu);


