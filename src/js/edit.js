// import React, { Component } from "react";
// import { render } from "react-dom";

// import Form from "react-jsonschema-form";
const Form = JSONSchemaForm.default;

const storage = new Storage('data-' + THEME_NAME);

const submit = (data) => {
    storage.set(data.formData);

    window.parent.reloadPreview();
};

storage.get()
    .then(formData => {
        ReactDOM.render((
            <Form
                schema={SCHEMA}
                formData={formData}
                // onChange={log("changed")}
                onSubmit={submit}
                // onError={log("errors")}
            >
                <button type="submit" className="btn btn-success">Save and update</button>
                <button className="btn btn-warning pull-right" onClick={() => {window.parent.location = '/'}}>Finish preview</button>
            </Form>
        ), document.getElementById("form"));
    });
