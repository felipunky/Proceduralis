var InitApp = function () {
    loadTextResource('shader.vs.glsl', function (vsError, vsText) {

        if (vsError) {
            alert('Fatal error getting vertex shader (see console for details)');
            console.error(vsError);
        }
        else {

            loadTextResource('/shader.fs.glsl', function (fsError, fsText) {

                if (fsError) {

                    alert('Fatal error getting vertex shader (see console for details)');
                    console.error(fsError);

                }
                else {

                    loadJSONResource('/Cube.json', function (modelErr, modelObj) {

                        if (modelErr) {

                            alert('Fatal error getting Cube model (see console for details)');
                            console.error(fsError);

                        }

                        else {

                            loadImage('/Images/Wave.jpg', function (imgErr, img) {

                                if (imgErr) {

                                    alert('Fatal error getting wave image (see console for details)');
                                    console.error(fsError);

                                }

                                else {

                                    RunObj(vsText, fsText, img, modelObj);

                                }
                            });

                        }

                    });

                }

            });

        }

    });
};

var RunObj = function (vertexShaderText, fragmentShaderText, CubeImage, CubeObj) {

    console.log("Yeah ModaFucka");
    cubeModel = CubeObj;

    var canvas = document.getElementById('Procedural');

    var gl = canvas.getContext('webgl');

    if (!gl) {

        gl = canvas.getContext('experimental-webgl');
        console.log("WebGL not supported falling back to experimental");

    } else {

        console.log("WebGL not supported");

    }

}
