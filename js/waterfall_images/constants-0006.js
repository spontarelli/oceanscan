var isSbpFile = false;
var unitsToMs = 1;

function x(n) {
    return 545425.709077889 + 0.135727087967098 * n ;
}

function y(n) {
    return 5029084.88711285 - 0.0740336836315691 * n ;
}

function lat(n) {
    return -44.890209447078 - 6.57688385530264E-07 * n ;
}

function lon(n) {
    return -74.4247412220929 + 1.72548864441069E-06 * n ;
}

function z(n) {
    return 0;
}

function zOffset(n) {
    return 0;
}
