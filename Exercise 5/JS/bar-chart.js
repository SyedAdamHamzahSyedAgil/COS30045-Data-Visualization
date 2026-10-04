const drawBarChart = data => {

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

    const svg = d3
        .select("#bar-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("role", "img")
        .attr(
            "aria-label",
            "Bar chart comparing average energy consumption of LCD, LED and OLED 55-inch televisions"
        );

    const innerChart = svg
        .append("g")
        .attr(
            "transform",
            `translate(${margin.left}, ${margin.top})`
        );

    const xScale = d3
        .scaleBand()
        .domain(data.map(d => d.screenTech))
        .range([0, innerWidth])
        .padding(0.25);

    const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.energy)])
        .nice()
        .range([innerHeight, 0]);

    const xAxis = d3
        .axisBottom(xScale);

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
        .text("Average Energy Consumption (kWh/year)");

    innerChart
        .append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 75)
        .attr("text-anchor", "middle")
        .text("Screen Type");

    innerChart
        .selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.screenTech))
        .attr("y", d => yScale(d.energy))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d.energy));

    innerChart
        .selectAll(".bar-label")
        .data(data)
        .join("text")
        .attr("class", "bar-label")
        .attr(
            "x",
            d => xScale(d.screenTech) + xScale.bandwidth() / 2
        )
        .attr("y", d => yScale(d.energy) - 10)
        .attr("text-anchor", "middle")
        .text(d => d.energy.toFixed(1));
};

d3.csv("Data/Data_exercise 5.1-1.csv", d => {

    return {
        screenTech: d.Screen_Tech.toUpperCase(),
        energy: +d["Mean(Labelled energy consumption (kWh/year))"]
    };

}).then(data => {

    data.sort((a, b) => d3.descending(a.energy, b.energy));

    console.log("Loaded bar chart data:", data);

    drawBarChart(data);

}).catch(error => {

    console.error("BAR CHART ERROR:", error);

});