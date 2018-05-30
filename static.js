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
        var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
        return function(t) {
            x.domain(xd(t));
            return tween(t);
        };
    } else {
        return tween;
    }
}

function arcTweenData2(a, i) {
    var oi = d3.interpolate({y: a.x0, dx: a.dx0}, a);
    function tween(t) {
        var b = oi(t);
        a.x0 = b.x;
        a.dx0 = b.dx;
        return arc2(b);
    }
    if (i == 0) {
        // If we are on the first arc, adjust the x domain to match the root node
        // at the current zoom level. (We only need to do this once.)
        var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
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

// When zooming: interpolate the scales.
function arcTweenZoom2(d) {
    var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
        yd = d3.interpolate(y.domain(), [d.y, 1]),
        yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
    return function(d, i) {
        return i
            ? function(t) { return arc2(d); }
            : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc2(d); };
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

// Setup for switching data: stash the old values for transition.
function stash(d) {
    d.x0 = d.x;
    d.dx0 = d.dx;
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
