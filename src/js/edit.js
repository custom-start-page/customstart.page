// import React, { Component } from "react";
// import { render } from "react-dom";

// import Form from "react-jsonschema-form";
const Form = JSONSchemaForm.default;

const storage = new CustomStartStorage();

async function getSchema() {
    return await fetch('/manifest/schema.json')
        .then(res => res.json())
        .then(out => {
            return out;
        })
        .catch(err => { throw err });
}

const del = () => {
    storage.delete();

    window.parent.reloadPreview();
};

const isPreview = () => {
    return typeof window.parent.reloadPreview !== 'undefined';
}

const saveAndUpdatePreview = () => {
    window.parent.reloadPreview();
};

async function render() {
    const originalFormData = await storage.get();
    const schema = await getSchema();

    const submit = (data) => {
        storage.set(data.formData);

        if (isPreview())
            saveAndUpdatePreview();
    };

    ReactDOM.render((
        <Form
            schema={schema}
            formData={originalFormData}
            // onChange={log("changed")}
            onSubmit={submit}
            // onError={log("errors")}
        >
            <footer className="sticky-footer">
                <div className="container ">
                    <div class="pull-right">
                        <button className="btn btn-primary">Save{ isPreview() ? " and update preview" : "" }</button>
                        &nbsp;
                        <a href="/" target="_blank" class="btn btn-warning">View start page</a>
                    </div>
                    {/* <button className="btn btn-warning pull-right" onClick={() => { formData = {}; }}>Clear data</button>
                    <button className="btn btn-warning pull-right" onClick={() => del({})}>Reset to default</button> */}
                </div>
            </footer>
        </Form>
    ), document.getElementById("form"));
}

render();
