const drawLineChart = data => {

    const margin = {
        top: 50,
        right: 30,
        bottom: 100,
        left: 90
    };

    const width = 900;
    const height = 500;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, innerWidth]);

    const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.averagePrice)])
        .nice()
        .range([innerHeight, 0]);

    const svg = d3
        .select("#line-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);

    const innerChart = svg
        .append("g")
        .attr(
            "transform",
            `translate(${margin.left}, ${margin.top})`
        );

    const xAxis = d3
        .axisBottom(xScale)
        .ticks(10)
        .tickFormat(d3.format("d"));

    const yAxis = d3
        .axisLeft(yScale);

    innerChart
        .append("g")
        .attr("class", "x-axis")
        .attr(
            "transform",
            `translate(0, ${innerHeight})`
        )
        .call(xAxis);

    innerChart
        .append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    innerChart
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -60)
        .attr("text-anchor", "middle")
        .text("Average Spot Price ($/MWh)");

    innerChart
        .append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 75)
        .attr("text-anchor", "middle")
        .text("Year");

    innerChart
        .selectAll(".data-point")
        .data(data)
        .join("circle")
        .attr("class", "data-point")
        .attr("r", 5)
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.averagePrice));

    const lineGenerator = d3
        .line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.averagePrice));

    innerChart
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3);
};

d3.csv("Data/ARE_Spot_Prices.csv", d => {

    return {
        year: +d.Year,
        averagePrice: +d["Average Price (notTas-Snowy)"]
    };

}).then(data => {

    console.log("Processed line chart data:", data);

    drawLineChart(data);

}).catch(error => {

    console.error("LINE CHART ERROR:", error);

});