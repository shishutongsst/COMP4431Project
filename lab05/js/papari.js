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
            if (x1 === x2 && y1 === y2) { return 0 }
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
        function Vi(x1, y1, x2, y2, N, i, sigma) {
            var gaussian = Gaussian(x1-x2, y1-y2, sigma/4);
            var ui = Ui(x1, y1, x2, y2, N, i);
            return gaussian * ui;
        }
        */

        //An internal function to calculate weight wi

        function Wi(x1, y1, x2, y2, N, i, sigma, factor) {
            const ui = Ui(x1, y1, x2, y2, N, i);
            const gaussian = Gaussian(x2 - x1, y2 - y1, sigma);
            const out = gaussian * ui;
            return out / factor[i]
        }

        function rgb2gray(r, g, b) {
            return 0.2989 * r + 0.5870 * g + 0.1140 * b;
        }

        //Internal function to calculate Mi
        function Mi(x_center, y_center, N, i, sigma, filterSize) {
            let accumulator = 0;
            let rAccumulator = 0;
            let gAccumulator = 0;
            let bAccumulator = 0;
            //Convolve the filter size
            const halfFilterSize = Math.floor(filterSize / 2);

            const yMin = Math.max(0, y_center - halfFilterSize);
            const yMax = Math.min(inputData.height - 1, y_center + halfFilterSize);
            const xMin = Math.max(0, x_center - halfFilterSize);
            const xMax = Math.min(inputData.width - 1, x_center + halfFilterSize);
            for (let y = yMin; y < yMax; y++) {
                for (let x = xMin; x < xMax; x++) {
                    if (Math.hypot(x - x_center, y - y_center) <= halfFilterSize) {
                        if (isColor) {
                            const index = (x + y * inputData.width) * 4;
                            const redValue = inputData.data[index];
                            const greenValue = inputData.data[index + 1];
                            const blueValue = inputData.data[index + 2];
                            const weight = Wi(x_center, y_center, x, y, N, i, sigma, wiFactor);
                            rAccumulator += redValue * weight;
                            gAccumulator += greenValue * weight;
                            bAccumulator += blueValue * weight;
                        } else {
                            const index = (x + y * inputData.width) * 4;
                            const grayValue = rgb2gray(inputData.data[index], inputData.data[index + 1], inputData.data[index + 2]);
                            const weight = Wi(x_center, y_center, x, y, N, i, sigma, wiFactor);
                            accumulator += grayValue * weight;
                        }
                    }
                }
            }
            return {
                colorMi: { r: rAccumulator, g: gAccumulator, b: bAccumulator },
                Mi: accumulator
            };
        }

        function numericalStability(number) {
            let out = number;
            if (Number.isNaN(number) || number < 1e-5) {
                out = 1e-5
            }
            return out
        }

        function Si(x_center, y_center, N, i, sigma, filterSize) { //Get rid of the square root
            let accumulator = 0;
            let rAccumulator = 0;
            let gAccumulator = 0;
            let bAccumulator = 0;
            //Convolve the filter size
            const halfFilterSize = Math.floor(filterSize / 2);
            const yMin = Math.max(0, y_center - halfFilterSize);
            const yMax = Math.min(inputData.height - 1, y_center + halfFilterSize);
            const xMin = Math.max(0, x_center - halfFilterSize);
            const xMax = Math.min(inputData.width - 1, x_center + halfFilterSize);
            for (let y = yMin; y < yMax; y++) {
                for (let x = xMin; x < xMax; x++) {
                    if (Math.hypot(x - x_center, y - y_center) <= halfFilterSize) {
                        if (isColor) {
                            const index = (x + y * inputData.width) * 4;
                            const weight = Wi(x_center, y_center, x, y, N, i, sigma, wiFactor);
                            const redValue = inputData.data[index];
                            const greenValue = inputData.data[index + 1];
                            const blueValue = inputData.data[index + 2];
                            rAccumulator += redValue * redValue * weight;
                            gAccumulator += greenValue * greenValue * weight;
                            bAccumulator += blueValue * blueValue * weight;
                        } else {
                            const index = (x + y * inputData.width) * 4;
                            const grayValue = rgb2gray(inputData.data[index], inputData.data[index + 1], inputData.data[index + 2]);
                            const weight = Wi(x_center, y_center, x, y, N, i, sigma, wiFactor);
                            accumulator += grayValue * grayValue * weight;
                        }
                    }
                }
            }
            let si = 0, rsi = 0, gsi = 0, bsi = 0;
            if (isColor) {
                const rmi = Mi(x_center, y_center, N, i, sigma, filterSize).colorMi.r;
                const gmi = Mi(x_center, y_center, N, i, sigma, filterSize).colorMi.g;
                const bmi = Mi(x_center, y_center, N, i, sigma, filterSize).colorMi.b;
                rsi = Math.sqrt(rAccumulator - rmi * rmi);
                gsi = Math.sqrt(gAccumulator - gmi * gmi);
                bsi = Math.sqrt(bAccumulator - bmi * bmi);
                rsi = numericalStability(rsi);
                gsi = numericalStability(gsi);
                bsi = numericalStability(bsi);
            }
            else {
                const mi = Mi(x_center, y_center, N, i, sigma, filterSize).Mi;
                si = Math.sqrt(accumulator - mi * mi)
                si = numericalStability(si)
            }
            return {
                colorSi: { r: rsi, g: gsi, b: bsi },
                Si: si
            };
        }

        //Internal function to calculate the output
        function outputPhi(x_center, y_center, N, sigma, filterSize, q) {
            let numerator = 0;
            let denominator = 0;

            let rnumerator = 0;
            let rdenominator = 0;
            let gnumerator = 0;
            let gdenominator = 0;
            let bnumerator = 0;
            let bdenominator = 0;

            for (let i = 1; i <= N; i++) {
                if (isColor) {
                    const colorSi = Si(x_center, y_center, N, i, sigma, filterSize).colorSi;
                    const colorMi = Mi(x_center, y_center, N, i, sigma, filterSize).colorMi;
                    const rsi = colorSi.r;
                    const rsi_pow_neg_q = Math.pow(rsi, -q)
                    rnumerator += colorMi.r * rsi_pow_neg_q;
                    rdenominator += rsi_pow_neg_q;

                    const gsi = colorSi.g;
                    const gsi_pow_neg_q = Math.pow(gsi, -q)
                    gnumerator += colorMi.g * gsi_pow_neg_q;
                    gdenominator += gsi_pow_neg_q;

                    const bsi = colorSi.b;
                    const bsi_pow_neg_q = Math.pow(bsi, -q)
                    bnumerator += colorMi.b * bsi_pow_neg_q;
                    bdenominator += bsi_pow_neg_q;

                } else {
                    const si = Si(x_center, y_center, N, i, sigma, filterSize).Si;
                    const si_pow_neg_q = Math.pow(si, -q)
                    const mi = Mi(x_center, y_center, N, i, sigma, filterSize).Mi
                    numerator += mi * si_pow_neg_q;
                    denominator += si_pow_neg_q;
                }
            }

            const phi = numerator / denominator;

            const rPhi = rnumerator / rdenominator;
            const gPhi = gnumerator / gdenominator;
            const bPhi = bnumerator / bdenominator;

            return {
                colorPhi: { r: rPhi, g: gPhi, b: bPhi },
                Phi: phi
            };
        }

        function wiRescaleFactor(N, sigma, filterSize) {
            const halfFilterSize = Math.floor(filterSize / 2);
            let sum = 0;
            const factor = Array(N + 1).fill(0)
            for (let i = 1; i <= N; i++) {
                sum = 0;
                for (let x = -halfFilterSize; x <= halfFilterSize; x++) {
                    for (let y = -halfFilterSize; y <= halfFilterSize; y++) {
                        if (Math.hypot(x, y) <= halfFilterSize) {
                            sum += Ui(0, 0, x, y, N, i) * Gaussian(x, y, sigma)
                        }
                    }
                }
                factor[i] = sum
            }
            return factor
        }

        const wiFactor = wiRescaleFactor(N, sigma, filterSize);
        //put the calculated output to the pixels
        for (let y = 0; y < inputData.height; y++) {
            for (let x = 0; x < inputData.width; x++) {
                if (isColor) {
                    const index = (x + y * inputData.width) * 4;
                    const rscale = outputPhi(x, y, N, sigma, filterSize, q).colorPhi.r;
                    outputData.data[index] = rscale;
                    const gscale = outputPhi(x, y, N, sigma, filterSize, q).colorPhi.g;
                    outputData.data[index + 1] = gscale;
                    const bscale = outputPhi(x, y, N, sigma, filterSize, q).colorPhi.b;
                    outputData.data[index + 2] = bscale;
                } else {
                    const index = (x + y * inputData.width) * 4;
                    const grayscale = outputPhi(x, y, N, sigma, filterSize, q).Phi;
                    outputData.data[index] = grayscale;
                    outputData.data[index + 1] = grayscale;
                    outputData.data[index + 2] = grayscale;
                }
            }
        }
    }
}(window.imageproc = window.imageproc || {}));
