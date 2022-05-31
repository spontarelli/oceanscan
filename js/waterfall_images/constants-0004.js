var isSbpFile = false;
var unitsToMs = 1;

function x(n) {
    return 545364.418894842 + 0.152013801794965 * n ;
}

function y(n) {
    return 5029063.69236791 - 0.119016182143241 * n ;
}

function lat(n) {
    return -44.8904042160552 - 1.0615356309529E-06 * n ;
}

function lon(n) {
    return -74.4255156529528 + 1.93590003760846E-06 * n ;
}

function z(n) {
    return 0;
}

function zOffset(n) {
    return 0;
}
