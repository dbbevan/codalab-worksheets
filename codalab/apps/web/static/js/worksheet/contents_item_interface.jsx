
// Display a worksheet item representing the file contents of a bundle.
var ContentsItem = React.createClass({
    mixins: [CheckboxMixin, GoToBundleMixin],
    getInitialState: function(){
        return {};
    },

    handleClick: function(event){
        this.props.setFocus(this.props.focusIndex, 0);
    },

    handleContextMenu: function(event) {
        this.props.setFocus(this.props.focusIndex, 0);
        this.props.handleContextMenu(this.props.item.bundle_info.uuid, 'bundle', event);
    },

    shouldComponentUpdate: function(nextProps, nextState) {
      return worksheetItemPropsChanged(this.props, nextProps);
    },

    render: function() {
        var className = 'type-contents' + (this.props.focused ? ' focused' : '');
        var contents = this.props.item.interpreted.join('');
        return(
            <div className="ws-item" onClick={this.handleClick} onContextMenu={this.handleContextMenu}>
                <div className={className} ref={this.props.item.ref}>
                    <blockquote>
                        <p>{contents}</p>
                    </blockquote>
                </div>
            </div>
        );
    }
});
