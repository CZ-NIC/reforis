Bootstrap component of email input with label with predefined sizes and structure for using in foris forms.
It use built-in browser email address checking. It's only meaningful using inside `<form>`.

All additional `props` are passed to the `<input type="email">` HTML component.

```js
import {useState} from 'react';
const [email, setEmail] = useState('Wrong email');
<form onSubmit={e=>e.preventDefault()}>
    <EmailInput
        value={email}
        label="Some label" 
        helpText="Read the small text!"
        onChange={target => setEmail(target.value)}
    />
    <button type="submit">Try to submit</button>
</form>
```
