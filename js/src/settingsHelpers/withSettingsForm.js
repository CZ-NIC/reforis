/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import update from 'immutability-helper';
import {compose} from "recompose";

import ForisAPI from "../api/api";
import SubmitButton from "./SubmitButton";


export const FORM_STATES = {
    READY: 1,
    UPDATE: 2,
    NETWORK_RESTART: 3,
    LOAD: 4,
};

const withFormData = WrappedComponent => {
    class WithFormData extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                formState: FORM_STATES.LOAD,
                formData: null,
                formErrors: null,
            };
        }

        render() {
            return <WrappedComponent
                formState={this.state.formState}
                formData={this.state.formData}
                formErrors={this.state.formErrors}
                formIsDisabled={this.state.formState !== FORM_STATES.READY}

                setFormState={(state, callback) => this.setState({formState: state}, callback)}
                setFormData={(data, callback) => this.setState({formData: data}, callback)}
                setFormErrors={(errors, callback) => this.setState({formErrors: errors}, callback)}

                {...this.props}
            />
        }
    }

    WithFormData.displayName = `withFormData(...)`;
    return WithFormData;
};

const withFormValidation = validator => WrappedComponent => {
    class WithFormValidation extends React.Component {
        validateFormData = () => {
            if (!this.props.formData) return;

            const errors = validator(this.props.formData);
            this.props.setFormErrors(JSON.stringify(errors) !== '{}' ? errors : null);
        };

        render() {
            return <WrappedComponent
                validateFormData={this.validateFormData}

                {...this.props}
            />
        }
    }

    WithFormValidation.displayName = `withFormValidation(...)`;
    return WithFormValidation;
};

const withFormDataProcessing = WrappedComponent => {
    class WithFormDataProcessing extends React.Component {
        // The data from the API and forms don't have the same structure. This function is made to tend to process data
        // change flexibly from the children of the wrapped component. In this way component which uses this function
        // can specify where to put changed data.
        changeFormData = (updateRule) => (event) => {
            const value = WithFormDataProcessing.getChangedValue(event.target);
            this.props.setFormData(
                update(this.props.formData, updateRule(value)),
                () => this.props.validateFormData()
            );
        };

        static getChangedValue(target) {
            let value = target.value;
            if (target.type === 'checkbox')
                value = target.checked;
            else if (target.name === 'channel')
                value = parseInt(target.value);
            return value
        };

        render() {
            return <WrappedComponent
                changeFormData={this.changeFormData}

                {...this.props}
            />
        }
    }

    WithFormDataProcessing.displayName = `withFormDataProcessing(...)`;
    return WithFormDataProcessing;
};

const withAPI = module => WrappedComponent => {
    class WithAPI extends React.Component {
        componentDidMount() {
            this.getData();
        }

        getData = () => {
            this.props.setFormState(FORM_STATES.LOAD, () =>
                ForisAPI[module].get()
                    .then(data => {
                        this.props.setFormData(data, () => {
                            this.props.validateFormData();
                            this.props.setFormState(FORM_STATES.READY)
                        });
                    })
            );
        };

        postData = (preparedData) => {
            this.props.setFormState(FORM_STATES.UPDATE, () =>
                ForisAPI[module].post(preparedData)
                    .then(result => console.log(result))
            );
        };

        render() {
            if (!this.props.formData)
                return null;

            return <WrappedComponent
                getData={this.getData}
                postData={this.postData}

                {...this.props}
            />
        }
    }

    WithAPI.displayName = `withAPI(...)`;
    return WithAPI;
};


const withWSNetworkRestart = WrappedComponent => {
    class WithWSNetworkRestart extends React.Component {
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
                        this.props.getData();
                        return;
                    }
                    if (this.props.formState !== FORM_STATES.NETWORK_RESTART)
                        this.props.setFormState(FORM_STATES.NETWORK_RESTART);
                    this.setState({remindsToNWRestart: remainsSec})

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

    WithWSNetworkRestart.displayName = `withWSNetworkRestart(...)`;
    return WithWSNetworkRestart;
};

const withWSUpdateSetting = module => WrappedComponent => {
    class WithWSUpdateSetting extends React.Component {
        componentDidMount() {
            window.forisWS
                .subscribe(module)
                .bind(module, 'update_settings',
                    () => this.props.setFormState(FORM_STATES.UPDATE)
                );
        }

        render() {
            return <WrappedComponent {...this.props}/>
        }
    }

    WithWSUpdateSetting.displayName = `withWSUpdateSetting(...)`;
    return WithWSUpdateSetting;
};

const withFormSubmit = prepareData => WrappedComponent => {
    class WithFormSubmitButton extends React.Component {

        onSubmit = (e) => {
            const preparedData = prepareData(this.props.formData);
            this.props.postData(preparedData);
            e.preventDefault();
        };

        render() {
            return <form onSubmit={this.onSubmit}>
                <WrappedComponent {...this.props}/>
                <SubmitButton
                    disable={!!this.props.formErrors}
                    state={this.props.formState}
                    remindsToNWRestart={this.props.remindsToNWRestart}
                />
            </form>
        }
    }

    WithFormSubmitButton.displayName = `withFormSubmitButton(...)`;
    return WithFormSubmitButton;
};

const withSettingsForm = (module, prepareDataToSubmit, validator) => {
    return compose(
        withFormData,
        withFormValidation(validator),
        withFormDataProcessing,

        withAPI(module),

        withWSNetworkRestart,
        withWSUpdateSetting(module),

        withFormSubmit(prepareDataToSubmit),
    );
};

export default withSettingsForm;