(function(imageproc) {
    "use strict";

    /*
     * Apply Tomita filter to the input data
     */
    imageproc.tomita = function(inputData, outputData, size) { //size may be 5*5 or 9*9 or 13*13
        console.log("Applying Tomita filter...");

        /*
         * An internal function to find the regional stat centred at (x, y)
         */
        var subSize = (size + 1)/2;
        var diff = (size - subSize)/2;

        function regionStat(x, y) {
            // Find the mean colour and brightness
            var meanR = 0, meanG = 0, meanB = 0;
            var meanValue = 0;
            for (var j = - (subSize-1)/2; j <= (subSize-1)/2; j++) {
                for (var i = - (subSize-1)/2; i <= (subSize-1)/2; i++) {
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);

                    // For the mean colour
                    meanR += pixel.r;
                    meanG += pixel.g;
                    meanB += pixel.b;

                    // For the mean brightness
                    meanValue += (pixel.r + pixel.g + pixel.b) / 3;
                }
            }
            meanR /= (subSize * subSize);
            meanG /= (subSize * subSize);
            meanB /= (subSize * subSize);
            meanValue /= (subSize * subSize);

            // Find the variance
            var variance = 0;
            for (var j = - (subSize-1)/2; j <= (subSize-1)/2; j++) {
                for (var i = - (subSize-1)/2; i <= (subSize-1)/2; i++) {
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);
                    var value = (pixel.r + pixel.g + pixel.b) / 3;

                    variance += Math.pow(value - meanValue, 2);
                }
            }
            variance /= (subSize * subSize);

            // Return the mean and variance as an object
            return {
                mean: {r: meanR, g: meanG, b: meanB},
                variance: variance
            };
        }

        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                // Find the statistics of the four sub-regions
                var regionA = regionStat(x - diff, y - diff, inputData);
                var regionB = regionStat(x + diff, y - diff, inputData);
                var regionC = regionStat(x - diff, y + diff, inputData);
                var regionD = regionStat(x + diff, y + diff, inputData);
                var regionCenter = regionStat(x, y, inputData);

                // Get the minimum variance value
                var minV = Math.min(regionA.variance, regionB.variance,
                                    regionC.variance, regionD.variance, regionCenter.variance);

                var i = (x + y * inputData.width) * 4;

                // Put the mean colour of the region with the minimum
                // variance in the pixel
                switch (minV) {
                case regionA.variance:
                    outputData.data[i]     = regionA.mean.r;
                    outputData.data[i + 1] = regionA.mean.g;
                    outputData.data[i + 2] = regionA.mean.b;
                    break;
                case regionB.variance:
                    outputData.data[i]     = regionB.mean.r;
                    outputData.data[i + 1] = regionB.mean.g;
                    outputData.data[i + 2] = regionB.mean.b;
                    break;
                case regionC.variance:
                    outputData.data[i]     = regionC.mean.r;
                    outputData.data[i + 1] = regionC.mean.g;
                    outputData.data[i + 2] = regionC.mean.b;
                    break;
                case regionD.variance:
                    outputData.data[i]     = regionD.mean.r;
                    outputData.data[i + 1] = regionD.mean.g;
                    outputData.data[i + 2] = regionD.mean.b;
                    break;
                case regionCenter.variance:
                    outputData.data[i]     = regionCenter.mean.r;
                    outputData.data[i + 1] = regionCenter.mean.g;
                    outputData.data[i + 2] = regionCenter.mean.b;
                    break;
                }
            }
        }
    }
 
}(window.imageproc = window.imageproc || {}));
