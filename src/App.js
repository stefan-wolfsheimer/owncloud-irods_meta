import React from 'react';
import Form from 'react-jsonschema-form';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mySchema: {}
    };
  };

  handleSubmit({formData}) {
    console.log(formData);
  };

  componentDidMount(){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: data => {
        if(typeof data == 'string') {
          data = JSON.parse(data);
        }
        this.setState({mySchema: data});
      },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  };


  render() {
    return (
        <div id="main-registration-container">
          <div id="project">
          {this.state && this.state.mySchema &&
           <Form schema={this.state.mySchema} onSubmit={this.handleSubmit} />}
          </div>
        </div>
      );
    }
  }
  export default App;
