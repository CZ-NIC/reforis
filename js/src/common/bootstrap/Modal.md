Bootstrap modal component.

I have no idea why example doesn't work here but you can investigate HTML code...
```js
import {ModalHeader, ModalBody, ModalFooter} from './Modal';

import {useState} from 'react';
const [shown, setShown] = useState(false);

<>
    <Modal shown={shown}>
        <ModalHeader setShown={setShown} title='Warning!'/>
        <ModalBody><p>Bla bla bla...</p></ModalBody>
        <ModalFooter>
            <button 
                className='btn btn-secondary' 
                onClick={() => setShown(false)}
            >Skip it</button>
        </ModalFooter>
    </Modal>
    
    <button 
        className='btn btn-secondary'
        onClick={()=>setShown(true)}
    >Show modal</button>
</>
```
