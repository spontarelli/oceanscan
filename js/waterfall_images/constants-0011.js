var isSbpFile = false;
var unitsToMs = 1;

function x(n) {
    return 545954.792544242 + 0.20397208025679 * n ;
}

function y(n) {
    return 5028584.33689237 - 0.173224327154458 * n ;
}

function lat(n) {
    return -44.894681219981 - 1.54606556534986E-06 * n ;
}

function lon(n) {
    return -74.4179958901215 + 2.59900820509529E-06 * n ;
}

function z(n) {
    return 0;
}

function zOffset(n) {
    return 0;
}
