var isSbpFile = false;
var unitsToMs = 1;

function x(n) {
    return 545773.355756426 + 0.117734938219655 * n ;
}

function y(n) {
    return 5028984.59808665 - 0.0854893722571433 * n ;
}

function lat(n) {
    return -44.8910899348622 - 7.61915913471967E-07 * n ;
}

function lon(n) {
    return -74.4203298707776 + 1.49876118626935E-06 * n ;
}

function z(n) {
    return 0;
}

function zOffset(n) {
    return 0;
}
