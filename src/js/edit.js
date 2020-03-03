// import React, { Component } from "react";
// import { render } from "react-dom";

// import Form from "react-jsonschema-form";
const Form = JSONSchemaForm.default;

const storage = new CustomStartStorage();

async function getSchema() {
    return await fetch('/api/schema')
        .then(res => res.json())
        .then(out => {
            return out;
        })
        .catch(err => { throw err });
}

const submit = (data) => {
    console.log('submit', data)

    storage.set(data.formData);

    window.parent.reloadPreview();
};

const del = () => {
    storage.delete();

    window.parent.reloadPreview();
};

async function render() {
    const formData = await storage.get();
    const schema = await getSchema();

    ReactDOM.render((
        <Form
            schema={schema}
            formData={formData}
            // onChange={log("changed")}
            onSubmit={submit}
            // onError={log("errors")}
        >
            <footer className="sticky-footer">
                <div className="container ">
                    <button className="btn btn-success">Save and update preview</button>
                    <button className="btn btn-warning pull-right" onClick={() => {window.parent.location = '/'}}>Save and view result</button>
                    {/* <button className="btn btn-warning pull-right" onClick={() => { formData = {}; }}>Clear data</button>
                    <button className="btn btn-warning pull-right" onClick={() => del({})}>Reset to default</button> */}
                </div>
            </footer>
        </Form>
    ), document.getElementById("form"));
}

render();
