// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyCiztytQfWU5I9Ojd3nH0GSerGsc1bQ8E4",
    authDomain: "train-f588d.firebaseapp.com",
    databaseURL: "https://train-f588d.firebaseio.com/",
    projectId: "train-f588d",
    storageBucket: "train-f588d.appspot.com",
    messagingSenderId: "875350847995"
};

firebase.initializeApp(config);

var database = firebase.database();


function getNextMoment(currentMoment, startMoment, frequencyInMinutes) {
    var nextMoment = startMoment.clone();
    while(nextMoment.diff(currentMoment) < 0) {
        nextMoment.add(frequencyInMinutes, 'm');
    }
    return nextMoment;
}

// 2. Button for adding Trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destinationInput = $("#destination-input").val().trim();
    var trainTimeMoment = moment($("#train-time-input").val().trim(), "HH:mm");
    var trainTime = trainTimeMoment.format("X");
    var frequencyInput = $("#frequency-input").val().trim();
    frequencyInput = parseInt(frequencyInput);

    if (trainName.length === 0 ||
        destinationInput.length === 0 ||
        !trainTimeMoment.isValid() ||
        Number.isNaN(frequencyInput) || frequencyInput <= 0 || frequencyInput > 200000) {
            alert("Input is invalid, please check your input.");
            return;
    }

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: destinationInput,
        frequency: frequencyInput,
        time: trainTime,
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.frequency);
    console.log(newTrain.time);

    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#train-time-input").val("");
    $("#frequency-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var frequency = childSnapshot.val().frequency;
    var trainTime = childSnapshot.val().time;


    // Train Info
    console.log(trainName);
    console.log(destination);
    console.log(trainTime);
    console.log(frequency);

    // Prettify the train start
    var trainStartTime = moment.unix(trainTime).format("HH:mm");
    var nextMoment = getNextMoment(moment(), moment(trainStartTime, "HH:mm"), frequency);
    var nextArrival = nextMoment.format("hh:mm a");

    var nextArrivalMinutesAway = nextMoment.fromNow();

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextArrival),
        $("<td>").text(nextArrivalMinutesAway)
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
});
