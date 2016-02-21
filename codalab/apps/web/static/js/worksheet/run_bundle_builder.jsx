DEFAULT_OPTION = 'Select Your Dependency';

var RunBundleBuilder = React.createClass({

  getInitialState: function() {
    return {
      bundleList: [],
      bundleDisplayList: [],
      dependencyKeyList: ['','',''],
      dependencyTargetList: ['','',''],
      command: null,
      name: null,
    };
  },

  componentWillReceiveProps: function() {
    $.ajax({
      url: '/api/worksheets/bundle_list/',
      data: {
        worksheet_uuid: this.props.ws.uuid
      },
      type: 'GET',
      success: function (data, status, jqXHR) {
        bundles = data.bundles;
        bundleList = [];
        bundleDisplayList = [];
        bundles.forEach(function(bundle) {
          bundleList.push(bundle.uuid);
          bundleDisplayList.push(bundle.metadata.name + ' (' + bundle.uuid.substr(0, 8) + ')');
        }.bind(this));
        this.setState({
          bundleList: bundleList,
          bundleDisplayList: bundleDisplayList,
        });
      }.bind(this),
      error: function (jqHXR, status, error) {
        alert(errorString);
      }.bind(this)
    });
  },

  popupBuilder: function() {
    console.log('popup');
    $('#run-bundle-builder-form').css('display', 'block');
  },

  buildRunBundle: function(e) {
    e.preventDefault();
    $('#command_line').terminal().exec(this.createCommand());
    this.setState(this.getInitialState());
  },

  createCommand: function(e) {
    var command = ['cl run'];
    for (var i = 0; i < this.state.dependencyTargetList.length; i++) {
      var key = this.state.dependencyKeyList[i];
      var target = this.state.dependencyTargetList[i];
      if (key != '' && target != '') {
        command.push(key + ':' + target);
      }
    }
    if (this.state.command != null) {
      command.push('\'' + this.state.command + '\'')
    }
    if (this.state.name != null) {
      command.push('-n')
      command.push(this.state.name)
    }
    command = command.join(' ');
    console.log(command);
    return command;
    // cl run sort.py:sort.py input:a.txt 'python sort.py < input > output' -n sort-run
  },

  handleTargetChange: function(index, event) {
    console.log(event.target.value);
    var dependencyTarget = event.target.value;
    var dependencyKey = $('#bundle_dependency_'+index + ' option:selected').text();
    dependencyKey = dependencyKey === DEFAULT_OPTION ? '' : dependencyKey.split(' ')[0];
    var dependencyKeyList = this.state.dependencyKeyList.slice();
    var dependencyTargetList = this.state.dependencyTargetList.slice();
    dependencyKeyList[index] = dependencyKey;
    dependencyTargetList[index] = dependencyTarget;
    this.setState({
      dependencyKeyList: dependencyKeyList,
      dependencyTargetList: dependencyTargetList
    });
  },

  handleKeyChange: function(index, event) {
    var dependencyKey = event.target.value;
    var dependencyKeyList = this.state.dependencyKeyList.slice();
    dependencyKeyList[index] = dependencyKey
    this.setState({dependencyKeyList: dependencyKeyList});
  },

  handleCommandChange: function(event) {
    this.setState({command: event.target.value});
  },

  handleNameChange: function(event) {
    this.setState({name: event.target.value});
  },

  addDependency: function(e) {
    e.preventDefault();
    var dependencyKeyList = this.state.dependencyKeyList.slice();
    var dependencyTargetList = this.state.dependencyTargetList.slice();
    dependencyKeyList.push('');
    dependencyTargetList.push('');
    this.setState({
      dependencyKeyList: dependencyKeyList,
      dependencyTargetList: dependencyTargetList
    });
  },

  render: function () {
    var addDepBtn = (<div>
        <button onClick={this.addDependency}>Add more dependency</button>
      </div>
      )
    var dependencyList = []
    var bundleList = this.state.bundleList.map(function(bundle, i) {
        return <option value={bundle}>{this.state.bundleDisplayList[i]}</option>;
      }.bind(this));
    bundleList.unshift(<option value=''>{DEFAULT_OPTION}</option>)
    for (var i = 0; i < this.state.dependencyTargetList.length; i++){
      var selectboxId = 'bundle_dependency_'+i;
      dependencyList.push(<div>
        <select id={selectboxId} value={this.state.dependencyTargetList[i]} onChange={this.handleTargetChange.bind(this, i)}>{bundleList}</select>
        <input type='text' value={this.state.dependencyKeyList[i]} placeholder='key' onChange={this.handleKeyChange.bind(this, i)}></input>
      </div>)
    } 
    var command = (<div>
        <input type='text' value={this.state.command} placeholder='command' onChange={this.handleCommandChange}></input>
      </div>
      )

    var name = (<div>
        <input type='text' value={this.state.name} placeholder='customized bundle name (optional)' onChange={this.handleNameChange}></input>
      </div>
      )

    return (
      <div>
        <div id="abc">
          <div id="popupContact">
            <form id='run-bundle-builder-form' onSubmit={this.buildRunBundle}>
              <h4>Build Run Bundle</h4>
              <hr></hr>
              {addDepBtn}
              {dependencyList}
              {command}
              {name}
              <button type="submit">Build</button>
            </form>
          </div>
        </div>
        <button id="popup" onClick={this.popupBuilder}>Build Run Bunddle</button>
      </div>
      );
  }
});
