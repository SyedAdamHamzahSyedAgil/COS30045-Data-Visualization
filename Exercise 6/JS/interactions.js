
function populateFilters(data) {
    const filterContainer = d3.select("#filters_screen");

    filterContainer.selectAll("*").remove();

    const buttons = filterContainer
        .selectAll("button")
        .data(screenFilters)
        .join("button")
        .attr("type", "button")
        .attr("id", d => `filter-${d.id}`)
        .attr("class", "filter-button")
        .classed("active", d => d.isActive)
        .attr("aria-pressed", d => d.isActive)
        .text(d => d.label)
        .on("click", function(event, selectedFilter) {
            if (selectedFilter.id === "all") {
                screenFilters.forEach(filter => {
                    filter.isActive = filter.id === "all";
                });
            } else {
                selectedFilter.isActive = !selectedFilter.isActive;

                const allFilter = screenFilters.find(
                    filter => filter.id === "all"
                );

                allFilter.isActive = false;

                const anySelected = screenFilters
                    .filter(filter => filter.id !== "all")
                    .some(filter => filter.isActive);

                if (!anySelected) {
                    allFilter.isActive = true;
                }
            }

            filterContainer
                .selectAll("button")
                .classed("active", d => d.isActive)
                .attr("aria-pressed", d => d.isActive);

            updateHistogram(data);
        });

    updateHistogram(data);
}

function updateHistogram(data) {
    const activeFilters = screenFilters
        .filter(filter => filter.isActive)
        .map(filter => filter.id);

    let updatedData;

    if (activeFilters.includes("all")) {
        updatedData = data;
    } else {
        updatedData = data.filter(d =>
            activeFilters.includes(
                String(d.screenType).trim().toUpperCase()
            )
        );
    }

    console.log("Active filters:", activeFilters);
    console.log("Filtered data:", updatedData);

    const updatedBins = binGenerator(updatedData);

    const innerChart = d3.select("#histogram-chart svg g");

    if (innerChart.empty()) {
        console.error("Histogram SVG not found.");
        return;
    }

    const bars = innerChart
        .selectAll(".histogram-bar")
        .data(updatedBins, d => d.x0);

    bars.exit()
        .transition()
        .duration(300)
        .attr("y", histogramInnerHeight)
        .attr("height", 0)
        .remove();

    const newBars = bars.enter()
        .append("rect")
        .attr("class", "histogram-bar")
        .attr("x", d => histogramXScale(d.x0) + 1)
        .attr("y", histogramInnerHeight)
        .attr("width", d =>
            Math.max(
                0,
                histogramXScale(d.x1) -
                histogramXScale(d.x0) - 2
            )
        )
        .attr("height", 0)
        .attr("fill", histogramBarColor)
        .attr("stroke", bodyBackgroundColor)
        .attr("stroke-width", 1);

    newBars.merge(bars)
        .transition()
        .duration(750)
        .ease(d3.easeCubicOut)
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
        );

    innerChart
        .selectAll(".histogram-bar")
        .selectAll("title")
        .remove();

    innerChart
        .selectAll(".histogram-bar")
        .append("title")
        .text(d =>
            `Energy: ${d.x0.toFixed(1)}–${d.x1.toFixed(1)} | Frequency: ${d.length}`
        );

    innerChart
        .select(".histogram-y-axis")
        .transition()
        .duration(750)
        .call(
            d3.axisLeft(histogramYScale)
                .ticks(5)
                .tickFormat(d3.format("d"))
        );

    innerChart
        .select(".histogram-x-axis")
        .call(d3.axisBottom(histogramXScale));
}

function createTooltip() {
    if (!innerChartS) {
        console.error("Scatterplot inner chart is not available.");
        return;
    }

    innerChartS.selectAll(".scatter-tooltip").remove();

    tooltipS = innerChartS.append("g")
        .attr("class", "scatter-tooltip")
        .style("opacity", 0)
        .style("pointer-events", "none");

    tooltipS.append("rect")
        .attr("width", tooltipWidthS)
        .attr("height", tooltipHeightS)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("fill", "#C76E00")
        .attr("opacity", 0.9);

    tooltipS.append("text")
        .attr("class", "tooltip-text")
        .attr("x", 10)
        .attr("y", 28)
        .attr("fill", "#ffffff")
        .attr("font-size", "13px")
        .attr("font-weight", "bold")
        .text("");
}

function handleMouseEvents() {
    if (!innerChartS || !tooltipS) {
        console.error("Create the scatterplot and tooltip first.");
        return;
    }

    innerChartS.selectAll(".scatter-point")
        .on("mouseenter", function(event, d) {
            console.log("Mouse entered:", d);

            const circle = d3.select(this);

            const cx = Number(circle.attr("cx"));
            const cy = Number(circle.attr("cy"));

            const screenSize = Number.isFinite(d.screenSize)
                ? `${d.screenSize} inches`
                : "Not available";

            tooltipS.select(".tooltip-text")
                .text(`Screen size: ${screenSize}`);

            const tooltipX = Math.max(
                0,
                Math.min(
                    cx + 10,
                    scatterplotInnerWidthS - tooltipWidthS
                )
            );

            const tooltipY = Math.max(
                0,
                cy - tooltipHeightS - 10
            );

            tooltipS
                .attr("transform", `translate(${tooltipX}, ${tooltipY})`)
                .transition()
                .duration(200)
                .style("opacity", 1);

            circle
                .attr("opacity", 1)
                .attr("r", 7);
        })
        .on("mouseleave", function() {
            console.log("Mouse left data point");

            tooltipS
                .transition()
                .duration(200)
                .style("opacity", 0);

            d3.select(this)
                .attr("opacity", 0.5)
                .attr("r", 5);
        });
}