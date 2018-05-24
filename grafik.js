// Dimensions of sunburst.
var width = 400;
var height = 400;
var radius = Math.min(width, height) / 2;

var value;
var value2;

var rootOriginal = [];

var EinAus = 0;
var Year =0;
var EinAus2 = 0;
var Year2 =0;

var yearString = "(2007)";
var yearString2 = "(2007)";

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
    w: 75, h: 30, s: 3, t: 10
};

// make `colors` an ordinal scale
var colors = d3.scale.category20c();

// Total size of all segments; we set this later, after loading the data.
var totalSize = 0;
var totalSize2 = 0;

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

var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

var y = d3.scale.sqrt()
    .range([0, radius]);

var partition = d3.layout.partition()
    .value(function(d) { return d.size; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });


d3.json("EinAusgabenBund.json", function(error, root) {
    if (error) throw error;

    rootOriginal = root;

    createVisualization(Year,EinAus);
});


// Main function to draw and set up the visualization, once we have the data.
function createVisualization(currentYear,EinnahmenAusgaben) {

    root = rootOriginal.children[currentYear].children[EinnahmenAusgaben];

    vis.selectAll("circle").remove();
    vis2.selectAll("circle").remove();

    // Bounding circle underneath the sunburst, to make it easier to detect
    // when the mouse leaves the parent g.
    vis.append("circle")
        .attr("r", radius)
        .style("opacity", 0);
    vis2.append("circle")
        .attr("r", radius)
        .style("opacity", 0);

    // For efficiency, filter nodes to keep only those large enough to see.
    var nodes = partition.nodes(root);

    var uniqueNames = (function(a) {
        var output = [];
        a.forEach(function(d) {
            if (output.indexOf(d.name) === -1) {
                output.push(d.name);
            }
        });
        return output;
    })(nodes);

    // set domain of colors scale based on data
    colors.domain(uniqueNames);

    var path = vis.data([root]).selectAll("path")
        .data(nodes)
        .enter()
        .append("path")
        .attr("display", function(d) { return d.depth ? null : "none"; })
        .attr("d", arc)
        .style("fill", function(d) { return colors(d.name); })
        .style("opacity", 1)
        .on("mouseover", mouseover)
        .on("click", click);

    var path2 = vis2.data([root]).selectAll("path")
        .data(nodes)
        .enter()
        .append("path")
        .attr("display", function(d) { return d.depth ? null : "none"; })
        .attr("d", arc)
        .style("fill", function(d) { return colors(d.name); })
        .style("opacity", 1)
        .on("mouseover", mouseover2)
        .on("click", click2);

    total = root.value;
    total2 = root.value;

    totalSize = path.node().__data__.value;
    totalSize2 = path2.node().__data__.value;

    d3.select("#gesamtEinAus").text(root.name + " " + yearString + ", Total: " + (root.value/ 1000000000).toPrecision(4) + " Mia.");
    d3.select("#gesamtEinAus2").text(root.name + " " + yearString2 + ", Total: " + (root.value/ 1000000000).toPrecision(4) + " Mia.");
    d3.select("#differenzGesamt").text("0 Mio.");
};



// Fade all but the current sequence, and show it in the breadcrumb trail.
function mouseover(d) {

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

    d3.select("#percentage")
        .text(valueString);

    d3.select("#currentTopic").text(d.name);
    var newValue = value-value2;
    if(newValue > 1000000000 || newValue < -1000000000) {
        newValue = (newValue / 1000000000).toPrecision(4);
        valueString = newValue + " Mia.";
    } else {
        if (newValue > 1000000 || newValue < -1000000) {
            newValue = (newValue / 1000000).toPrecision(5);
            valueString = newValue + " Mio.";
        } else {
            valueString = "< 1 Mio.";
        }
    }
    d3.select("#differenz").text(valueString);

    d3.select("#explanation")
        .style("visibility", "");

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


// Fade all but the current sequence, and show it in the breadcrumb trail.
function mouseover2(d) {

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
    d3.select("#percentage2")
        .text(valueString);

    d3.select("#currentTopic2").text(d.name);
    var newValue = value-value2;
    if(newValue > 1000000000 || newValue < -1000000000) {
        newValue = (newValue / 1000000000).toPrecision(4);
        valueString = newValue + " Mia.";
    } else {
        if (newValue > 1000000 || newValue < -1000000) {
            newValue = (newValue / 1000000).toPrecision(5);
            valueString = newValue + " Mio.";
        } else {
            valueString = "< 1 Mio.";
        }
    }
    d3.select("#differenz").text(valueString);

    d3.select("#explanation2")
        .style("visibility", "");

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

// Given a node in a partition layout, return an array of all of its ancestor
// nodes, highest first, but excluding the root.
function getAncestors(node) {
    var path = [];
    var current = node;
    while (current.parent) {
        path.unshift(current);
        current = current.parent;
    }
    return path;
}



function updateBreadcrumbs(nodeArray, percentageString) {

    var g = d3.select("#trail")
        .selectAll("g")
        .data(nodeArray, function(d) { return d.name + d.depth; });

    var entering = g.enter().append("g");

    entering.append("text")
        .attr("x", (b.w + b.t) / 2)
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; });

    g.attr("transform", function(d, i) {
        return "translate(" + i * (b.w + b.s) + ", 0)";
    });

    g.exit().remove();

    d3.select("#trail").select("#endlabel")
        .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(percentageString);

    d3.select("#trail")
        .style("visibility", "");
}

function click(d) {
    updateAfterClick(d,1);
}

function click2(d) {
    updateAfterClick(d,2);
}

function updateAfterClick(root, gr){

    if (gr == 1) {
        var newPath = vis.selectAll("path").data([root]);
    } else {
        var newPath = vis2.selectAll("path").data([root]);
    }
    newPath.exit().remove();

    newPath.attr("class", "update");

    var nodes = partition.nodes(root);

    if(gr == 1) {
        vis.data([root]).selectAll("path")
            .data(nodes)
            .enter()
            .append("path")
            .attr("display", function (d) {
                return d.depth ? null : "none";
            })
            .attr("d", arc)
            .style("fill", function (d) {
                return colors(d.name);
            })
            .style("opacity", 1)
            .on("mouseover", mouseover)
            .on("click", click);

        total = root.value;
    } else {
        vis2.data([root]).selectAll("path")
            .data(nodes)
            .enter()
            .append("path")
            .attr("display", function(d) { return d.depth ? null : "none"; })
            .attr("d", arc)
            .style("fill", function(d) { return colors(d.name); })
            .style("opacity", 1)
            .on("mouseover", mouseover2)
            .on("click", click2);

        total2 = root.value;
    }
    var valueString = getNewValue();

    if (gr == 1) {
        d3.select("#gesamtEinAus").text(root.name + " " + yearString + ", Total: " + (root.value / 1000000000).toPrecision(4) + " Mia.");
    } else {
        d3.select("#gesamtEinAus2").text(root.name + " " + yearString2 + ", Total: " + (root.value/ 1000000000).toPrecision(4) + " Mia.");
    }
    d3.select("#differenzGesamt").text(valueString);
}

function EinAusagben() {
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
    }
    updateVisualization(Year,EinAus,1);
}

function EinAusagben2() {
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
    }
    updateVisualization(Year2,EinAus2,2);
}


function updateVisualization(currentYear,EinnahmenAusgaben,gr){

    root = rootOriginal.children[currentYear].children[EinnahmenAusgaben];

    if (gr == 1) {
        var newPath = vis.selectAll("path").data([root]);
    } else {
        var newPath = vis2.selectAll("path").data([root]);
    }
    newPath.exit().remove();

    newPath.attr("class", "update");

    var nodes = partition.nodes(root);

    if(gr == 1) {
        vis.data([root]).selectAll("path")
            .data(nodes)
            .enter()
            .append("path")
            .attr("display", function (d) {
                return d.depth ? null : "none";
            })
            .attr("d", arc)
            .style("fill", function (d) {
                return colors(d.name);
            })
            .style("opacity", 1)
            .on("mouseover", mouseover)
            .on("click", click);

        total = root.value;
    } else {
        vis2.data([root]).selectAll("path")
            .data(nodes)
            .enter()
            .append("path")
            .attr("display", function(d) { return d.depth ? null : "none"; })
            .attr("d", arc)
            .style("fill", function(d) { return colors(d.name); })
            .style("opacity", 1)
            .on("mouseover", mouseover2)
            .on("click", click2);

        total2 = root.value;
    }
    var valueString = getNewValue();

    if (gr == 1) {
        d3.select("#gesamtEinAus").text(root.name + " " + yearString + ", Total: " + (root.value / 1000000000).toPrecision(4) + " Mia.");
    } else {
        d3.select("#gesamtEinAus2").text(root.name + " " + yearString2 + ", Total: " + (root.value/ 1000000000).toPrecision(4) + " Mia.");
    }
    d3.select("#differenzGesamt").text(valueString);
}

function getNewValue(){
    var valueString;
    var newValue = total-total2;
    if(newValue > 1000000000 || newValue < -1000000000) {
        newValue = (newValue / 1000000000).toPrecision(4);
        valueString = newValue + " Mia.";
    } else {
        if (newValue > 1000000 || newValue < -1000000) {
            newValue = (newValue / 1000000).toPrecision(5);
            valueString = newValue + " Mio.";
        } else {
            valueString = "< 1 Mio.";
        }
    }
    return valueString;
}
