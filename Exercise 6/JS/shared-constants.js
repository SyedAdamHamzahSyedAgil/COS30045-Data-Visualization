const histogramWidth = 900;
const histogramHeight = 500;

const histogramMargin = {
    top: 30,
    right: 40,
    bottom: 70,
    left: 75
};

const histogramBarColor = "#4682b4";
const bodyBackgroundColor = "#ffffff";

const histogramInnerWidth =
    histogramWidth - histogramMargin.left - histogramMargin.right;

const histogramInnerHeight =
    histogramHeight - histogramMargin.top - histogramMargin.bottom;

const histogramXScale = d3.scaleLinear();
const histogramYScale = d3.scaleLinear();

const binGenerator = d3.bin()
    .value(d => d.energyConsumption)
    .thresholds(14);

const screenFilters = [
    {
        id: "all",
        label: "All TVs",
        isActive: true
    },
    {
        id: "LCD",
        label: "LCD",
        isActive: false
    },
    {
        id: "LED",
        label: "LED",
        isActive: false
    },
    {
        id: "OLED",
        label: "OLED",
        isActive: false
    }
];


const scatterplotWidthS = 960;
const scatterplotHeightS = 520;

const scatterplotMarginS = {
    top: 40,
    right: 180,
    bottom: 75,
    left: 85
};

const scatterplotInnerWidthS =
    scatterplotWidthS -
    scatterplotMarginS.left -
    scatterplotMarginS.right;

const scatterplotInnerHeightS =
    scatterplotHeightS -
    scatterplotMarginS.top -
    scatterplotMarginS.bottom;

let innerChartS;
let xScaleS;
let yScaleS;

const colorScaleS = d3.scaleOrdinal()
    .range(d3.schemeTableau10);


const tooltipWidthS = 160;
const tooltipHeightS = 48;
let tooltipS;