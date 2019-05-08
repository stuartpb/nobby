misty.AddPropertyTest("ActuatorPosition", "sensorName", "==", "Actuator_RightArm", "string");
misty.RegisterEvent("ActuatorPosition", "ActuatorPosition", 50, true);

var state = "waiting";
var targetSeat = 0; // NOTE: valid seats start at 1
var totalSeats = 4;

var bottomArmPosition = -30;
var topArmPosition = -215;

function armValueToSeat(armValue) {
  var scale = topArmPosition - bottomArmPosition;
  return Math.max(1,Math.min(totalSeats,
    Math.ceil(totalSeats * (armValue - bottomArmPosition) / scale)));
}

function updateSeat(value) {
  targetSeat = armValueToSeat(value);
  misty.DisplayImage("seat"+targetSeat.toString(10)+".png");
};

function _ActuatorPosition(data) {
  if (state == "waiting" && data.message.sensorId == "ala") {
     updateSeat(data.message.value);
  }
}

// let the left arm move freely
misty.Halt();
// lock the right arm into a beer-safe position
misty.MoveArmPosition("left", 0, 100);
