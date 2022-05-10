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
            const ui = Ui(x1, y1, x2, y2, N, i);
            const gaussian = Gaussian(x2 - x1, y2 - y1, sigma);
            return gaussian * ui;
        }
        
        function rgb2gray(r, g, b) {
            return 0.2989 * r + 0.5870 * g + 0.1140 * b;
        }

        //Internal function to calculate Mi
        function Mi(x_center, y_center, N, i, sigma, filterSize) {
            let accumulator = 0;
            //Convolve the filter size
            const yMin = Math.max(0, y_center - filterSize / 2);
            const yMax = Math.min(inputData.height - 1, y_center + filterSize / 2);
            const xMin = Math.max(0, x_center - filterSize / 2);
            const xMax = Math.min(inputData.width - 1, x_center + filterSize / 2);
            for (let y = yMin; y < yMax; y++) {
                for (let x = xMin; x < xMax; x++) {
                    if (Math.hypot(x - x_center, y - y_center) <= filterSize / 2) {
                        const index = (x + y * inputData.width) * 4;
                        const grayValue = rgb2gray(inputData.data[index], inputData.data[index + 1], inputData.data[index + 2]);
                        const weight = Wi(x_center, y_center, x, y, N, i, sigma);
                        accumulator += grayValue * weight;
                    }
                }
            }
            return accumulator;
        }

        function Si_sqr(x_center, y_center, N, i, sigma, filterSize) {
            let accumulator = 0;
            //Convolve the filter size
            const yMin = Math.max(0, y_center - filterSize / 2);
            const yMax = Math.min(inputData.height - 1, y_center + filterSize / 2);
            const xMin = Math.max(0, x_center - filterSize / 2);
            const xMax = Math.min(inputData.width - 1, x_center + filterSize / 2);
            for (let y = yMin; y < yMax; y++) {
                for (let x = xMin; x < xMax; x++) {
                    if (Math.hypot(x - x_center, y - y_center) <= filterSize / 2) {
                        const index = (x + y * inputData.width) * 4;
                        const grayValue = rgb2gray(inputData.data[index], inputData.data[index + 1], inputData.data[index + 2]);
                        const weight = Wi(x_center, y_center, x, y, N, i, sigma);
                        accumulator += grayValue * grayValue * weight;
                    }
                }
            }
            const mi = Mi(x_center, y_center, N, i, sigma, filterSize);
            return accumulator - mi * mi;
        }

        //Internal function to calculate the output
        function outputPhi(x_center, y_center, N, sigma, filterSize, q) {
            let numerator = 0;
            let denominator = 0;
            for (let i = 1; i <= N; i++) {
                const si_sqr = Si_sqr(x_center, y_center, N, i, sigma, filterSize)
                const si_sqr_pow_neg_q = Math.pow(si_sqr, -q)
                numerator += Mi(x_center, y_center, N, i, sigma, filterSize) * si_sqr_pow_neg_q;
                denominator += si_sqr_pow_neg_q;
            }
            return numerator / denominator;
        }

        //put the calculated output to the pixels
        for (let y = 0; y < inputData.height; y++) {
            for (let x = 0; x < inputData.width; x++) {
                const index = (x + y * inputData.width) * 4;
                const grayscale = outputPhi(x, y, N, sigma, filterSize, q);
                outputData.data[index] = grayscale;
                outputData.data[index + 1] = grayscale;
                outputData.data[index + 2] = grayscale;
            }
        }
    }
}(window.imageproc = window.imageproc || {}));
