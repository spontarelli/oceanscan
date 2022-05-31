var isSbpFile = false;
var unitsToMs = 1;

function x(n) {
    return 545744.990815904 + 0.182821429800242 * n ;
}

function y(n) {
    return 5028932.66634354 - 0.122366581112146 * n ;
}

function lat(n) {
    return -44.8915592535042 - 1.08964068701312E-06 * n ;
}

function lon(n) {
    return -74.4206844165777 + 2.32640909558768E-06 * n ;
}

function z(n) {
    return 0;
}

function zOffset(n) {
    return 0;
}
