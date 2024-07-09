
import React from 'react';
import { Dropdown, Button } from 'semantic-ui-react';
import "../../css/ConfigBar.css"; // Import your CSS file

class ConfigBar extends React.Component {
  render() {
    const { mode, status, handleOnChange, languages, fontSizes, themes, handleRunClick } = this.props;

    return (
      <div className="config-bar">
        <Dropdown
          className="dropdown"
          placeholder="Select Language"
          selection
          options={languages}
          onChange={(e, data) => handleOnChange(e, data, 'language')}
          defaultValue={this.props.mode}
        />
        <Dropdown
          className="dropdown"
          placeholder="Select Font Size"
          selection
          options={fontSizes}
          onChange={(e, data) => handleOnChange(e, data, 'fontSize')}
          defaultValue={this.props.fontSizes[4].value}
        />
        <Dropdown
          className="dropdown"
          placeholder="Select Theme"
          selection
          options={themes}
          onChange={(e, data) => handleOnChange(e, data, 'theme')}
          defaultValue={this.props.themes[8].value}
        />
        <Button className="button" onClick={handleRunClick}>Run</Button>
      </div>
    );
  }
}

export default ConfigBar;
