Password Bootstrap component input with label and predefined sizes and structure for using in foris forms.
Can be used with "eye" button, see example.

All additional `props` are passed to the `<input type="password">` HTML component.

```js
import {useState} from 'react';
const [value, setValue] = useState('secret');

<PasswordInput
    withEye
    value={value}
    label="Some password" 
    helpText="Read the small text!"
    onChange={target => setValue(target.value)}
/>
```
