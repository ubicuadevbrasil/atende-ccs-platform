# Description

Ubica Whatsapp Front is an website aplication that integrates service with whatsapp through an endpoint API. 

# Installation

This aplication requires [Node](https://nodejs.org/en/) and [Python3.7](https://www.python.org/downloads/) 

### Node modules

Use the npm package manager to install the node dependencies

```bash
npm install
```

### Python3

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install the python requirements.

```bash
pip3 install -r requirements.txt
```

### Database

Our application uses an [MYSQL](https://www.mysql.com/downloads/) database to store the data, the database schema is in the **db.sql** file inside the database folder. After installing, change the database configuration inside the **dbcc.js** file

### File .env
CCS_MOBILE = Mobile EXT
CCS_CDN_FILE = Cdn file route
CCS_CDN_BASE = Cdn base64 route
CCS_OPTIONSKEY = Cert Key
CCS_OPTIONSCERT = Cert
CCS_EXTENSION = Ext Url
CCS_REPORT = Report URL

# Usage

Start the main aplication **app.js** then start the **sentinel.py** python script file

```bash
node app.js
python3 sentinel.py
```

# License

[ISC](https://opensource.org/licenses/ISC)


