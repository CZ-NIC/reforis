import React from 'react'
import update from 'immutability-helper';

import WifiForm from '../components/Wifi';
import Button from "../components/bootstrap/Button";

class Wifi extends React.Component {
    constructor(props) {
        super(props);
        this.state = {devices: []};
    }

    componentDidMount() {
        fetch('/api/wifi')
            .then(response => response.json())
            .then(data => this.setState(data));
    }

    handleWifiFormChange = (deviceId, target) => {
        let value = target.value;
        if (target.type === 'checkbox')
            value = target.checked;
        else if (target.name === 'channel')
            value = parseInt(target.value);

        this.updateDevice(
            deviceId,
            target.name,
            value
        );
    };

    handleGuestWifiFormChange = (deviceId, target) => {
        const newGuestWifiState = update(
            this.state.devices[deviceId].guest_wifi,
            {[target.name]: {$set: target.type === 'checkbox' ? target.checked : target.value}}
        );

        this.updateDevice(
            deviceId,
            'guest_wifi',
            newGuestWifiState
        );
    };

    updateDevice(deviceId, target, value) {
        const newDeviceState = update(
            this.state.devices[deviceId],
            {[target]: {$set: value}}
        );

        this.setState(update(
            this.state,
            {devices: {$splice: [[deviceId, 1, newDeviceState]]}}
        ));
    }

    getChannelChoices = (deviceId) => {
        const device = this.state.devices[deviceId];
        let channel_choices = [];

        device.available_bands.forEach((available_band) => {
            if (available_band.hwmode !== device.hwmode) return;

            channel_choices = available_band.available_channels.map((available_channel) => {
                let channel = available_channel.number;
                return {label: channel, value: channel};
            })
        });
        return channel_choices
    };

    getHtmodeChoices = (deviceId) => {
        const device = this.state.devices[deviceId];
        let htmode_choices = [];

        device.available_bands.forEach((available_band) => {
            if (available_band.hwmode !== device.hwmode)
                return;

            htmode_choices = available_band.available_htmodes.map((available_htmod) => {
                return {
                    key: available_htmod,
                    label: available_htmod,
                    value: available_htmod,
                };
            })
        });
        return htmode_choices
    };

    getHwmodeChoices = (deviceId) => {
        const device = this.state.devices[deviceId];

        return device.available_bands.map((available_band) => {
            return {
                label: available_band.hwmode,
                value: available_band.hwmode,
            }
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const data = this.getPreparedDataToSubmit();
        fetch('/api/wifi', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            // Todo: better error processing
            .then(result => console.log(result));
    };

    getPreparedDataToSubmit() {
        let data = {'devices': []};

        this.state.devices.forEach((device, idx) => {
            data.devices[idx] = {...device};
        });

        data.devices.forEach((device, idx) => {
            delete device['available_bands'];

            if (!device.enabled) {
                data.devices[idx] = {id: device.id, enabled: false};
                return;
            }

            if (!device.guest_wifi.enabled)
                data.devices[idx].guest_wifi = {enabled: false};
        });

        return data;
    }

    render() {
        const forms = this.state.devices.map((device) =>
            <div key={device.id}>
                <WifiForm
                    {...device}
                    getChannelChoices={this.getChannelChoices}
                    getHtmodeChoices={this.getHtmodeChoices}
                    getHwmodeChoices={this.getHwmodeChoices}

                    onWifiFormChange={this.handleWifiFormChange}
                    onGuestWifiFormChange={this.handleGuestWifiFormChange}
                />
            </div>
        );
        let devices_count = this.state.devices.length;
        return (
            <form onSubmit={this.handleSubmit}>
                <p>{_(
                    "If you want to use your router as a Wi-Fi access point, enable Wi-Fi here and fill in an SSID " +
                    "(the name of the access point) and a corresponding password. You can then set up your  mobile " +
                    "devices, using the QR code available within the form."
                )}</p>

                {/* TODO: delete this plural test.*/}
                <p>{babel.format(
                    ngettext("You have %d wifi module", "You have %d wifi modules", devices_count),
                    devices_count
                )}</p>

                {forms}
                <Button>Save</Button>
            </form>
        );
    }
}


export default Wifi;
