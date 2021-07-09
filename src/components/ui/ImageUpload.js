import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Field } from 'mobx-react-form';
import classnames from 'classnames';
import Dropzone from 'react-dropzone';

export default @observer class ImageUpload extends Component {
  static propTypes = {
    field: PropTypes.instanceOf(Field).isRequired,
    className: PropTypes.string,
    multiple: PropTypes.bool,
    textDelete: PropTypes.string.isRequired,
    textUpload: PropTypes.string.isRequired,
  };

  static defaultProps = {
    className: null,
    multiple: false,
  };

  state = {
    path: null,
  };

  dropzoneRef = null;

  imgPath = null;

  onDrop(acceptedFiles) {
    const { field } = this.props; 

    acceptedFiles.forEach((file) => {
      console.log(this.getOS());
      
      if(this.getOS() === "Windows"){
        this.imgPath = file.path.replace(/\\/g,"/");
      }else{
        this.imgPath = file.path;
      }

      console.log(this.imgPath);
      
      this.setState({
        path: this.imgPath,
      });
      this.props.field.onDrop(file);
    });

    field.set('');
  }

  getOS() {
    var platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        os = null;
  
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
    }
  
    return os;
  }

  render() {
    const {
      field, className, multiple, textDelete, textUpload,
    } = this.props;

    const cssClasses = classnames({
      'image-upload__dropzone': true,
      [`${className}`]: className,
    });

    return (
      <div className="image-upload-wrapper">
        <label className="franz-form__label" htmlFor="iconUpload">
          {field.label}
        </label>
        <div className="image-upload">
          {(field.value && field.value !== 'delete') || this.state.path ? (
            <>
              <div
                className="image-upload__preview"
                style={{
                  backgroundImage: `url("${this.state.path || field.value}")`,
                }}
              />
              <div className="image-upload__action">
                <button
                  type="button"
                  onClick={() => {
                    if (field.value) {
                      field.set('delete');
                    } else {
                      this.setState({
                        path: null,
                      });
                    }
                  }}
                >
                  <i className="mdi mdi-delete" />
                  <p>{textDelete}</p>
                </button>
                <div className="image-upload__action-background" />
              </div>
            </>
          ) : (
            <Dropzone
              ref={(node) => {
                this.dropzoneRef = node;
              }}
              onDrop={this.onDrop.bind(this)}
              multiple={multiple}
              accept="image/jpeg, image/png, image/svg+xml"
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className={cssClasses}>
                  <i className="mdi mdi-file-image" />
                  <p>{textUpload}</p>
                  <input {...getInputProps()} />
                </div>
              )}
            </Dropzone>
          )}
        </div>
      </div>
    );
  }
}
