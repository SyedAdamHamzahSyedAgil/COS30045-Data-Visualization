
d3.csv("Data/Ex6_TVdata_withStar.csv")
    .then(data => {
        console.log("CSV columns:", data.columns);
        console.log("Total CSV rows:", data.length);

        const validData = data.map(d => ({
            brand: d.brand?.trim(),
            model: d.model?.trim(),
            screenSize: Number(d.screenSize),
            screenType: d.screenTech?.trim().toUpperCase(),
            star2: Number(d.star),
            energyConsumption: Number(d.energyConsumption)
        })).filter(d =>
            Number.isFinite(d.star2) &&
            Number.isFinite(d.energyConsumption) &&
            d.energyConsumption >= 0 &&
            d.screenType
        );

        console.log("Valid TV data:", validData);
        console.log("Number of valid TVs:", validData.length);
        console.log(
            "Screen types:",
            [...new Set(validData.map(d => d.screenType))]
        );

        if (validData.length === 0) {
            console.error("No valid TV data found.");
            return;
        }

        drawHistogram(validData);
        populateFilters(validData);
        drawScatterplot(validData);

        if (typeof createTooltip === "function") {
            createTooltip();
        }

        if (typeof handleMouseEvents === "function") {
            handleMouseEvents();
        }
    })
    .catch(error => {
        console.error("Error loading TV dataset:", error);
    });

drawHistogram(validData);
populateFilters(validData);
drawScatterplot(validData);

createTooltip();
handleMouseEvents();