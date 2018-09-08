var gl;
var model;

var InitApp = function () {
    loadTextResource('/shader.vs.glsl', function (vsError, vsText) {

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

                    loadJSONResource('/Susan.json', function (modelErr, modelObj) {

                        if (modelErr) {

                            alert('Fatal error getting Susan model (see console for details)');
                            console.error(fsError);

                        }

                        else {

                            loadImage('/Images/m870Text.png', function (imgErr, img) {

                                if (imgErr) {

                                    alert('Fatal error getting wave image (see console for details)');
                                    console.error(fsError);

                                }

                                else {

                                    RunApp(vsText, fsText, img, modelObj);

                                }
                            });

                        }

                    });

                }

            });

        }

    });
};


var RunApp = function (vertexShaderText, fragmentShaderText, SusanImage, SusanModelObj) {

    console.log("This is working");
    model = SusanModelObj;

    var canvas = document.getElementById('Procedural');

    var gl = canvas.getContext('webgl');

    if (!gl) {

        gl = canvas.getContext('experimental-webgl');
        console.log("WebGL not supported falling back to experimental");

    } else {

        console.log("WebGL not supported");

    }

    var R = .2;
    var G = .2;
    var B = .1;
    var A = 1.;

    gl.clearColor(R, G, B, A);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {

        console.error("ERROR You fucked up nigga on vertexShader", gl.getShaderInfoLog(vertexShader));
        return;

    }
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {

        console.error("ERROR You fucked up nigga on fragmentShader", gl.getShaderInfoLog(fragmentShader));
        return;

    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {

        console.error("ERROR Linking program failed", gl.getProgramInfoLog(program));
        return;

    }

    // Create buffer

    var boxVertices = SusanModelObj.meshes[0].vertices;

    var boxIndices = [].concat.apply([], SusanModelObj.meshes[0].faces);

    var boxTextCoords = SusanModelObj.meshes[0].texturecoords[0];

    var boxNormals = SusanModelObj.meshes[0].normals;


    var boxVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    var boxIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

    var boxTextBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxTextBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxTextCoords), gl.STATIC_DRAW);

    var boxNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxNormals), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBuffer);
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');

    gl.vertexAttribPointer(

        positionAttribLocation, //Attribute location
        3, //Number of elements in each attribute
        gl.FLOAT, //Type of elements
        gl.FALSE,
        3 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertex
        0 //Offset from the beginning of a single vertex to this attribute

    );
    gl.enableVertexAttribArray(positionAttribLocation)


    gl.bindBuffer(gl.ARRAY_BUFFER, boxTextBuffer);
    var textCoordAttribLocation = gl.getAttribLocation(program, 'vertTextCoord');

    gl.vertexAttribPointer(

        textCoordAttribLocation, //Attribute location
        2, //Number of elements in each attribute
        gl.FLOAT, //Type of elements
        gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertex
        0 * Float32Array.BYTES_PER_ELEMENT //Offset from the beginning of a single vertex to this attribute

    );
    gl.enableVertexAttribArray(textCoordAttribLocation);

    // Create texture
    var boxTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, boxTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
        SusanImage
    );
    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.bindBuffer(gl.ARRAY_BUFFER, boxNormalBuffer);
    var normalAttribLocation = gl.getAttribLocation(program, 'vertNormal');

    gl.vertexAttribPointer(

        normalAttribLocation,
        3, gl.FLOAT,
        gl.TRUE,
        3 * Float32Array.BYTES_PER_ELEMENT,
        0 * Float32Array.BYTES_PER_ELEMENT

    );

    gl.enableVertexAttribArray(normalAttribLocation);

    // Tell OpenGL state machine which program should be active
    gl.useProgram(program);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    mat4.identity(worldMatrix);
    mat4.lookAt(viewMatrix, [0, 1, -10], [0, 0, 0], [0, 1, 0]);
    mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    var xProjMatrix = new Float32Array(16);
    var yProjMatrix = new Float32Array(16);

    // Lights
    gl.useProgram(program);

    var ambUL = gl.getUniformLocation(program, 'amb');
    gl.uniform3f(ambUL, 0.2, 0.2, 0.2);
    var sunUL = gl.getUniformLocation(program, 'sun');
    gl.uniform3f(sunUL, 1.9, 1.9, 1.9);
    var sunDirectionUL = gl.getUniformLocation(program, 'sunDirection');
    gl.uniform3f(sunDirectionUL, 10.0, 4.0, 2.0);

    // Main render loop
    var angle = 0;
    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);
    var loop = function () {

        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        mat4.rotate(xProjMatrix, identityMatrix, angle, [0, 1, 0]);
        mat4.rotate(yProjMatrix, identityMatrix, angle / 4, [0, 0, 1]);
        mat4.mul(worldMatrix, xProjMatrix, yProjMatrix);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clearColor(0.75, 0.74, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        angle = performance.now() / 1000 / 6 / 2 * Math.PI;
        requestAnimationFrame(loop);

        gl.bindTexture(gl.TEXTURE_2D, boxTexture);
        //gl.activateTexture(gl.TEXTURE0);
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

        //requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
};