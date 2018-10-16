const express = require('express');
const fileUpload = require('express-fileupload');
const fileExtension = require('file-extension');
const toPdf = require('office-to-pdf');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.static('dist'));
app.use(fileUpload());
app.use('/public', express.static(__dirname + '/public'));

const FILE_SHARE_LOACTION="//MS179PWRMM01/retalix/powernet/customer/PowerNetCustomerV65/customer/messages/uploads/";
const saveInFileSysytem = (fileToSave, fileSaveLocation, fileName) => {
    return new Promise((resolve, reject) => {
        fileToSave.mv(FILE_SHARE_LOACTION+fileName, function (err) {   
        if (err) {
                reject("");
            }
            resolve("");
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
    console.log(req);
    let fileToSave = req.files.file;
    let fileName = req.body.filename;
    //fileName = fileName.replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
    fileName = fileName.replace(/\s+/g,'');
    
    var fileSaveLocation = path.join('./uploads', fileName);
    console.log('/api/upload ' + fileName);

    let fileType = fileExtension(fileName);

    if ('pdf' === fileType) {
        saveInFileSysytem(fileToSave, fileSaveLocation, fileName);
        res.send({ file: fileName });
    } else if ('docx' === fileType || 'xlsx' === fileType) {
        await saveInFileSysytem(fileToSave, fileSaveLocation, fileName);
        converOfficeDocToPdf(fileSaveLocation, fileName, res);
    } else {
        return res.status(400).send({ error: 'File type not supprted.' });
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
