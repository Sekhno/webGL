varying float vNoise;

void main() {
    vec3 color1 = vec3(1.,0.8,0.);
    vec3 color2 = vec3(1.,1.,1.);
    vec3 fiinalColor = mix(color1, color2, 0.5*(vNoise + 1.));

    gl_FragColor = vec4(fiinalColor, 1.);
}