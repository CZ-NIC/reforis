Adopted from `react-datetime/DateTime` datatime picker component.
It uses `momentjs` see example.

It requires `ForisTranslations.locale` to be defined in order to use right locale.

```js
ForisTranslations={locale:'en'};

import {useState, useEffect} from 'react';
import moment from 'moment/moment';

const [dataTime, setDataTime] = useState(moment());
const [error, setError] = useState();
useEffect(()=>{
   dataTime.isValid() ? setError(null) : setError('Invalid value!');
},[dataTime]);
 
<DataTimeInput
    label='Time to sleep'
    value={dataTime}
    error={error}
    helpText='Example helptext...'
    onChange={value => setDataTime(value)}
/>
```
