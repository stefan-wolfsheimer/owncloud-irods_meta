import React, { Component } from 'react';
import Form from 'react-jsonschema-form'

const mySchema ={
  "title": "MetaData",
    "type": "object",
    "properties": {
	"Project" : {
	    "title" : "Project",
	    "type" : "string"
	},
	"Title" : {
	    "title" : "Title",
	    "type" : "string"
	},
	"Description" : {
	    "title" : "Description",
	    "type" : "string"
	},
	"Date" : {
	    "title" : "Date",
	    "type" : "string",
	    "format" : " date"
	},
	"Factors" : {
	    "title" : "Factors",
	    "type" : "string"
	},
	"Organism" : {
	    "title" : "Organism",
	    "type" : "string"
	},
	"Issue" : {
	    "title" : "Issue",
	    "type" : "string"
	},
	"Technology" : {
	    "title" : "Technology",
	    "type" : "string"
	},
	"Related Publications" : {
	    "title" : "Related Publications",
	    "type" : "string"
	},
	"Creator" : {
	    "title" : "Creator",
	    "type" : "string"
	},
        "contacts" : {
	    "title" : "Contacts",
	    "type" : "string"
	},
	"Protocol" : {
	    "title" : "Protocol",
            "type" : "string"
        }
    },
    "required" : ["Project", "Title", "Description", "Date", "Factors", "Organism", "Issue", "Technology", "Related Publications", "Creator", "Contacts", "Protocol"]
};

export default class MyForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit({formData}) {
        console.log(formData);
    }

    render() {
        return (
            <Form schema={mySchema} onSubmit={this.handleSubmit} />
        )
    }
}

