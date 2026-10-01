const DONUT_CSV_PATH = "Data/Data_exercise 5.3.csv";
const DONUT_CATEGORY_COLUMN = "Screensize_Category";
const DONUT_VALUE_COLUMN = "Count";

const donutContainer = d3.select("#donut-chart");

if (!donutContainer.empty()) {
    const width = 600;
    const height = 420;
    const radius = Math.min(width, height) / 2 - 55;

    const svg = donutContainer
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("role", "img")
        .attr(
            "aria-label",
            "Donut chart showing the proportion of TV models by screen size"
        );

    const chart = svg.append("g")
        .attr(
            "transform",
            `translate(${width / 2 - 55}, ${height / 2})`
        );

    const tooltip = donutContainer
        .append("div")
        .style("position", "absolute")
        .style("display", "none")
        .style("padding", "8px 10px")
        .style("background", "#222")
        .style("color", "#fff")
        .style("border-radius", "5px")
        .style("font-size", "13px")
        .style("pointer-events", "none")
        .style("z-index", "10");

    d3.csv(DONUT_CSV_PATH, row => ({
        category: (row[DONUT_CATEGORY_COLUMN] || "").trim(),
        value: Number(
            String(row[DONUT_VALUE_COLUMN] || "").replace(/,/g, "")
        )
    }))
    .then(rows => {
        console.log("Donut chart data:", rows);

        const data = rows.filter(d =>
            d.category !== "" &&
            Number.isFinite(d.value) &&
            d.value > 0
        );

        if (data.length === 0) {
            throw new Error(
                `No valid rows found. Check the CSV columns: ` +
                `${DONUT_CATEGORY_COLUMN} and ${DONUT_VALUE_COLUMN}.`
            );
        }

        const total = d3.sum(data, d => d.value);

        const colors = d3.scaleOrdinal()
            .domain(data.map(d => d.category))
            .range([
                "#4e79a7",
                "#f28e2b",
                "#59a14f"
            ]);

        const pie = d3.pie()
            .sort(null)
            .value(d => d.value);

        const arc = d3.arc()
            .innerRadius(radius * 0.58)
            .outerRadius(radius);

        const hoverArc = d3.arc()
            .innerRadius(radius * 0.58)
            .outerRadius(radius + 8);

        chart.selectAll("path")
            .data(pie(data))
            .join("path")
            .attr("d", arc)
            .attr("fill", d => colors(d.data.category))
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .style("cursor", "pointer")
            .on("mouseenter", function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(150)
                    .attr("d", hoverArc);

                const percentage =
                    (d.data.value / total * 100).toFixed(1);

                tooltip
                    .style("display", "block")
                    .text(
                        `${d.data.category}: ` +
                        `${d.data.value.toLocaleString()} models ` +
                        `(${percentage}%)`
                    );
            })
            .on("mousemove", function(event) {
                const [x, y] = d3.pointer(
                    event,
                    donutContainer.node()
                );

                tooltip
                    .style("left", `${x + 12}px`)
                    .style("top", `${y + 12}px`);
            })
            .on("mouseleave", function() {
                d3.select(this)
                    .transition()
                    .duration(150)
                    .attr("d", arc);

                tooltip.style("display", "none");
            });

        chart.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "-0.2em")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("TV Models");

        chart.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "1.3em")
            .style("font-size", "14px")
            .text(total.toLocaleString());

        const legend = svg.append("g")
            .attr(
                "transform",
                `translate(${width - 165}, 125)`
            );

        const legendRows = legend.selectAll("g")
            .data(data)
            .join("g")
            .attr(
                "transform",
                (d, i) => `translate(0, ${i * 32})`
            );

        legendRows.append("rect")
            .attr("width", 14)
            .attr("height", 14)
            .attr("rx", 2)
            .attr("fill", d => colors(d.category));

        legendRows.append("text")
            .attr("x", 22)
            .attr("y", 12)
            .style("font-size", "13px")
            .text(d => {
                const percentage =
                    (d.value / total * 100).toFixed(1);

                return `${d.category} (${percentage}%)`;
            });
    })
    .catch(error => {
        console.error("Donut chart error:", error);

        donutContainer.append("p")
            .attr("class", "chart-error")
            .text(
                "Could not display the donut chart. " +
                "Check the CSV path and column names in the console."
            );
    });
}