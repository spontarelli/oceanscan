var isSbpFile = false;
var unitsToMs = 1;

function x(n) {
    return 545470.620961442 + 0.199889004754368 * n ;
}

function y(n) {
    return 5029174.5285697 - 0.137548356782645 * n ;
}

function lat(n) {
    return -44.8893997262716 - 1.22523837475796E-06 * n ;
}

function lon(n) {
    return -74.4241807195441 + 2.54384098496985E-06 * n ;
}

function z(n) {
    return 0;
}

function zOffset(n) {
    return 0;
}
