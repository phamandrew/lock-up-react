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



class App extends React.Component {

	constructor(){
		super();

		this.state = {
			ready: false,
			atHome: false,
			retry: true

		}

		this.userReady = this.userReady.bind(this);
		this.findHome = this.findHome.bind(this);
		this.notHome = this.notHome.bind(this);
		this.checkDoor = this.checkDoor.bind(this);
		this.restartApp = this.restartApp.bind(this);

	}

// User ready to begin set up

	userReady() {
		this.setState({
			ready: true,
			atHome: false
		})
	}

// establish Users Home location 

	findHome() {
		const success = (position) => {

			updateHome(position.coords.longitude, position.coords.latitude);
			
			this.setState({
				atHome: true
			})
			
			this.checkDoor()
			
		}

		function error () {
			console.log('error');
		}

		navigator.geolocation.getCurrentPosition(success, error);

	}

	notHome() {
		this.setState({
			atHome: false,
			retry: false,
			ready: true
		})
	}

	

// establish whether User is at home and to trigger alert for if User has left home

	checkDoor(){

		let id;

		const success = (position) => {

			var location = position.coords;

			const distanceHomeToCurrent = distanceBetween(profile.home.latitude, profile.home.longitude, location.latitude, location.longitude);

			if (distanceHomeToCurrent > 200) {

				alert("Did you lock your door?");

				navigator.geolocation.clearWatch(id);

				updateProfile(false);

			}
			else {
				updateProfile(true);
			}

		}
		function error () {
			console.log('error')

		}

		id = navigator.geolocation.watchPosition(success, error);

	}

	restartApp() {
		this.setState({
			atHome: true
		})
	}

	render(){
		return (
			<div>
				<h1>Lock Up</h1>
				{this.state.ready === false && this.state.atHome === false &&
					<div>
					<p>User Setup</p>
					<button onClick={this.userReady}>Begin</button>
					</div>}

				{this.state.ready === true && this.state.atHome === false && <div>
					<p>Are you at home right now?</p>
					<div className="buttons">
						<button onClick={this.findHome}>Yes</button>
						<button onClick={this.notHome}>No</button>
					</div>
				</div>}

				{this.state.atHome === true && <div>
					<p>App Is Activated</p></div>
				}
			
				{this.state.atHome === false && this.state.retry === false &&  <div><p>Try again when you are home.</p>
					 </div>}
			</div>)		
	}

}

ReactDOM.render(<App />, document.getElementById('app'));

