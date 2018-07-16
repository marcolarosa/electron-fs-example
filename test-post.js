'use strict';

const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

let formData = new FormData();
formData.append('file', fs.createReadStream('/Users/mlarosa/src/data.txt'));

axios({
    method: 'post',
    url: `http://localhost:9000/upload`,
    headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
    },
    data: formData
});
