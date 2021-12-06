<script>
import VolcanoPlotUtils from './VolcanoPlotUtils'

export default ({
    name: "ComparisonVolcanoPlot",
    mixins: [VolcanoPlotUtils],
    props: {
        geneExpressionOne: {
            type: Array,
            default: () => [],
        },
        geneExpressionTwo: {
            type: Array,
            default: () => [],
        },
        titleOne: {
            type: String,
            default: "Data One"
        },
        titleTwo: {
            type: String,
            default: "Data Two"
        }
    },
    methods: {
        fillData(diffExpResults, x, y, text) {
            for (let i = 0; i < diffExpResults.length; i++) {
                let tmp = diffExpResults[i]
                x.push(tmp.logFC);
                y.push(-Math.log10(tmp.pValue));
                text.push(this.createText(tmp));
            }
        },

        updatePlot(data) {
            const chosenX = [];
            const chosenY = [];
            const chosenText = [];
            this.fillData(this.geneExpressionOne, chosenX, chosenY, chosenText);
            const filteredX = [];
            const filteredY = [];
            const filteredText = [];
            this.fillData(this.geneExpressionTwo, filteredX, filteredY, filteredText);
            data[0].x = chosenX;
            data[0].y = chosenY;
            data[0].text = chosenText;
            data[0].name = "<b>" + this.titleOne + " (a)</b>";
            data[0].marker.color = NaN // Let plotly decide a color
            data[0].marker.opacity = 0.75 // To see each other
            data[1].x = filteredX;
            data[1].y = filteredY;
            data[1].text = filteredText;
            data[1].name = "<b>" + this.titleTwo + " (b)</b>";
            data[1].marker.color = NaN
            data[1].marker.opacity = 0.75
            return data
        },
    },
})
</script>
