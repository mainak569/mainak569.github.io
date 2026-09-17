import React, { Component } from 'react';
import SmallArrow from './small_arrow';
import onClickOutside from 'react-onclickoutside';
import { WifiIcon, BatteryIcon } from './status';

class Slider extends Component {
	render() {
		return (
			<input
				type="range"
				onChange={this.props.onChange}
				className={this.props.className}
				name={this.props.name}
				min="0"
				max="100"
				value={this.props.value}
				step="1"
			/>
		);
	}
}

function formatBattery(battery) {
	if (battery.level == null) return "Battery info unavailable";
	const pct = Math.round(battery.level * 100);
	if (battery.charging) {
		if (pct >= 100) return "Fully Charged";
		const t = battery.chargingTime;
		if (Number.isFinite(t) && t > 0) return `${Math.floor(t / 3600)}:${String(Math.floor((t % 3600) / 60)).padStart(2, "0")} Until Full (${pct}%)`;
		return `Charging (${pct}%)`;
	}
	const t = battery.dischargingTime;
	if (Number.isFinite(t) && t > 0) return `${Math.floor(t / 3600)}:${String(Math.floor((t % 3600) / 60)).padStart(2, "0")} Remaining (${pct}%)`;
	return `${pct}% Remaining`;
}

export class StatusCard extends Component {
	constructor() {
		super();
		this.state = {
			brightness_level: 100 // setting default value to 100 so that by default its always full.
		};
	}

	handleClickOutside = () => {
		if (this.props.visible) this.props.toggleVisible();
	};

	componentDidMount() {
		this.setState({
			brightness_level: localStorage.getItem('brightness-level') || 100
		}, () => {
			document.getElementById('monitor-screen').style.filter = `brightness(${3 / 400 * this.state.brightness_level + 0.25})`;
		})
	}

	handleBrightness = (e) => {
		this.setState({ brightness_level: e.target.value });
		localStorage.setItem('brightness-level', e.target.value);
		// at 0 the screen still keeps 0.25 brightness so that it doesn't turn black.
		document.getElementById('monitor-screen').style.filter = `brightness(${3 / 400 * e.target.value + 0.25})`;
	};

	render() {
		const { system } = this.props;
		const rowClass = "w-72 py-1.5 flex items-center justify-center bg-ub-cool-grey hover:bg-ub-warm-grey hover:bg-opacity-20";
		const wifiLabel = system.online ? "OnePlus Nord CE3 Lite" : "Not Connected";

		return (
			<div
				className={
					'absolute bg-ub-cool-grey rounded-md py-4 top-9 right-3 shadow border-black border border-opacity-20 status-card' +
					(this.props.visible ? ' visible animateShow' : ' invisible')
				}
			>
				<div className="absolute w-0 h-0 -top-1 right-6 top-arrow-up" />
				<div className={rowClass}>
					<div className="w-8">
						<img width="16px" height="16px" src="./themes/Yaru/status/display-brightness-symbolic.svg" alt="ubuntu brightness" />
					</div>
					<Slider
						onChange={this.handleBrightness}
						className="ubuntu-slider w-2/3"
						name="brightness_range"
						value={this.state.brightness_level}
					/>
				</div>
				<div className="w-72 flex content-center justify-center">
					<div className="w-2/4 border-black border-opacity-50 border-b my-2 border-solid" />
				</div>
				<div className={rowClass}>
					<div className="w-8">
						<WifiIcon on={system.online} />
					</div>
					<div className="w-2/3 flex items-center justify-between text-gray-400">
						<span>{wifiLabel}</span>
					</div>
				</div>
				<div className={rowClass}>
					<div className="w-8">
						<img width="16px" height="16px" src="./themes/Yaru/status/bluetooth-symbolic.svg" alt="ubuntu bluetooth" />
					</div>
					<div className="w-2/3 flex items-center justify-between text-gray-400">
						<span>Bluetooth Off</span>
					</div>
				</div>
				<div className={rowClass}>
					<div className="w-8">
						<BatteryIcon level={system.battery.level} charging={system.battery.charging} />
					</div>
					<div className="w-2/3 flex items-center justify-between text-gray-400">
						<span>{formatBattery(system.battery)}</span>
					</div>
				</div>
				<div className="w-72 flex content-center justify-center">
					<div className="w-2/4 border-black border-opacity-50 border-b my-2 border-solid" />
				</div>
				<div
					id="open-settings"
					className={rowClass}
				>
					<div className="w-8">
						<img width="16px" height="16px" src="./themes/Yaru/status/emblem-system-symbolic.svg" alt="ubuntu settings" />
					</div>
					<div className="w-2/3 flex items-center justify-between">
						<span>Settings</span>
					</div>
				</div>
				<div
					onClick={this.props.lockScreen}
					className={rowClass}
				>
					<div className="w-8">
						<img width="16px" height="16px" src="./themes/Yaru/status/changes-prevent-symbolic.svg" alt="ubuntu lock" />
					</div>
					<div className="w-2/3 flex items-center justify-between">
						<span>Lock</span>
					</div>
				</div>
				<div
					onClick={this.props.shutDown}
					className={rowClass}
				>
					<div className="w-8">
						<img width="16px" height="16px" src="./themes/Yaru/status/system-shutdown-symbolic.svg" alt="ubuntu power" />
					</div>
					<div className="w-2/3 flex items-center justify-between">
						<span>Power Off / Log Out</span>
						<SmallArrow angle="right" />
					</div>
				</div>
			</div>
		);
	}
}

export default onClickOutside(StatusCard);
