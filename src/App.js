import React from 'react';
import Form from 'react-jsonschema-form';
import './App.css';
const log = (type) => console.log.bind(console, type);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mySchema: {},
      formData: {}
    };
  };

  onBlur(e,value) {
    $.ajax({
      url: this.props.url_data,
      type: 'PUT',
      cache: false,
      data: { attr: atr, value: value}
    });
    //let formData = this.state.formData;
    //formData[e.target.name] = e.target.value;
    let atr = e.substring(5)
    console.log('--------------');
    console.log(atr, value);
    console.log('+++++++++++++++');
    console.log(this);
    //console.log(e.target.name + '=' + e.target.value);
    //this.setState({
  //    formData
//    });
  }
 url='/dasfafd/sdaf/asdfsadf/ads?attr=' + encodeURIComponent(atr) + '&value=' + encodeURIComponent(value);



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
        <Form schema={this.state.mySchema}
        formData={this.state.formData}
        onBlur={this.onBlur}
        //onChange={log("changed")}
        onSubmit={this.handleSubmit}/>}
        </div>
        </div>
      );
    }
  }
  export default App;
