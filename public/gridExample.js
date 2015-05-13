/**
*   calendarWeekHour    Setup a week-hour grid: 
*                           7 Rows (days), 24 Columns (hours)
*   @param id           div id tag starting with #
*   @param width        width of the grid in pixels
*   @param height       height of the grid in pixels
*   @param square       true/false if you want the height to 
*                           match the (calculated first) width
*/
function calendarWeekHour(id, width, height, square)
{
    var calData = randomData(width, height, square);
    var grid = d3.select(id).append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("class", "chart");

        grid.selectAll("rect")
              .data(calData)
                .enter().append("svg:rect")
                 .attr("x", function(d, i) { return d[i].x; })
                 .attr("y", function(d, i) { return d[i].y; })
                 .attr("width", function(d, i) { return d[i].width; })
                 .attr("height", function(d, i) { return d[i].height; })
                 .on('mouseover', function() {
                    d3.select(this)
                        .style('fill', '#0F0');
                 })
                 .on('mouseout', function() {
                    d3.select(this)
                        .style('fill', '#FFF');
                 })
                 .on('click', function() {
                    console.log(d3.select(this));
                 })
                 .style("fill", '#FFF')
                 .style("stroke", '#555');
}

////////////////////////////////////////////////////////////////////////

/**
*   randomData()        returns an array: [
                                            [{id:value, ...}],
                                            [{id:value, ...}],
                                            [...],...,
                                            ];
                        ~ [
                            [hour1, hour2, hour3, ...],
                            [hour1, hour2, hour3, ...]
                          ]

*/
function randomData(gridWidth, gridHeight, square)
{
    var data = new Array();
    var gridItemWidth = gridWidth / 24;
    var gridItemHeight = (square) ? gridItemWidth : gridHeight / 7;
    var startX = gridItemWidth / 2;
    var startY = gridItemHeight / 2;
    var stepX = gridItemWidth;
    var stepY = gridItemHeight;
    var xpos = startX;
    var ypos = startY;
    var newValue = 0;
    var count = 0;

    for (var index_a = 0; index_a < 7; index_a++)
    {
        data.push(new Array());
        for (var index_b = 0; index_b < 24; index_b++)
        {
            newValue = Math.round(Math.random() * (100 - 1) + 1);
            data[index_a].push({ 
                                time: index_b, 
                                value: newValue,
                                width: gridItemWidth,
                                height: gridItemHeight,
                                x: xpos,
                                y: ypos,
                                count: count
                            });
            xpos += stepX;
            count += 1;
        }
        xpos = startX;
        ypos += stepY;
    }
    return data;
}
