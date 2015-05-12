
var TILE_WIDTH = 150;
var TILE_HEIGHT = 150;


function makeGrid()
{
    var bbox = d3.select("#svgContainer").node().getBoundingClientRect();
    var cWidth = bbox.width;
    var cHeight = bbox.height;

    var grid = d3.select("#svgContainer").append("svg")
                    .attr("width", cWidth)
                    .attr("height", cHeight)
                    .attr("class", "chart");

    var nRows = cWidth / TILE_WIDTH + 1;
    var nCols = cHeight / TILE_HEIGHT + 1;
    var gridData = makeGridData(nRows, nCols);

    var row = grid.selectAll(".row")
                  .data(gridData)
                  .enter().append("svg:g")
                  .attr("class", "row");

    var col = row.selectAll(".cell")
                 .data(function (d) { return d; })
                 .enter().append("svg:rect")
                 .attr("class", "cell")
                 .attr("x", function(d) { return d.x; })
                 .attr("y", function(d) { return d.y; })
                 .attr("width", TILE_WIDTH)
                 .attr("height", TILE_HEIGHT)
                 .on('mouseover', function() {
                    d3.select(this)
                    .style('fill', '#0F0');
                 })
                 .on('mouseout', function() {
                    d3.select(this)
                    .style('fill', '#FFF');
                 })
                .on('click', function(d) {
                    console.log(d3.select(this));
                    alert("You have clicked: " + d.x + ", " + d.y);
                })
                .style("fill", '#FFF')
                .style("stroke", '#555');

    // grid.selectAll("rect")
    //         .data(gridData)
    //         .enter().append("svg:rect")
    //          .attr("x", function(d, i) { return d[i].x; })
    //          .attr("y", function(d, i) { return d[i].y; })
    //          .attr("width", function(d, i) { return TILE_WIDTH; })
    //          .attr("height", function(d, i) { return TILE_HEIGHT; })
    //          .on('mouseover', function() {
    //             d3.select(this)
    //                 .style('fill', '#0F0');
    //          })
    //          .on('mouseout', function() {
    //             d3.select(this)
    //                 .style('fill', '#FFF');
    //          })
    //          .on('click', function() {
    //             console.log(d3.select(this));
    //          })
    //          .style("fill", '#FFF')
    //          .style("stroke", '#555');
}


function makeGridData(nRows, nCols)
{
    var data = new Array();
    var startX = - TILE_WIDTH / 2;
    var startY = - TILE_HEIGHT / 2;
    var newValue = 0;
    var count = 0;

    var ypos = startY;
    for (var i = 0; i < nCols; i++) {
        data.push(new Array());
        var xpos = startX;
        for (var j = 0; j < nRows; j++) {
            newValue = Math.round(Math.random() * (100 - 1) + 1);
            data[i].push({ 
                            time: j, 
                            value: newValue,
                            x: xpos,
                            y: ypos,
                            count: count
                        });
            xpos += TILE_WIDTH;
            count += 1;
        }
        ypos += TILE_HEIGHT;
    }

    return data;
}


makeGrid();
