var isSbpFile = false;
var unitsToMs = 1;

function x(n) {
    return 545364.771868507 + 0.151865576161072 * n ;
}

function y(n) {
    return 5029063.27091983 - 0.118839201517403 * n ;
}

function lat(n) {
    return -44.8904079857433 - 1.05995260213376E-06 * n ;
}

function lon(n) {
    return -74.4255111418607 + 1.93400568093693E-06 * n ;
}

function z(n) {
    return 0;
}

function zOffset(n) {
    return 0;
}
