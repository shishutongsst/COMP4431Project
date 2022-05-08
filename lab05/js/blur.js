(function(imageproc) {
    "use strict";

    /*
     * Apply blur to the input data
     */
    imageproc.blur = function(inputData, outputData, kernelSize) {
		console.log("Applying blur......");
		
		switch(kernelSize){
			
		case 3:

        // You are given a 3x3 kernel but you need to create a proper kernel
        // using the given kernel size
        var kernel = [ [1, 1, 1], [1, 1, 1], [1, 1, 1] ];

        /**
         * TODO: You need to extend the blur effect to include different
         * kernel sizes and then apply the kernel to the entire image
         */

        // Apply the kernel to the whole image
        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                // Use imageproc.getPixel() to get the pixel values
                // over the kernel
				var pixel = imageproc.getPixel(inputData, x, y);
				
				var r = 0;
				var g = 0;
				var b = 0;
				
				for (var j = -1; j <= 1; j++) {
					for (var i = -1; i <= 1; i++) {
						r += imageproc.getPixel(inputData, x+i, y+j).r * kernel[j+1][i+1];
						g += imageproc.getPixel(inputData, x+i, y+j).g * kernel[j+1][i+1];
						b += imageproc.getPixel(inputData, x+i, y+j).b * kernel[j+1][i+1];
					}
				}
				
				r = parseInt(r/9);
				g = parseInt(g/9);
				b = parseInt(b/9);

                // Then set the blurred result to the output data
                
                var i = (x + y * outputData.width) * 4;
                outputData.data[i]     = r;
                outputData.data[i + 1] = g;
                outputData.data[i + 2] = b;
            }
        }
		break;
		
		
		
		
		
		
		case 5:
		        // You are given a 3x3 kernel but you need to create a proper kernel
        // using the given kernel size
        var kernel = [ [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1] ];

        /**
         * TODO: You need to extend the blur effect to include different
         * kernel sizes and then apply the kernel to the entire image
         */

        // Apply the kernel to the whole image
        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                // Use imageproc.getPixel() to get the pixel values
                // over the kernel
				var pixel = imageproc.getPixel(inputData, x, y);
				
				var r = 0;
				var g = 0;
				var b = 0;
				
				for (var j = -2; j <= 2; j++) {
					for (var i = -2; i <= 2; i++) {
						r += imageproc.getPixel(inputData, x+i, y+j).r * kernel[j+2][i+2];
						g += imageproc.getPixel(inputData, x+i, y+j).g * kernel[j+2][i+2];
						b += imageproc.getPixel(inputData, x+i, y+j).b * kernel[j+2][i+2];
					}
				}
				
				r = parseInt(r/25);
				g = parseInt(g/25);
				b = parseInt(b/25);

                // Then set the blurred result to the output data
                
                var i = (x + y * outputData.width) * 4;
                outputData.data[i]     = r;
                outputData.data[i + 1] = g;
                outputData.data[i + 2] = b;
            }
        }
		
		break;
		
		
		
		
		case 7:
		        // You are given a 3x3 kernel but you need to create a proper kernel
        // using the given kernel size
        var kernel = [ [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1]];

        /**
         * TODO: You need to extend the blur effect to include different
         * kernel sizes and then apply the kernel to the entire image
         */

        // Apply the kernel to the whole image
        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                // Use imageproc.getPixel() to get the pixel values
                // over the kernel
				var pixel = imageproc.getPixel(inputData, x, y);
				
				var r = 0;
				var g = 0;
				var b = 0;
				
				for (var j = -3; j <= 3; j++) {
					for (var i = -3; i <= 3; i++) {
						r += imageproc.getPixel(inputData, x+i, y+j).r * kernel[j+3][i+3];
						g += imageproc.getPixel(inputData, x+i, y+j).g * kernel[j+3][i+3];
						b += imageproc.getPixel(inputData, x+i, y+j).b * kernel[j+3][i+3];
					}
				}
				
				r = parseInt(r/49);
				g = parseInt(g/49);
				b = parseInt(b/49);

                // Then set the blurred result to the output data
                
                var i = (x + y * outputData.width) * 4;
                outputData.data[i]     = r;
                outputData.data[i + 1] = g;
                outputData.data[i + 2] = b;
            }
        }
		
		break;
		
		
		
		case 9:
		        // You are given a 3x3 kernel but you need to create a proper kernel
        // using the given kernel size
        var kernel = [ [1, 1, 1, 1, 1, 1, 1, 1, 1],[1, 1, 1, 1, 1, 1, 1, 1, 1],[1, 1, 1, 1, 1, 1, 1, 1, 1],[1, 1, 1, 1, 1, 1, 1, 1, 1],[1, 1, 1, 1, 1, 1, 1, 1, 1],[1, 1, 1, 1, 1, 1, 1, 1, 1],[1, 1, 1, 1, 1, 1, 1, 1, 1],[1, 1, 1, 1, 1, 1, 1, 1, 1],[1, 1, 1, 1, 1, 1, 1, 1, 1]];

        /**
         * TODO: You need to extend the blur effect to include different
         * kernel sizes and then apply the kernel to the entire image
         */

        // Apply the kernel to the whole image
        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                // Use imageproc.getPixel() to get the pixel values
                // over the kernel
				var pixel = imageproc.getPixel(inputData, x, y);
				
				var r = 0;
				var g = 0;
				var b = 0;
				
				for (var j = -4; j <= 4; j++) {
					for (var i = -4; i <= 4; i++) {
						r += imageproc.getPixel(inputData, x+i, y+j).r * kernel[j+4][i+4];
						g += imageproc.getPixel(inputData, x+i, y+j).g * kernel[j+4][i+4];
						b += imageproc.getPixel(inputData, x+i, y+j).b * kernel[j+4][i+4];
					}
				}
				
				r = parseInt(r/81);
				g = parseInt(g/81);
				b = parseInt(b/81);

                // Then set the blurred result to the output data
                
                var i = (x + y * outputData.width) * 4;
                outputData.data[i]     = r;
                outputData.data[i + 1] = g;
                outputData.data[i + 2] = b;
            }
        }
		
		break;
		
		}
    } 

}(window.imageproc = window.imageproc || {}));
