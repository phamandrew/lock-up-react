import React from 'react';
import ReactDOM from 'react-dom';

// Global object to simulate a backend API database

var profile = {
	home: {},
};

// Function to simulate API fetch

function getProfile() {
	return profile;
}

// Function to simulate API update for User Home Coordinates

function updateHome(long, lat) {
	profile.home.longitude = long;
	profile.home.latitude = lat;
};

// Function to simulate API update for whether User has left home.

function updateProfile(flag) {
	profile.leftHome = flag;
}

// 2 Functions to calculate distance between 2 coordinates and converted from degrees to Meters.

function degreesToRadians(degrees) {
	return degrees * Math.PI / 180;
}

function distanceBetween(lat1, lon1, lat2, lon2) {

	var earthRadiusKm = 6371;

	var dLat = degreesToRadians(lat2-lat1);
	var dLon = degreesToRadians(lon2-lon1);

	lat1 = degreesToRadians(lat1);
	lat2 = degreesToRadians(lat2);

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	return (earthRadiusKm * c) * 1000;
}

// Component to establish Users Home location 

class App extends React.Component {

	constructor(){
		super();

		this.state = {
			atHome: false
			}

		this.findHome = this.findHome.bind(this);
		this.notHome = this.notHome.bind(this);
		this.checkDoor = this.checkDoor.bind(this);
	}

	findHome() {

		const success = (position) => {

			updateHome(position.coords.longitude, position.coords.latitude);

			this.setState.atHome = true;

			console.log(profile);
			
		}

		function error () {
			console.log('error');
		}

		navigator.geolocation.getCurrentPosition(success, error);

	}

	notHome() {
		this.setState.atHome = false;

		// console.log(this.state.atHome);
	}

	checkDoor(){

		const success = (position) => {

			getProfile();

			var location = position.coords;

			const distanceHomeToCurrent = distanceBetween(profile.home.latitude, profile.home.longitude, location.latitude, location.longitude);

			console.log(distanceHomeToCurrent);
			
			if (distanceHomeToCurrent > 200) {

				alert("Did you lock your door?");

				updateProfile(true);

			}

			// if user is still at home

			else {

				updateProfile(false);
				// console.log(profile);
			}

			console.log(profile.leftHome);
		}
		function error () {

		}

		navigator.geolocation.watchPosition(success, error);

	}
	render(){
		return (
			<div>
				<p>Are you at home right now?</p>
				<button onClick={this.findHome}>Yes</button>
				<button onClick={this.notHome}>No</button>
			</div>

		)


		// if (this.state.atHome === false) {
		// 	return(
		// 		<p>Please try again when you're home.</p>
		// 	)
		// }
		
	}


	
}



ReactDOM.render(<App />, document.getElementById('app'));
