var isSbpFile = false;
var unitsToMs = 1;

function x(n) {
    return 545348.292078852 + 0.226886330288835 * n ;
}

function y(n) {
    return 5029214.40848307 - 0.147887428756803 * n ;
}

function lat(n) {
    return -44.8890485286757 - 1.31661278146566E-06 * n ;
}

function lon(n) {
    return -74.4257332927172 + 2.8865851859905E-06 * n ;
}

function z(n) {
    return 0;
}

function zOffset(n) {
    return 0;
}
