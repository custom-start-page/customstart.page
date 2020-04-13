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

async function render() {
    const originalFormData = await storage.get();
    const schema = await getSchema();
    let formData = null;
    let formAction = function() { console.error('No action set.'); };

    const previewButton = isPreview()
        ?  <button className="btn btn-success" onClick={() => { formAction = saveAndUpdatePreview; }}>Save and update preview</button>
        : '';

    const submit = (data) => {
        formData = data.formData;

        storage.set(formData);

        console.log(formData);

        alert('Saved!');

        formAction();
    };

    const saveAndUpdatePreview = () => {
        window.parent.reloadPreview();
    };

    const save = () => {

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
                    {previewButton}
                    <div class="pull-right">
                        <button className="btn btn-primary" onClick={() => { formAction = save; }}>Save</button>
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
