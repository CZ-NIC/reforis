import React from 'react';
import {render} from 'react-dom';
import Wifi from './wifi/Wifi';


let domContainer = document.getElementById('wifi_form_container');

render(<Wifi/>, domContainer);