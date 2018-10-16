import React, { Component } from 'react';
import InputPreview from '../components/InputPreview';
import { connect } from 'react-redux';
import { setMessage } from '../actions/message';
import { setSelectedFile, setNetworkEvent, setClipBoadItem } from '../actions/fileActions';
import { Link } from 'react-router-dom';
import '../styles/app.css';
import ReactImage from '../../../public/sysco.png';
import Loader from 'react-loader-spinner';
import CopyToClipboard from 'react-copy-to-clipboard';
import fileDownload from 'js-file-download';
import { saveAs } from 'file-saver';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleUploadImage = this.handleUploadImage.bind(this);
  }

  state = { copied: false };

  onCopy = () => {
    this.setState({ copied: true });
  };

  onChange = (value) => {
    this.props.dispatch(setMessage(value))
  }
  importFile(e) {
    console.log('importFile' + this.uploadInput.files[0].name)
    this.props.setSelectedFile(this.uploadInput.files[0].name);
  }

  handleUploadImage(ev) {
    ev.preventDefault();
    if(!this.uploadInput.files[0]){
      {window.alert("Please select a file using \"Pick a File\" button")}
    }else{
    this.props.setNetworkEvent(true);
    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    data.append('filename', this.uploadInput.files[0].name);
    console.log('filename' + this.uploadInput.files[0].name)
    fetch('/api/upload', {
      method: 'POST',
      body: data,
    }).then((response) => {
      this.props.setNetworkEvent(false);
      response.json().then((body) => {
        let filenameRetunred = body.file;
        console.log('file returned '+filenameRetunred);
        this.props.setClipBoadItem('https://www.syscosource.ca/pnet/customer/messages/uploads/'+filenameRetunred);
        this.props.setNetworkEvent(false);
        this.setState({ copied: false });
        //this.handleDownloadFile(filenameRetunred);
      });
    });
  }
  }

  handleDownloadFile(fileNameToDownload) {
    this.props.setNetworkEvent(true);
    fetch('/api/download?fileName=' + fileNameToDownload, {
      method: 'GET',
      responseType: 'blob'
    }).then(response => response.blob())
      .then(blob => {
        saveAs(blob, fileNameToDownload)
        this.props.setNetworkEvent(false);
      });
  }


  // <InputPreview
  //  value={message}
  //  onChange={this.onChange}/>

  //  <Link to="/about">
  // <button>Go to About</button>
  // </Link>

  isLoading(loading) {
    if (loading) {
      return (
        <div className="loading">
          <Loader
            type="Rings"
            color="#00BFFF"
            height="100"
            width="100"
          />
        </div>)
    }
  }

  canCopy(url) {
    if (url) {
      return (
        <div >
          <CopyToClipboard onCopy={this.onCopy} text={url}>
            <button className="button hover">Copy Link</button>
          </CopyToClipboard>
        </div>)
    }
  }
  render() {
    const { username } = 'this.state;'
    const { fileName, loading, url } = this.props.fileState;

    return (
      < div >
      
        <img src={ReactImage} alt="react" />
        <form onSubmit={this.handleUploadImage}>
          <div className="upload-btn-wrapper">
            <button className="btn">Pick a File</button>
            <input onChange={this.importFile.bind(this)} type="file" ref={(ref) => { this.uploadInput = ref; }} />
          </div>
          <br />
          <div><p className="p">{fileName == '' ? 'No file selected. Please select a file by using "Pick a File" button above (pdf, docx)' : 'Selected file:' + ' ' + fileName}</p></div>
          {this.isLoading(loading)}
          <div>
            <button className="button hover">Get Shareable Link</button>
          </div>
        </form>
        <br />

        <div><p className="p">{url == '' ? '' : url}</p></div>
        {this.canCopy(url)}

      </div >
    );
  }

}
const mapDispatchToProps = {
  setMessage, // will be wrapped into a dispatch call
  setSelectedFile, // will be wrapped into a dispatch call
  setNetworkEvent,
  setClipBoadItem
};
export default connect(state => state, mapDispatchToProps)(App);
