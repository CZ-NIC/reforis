/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react'
import {
    Form,
    Col,
    Row
} from 'react-bootstrap';

class WifiForm extends React.Component {
    onWifiFormChange = (event) => {
        const deviceId = this.props.id;
        this.props.onWifiFormChange(deviceId, event.target)
    };

    onGuestWifiFormChange = (event) => {
        const deviceId = this.props.id;
        this.props.onGuestWifiFormChange(deviceId, event.target)
    };

    render() {
        const guestWifiForm = this.props.guest_wifi.enabled ? (
            <div>
                {/*TODO*/}
            </div>
        ) : null;

        let channel_options;
        this.props.available_bands.forEach((available_band) => {
                if (available_band.hwmode !== this.props.hwmode)
                    return;

                channel_options = available_band.available_channels.map((available_channel) =>
                    <option key={available_channel.number} value={available_channel.number}>
                        {available_channel.number}
                    </option>
                )
            }
        );

        let htmode_options;
        this.props.available_bands.forEach((available_band) => {
                if (available_band.hwmode !== this.props.hwmode)
                    return;

                htmode_options = available_band.available_htmodes.map((available_htmod) =>
                    <option key={available_htmod} value={available_htmod}>
                        {available_htmod}
                    </option>
                )
            }
        );

        let hwmode_options;
        hwmode_options = this.props.available_bands.map((available_band) =>
            <Form.Check inline
                        key={available_band.hwmode}
                        label={available_band.hwmode}
                        type="radio"
                        name="hwmode"
                        value={available_band.hwmode}
                        defaultChecked={this.props.hwmode === available_band.hwmode}
                        onChange={this.onWifiFormChange}
            />
        );

        const wifiForm = this.props.enabled ? (
            <div>
                <Form.Group as={Row}>
                    <Col className="form-label" sm={2}>
                        <Form.Label>SSID</Form.Label>
                    </Col>
                    <Col sm={8}>
                        <Form.Control onChange={this.onWifiFormChange} name="SSID" value={this.props.SSID}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Col className="form-label" sm={2}>
                        <Form.Label>Password</Form.Label>
                    </Col>
                    <Col sm={8}>
                        <Form.Control
                            type="password"
                            name="password"
                            onChange={this.onWifiFormChange}
                            value={this.props.password}
                            isInvalid={this.props.password.length < 8}
                            isValid={this.props.password.length >= 8}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            TODO: Fix this bug...
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Col className="form-label" sm={2}>
                        <Form.Check.Label>Hide SSID</Form.Check.Label>
                    </Col>
                    <Col sm={8}>
                        <Form.Check.Input name="hidden" onChange={this.onWifiFormChange}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Col className="form-label" sm={2}>
                        <Form.Label>GHz</Form.Label>
                    </Col>
                    <Col sm={8}>
                        {hwmode_options}
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Col className="form-label" sm={2}>
                        <Form.Label>802.11n/ac mode</Form.Label>
                    </Col>
                    <Col sm={8}>
                        <Form.Control name="htmode" as="select"
                                      onChange={this.onWifiFormChange}>{htmode_options}</Form.Control>
                    </Col>
                </Form.Group>


                <Form.Group as={Row}>
                    <Col className="form-label" sm={2}>
                        <Form.Label>Channel</Form.Label>
                    </Col>
                    <Col sm={8}>
                        <Form.Control name="channel" as="select"
                                      onChange={this.onWifiFormChange}>{channel_options}</Form.Control>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Col className="form-label" sm={2}>
                        <Form.Check.Label>Enable Guest Wifi</Form.Check.Label>
                    </Col>
                    <Col sm={8}>
                        <Form.Check.Input type="checkbox" onChange={this.onGuestWifiFormChange} name="enabled"/>
                    </Col>
                </Form.Group>
                {guestWifiForm}
            </div>
        ) : null;
        return (
            <div>
                <h3>WiFi {this.props.id + 1}</h3>
                <Form.Group as={Row} controlId={"enable_wifi_" + this.props.id}>
                    <Col className="form-label" sm={2}>
                        <Form.Check.Label>Enable</Form.Check.Label>
                    </Col>
                    <Col sm={8}>
                        <Form.Check.Input
                            name="enabled"
                            onChange={this.onWifiFormChange}
                            defaultChecked={this.props.enabled}
                        />
                    </Col>
                </Form.Group>
                {wifiForm}
            </div>
        );
    }
}


export default WifiForm;
