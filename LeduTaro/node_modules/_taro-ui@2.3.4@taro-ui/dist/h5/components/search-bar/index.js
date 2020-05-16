import Taro from "@tarojs/taro-h5";
import Nerv from "nervjs";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Input, Text, View } from '@tarojs/components';
import AtComponent from '../../common/component';
export default class AtSearchBar extends AtComponent {
  constructor(props) {
    super(props);

    this.state = {
      isFocus: !!props.focus
    };
  }
  render() {
    const { value, placeholder, maxLength, fixed, disabled, showActionButton, actionName, inputType, // 处理issue#464
      className, customStyle } = this.props;
    const { isFocus } = this.state;
    const fontSize = 14;
    const rootCls = classNames('at-search-bar', {
      'at-search-bar--fixed': fixed
    }, className);
    const placeholderWrapStyle = {};
    const actionStyle = {};
    if (isFocus || !isFocus && value) {
      actionStyle.opacity = 1;
      actionStyle.marginRight = `0`;
      placeholderWrapStyle.flexGrow = 0;
    } else if (!isFocus && !value) {
      placeholderWrapStyle.flexGrow = 1;
      actionStyle.opacity = 0;
      actionStyle.marginRight = `-${(actionName.length + 1) * fontSize + 7 + 10}px`;
    }
    if (showActionButton) {
      actionStyle.opacity = 1;
      actionStyle.marginRight = `0`;
    }
    const clearIconStyle = { display: 'flex' };
    const placeholderStyle = { visibility: 'hidden' };
    if (!value.length) {
      clearIconStyle.display = 'none';
      placeholderStyle.visibility = 'visible';
    }
    return <View className={rootCls} style={customStyle}>
        <View className="at-search-bar__input-cnt">
          <View className="at-search-bar__placeholder-wrap" style={placeholderWrapStyle}>
            <Text className="at-icon at-icon-search"></Text>
            <Text className="at-search-bar__placeholder" style={placeholderStyle}>
              {isFocus ? '' : placeholder}
            </Text>
          </View>
          <Input className="at-search-bar__input" type={inputType} confirmType="search" value={value} focus={isFocus} disabled={disabled} maxLength={maxLength} onInput={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur} onConfirm={this.handleConfirm} />
          <View className="at-search-bar__clear" style={clearIconStyle} onTouchStart={this.handleClear}>
            <Text className="at-icon at-icon-close-circle"></Text>
          </View>
        </View>
        <View className="at-search-bar__action" style={actionStyle} onClick={this.handleActionClick}>
          {actionName}
        </View>
      </View>;
  }
  handleFocus = event => {
    this.setState({
      isFocus: true
    });
    this.props.onFocus && this.props.onFocus(event);
  };
  handleBlur = event => {
    this.setState({
      isFocus: false
    });
    this.props.onBlur && this.props.onBlur(event);
  };
  handleChange = e => {
    this.props.onChange(e.target.value, e);
  };
  handleClear = event => {
    if (this.props.onClear) {
      this.props.onClear(event);
    } else {
      this.props.onChange('', event);
    }
  };
  handleConfirm = event => {
    this.props.onConfirm && this.props.onConfirm(event);
  };
  handleActionClick = event => {
    this.props.onActionClick && this.props.onActionClick(event);
  };
}
AtSearchBar.defaultProps = {
  value: '',
  placeholder: '搜索',
  maxLength: 140,
  fixed: false,
  focus: false,
  disabled: false,
  showActionButton: false,
  actionName: '搜索',
  inputType: 'text',
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
  onConfirm: () => {},
  onActionClick: () => {}
};
AtSearchBar.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  fixed: PropTypes.bool,
  focus: PropTypes.bool,
  disabled: PropTypes.bool,
  showActionButton: PropTypes.bool,
  actionName: PropTypes.string,
  inputType: PropTypes.oneOf(['text', 'number', 'idcard', 'digit']),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onConfirm: PropTypes.func,
  onActionClick: PropTypes.func,
  onClear: PropTypes.func
};