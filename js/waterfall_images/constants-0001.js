var isSbpFile = false;
var unitsToMs = 1;

function x(n) {
    return 545365.088182418 + 0.186359339742921 * n ;
}

function y(n) {
    return 5028984.75735171 - 0.145139531698078 * n ;
}

function lat(n) {
    return -44.8911147612017 - 1.29445177066145E-06 * n ;
}

function lon(n) {
    return -74.4255001873702 + 2.37329301455702E-06 * n ;
}

function z(n) {
    return 0;
}

function zOffset(n) {
    return 0;
}
