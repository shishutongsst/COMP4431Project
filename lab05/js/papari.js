(function (imageproc) {
    "use strict";

    /*
     * Apply Tomita filter to the input data
     */
    imageproc.papari = function (inputData, outputData, q, N, sigma, filterSize, isColor) {
        console.log("Applying Papari filter...");

        /*
         * An internal function to calculate the Gaussian kernel
         */
        function Gaussian(x, y, sigma) { //x y refer to thr distance
            return Math.exp(-(x * x + y * y) / (2 * sigma * sigma)) / (2 * Math.PI * sigma * sigma);
        }

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
        /*
        //An internal function to cauculate Vi
        function V(x1, y1, x2, y2, N, i, sigma) {
            var gaussian = Gaussian(x1-x2, y1-y2, sigma/4);
            var Ui = U(x1, y1, x2, y2, N, i);
            return gaussian * Ui;
        }
        */

        //An internal function to calculate weight wi

        function Wi(x1, y1, x2, y2, N, i, sigma) {
            const Ui = Ui(x1, y1, x2, y2, N, i);
            const gaussian = Gaussian(x2 - x1, y2 - y1, sigma);
            return gaussian * Ui;
        }


        //Internal function to calculate Mi
        function Mi(x_center, y_center, N, i, sigma, filterSize) {
            var accumulator = 0;
            //Convolve the entire image
            for (var y = 0; y < inputData.height; y++) {
                for (var x = 0; x < inputData.width; x++) {
                    if (Math.hypot(x - x_center, y - y_center) <= filterSize / 2) {
                        var arrayCount = (x + y * inputData.width) * 4;
                        var GrayValue = 0.299 * inputData.data[arrayCount] + 0.587 * inputData.data[arrayCount + 1] + 0.114 * inputData.data[arrayCount + 2];
                        var weight = Wi(x_center, y_center, x, y, N, i, sigma);
                        accumulator += GrayValue * weight;
                    }
                }
            }
            return accumulator;
        }

        function Si_sqr(x_center, y_center, N, i, sigma, filterSize) {
            var accumulator = 0;
            //Convolve the entire image
            for (var y = 0; y < inputData.height; y++) {
                for (var x = 0; x < inputData.width; x++) {
                    if (Math.hypot(x - x_center, y - y_center) <= filterSize / 2) {
                        var arrayCount = (x + y * inputData.width) * 4;
                        var GrayValue = 0.299 * inputData.data[arrayCount] + 0.587 * inputData.data[arrayCount + 1] + 0.114 * inputData.data[arrayCount + 2];
                        var weight = Wi(x_center, y_center, x, y, N, i, sigma);
                        accumulator += GrayValue * GrayValue * weight;
                    }
                }
            }
            return accumulator - Mi(x_center, y_center, N, i, sigma, filterSize) * Mi(x_center, y_center, N, i, sigma, filterSize);
        }

        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {


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
