// import 'react-tabs/style/react-tabs.css';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
const { Tabs, TabList, Tab, TabPanel } = ReactTabs;

window.reloadPreview = function() {
    document.querySelector('#iframe-preview')
        .contentWindow.location.reload(true);
};

ReactDOM.render((
    <Tabs forceRenderTabPanel="true">
        <TabList>
            <Tab>Preview</Tab>
            <Tab>Edit</Tab>
        </TabList>
        <div className="tab-panel-container">
            <TabPanel>
                <iframe id="iframe-preview" className="embed-responsive-item" src="/"></iframe>
            </TabPanel>
            <TabPanel>
                <iframe className="edit-container" src="/edit?hideFooter=true"></iframe>
            </TabPanel>
        </div>
    </Tabs>
), document.querySelector("#preview"));
