Bootstrap component of number input with label with predefined sizes and structure for using in foris forms.

All additional `props` are passed to the `<input type="number">` HTML component.

```js
import {useState} from 'react';
const [value, setValue] = useState(42);

<NumberInput
    value={value}
    label="Some number" 
    helpText="Read the small text!"
    min='33'
    max='54'
    onChange={target => setValue(target.value)}
/>
```
