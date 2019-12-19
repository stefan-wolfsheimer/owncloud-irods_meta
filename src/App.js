import React from 'react';
import Form from 'react-jsonschema-form';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mySchema: {},
      formData: {}
    };
  };

  handleSubmit({formData}) {
    console.log(formData);
  };

  componentDidMount(){
    $.ajax({
      url: this.props.url_schema,
      dataType: 'json',
      cache: false,
      success: data => {
        if(typeof data == 'string') {
          data = JSON.parse(data);
        }
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
        console.log(data);
        if(typeof data == 'string') {
          data = JSON.parse(data);
        }
        this.setState({formData: data});
      },
      error: (xhr, status, err) => {
        console.error(this.props.url_data, status, err.toString());
      }
    });
  };


  render() {
    return (
        <div id="main-registration-container">
          <div id="project">
          {this.state && this.state.mySchema && this.state.formData &&
           <Form schema={this.state.mySchema} onSubmit={this.handleSubmit}
                 formData={this.state.formData} />}
          </div>
        </div>
      );
    }
  }
  export default App;
