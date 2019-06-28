Bootstrap alert component.
```jsx
import {useState} from 'react';

function AlertExample(){
    const [alert, setAlert] = useState(true);
    if (alert)
        return <Alert 
            type='warning' 
            message='Some warning out there!' 
            onDismiss={()=>setAlert(false)}
        />;
    return <button 
        className='btn btn-secondary' 
        onClick={()=>setAlert(true)}
    >Show alert again</button>;
};
<AlertExample/>

```
