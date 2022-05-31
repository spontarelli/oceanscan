var topLeftX = 545112.29;
var topLeftY = 5029395.48;
var bottomRightX = 547399.9;
var bottomRightY = 5027874.79;
var topLeftLat = -44.887433444837;
var topLeftLon = -74.428737576997;
var bottomRightLat = -44.900973552944;
var bottomRightLon = -74.399628533889;

var contactPositionArray = [
	{ x: 0.148439394046781, y: 0.280956828663739 },
	{ x: 0.248411985236076, y: 0.376472909750858 },
	{ x: 0.509933042345693, y: 0.771356552158975 },
	{ x: 0.55536889728163, y: 0.690178033415769 },
	{ x: 0.300865029415667, y: 0.349652715827469 },
	{ x: 0.309675025115384, y: 0.365706520637364 },
	{ x: 0.30337840258949, y: 0.346845288316135 },
	{ x: 0.222101847656701, y: 0.390831926099267 },
	{ x: 0.281586480065315, y: 0.370797565209076 },
	{ x: 0.296846849416103, y: 0.370081237785401 },
	{ x: 0.282706819721682, y: 0.37578214557413 },
	{ x: 0.278388355054598, y: 0.374813794068007 },
	{ x: 0.31283327347964, y: 0.404515451612083 },
	{ x: 0.309264658752763, y: 0.401252886369639 },
	{ x: 0.569391056446467, y: 0.68137811557148 },
	{ x: 0.560749191576028, y: 0.685108189642528 },
	{ x: 0.566971711757451, y: 0.688658006877522 },
	{ x: 0.486941610303976, y: 0.692842534656814 },
	{ x: 0.507600038603157, y: 0.596474873059626 },
	{ x: 0.560188234756967, y: 0.704605061438462 },
	{ x: 0.276669811398353, y: 0.255204933792442 },
	{ x: 0.589995139237145, y: 0.66026540547178 },
	{ x: 0.580680947131098, y: 0.690790495666988 },
	{ x: 0.297994786644811, y: 0.391933194960807 },
	{ x: 0.301896529056307, y: 0.410417775817905 },
	{ x: 0.303856036153713, y: 0.416650349334098 },
	{ x: 0.292836305477087, y: 0.327723984635376 },
	{ x: 0.550989095374359, y: 0.684859458714965 },
	{ x: 0.290845106544373, y: 0.244835342320046 },
	{ x: 0.551103310476221, y: 0.690838966969524 },
	{ x: 0.230914280487906, y: 0.235531678359737 },
	{ x: 0.519397412465958, y: 0.767099551884679 },
	{ x: 0.308589674677695, y: 0.378897178396766 },
	{ x: 0.305183001768751, y: 0.383935581421369 },
];

var contactInfo = [
	{ name: "Contact0000", llPos: "Click Position: -44.8912577892 -74.4243994503", xyPos: "Click Position (Projected Coordinates) (X) 545451.86 (Y) 5028968.23 (Projected Coordinates)" },
	{ name: "Contact0001", llPos: "Click Position: -44.8925506468 -74.4214902636", xyPos: "Click Position (Projected Coordinates) (X) 545680.56 (Y) 5028822.98 (Projected Coordinates)" },
	{ name: "Contact0002", llPos: "Click Position: -44.8979174515 -74.4138592602", xyPos: "Click Position (Projected Coordinates) (X) 546278.82 (Y) 5028222.49 (Projected Coordinates)" },
	{ name: "Contact0003", llPos: "Click Position: -44.8967994620 -74.4125542062", xyPos: "Click Position (Projected Coordinates) (X) 546382.76 (Y) 5028345.93 (Projected Coordinates)" },
	{ name: "Contact0004", llPos: "Click Position: -44.8921758058 -74.4199744224", xyPos: "Click Position (Projected Coordinates) (X) 545800.55 (Y) 5028863.77 (Projected Coordinates)" },
	{ name: "Contact0005", llPos: "Click Position: -44.8923942649 -74.4197169942", xyPos: "Click Position (Projected Coordinates) (X) 545820.71 (Y) 5028839.35 (Projected Coordinates)" },
	{ name: "Contact0006", llPos: "Click Position: -44.8921370059 -74.4199019984", xyPos: "Click Position (Projected Coordinates) (X) 545806.30 (Y) 5028868.04 (Projected Coordinates)" },
	{ name: "Contact0007", llPos: "Click Position: -44.8927510616 -74.4222504839", xyPos: "Click Position (Projected Coordinates) (X) 545620.37 (Y) 5028801.15 (Projected Coordinates)" },
	{ name: "Contact0008", llPos: "Click Position: -44.8924680864 -74.4205299995", xyPos: "Click Position (Projected Coordinates) (X) 545756.45 (Y) 5028831.61 (Projected Coordinates)" },
	{ name: "Contact0010", llPos: "Click Position: -44.8924560368 -74.4200880155", xyPos: "Click Position (Projected Coordinates) (X) 545791.36 (Y) 5028832.70 (Projected Coordinates)" },
	{ name: "Contact0011", llPos: "Click Position: -44.8925361541 -74.4204968588", xyPos: "Click Position (Projected Coordinates) (X) 545759.01 (Y) 5028824.03 (Projected Coordinates)" },
	{ name: "Contact0012", llPos: "Click Position: -44.8925235334 -74.4206220951", xyPos: "Click Position (Projected Coordinates) (X) 545749.13 (Y) 5028825.50 (Projected Coordinates)" },
	{ name: "Contact0013", llPos: "Click Position: -44.8929250436 -74.4196201588", xyPos: "Click Position (Projected Coordinates) (X) 545827.93 (Y) 5028780.34 (Projected Coordinates)" },
	{ name: "Contact0014", llPos: "Click Position: -44.8928809087 -74.4197239891", xyPos: "Click Position (Projected Coordinates) (X) 545819.77 (Y) 5028785.30 (Projected Coordinates)" },
	{ name: "Contact0015", llPos: "Click Position: -44.8966769125 -74.4121491912", xyPos: "Click Position (Projected Coordinates) (X) 546414.83 (Y) 5028359.32 (Projected Coordinates)" },
	{ name: "Contact0016", llPos: "Click Position: -44.8967292607 -74.4123990381", xyPos: "Click Position (Projected Coordinates) (X) 546395.07 (Y) 5028353.64 (Projected Coordinates)" },
	{ name: "Contact0017", llPos: "Click Position: -44.8967769252 -74.4122182677", xyPos: "Click Position (Projected Coordinates) (X) 546409.30 (Y) 5028348.24 (Projected Coordinates)" },
	{ name: "Contact0018", llPos: "Click Position: -44.8968461158 -74.4145362751", xyPos: "Click Position (Projected Coordinates) (X) 546226.22 (Y) 5028341.88 (Projected Coordinates)" },
	{ name: "Contact0019", llPos: "Click Position: -44.8955239005 -74.4139511690", xyPos: "Click Position (Projected Coordinates) (X) 546273.48 (Y) 5028488.43 (Projected Coordinates)" },
	{ name: "Contact0020", llPos: "Click Position: -44.8969962305 -74.4124125717", xyPos: "Click Position (Projected Coordinates) (X) 546393.78 (Y) 5028323.99 (Projected Coordinates)" },
	{ name: "Contact0022", llPos: "Click Position: -44.8908864961 -74.4206883174", xyPos: "Click Position (Projected Coordinates) (X) 545745.20 (Y) 5029007.39 (Projected Coordinates)" },
	{ name: "Contact0023", llPos: "Click Position: -44.8963848334 -74.4115552098", xyPos: "Click Position (Projected Coordinates) (X) 546461.97 (Y) 5028391.42 (Projected Coordinates)" },
	{ name: "Contact0024", llPos: "Click Position: -44.8968040713 -74.4118207938", xyPos: "Click Position (Projected Coordinates) (X) 546440.66 (Y) 5028345.00 (Projected Coordinates)" },
	{ name: "Contact0025", llPos: "Click Position: -44.8927549927 -74.4200517542", xyPos: "Click Position (Projected Coordinates) (X) 545793.99 (Y) 5028799.47 (Projected Coordinates)" },
	{ name: "Contact0026", llPos: "Click Position: -44.8930074485 -74.4199361792", xyPos: "Click Position (Projected Coordinates) (X) 545802.91 (Y) 5028771.36 (Projected Coordinates)" },
	{ name: "Contact0027", llPos: "Click Position: -44.8930924759 -74.4198785553", xyPos: "Click Position (Projected Coordinates) (X) 545807.39 (Y) 5028761.88 (Projected Coordinates)" },
	{ name: "Contact0028", llPos: "Click Position: -44.8918768110 -74.4202100240", xyPos: "Click Position (Projected Coordinates) (X) 545782.19 (Y) 5028897.11 (Projected Coordinates)" },
	{ name: "Contact0029", llPos: "Click Position: -44.8967273104 -74.4126818366", xyPos: "Click Position (Projected Coordinates) (X) 546372.74 (Y) 5028354.02 (Projected Coordinates)" },
	{ name: "Contact0030", llPos: "Click Position: -44.8907424661 -74.4202791059", xyPos: "Click Position (Projected Coordinates) (X) 545777.63 (Y) 5029023.16 (Projected Coordinates)" },
	{ name: "Contact0031", llPos: "Click Position: -44.8968091449 -74.4126776944", xyPos: "Click Position (Projected Coordinates) (X) 546373.00 (Y) 5028344.93 (Projected Coordinates)" },
	{ name: "Contact0032", llPos: "Click Position: -44.8906239107 -74.4220164856", xyPos: "Click Position (Projected Coordinates) (X) 545640.53 (Y) 5029037.31 (Projected Coordinates)" },
	{ name: "Contact0033", llPos: "Click Position: -44.8978577712 -74.4135856505", xyPos: "Click Position (Projected Coordinates) (X) 546300.47 (Y) 5028228.96 (Projected Coordinates)" },
	{ name: "Contact0034", llPos: "Click Position: -44.8925749876 -74.4197466203", xyPos: "Click Position (Projected Coordinates) (X) 545818.22 (Y) 5028819.29 (Projected Coordinates)" },
	{ name: "Contact0035", llPos: "Click Position: -44.8926444581 -74.4198446161", xyPos: "Click Position (Projected Coordinates) (X) 545810.43 (Y) 5028811.63 (Projected Coordinates)" },
];

var mapWidth = 22891;
var mapHeight = 15211;

var minutesFormat = false;
var north = "N";
var south = "S";
var west = "W";
var east = "E";

var units = "Meters";
