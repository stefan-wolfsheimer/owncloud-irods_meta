import React from 'react';
import Form from 'react-jsonschema-form';
import mainFileInfoView from './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mySchema: {},
      formData: {}
    };
  };

  onBlur(k, value) {
    let atr = k.substring(5);
    let oldValue = this.state.formData[atr];
    if(!oldValue) oldValue = '';
    if(oldValue != value)
    {
      this.state.formData[atr] = value;
      //this.setState({formData: this.state.formData});
      $.ajax({
        url: this.props.url_data,
        type: 'PUT',
        cache: false,
        data: { attr: atr, value: value}
      });
    }
  }



  handleSubmit({formData}) {
    $( "#main-registration-container .form-control").attr('readonly', true);
    $( "#main-registration-container :button").hide();
    $.ajax({
      url: this.props.url_submit,
      type: 'POST',
      cache: false,
      success: data => {
        $( "#irods-notification").show();
        $( "#irods-notification-message").html("Your Collection has been Submitted");
      },
      error: (xhr, status, err) => {
        $( "#irods-error").show();
        $( "#irods-error-message").html("Failed to submit collection");
        $( "#main-registration-container :button").show();
      },
    });
  };

  componentDidMount(){
    $.ajax({
      url: this.props.url_schema,
      dataType: 'json',
      cache: false,
      success: data => {
        this.setState({mySchema: data});
      },
      error: (xhr, status, err) => {
        console.error(this.props.url_schema, status, err.toString());
      }
    });
    $.ajax({
      url: this.props.url_data,
      dataType: 'json',
      cache: false,
      success: data => {
        if(typeof data == 'string')
        {
          data = JSON.parse(data);
        }
        if(Array.isArray(data) && data.length == 0)
        {
          data = {};
        }
        this.setState({formData: data});
      },
      error: (xhr, status, err) => {
        console.error(this.props.url_data, status, err.toString());
      }
    });
  };

  render() {
    let button;
    if(this.props.url_submit) {
      button = <button type="submit">Submit</button>;
    }
    else {
      button = <div/>
    }
    return (
      <div id="main-registration-container">
       <div id="project">
        {this.state && this.state.mySchema && this.state.formData &&
         <Form schema={this.state.mySchema}
                       formData={this.state.formData}
                       onBlur={(k, v) => { this.onBlur(k,v);} }
                       onSubmit={d => { this.handleSubmit(d); }}>
         {button}
         </Form>
        }
        <div className="irods-error" id="irods-error">
          <h3 className="irods-field-header">Error!</h3>
          <div id="irods-error-message">
          </div>
        </div>
        <div className="irods-notification" id="irods-notification">
          <h3 className="irods-field-header">Success!</h3>
          <div id="irods-notification-message">
          </div>
        </div>
       </div>
      </div>
     );
  }
}

export default App;
