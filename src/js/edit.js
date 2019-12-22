// import React, { Component } from "react";
// import { render } from "react-dom";

// import Form from "react-jsonschema-form";
const Form = JSONSchemaForm.default;

const storage = new Storage('data-' + THEME_NAME);

const submit = (data) => {
    storage.set(data.formData);
};

ReactDOM.render((
    <Form
        schema={SCHEMA}
        formData={storage.get()}
        // onChange={log("changed")}
        onSubmit={submit}
        // onError={log("errors")}
    />
), document.getElementById("form"));
