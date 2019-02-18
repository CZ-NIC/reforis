import React from 'react'

import WifiForm from '../components/Wifi';
import {Form, Button} from 'react-bootstrap';
import update from 'immutability-helper';

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

    handleSubmit = (e) => {
        e.preventDefault();
        let data = {...this.state};

        data.devices.forEach(function (device, idx) {
            delete device['available_bands'];

            if (!device.enabled) {
                data.devices[idx] = {
                    id: device.id,
                    enabled: false,
                };
                return;
            }


            if (!device.guest_wifi.enabled) {
                data.devices[idx].guest_wifi = {
                    enabled: false,
                };
            }

        });

        fetch('/api/wifi', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => console.log(result));
    };

    render() {
        const forms = this.state.devices.map((device) =>
            <div key={device.id}>
                <WifiForm
                    {...device}
                    onWifiFormChange={this.handleWifiFormChange}
                    onGuestWifiFormChange={this.handleGuestWifiFormChange}
                />
            </div>
        );
        let devices_count = this.state.devices.length;
        return (
            <Form onSubmit={this.handleSubmit}>
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
                <Button variant="primary" type="submit">Submit</Button>
            </Form>
        );
    }
}


export default Wifi;
