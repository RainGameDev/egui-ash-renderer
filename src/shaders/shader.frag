#version 450
#extension GL_ARB_separate_shader_objects : enable

layout(location = 0) in vec4 oColor;
layout(location = 1) in vec2 oUV;

layout(binding = 0, set = 0) uniform sampler2D fontsSampler;

layout(location = 0) out vec4 finalColor;

layout(constant_id = 0) const bool SRGB_FRAMEBUFFER = false;

const float GAMMA = 2.2;
const float INV_GAMMA = 1.0 / GAMMA;

vec3 SRGBtoLINEAR(vec3 color) {
    return pow(color, vec3(GAMMA));
}
vec4 SRGBtoLINEAR(vec4 color) {
    return vec4(SRGBtoLINEAR(color.rgb), color.a);
}
vec3 LINEARtoSRGB(vec3 color) {
    return pow(color, vec3(INV_GAMMA));
}
vec4 LINEARtoSRGB(vec4 color) {
    return vec4(LINEARtoSRGB(color.rgb), color.a);
}
void main() {
    // Managed textures store gamma-encoded premultiplied-alpha data in a UNORM image,
    // so the sampled values are interpolated in gamma space (required for premultiplied
    // alpha). Decode them to linear here before any color math.
    vec4 texColor = SRGBtoLINEAR(texture(fontsSampler, oUV));
    if (SRGB_FRAMEBUFFER) {
        finalColor = oColor * texColor;
    } else {
        finalColor = LINEARtoSRGB(oColor * texColor);
    }
}
