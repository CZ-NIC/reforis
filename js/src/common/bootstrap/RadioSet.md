Set of radio Bootstrap component input with label and predefined sizes and structure for using in foris forms.

All additional `props` are passed to the `<input type="number">` HTML component.

```js
import {useState} from 'react';
const CHOICES=[
    {value:'one',label:'1'},
    {value:'two',label:'2'},
    {value:'three',label:'3'},
];
const [value, setValue] = useState(CHOICES[0].value);

<>
    {/*Yeah, it gets event, not value!*/}
    <RadioSet
        value={value}
        name='some-radio'
        choices={CHOICES}
        onChange={event=>setValue(event.target.value)}
    />
    <p>Selected value: {value}</p>
</>
```
