d3.select("h1")
    .style("color", "green");

d3.select(".d3-container")
    .append("p")
    .text("This is to Simulate the Text of the Paragraph");

d3.select(".d3-svg")
    .append("rect")
    .attr("x", 50)
    .attr("y", 30)
    .attr("width", 150)
    .attr("height", 50)
    .style("fill", "green");