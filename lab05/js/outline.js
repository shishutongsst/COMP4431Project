(function(imageproc) {
    "use strict";

    /*
     * Apply sobel edge to the input data
     */
    imageproc.sobelEdge = function(inputData, outputData, threshold) {
        console.log("Applying Sobel edge detection...");

        /* Initialize the two edge kernel Gx and Gy */
        var Gx = [
            [-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1]
        ];
        var Gy = [
            [-1,-2,-1],
            [ 0, 0, 0],
            [ 1, 2, 1]
        ];

        /**
         * TODO: You need to write the code to apply
         * the two edge kernels appropriately
         */
        
        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
				
				var Gx_r = 0;
				var Gx_g = 0;
				var Gx_b = 0;
				
				for (var j = -1; j <= 1; j++) {
					for (var i = -1; i <= 1; i++) {
						Gx_r += imageproc.getPixel(inputData, x+i, y+j).r * Gx[j+1][i+1];
						Gx_g += imageproc.getPixel(inputData, x+i, y+j).g * Gx[j+1][i+1];
						Gx_b  += imageproc.getPixel(inputData, x+i, y+j).b * Gx[j+1][i+1];
					}
				}
				
				Gx_r = parseInt(Gx_r);
				Gx_g = parseInt(Gx_g);
				Gx_b  = parseInt(Gx_b);

				var Gy_r = 0;
				var Gy_g = 0;
				var Gy_b = 0;

				for (var j = -1; j <= 1; j++) {
					for (var i = -1; i <= 1; i++) {
						Gy_r += imageproc.getPixel(inputData, x+i, y+j).r * Gy[j+1][i+1];
						Gy_g += imageproc.getPixel(inputData, x+i, y+j).g * Gy[j+1][i+1];
						Gy_b  += imageproc.getPixel(inputData, x+i, y+j).b * Gy[j+1][i+1];
					}
				}
				
				Gy_r = parseInt(Gy_r);
				Gy_g = parseInt(Gy_g);
				Gy_b  = parseInt(Gy_b);

				var G_r = parseInt(Math.hypot(Gx_r, Gy_r));
				var G_g = parseInt(Math.hypot(Gx_g, Gy_g));
				var G_b = parseInt(Math.hypot(Gx_b, Gy_b));
				
				if(G_r > threshold){
					G_r = 255;
				}else{
					G_r = 0;
				}
				
				if(G_g > threshold){
					G_g = 255;
				}else{
					G_g = 0;
				}				

				if(G_b > threshold){
					G_b = 255;
				}else{
					G_b = 0;
				}
					
                var i = (x + y * outputData.width) * 4;
                outputData.data[i]     = G_r;
                outputData.data[i + 1] = G_g;
                outputData.data[i + 2] = G_b;
            }
        }
    }

}(window.imageproc = window.imageproc || {}));
