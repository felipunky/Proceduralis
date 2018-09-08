precision mediump float;

varying vec2 fragTextCoord;
uniform sampler2D sampler;
uniform vec3 amb;
uniform vec3 sun;
uniform vec3 sunDirection;
varying vec3 fragNormal;

void main()
{
    vec3 NormalizedSunDirection = normalize( sunDirection );
    vec3 lightIntensity = amb + sun * max( dot( fragNormal, NormalizedSunDirection ), 0.0 );
    vec3 surfaceNormal = normalize( fragNormal );
    vec4 texel = texture2D(sampler, fragTextCoord);
    gl_FragColor = vec4(texel.rgb * lightIntensity, texel.a);
   //gl_FragColor = texture2D(sampler, fragTextCoord);

}