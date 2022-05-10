(function (imageproc) {
    "use strict";

    /*
     * Apply Tomita filter to the input data
     */
    imageproc.papari = function (inputData, outputData, q, N, sigma, filterSize, isColor) {
        console.log("Applying Papari filter...");

        /*
         * An internal function to find the regional stat centred at (x, y)
         */
        var size = q;
        var shiftSize = (size - 1) / 4;
        var sideLength = (size - 1) / 2 + 1;
        var regionSize = sideLength * sideLength;

        function Ui(x1, y1, x2, y2, N, i) {
            /**
             * @param {x1} Central_point.x
             * @param {y1} Central_point.y
             * @param {x2} Target_point.x
             * @param {y2} Target_point.y
             *  
             */
            if (i === N) {
                let angle = Math.atan2(y2 - y1, x2 - x1);
                if (angle < Math.PI / N && angle > -Math.PI / N) {
                    return N;
                } else {
                    return 0;
                }
            }
            else {
                let angle = Math.atan2(y2 - y1, x2 - x1);
                angle = (angle + 2 * Math.PI) % (2 * Math.PI);
                if (angle < 2 * Math.PI / N * (i + 1 / 2) && angle > 2 * Math.PI / N * (i - 1 / 2)) {
                    return N;
                } else {
                    return 0;
                }
            }
        }

        function regionStat(x, y) {
            // Find the mean colour and brightness
            var meanR = 0, meanG = 0, meanB = 0;
            var meanValue = 0;
            for (var j = -shiftSize; j <= shiftSize; j++) {
                for (var i = -shiftSize; i <= shiftSize; i++) {
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);

                    // For the mean colour
                    meanR += pixel.r;
                    meanG += pixel.g;
                    meanB += pixel.b;

                    // For the mean brightness
                    meanValue += (pixel.r + pixel.g + pixel.b) / 3;
                }
            }
            meanR /= regionSize;
            meanG /= regionSize;
            meanB /= regionSize;
            meanValue /= regionSize;

            // Find the variance
            var variance = 0;
            for (var j = -shiftSize; j <= shiftSize; j++) {
                for (var i = -shiftSize; i <= shiftSize; i++) {
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);
                    var value = (pixel.r + pixel.g + pixel.b) / 3;

                    variance += Math.pow(value - meanValue, 2);
                }
            }
            variance /= regionSize;

            // Return the mean and variance as an object
            return {
                mean: { r: meanR, g: meanG, b: meanB },
                variance: variance
            };
        }

        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                // Find the statistics of the four sub-regions
                var regionA = regionStat(x - shiftSize, y - shiftSize, inputData);
                var regionB = regionStat(x + shiftSize, y - shiftSize, inputData);
                var regionC = regionStat(x - shiftSize, y + shiftSize, inputData);
                var regionD = regionStat(x + shiftSize, y + shiftSize, inputData);

                // Get the minimum variance value
                var minV = Math.min(regionA.variance, regionB.variance,
                    regionC.variance, regionD.variance);

                var i = (x + y * inputData.width) * 4;

                // Put the mean colour of the region with the minimum
                // variance in the pixel
                switch (minV) {
                    case regionA.variance:
                        outputData.data[i] = regionA.mean.r;
                        outputData.data[i + 1] = regionA.mean.g;
                        outputData.data[i + 2] = regionA.mean.b;
                        break;
                    case regionB.variance:
                        outputData.data[i] = regionB.mean.r;
                        outputData.data[i + 1] = regionB.mean.g;
                        outputData.data[i + 2] = regionB.mean.b;
                        break;
                    case regionC.variance:
                        outputData.data[i] = regionC.mean.r;
                        outputData.data[i + 1] = regionC.mean.g;
                        outputData.data[i + 2] = regionC.mean.b;
                        break;
                    case regionD.variance:
                        outputData.data[i] = regionD.mean.r;
                        outputData.data[i + 1] = regionD.mean.g;
                        outputData.data[i + 2] = regionD.mean.b;
                }
            }
        }
    }

}(window.imageproc = window.imageproc || {}));
