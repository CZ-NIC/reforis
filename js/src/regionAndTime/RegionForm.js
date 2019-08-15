/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Select from 'common/bootstrap/Select';
import {TIMEZONES, COUNTRIES} from 'utils/timezones';

RegionForm.propTypes = {
    formData: PropTypes.shape({
        region: PropTypes.string,
        country: PropTypes.string,
        city: PropTypes.string,
    }),
    setFormValue: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

RegionForm.defaultProps = {
    formData: {},
    setFormValue: () => {},
    disabled: false
};

export default function RegionForm({formData, setFormValue, disabled}) {
    function getRegionChoices() {
        return Object.keys(TIMEZONES)
            .sort()
            .reduce((obj, key) => {
            obj[key] = _(key);
            return obj;
        }, {})
    }

    function getCountryChoices() {
        return Object.keys(TIMEZONES[formData.region])
            .sort()
            .reduce((obj, country_code) => {
            obj[country_code] = _(COUNTRIES[country_code]);
            return obj;
        }, {})
    }

    function getCityChoices() {
        const countries = TIMEZONES[formData.region];
        const cities = countries[formData.country] || countries[Object.keys(countries)[0]];
        return Object.keys(cities)
            .sort()
            .reduce((obj, city) => {
            obj[city] = _(city);
            return obj;
        }, {})
    }

    return <>
        <h4>{_('Region settings')}</h4>
        <p>{_('Please select the timezone the router is being operated in. Correct setting is required to display ' +
            'the right time and for related functions.')}</p>
        <Select
            choices={getRegionChoices()}
            label={_('Continent or ocean')}
            value={formData.region}
            disabled={disabled}

            onChange={setFormValue(
                value => {
                    const country = Object.keys(TIMEZONES[value])[0];
                    const city = Object.keys(TIMEZONES[value][country])[0];
                    return {
                        region: {$set: value},
                        country: {$set: country},
                        city: {$set: city},
                    }
                }
            )}
        />
        <Select
            choices={getCountryChoices()}
            label={_('Country')}
            value={formData.country || ''}
            disabled={disabled}

            onChange={setFormValue(
                value => ({
                    country: {$set: value},
                    city: {$set: Object.keys(TIMEZONES[formData.region][value])[0]},
                })
            )}
        />
        <Select
            choices={getCityChoices()}
            label={_('Timezone')}
            value={formData.city || ''}
            disabled={disabled}

            onChange={setFormValue(
                value => ({city: {$set: value}})
            )}
        />
    </>
}
