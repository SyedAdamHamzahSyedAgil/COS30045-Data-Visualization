
function drawHistogram(data) {
    const chart = d3.select("#histogram-chart");

    chart.selectAll("*").remove();

    const svg = chart
        .append("svg")
        .attr("viewBox", `0 0 ${histogramWidth} ${histogramHeight}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("role", "img")
        .attr("aria-label", "Histogram of TV energy consumption");

    const innerChart = svg
        .append("g")
        .attr(
            "transform",
            `translate(${histogramMargin.left},${histogramMargin.top})`
        );

    const energyExtent = d3.extent(
        data,
        d => d.energyConsumption
    );

    binGenerator.domain(energyExtent);

    const bins = binGenerator(data);

    const minEnergy = bins[0].x0;
    const maxEnergy = bins[bins.length - 1].x1;
    const binsMaxLength = d3.max(bins, d => d.length);

    histogramXScale
        .domain([minEnergy, maxEnergy])
        .range([0, histogramInnerWidth]);

    histogramYScale
        .domain([0, binsMaxLength])
        .nice()
        .range([histogramInnerHeight, 0]);

    innerChart
        .selectAll(".histogram-bar")
        .data(bins)
        .join("rect")
        .attr("class", "histogram-bar")
        .attr("x", d => histogramXScale(d.x0) + 1)
        .attr("y", d => histogramYScale(d.length))
        .attr("width", d =>
            Math.max(
                0,
                histogramXScale(d.x1) -
                histogramXScale(d.x0) - 2
            )
        )
        .attr("height", d =>
            histogramInnerHeight - histogramYScale(d.length)
        )
        .attr("fill", histogramBarColor)
        .attr("stroke", bodyBackgroundColor)
        .attr("stroke-width", 1)
        .append("title")
        .text(d =>
            `Energy: ${d.x0.toFixed(1)}–${d.x1.toFixed(1)} | Frequency: ${d.length}`
        );

    innerChart
        .append("g")
        .attr("class", "histogram-x-axis")
        .attr("transform", `translate(0,${histogramInnerHeight})`)
        .call(d3.axisBottom(histogramXScale));

    innerChart
        .append("g")
        .attr("class", "histogram-y-axis")
        .call(
            d3.axisLeft(histogramYScale)
                .ticks(5)
                .tickFormat(d3.format("d"))
        );

    innerChart
        .append("text")
        .attr("class", "axis-label")
        .attr("x", histogramInnerWidth / 2)
        .attr("y", histogramInnerHeight + 55)
        .attr("text-anchor", "middle")
        .text("Energy Consumption");

    innerChart
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -histogramInnerHeight / 2)
        .attr("y", -55)
        .attr("text-anchor", "middle")
        .text("Frequency (Number of TVs)");
}