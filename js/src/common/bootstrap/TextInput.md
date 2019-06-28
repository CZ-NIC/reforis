Text Bootstrap component input with label and predefined sizes and structure for using in foris forms.

All additional `props` are passed to the `<input type="text">` HTML component.

```js
import {useState} from 'react';
const [value, setValue] = useState('Bla bla');

<TextInput
    value={value}
    label="Some text" 
    helpText="Read the small text!"
    onChange={event => setValue(event.target.value)}
/>
```
