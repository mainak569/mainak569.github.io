import React, { Component } from 'react';
import Clock from '../util components/clock';
import Calendar from '../util components/calendar';
import Status from '../util components/status';
import StatusCard from '../util components/status_card';

export default class Navbar extends Component {
	constructor() {
		super();
		this.state = {
			status_card: false,
			calendar: false,
			system: {
				online: true,
				battery: { level: null, charging: false, chargingTime: Infinity, dischargingTime: Infinity },
			},
		};
	}

	componentDidMount() {
		this.updateSystem({ online: navigator.onLine });

		window.addEventListener('online', this.handleOnline);
		document.addEventListener('mousedown', this.closeCalendarOnOutsideClick);
		window.addEventListener('offline', this.handleOnline);

		// real battery status where the browser supports it (Chromium based browsers)
		if (navigator.getBattery) {
			navigator.getBattery().then(battery => {
				this.battery = battery;
				this.syncBattery();
				['levelchange', 'chargingchange', 'chargingtimechange', 'dischargingtimechange']
					.forEach(evt => battery.addEventListener(evt, this.syncBattery));
			}).catch(() => { });
		}
	}

	componentWillUnmount() {
		window.removeEventListener('online', this.handleOnline);
		window.removeEventListener('offline', this.handleOnline);
		document.removeEventListener('mousedown', this.closeCalendarOnOutsideClick);
		if (this.battery) {
			['levelchange', 'chargingchange', 'chargingtimechange', 'dischargingtimechange']
				.forEach(evt => this.battery.removeEventListener(evt, this.syncBattery));
		}
	}

	handleOnline = () => this.updateSystem({ online: navigator.onLine });

	syncBattery = () => {
		const { level, charging, chargingTime, dischargingTime } = this.battery;
		this.updateSystem({ battery: { level, charging, chargingTime, dischargingTime } });
	}

	updateSystem = (changes) => {
		this.setState(prev => ({ system: { ...prev.system, ...changes } }));
	}

	closeCalendarOnOutsideClick = (e) => {
		if (this.state.calendar && this.clockRef && !this.clockRef.contains(e.target)) this.setState({ calendar: false });
	}

	toggleStatusCard = () => {
		this.setState(prev => ({ status_card: !prev.status_card }));
	}

	render() {
		return (
			<div className="main-navbar-vp absolute top-0 right-0 w-screen shadow-md flex flex-nowrap justify-between items-center bg-ub-grey text-ubt-grey text-sm select-none z-50">
				<div
					tabIndex="0"
					onClick={() => window.dispatchEvent(new CustomEvent('toggle-activities'))}
					className={
						'pl-3 pr-3 cursor-default outline-none transition duration-100 ease-in-out border-b-2 border-transparent focus:border-ubb-orange py-1 '
					}
				>
					Activities
				</div>
				<div
					ref={el => (this.clockRef = el)}
					className={
						'relative pl-2 pr-2 text-xs md:text-sm outline-none transition duration-100 ease-in-out border-b-2 py-1 cursor-default ' +
						(this.state.calendar ? 'border-ubb-orange' : 'border-transparent')
					}
				>
					<div onClick={() => this.setState(prev => ({ calendar: !prev.calendar }))}>
						<Clock />
					</div>
					{this.state.calendar ? <Calendar close={() => this.setState({ calendar: false })} /> : null}
				</div>
				<div
					id="status-bar"
					className={
						'relative outline-none transition duration-100 ease-in-out border-b-2 ' +
						(this.state.status_card ? 'border-ubb-orange' : 'border-transparent')
					}
				>
					{/* clicking the icons toggles the card; the card ignores these clicks as "outside" clicks */}
					<div className="status-toggle pr-3 pl-3 py-1 cursor-default" onClick={this.toggleStatusCard}>
						<Status system={this.state.system} />
					</div>
					<StatusCard
						outsideClickIgnoreClass="status-toggle"
						shutDown={this.props.shutDown}
						lockScreen={this.props.lockScreen}
						visible={this.state.status_card}
						system={this.state.system}
						toggleVisible={() => {
							this.setState({ status_card: false });
						}}
					/>
				</div>
			</div>
		);
	}
}
