var isSbpFile = false;
var unitsToMs = 1;

function x(n) {
    return 545329.348145871 + 0.202025461592712 * n ;
}

function y(n) {
    return 5029003.42062302 - 0.153396235313267 * n ;
}

function lat(n) {
    return -44.890949048191 - 1.36776921522141E-06 * n ;
}

function lon(n) {
    return -74.4259544613006 + 2.57243050327816E-06 * n ;
}

function z(n) {
    return 0;
}

function zOffset(n) {
    return 0;
}
