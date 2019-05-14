misty.Debug('Top statement');
misty.AddPropertyTest("ActuatorPosition", "sensorName", "==", "Actuator_RightArm", "string");
misty.RegisterEvent("ActuatorPosition", "ActuatorPosition", 50, true);

misty.Set("servingState", "waiting");
misty.Set("targetSeat", 0); // NOTE: valid seats start at 1

function armValueToSeat(armValue) {
  var bottomArmPosition = -0.75;
  var topArmPosition = -3.8;
  var totalSeats = 4;
  var scale = topArmPosition - bottomArmPosition;
  return Math.max(1,Math.min(totalSeats,
    Math.ceil(totalSeats * (armValue - bottomArmPosition) / scale)));
}

function updateSeat(value) {
  var oldSeat = misty.Get("targetSeat");
  var targetSeat = armValueToSeat(value);
  if (oldSeat != targetSeat) {
    misty.Set("targetSeat", targetSeat);
    misty.DisplayImage("seat"+targetSeat.toString(10)+".png");
  }
};

function _ActuatorPosition(wtf) {
  var data = wtf.PropertyTestResults[0].PropertyParent;
  var state = misty.Get("servingState");
  if (state == "waiting" && data.SensorId == "ara") {
     updateSeat(data.Value);
  }
}

misty.Halt();
misty.Pause(1000);
// lock the left arm into a beer-safe position
misty.MoveArmPosition("left", 1, 100,0,50); // HACK: jank to enforce movement
misty.MoveArmPosition("left", 0, 100,0,50);
misty.MoveHeadPosition(1,1,1,50,0,50);
misty.MoveHeadPosition(0,0,0,50,0,50);

misty.Debug('Bottom statement');
