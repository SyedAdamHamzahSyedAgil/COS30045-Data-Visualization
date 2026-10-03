const svg = d3.select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", "0 0 500 1200")
    .style("border", "1px solid black");

const createBarChart = data => {

    const xScale = d3.scaleLinear()
        .domain([0, 1200])
        .range([100, 500]);

    const yScale = d3.scaleBand()
        .domain(data.map(d => d.brand))
        .range([0, 1200])
        .padding(0.1);

    const barAndLabel = svg
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

    barAndLabel
        .append("rect")
        .attr("class", d => `bar bar-${d.count}`)
        .attr("width", d => xScale(d.count) - 100)
        .attr("height", yScale.bandwidth())
        .attr("fill", "blue")
        .attr("x", 100)
        .attr("y", 0);

    barAndLabel
        .append("text")
        .text(d => d.brand)
        .attr("x", 90)
        .attr("y", 15)
        .attr("text-anchor", "end")
        .style("font-size", "13px");

    barAndLabel
        .append("text")
        .text(d => d.count)
        .attr("x", d => xScale(d.count) + 5)
        .attr("y", yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .style("font-size", "13px");
};

d3.csv("Data/tvBrandCount.csv", d => {
    return {
        brand: d.brand,
        count: +d.count
    };
}).then(data => {

    console.log(data);
    console.log(data.length);
    console.log(d3.max(data, d => d.count));
    console.log(d3.min(data, d => d.count));
    console.log(d3.extent(data, d => d.count));

    data.sort((a, b) => b.count - a.count);

    console.log(data);

    createBarChart(data);
});