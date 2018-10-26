const express = require('express');
const fileUpload = require('express-fileupload');
const fileExtension = require('file-extension');
const toPdf = require('office-to-pdf');
const path = require('path');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const SimpleNodeLogger = require('simple-node-logger'),
    opts = {
        logFilePath: 'auditLog.log',
        timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
    },
    log = SimpleNodeLogger.createSimpleLogger(opts);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require('express-session')({

    name: '_es_demo', // The name of the cookie
    secret: 'secret_text', // The secret is required, and is used for signing cookies
    resave: true, // Force save of session for each request.
    saveUninitialized: false, // Save a session that is new, but has not been modified
    cookie: { maxAge: 150000 }

}));

app.use(express.static('dist'));
app.use(fileUpload());
app.use('/public', express.static(__dirname + '/public'));
app.get('/health', function (req, res) {

    // simple count for the session
    if (!req.session.count) {
        req.session.count = 0;
    }
    req.session.count += 1;

    // send info as json
    res.json(req.session);

});
app.post('/api/login', function (req, res) {

    let username = req.body.username;
    let password = req.body.password;

    log.info('User: ', username, ' logged in at: ', new Date().toJSON());

    if (!req.session.authenticated) {
        req.session.authenticated = false;
    }
    if (username && username) {
        let obj = JSON.parse(fs.readFileSync(__dirname + '/cred.json', 'utf8'));
        for (index in obj) {
            if (username === obj[index].username && password === obj[index].password) {
                req.session.authenticated = true;
                req.session.username = username;
            }
        }
    }
    if (req.session.authenticated) {
        res.status(200).send({ status: 'Authenticated' });
    } else {
        res.status(401).send({ status: 'Unauthenticated' });
    }
});

app.get('/api/authenticated', function (req, res) {
    if (!req.session.authenticated) {
        req.session.authenticated = false;
    }
    if (req.session.authenticated) {
        res.status(200).send({ status: 'Authenticated' });
    } else {
        res.status(401).send({ status: 'Unauthenticated' });
    }
});

const FILE_SHARE_LOACTION = "//MS179PWRMM01/retalix/powernet/customer/PowerNetCustomerV65/customer/messages/uploads/";
//const FILE_SHARE_LOACTION = 'C:/Users/srat0350/Desktop/Sysco Dev/nodedocker/uploads';

const saveInFileSysytem = (fileToSave, fileSaveLocation, fileName, username) => {
    return new Promise((resolve, reject) => {
        fileToSave.mv(FILE_SHARE_LOACTION + fileName, function (err) {
            if (err) {
                reject("");
                console.error('/api/upload ERROR ' + err);
                log.info('User: ', username, ' failed the upload ', fileName, ' at ',new Date().toJSON());
            }
            resolve("");
            log.info('User: ', username, ' uploaded the file ', fileName, ' at ',new Date().toJSON());
            console.log('/api/upload SUCESS ' + fileSaveLocation);
        });
    });
}

const converOfficeDocToPdf = (fileLoaction, fileName, res) => {
    console.log('converOfficeDocToPdf')
    var wordBuffer = fs.readFileSync(fileLoaction);
    let trimmedFilename = fileName.split('.').slice(0, -1).join('.');
    let newPdfName = trimmedFilename + '.pdf';
    toPdf(wordBuffer).then(
        (pdfBuffer) => {
            //fs.writeFileSync('./uploads/' + newPdfName, pdfBuffer);
            fs.writeFileSync(FILE_SHARE_LOACTION + newPdfName, pdfBuffer);
            console.log('Conversion seccess.');
            res.send({ file: newPdfName });
        }, (err) => {
            console.log(err)
        }
    )
}
app.post('/api/upload', async (req, res, next) => {
    console.log('/api/upload' + req.session.authenticated);
    if (!req.session.authenticated) {
        res.status(401).send({ status: 'Unauthenticated' });
    } else {
        console.log(req);
        let fileToSave = req.files.file;
        let fileName = req.body.filename;
        //fileName = fileName.replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
        fileName = fileName.replace(/[\,%\s@#]+/g, '');

        var fileSaveLocation = path.join('./uploads', fileName);
        console.log('/api/upload ' + fileName);

        let fileType = fileExtension(fileName);
        let username = req.session.username;

        if ('pdf' === fileType) {
            saveInFileSysytem(fileToSave, fileSaveLocation, fileName, username);
            res.send({ file: fileName });
        } else if ('docx' === fileType || 'xlsx' === fileType || 'xls' === fileType) {
            await saveInFileSysytem(fileToSave, fileSaveLocation, fileName, username);
            converOfficeDocToPdf(fileSaveLocation, fileName, res);
        } else {
            return res.status(400).send({ error: 'File type not supprted.' });
        }
    }

})

app.get('/api/download', function (req, res) {
    var fileNameToDownload = req.param('fileName');
    var fileLocation = path.join('./uploads', fileNameToDownload);
    console.log(fileLocation);
    res.setHeader('Content-disposition', 'attachment; filename=' + fileNameToDownload);
    res.download(fileLocation, fileNameToDownload);
});

app.listen(8080, () => console.log('Listening on port 8080!'));
