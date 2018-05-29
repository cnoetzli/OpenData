var width = 400,
    height = 400,
    radius = Math.min(width, height) / 2;


var EinAus = 0;
var Year =0;
var EinAus2 = 0;
var Year2 =0;

var yearString = "(2007)";
var yearString2 = "(2007)";

var total;
var total2;
var percentBase = 100;
var percentonoff = 0;

var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

var y = d3.scale.sqrt()
    .range([0, radius]);

var b = {
    w: 175, h: 30, s: 3, t: 10
};

var value;

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

var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });


var node;

d3.json("EinAusgabenBund.json", function(error, root) {
    if (error) throw error;

    rootOriginal = root;

    newGraphic(Year,EinAus);
});

function newGraphic(currentYear,EinnahmenAusgaben){

    root = rootOriginal.children[currentYear].children[EinnahmenAusgaben];

    vis.selectAll("path").remove();

    vis2.selectAll("path").remove();

    var path = vis.datum(root).selectAll("path")
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

    var path2 = vis2.datum(root).selectAll("path")
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
    total2 = root.value;

    d3.selectAll("input").on("change", function change() {

        node = root;
        path.transition()
            .duration(1000)
            .attrTween("d", arcTweenZoom(root));

        /* draw heirarchy */
        var sequenceArray = getAncestors(root);
        updateBreadcrumbs(sequenceArray);

        var value = this.value === "count"
            ? function() { return 1; }
            : function(d) { return d.size; };

        path.data(partition.value(value).nodes)
            .transition()
            .duration(1000)
            .attrTween("d", arcTweenData);

        total = root.value;

        var countsize = document.getElementById("countsize").value;

        if(percentonoff == 0){
            percentonoff = 1;
        } else {
            percentonoff = 0;
        }

        d3.select("#gesamtEinAus").text(root.name + " " + yearString + ", Total: " + (root.value/ 1000000000).toPrecision(4) + " Mia.");
        d3.select("#gesamtEinAus2").text(root.name + " " + yearString2 + ", Total: " + (root.value/ 1000000000).toPrecision(4) + " Mia.");
        d3.select("#differenzGesamt").text("0 Mio.");

    });

    function click(d) {
        node = d;
        path.transition()
            .duration(1000)
            .attrTween("d", arcTweenZoom(d));

        /* draw heirarchy */
        var sequenceArray = getAncestors(d);
        updateBreadcrumbs(sequenceArray);

        d3.select("#gesamtEinAus").text(d.name + " " + yearString + ", Total: " + (d.value / 1000000000).toPrecision(4) + " Mia.");
    }

    total = root.value;
    total2 = root.value;

    d3.select("#gesamtEinAus").text(root.name + " " + yearString + ", Total: " + (root.value/ 1000000000).toPrecision(4) + " Mia.");
    d3.select("#gesamtEinAus2").text(root.name + " " + yearString2 + ", Total: " + (root.value/ 1000000000).toPrecision(4) + " Mia.");
    d3.select("#differenzGesamt").text("0 Mio.");
}

d3.select(self.frameElement).style("height", height + "px");

// Setup for switching data: stash the old values for transition.
function stash(d) {
    d.x0 = d.x;
    d.dx0 = d.dx;
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

function arcTweenData(a, i) {
    var oi = d3.interpolate({y: a.x0, dx: a.dx0}, a);
    function tween(t) {
        var b = oi(t);
        a.x0 = b.x;
        a.dx0 = b.dx;
        return arc(b);
    }
    if (i == 0) {
        // If we are on the first arc, adjust the x domain to match the root node
        // at the current zoom level. (We only need to do this once.)
        var xd = d3.interpolate(x .domain(), [node.x, node.x + node.dx]);
        return function(t) {
            x.domain(xd(t));
            return tween(t);
        };
    } else {
        return tween;
    }
}

// When zooming: interpolate the scales.
function arcTweenZoom(d) {
    var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
        yd = d3.interpolate(y.domain(), [d.y, 1]),
        yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
    return function(d, i) {
        return i
            ? function(t) { return arc(d); }
            : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
    };
}

function getAncestors(node) {
    var path = [];
    var current = node;
    while (current.parent) {
        path.unshift(current);
        current = current.parent;
    }
    path.unshift(current);
    return path;
}

function getSize(node) {
    if (!node.children){
        return node.size;
    } else {
        var child;
        var size = 0;
        for (child in node.children){
            size += getSize(node.children[child]);
        }
        return size;
    }
}

function updateBreadcrumbs(nodeArray) {

    var g = d3.select("#trail")
        .selectAll("g")
        .data(nodeArray, function(d) { return d.name + d.depth; });

    var entering = g.enter().append("vis:g");

    entering.append("vis:polygon")
        .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
        .on("click", function(d){click(d);});

    entering.append("vis:text")
        .attr("x", (b.w + b.t) / 2)
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; })
        .on("click", function(d){ click(d);});


    g.attr("transform", function(d, i) {
        return "translate(" + i * (b.w + b.s) + ", 0)";
    });

    g.exit().remove();

    d3.select("#trail")
        .style("visibility", "");

}

function EinAusagben() {
    if (document.getElementById("einaus").value == "1"){
        EinAus = 1;
    } else {
        EinAus = 0;
    }
    newGraphic(Year,EinAus);
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
    }
    newGraphic(Year,EinAus);
}
