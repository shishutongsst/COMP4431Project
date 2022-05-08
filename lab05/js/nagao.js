(function(imageproc) {
    "use strict";

    /*
     * Apply Tomita filter to the input data
     */
    imageproc.nagao = function(inputData, outputData, size) {
        console.log("Applying Nagao filter...");

        /*
         * TODO: You need to extend the tomita function to include different
         * sizes of the filter
         *
         * You need to clearly understand the following code to make
         * appropriate changes
         */

        /*
         * An internal function to find the regional stat centred at (x, y)
         */
		
		//var shiftSize = (size-1)/4;
		//var sideLength = (size-1)/2 + 1;
		//var regionSize = sideLength * sideLength;
		 
		 
        function regionCorStat(x, y, i1, j1, i2, j2) {
            // Find the mean colour and brightness in corner
            var meanR = 0, meanG = 0, meanB = 0;
            var meanValue = 0;
            for (var j = -1; j <= 1; j++) {
                for (var i = -1; i <= 1; i++) {
					
					if((i==i1&&j==j1)||(i==i2&&j==j2)){
						
					}else{
						
						var pixel = imageproc.getPixel(inputData, x + i, y + j);
					
						// For the mean colour
						meanR += pixel.r;
						meanG += pixel.g;
						meanB += pixel.b;

						// For the mean brightness
						meanValue += (pixel.r + pixel.g + pixel.b) / 3;
					}
                }
            }
			
            meanR /= 7;
            meanG /= 7;
            meanB /= 7;
            meanValue /= 7;

            // Find the variance
            var variance = 0;
            for (var j = -1; j <= 1; j++) {
                for (var i = -1; i <= 1; i++) {
                    
					if((i==i1&&j==j1)||(i==i2&&j==j2)){
						
					}else{
						var pixel = imageproc.getPixel(inputData, x + i, y + j);
						var value = (pixel.r + pixel.g + pixel.b) / 3;

						variance += Math.pow(value - meanValue, 2);
					}
				}
            }
            variance /= 7;

            // Return the mean and variance as an object
            return {
                mean: {r: meanR, g: meanG, b: meanB},
                variance: variance
            };
        }
		
		
		
        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                // Find the statistics of the four sub-regions
                var regionA = regionCorStat(x - 1, y - 1, 1, -1, -1,  1, inputData);
                var regionB = regionCorStat(x + 1, y - 1, -1, -1, 1,  1, inputData);
                var regionC = regionCorStat(x - 1, y + 1, -1, -1, 1,  1, inputData);
                var regionD = regionCorStat(x + 1, y + 1, 1, -1, -1,  1, inputData);
				var regionE = regionCorStat(x - 1, y    , 1, -1,  1,  1, inputData);
				var regionF = regionCorStat(x    , y - 1, -1, 1,  1,  1, inputData);
				var regionG = regionCorStat(x    , y + 1, -1, -1, 1, -1, inputData);
				var regionH = regionCorStat(x + 1, y    , -1, -1,-1,  1, inputData);
				
				var regionI = regionCorStat(x    , y    , -2, -2,-2,  2, inputData);
				

                // Get the minimum variance value
                var minV = Math.min(regionA.variance, regionB.variance,
                                    regionC.variance, regionD.variance,
									regionE.variance, regionF.variance,
									regionG.variance, regionH.variance,
									regionI.variance);

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
				case regionE.variance:
                    outputData.data[i]     = regionE.mean.r;
                    outputData.data[i + 1] = regionE.mean.g;
                    outputData.data[i + 2] = regionE.mean.b;
                    break;
                case regionF.variance:
                    outputData.data[i]     = regionF.mean.r;
                    outputData.data[i + 1] = regionF.mean.g;
                    outputData.data[i + 2] = regionF.mean.b;
                    break;
                case regionG.variance:
                    outputData.data[i]     = regionG.mean.r;
                    outputData.data[i + 1] = regionG.mean.g;
                    outputData.data[i + 2] = regionG.mean.b;
                    break;
                case regionH.variance:
                    outputData.data[i]     = regionH.mean.r;
                    outputData.data[i + 1] = regionH.mean.g;
                    outputData.data[i + 2] = regionH.mean.b;
                    break;
                case regionI.variance:
                    outputData.data[i]     = regionI.mean.r;
                    outputData.data[i + 1] = regionI.mean.g;
                    outputData.data[i + 2] = regionI.mean.b;
                    break;					
               }
            }
        }
    }
 
}(window.imageproc = window.imageproc || {}));
