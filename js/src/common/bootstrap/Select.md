Select with options Bootstrap component input with label and predefined sizes and structure for using in foris forms.

All additional `props` are passed to the `<select>` HTML component.

```js
import {useState} from 'react';
const CHOICES={
    apple:'Apple',
    banana:'Banana',
    peach:'Peach',
};
const [value, setValue] = useState(Object.keys(CHOICES)[0]);

<>
    {/*Yeah, it gets event, not value!*/}
    <Select
        label="Fruit"
        value={value}
        choices={CHOICES}
        onChange={event=>setValue(event.target.value)}
    />
    <p>Selected choice label: {CHOICES[value]}</p>
    <p>Selected choice value: {value}</p>
</>
```
