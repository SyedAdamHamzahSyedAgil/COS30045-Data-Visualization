
function drawScatterplot(data) {
    d3.select("#scatterplot").selectAll("*").remove();

    const validData = data.filter(d =>
        Number.isFinite(d.star2) &&
        Number.isFinite(d.energyConsumption) &&
        d.energyConsumption >= 0 &&
        d.screenType
    );

    if (validData.length === 0) {
        console.error("No valid data available for scatterplot.");
        return;
    }

    const screenTypes = [
        ...new Set(validData.map(d => d.screenType))
    ].sort();

    colorScaleS.domain(screenTypes);

    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${scatterplotWidthS} ${scatterplotHeightS}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("width", "100%")
        .attr("height", "auto");

    innerChartS = svg.append("g")
        .attr(
            "transform",
            `translate(${scatterplotMarginS.left},${scatterplotMarginS.top})`
        );

    xScaleS = d3.scaleLinear()
        .domain([
            0,
            d3.max(validData, d => d.star2)
        ])
        .nice()
        .range([0, scatterplotInnerWidthS]);

    yScaleS = d3.scaleLinear()
        .domain([
            0,
            d3.max(validData, d => d.energyConsumption)
        ])
        .nice()
        .range([scatterplotInnerHeightS, 0]);

    innerChartS.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${scatterplotInnerHeightS})`)
        .call(d3.axisBottom(xScaleS));

    innerChartS.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScaleS));

    innerChartS.append("text")
        .attr("class", "axis-label")
        .attr("x", scatterplotInnerWidthS / 2)
        .attr("y", scatterplotInnerHeightS + 55)
        .attr("text-anchor", "middle")
        .text("Star Rating");

    innerChartS.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -scatterplotInnerHeightS / 2)
        .attr("y", -60)
        .attr("text-anchor", "middle")
        .text("Energy Consumption");

    innerChartS.selectAll(".scatter-point")
        .data(validData)
        .join("circle")
        .attr("class", "scatter-point")
        .attr("cx", d => xScaleS(d.star2))
        .attr("cy", d => yScaleS(d.energyConsumption))
        .attr("r", 5)
        .attr("fill", d => colorScaleS(d.screenType))
        .attr("opacity", 0.5);

    const legend = innerChartS.append("g")
        .attr("class", "scatter-legend")
        .attr("transform", `translate(${scatterplotInnerWidthS + 20}, 10)`);

    const legendItems = legend.selectAll(".legend-item")
        .data(screenTypes)
        .join("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 25})`);

    legendItems.append("rect")
        .attr("width", 14)
        .attr("height", 14)
        .attr("rx", 2)
        .attr("fill", d => colorScaleS(d));

    legendItems.append("text")
        .attr("x", 21)
        .attr("y", 11)
        .text(d => d)
        .attr("font-size", "13px")
        .attr("fill", "#222222");
}