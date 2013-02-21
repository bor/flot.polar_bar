(function ($) {

    function init(plot) {
        var maxValue = null,
            processed = false;

        plot.hooks.processOptions.push(function(plot, options) {
            if (options.series.pie.show && options.series.pie.polar) {

                // simple check if required pie plugin loaded
                // TODO grep $.plot.plugins for sure
                if (!$.isNumeric(options.series.pie.radius)) {
                    alert('pie plugin required to be enabled first');
                }
            }
        });

        plot.hooks.processDatapoints.push(function(plot, series, data, datapoints) {
            var options = plot.getOptions();
            if (options.series.pie.show && options.series.pie.polar) {
                processDatapoints(plot, series, data, datapoints);
            }
        });

        function processDatapoints(plot, series, datapoints) {
            if (!processed) {
                processed = true;
                options = plot.getOptions();
                plot.setData(processData(plot.getData()));
            }
        }

        function processData(slices) {

            // calculate maximum radius
            var maxRadius =  Math.min(plot.getPlaceholder().width(), plot.getPlaceholder().height() / options.series.pie.tilt) / 2;
            // TODO : get maxRadius from pie plugin to avoid issue with labels
            if (options.series.pie.label.show) maxRadius *= 0.75;    // dirty fix

            var i;

            // calculate maximum value
            for (i = 0; i < slices.length; i++) {
                maxValue = Math.max(maxValue, slices[i].data[0][1]);
            }

            // convert(invert) angle & radius
            for (i = 0; i < slices.length; i++) {
                slices[i].angle = Math.PI * 2 / slices.length;
                slices[i].radius = slices[i].data[0][1]/maxValue * maxRadius;
            }

            return slices;
        }

    }

    // define specific options and their default values
    var options = {
        series: {
            pie: {
                show: false,
                polar: false
            }
        }
    };

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'pie_polar',
        version: '0.1'
    });

})(jQuery);
