/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import update from 'immutability-helper';


import {ForisAPI} from "../api/api";
import {compose} from "recompose";

//TODO: better naming for this state...
export const STATES = {
    READY: 1,
    UPDATE: 2,
    NETWORK_RESTART: 3,
    LOAD: 4,
};

const withFormState = WrappedComponent => {
    return class WithFormState extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                formState: STATES.LOAD,
            };
        }

        setFormState = (state) => {
            this.setState({formState: state});
        };

        render() {
            return <WrappedComponent
                setFormState={this.setFormState}
                formState={this.state.formState}

                {...this.props}
            />
        }
    }
};

const withAPI = module => WrappedComponent => {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                formData: null,
            }
        }

        componentDidMount() {
            this.getSettings();
        }

        getSettings = () => {
            this.props.setFormState(STATES.LOAD);
            ForisAPI[module].get()
                .then(data => {
                    this.setState({formData: data},);
                    this.props.setFormState(STATES.READY);
                });
        };

        postSettings = (preparedData) => {
            this.props.setFormState(STATES.READY);
            ForisAPI[module].post(preparedData)
                .then(result => console.log(result));
        };

        getChangedValue = (target) => {
            let value = target.value;
            if (target.type === 'checkbox')
                value = target.checked;
            else if (target.name === 'channel')
                value = parseInt(target.value);
            return value
        };

        // The data from the API and forms don't have the same structure. This function is made to tend to process data
        // change flexibly from the children of the wrapped component. In this way component which uses this function
        // can specify where to put changed data.
        changeFormData = (updateRule) => (event) => {
            const value = this.getChangedValue(event.target);
            this.setState({formData: update(this.state.formData, updateRule(value))});
        };

        render() {
            return <WrappedComponent
                getSettings={this.getSettings}
                postSettings={this.postSettings}

                formData={this.state.formData}
                changeFormData={this.changeFormData}

                {...this.props}
            />
        }
    }
};

const withWSMaintainNetworkRestart = WrappedComponent => {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                remindsToNWRestart: 0,
            }
        }

        componentDidMount() {
            window.forisWS.bind('maintain', 'network-restart',
                (msg) => {
                    const remainsSec = msg.data.remains / 1000;
                    if (remainsSec === 0) {
                        this.props.setFormState(STATES.READY);
                        this.props.getSettings();
                        return;
                    }
                    this.props.setFormState(STATES.NETWORK_RESTART);

                    this.setState({remindsToNWRestart: remainsSec});
                }
            );
        }

        render() {
            return <WrappedComponent
                remindsToNWRestart={this.state.remindsToNWRestart}

                {...this.props}
            />
        }
    }
};

const withWSSetting = module => WrappedComponent => {
    return class extends React.Component {
        componentDidMount() {
            window.forisWS
                .subscribe(module)
                .bind(module, 'update_settings',
                    () => this.props.setFormState(STATES.UPDATE)
                );
        }

        render() {
            return <WrappedComponent
                {...this.props}
            />
        }
    }
};

export const ForisSettingWrapper = (WrappedComponent, module) => {
        return compose(
            withFormState,
            withAPI(module),
            withWSMaintainNetworkRestart,
            withWSSetting(module),
        )(WrappedComponent);
    }
;