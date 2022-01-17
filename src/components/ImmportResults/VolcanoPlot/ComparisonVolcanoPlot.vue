<script>
import VolcanoPlotUtils from './VolcanoPlotUtils'
import EventBus from '../../../service/EventBus'

export default ({
    name: "ComparisonVolcanoPlot",
    mixins: [VolcanoPlotUtils],
    props: {
        compareFrom: Object,
        compareTo: Object,
    },

    data() {
        return {
            showlegend: true,
        };
    },
    
    mounted() {
        EventBus.$on('cutoffValuesUpdated', this.handleCutoffValuesUpdated);
    },

    beforeDestroy() {
        EventBus.$off('cutoffValuesUpdated', this.handleCutoffValuesUpdated);
    },

    methods: {

        handleCutoffValuesUpdated(values) {
            // Check if id is the same as we have here
            if (values.id !== this.compareFrom.id && values.id !== this.compareTo.id)
                return; // Do nothing
            let chart = this.$refs.chart;
            // The following functions are wrapped around Plotly.js via vue-plotly.
            this.updatePlot(chart.data);
            chart.react(chart.data, chart.layout, chart.config);
        },

        initData() {
            let plotData = [
                this.createData('One_Selected', '#ff6666'),
                this.createData('One_Filtered-out', '#ffd11a'),
                this.createData('Two_Selected', '#3333ff'),
                this.createData('Two_Filtered-out', '#98e6e6'),
            ];
            return plotData
        },

        fillData(diffExpResults, x, y, text) {
            for (let i = 0; i < diffExpResults.length; i++) {
                let tmp = diffExpResults[i]
                x.push(tmp.logFC);
                y.push(-Math.log10(tmp.pValue));
                text.push(this.createText(tmp));
            }
        },

        updatePlot(data) {
            this.splitData(this.compareFrom.geneExpressionResults,
                           this.compareFrom.cutoffValues.pValueCutoff,
                           this.compareFrom.cutoffValues.adjPValueCutoff,
                           this.compareFrom.cutoffValues.log2fdLower,
                           this.compareFrom.cutoffValues.log2fdUpper,
                           data[0],
                           data[1]);
            this.splitData(this.compareTo.geneExpressionResults,
                           this.compareTo.cutoffValues.pValueCutoff,
                           this.compareTo.cutoffValues.adjPValueCutoff,
                           this.compareTo.cutoffValues.log2fdLower,
                           this.compareTo.cutoffValues.log2fdUpper,
                           data[2],
                           data[3]);               
            data[0].name = "<b>" + this.compareFrom.formData.resultSetName + "_Chosen (a)</b>";
            data[0].marker.opacity = 0.75 // To see each other
            data[1].name = "<b>" + this.compareFrom.formData.resultSetName + "_Not_Chosen (a)</b>";
            data[1].marker.opacity = 0.75
            data[2].name = "<b>" + this.compareTo.formData.resultSetName + "_Chosen (b)</b>";
            data[2].marker.opacity = 0.75 // To see each other
            data[3].name = "<b>" + this.compareTo.formData.resultSetName + "_Not_Chosen (b)</b>";
            data[3].marker.opacity = 0.75
            return data
        },
    },
})
</script>
