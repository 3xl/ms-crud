Base crud microservice based on Express and Mongoose

### Usage

```js
'use strict';

const Ms = require('./index.js');

/**
 * Init application
 * 
 */
let ms = new Ms(
    // Mongo configuration
    {
        user: "",
        password: "",
        connection: "mongodb://{address}t:{port}/{database}"
    },

    // Models
    {
        modelName: {
            propertyName: { type: String },
            propertyName: { type: String, endpoint: '{address}' }
        }
    }
);

ms.start(3000);
```