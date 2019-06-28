Checkbox with label Bootstrap component with predefined sizes and structure for using in foris forms.

All additional `props` are passed to the `<input type="checkbox">` HTML component.


```js
import {useState} from 'react';
const [value, setValue] = useState(false);

<CheckBox
    value={value}
    label="Some label" 
    helpText="Read the small text!"
    onChange={value => setValue(value)}
/>
```
