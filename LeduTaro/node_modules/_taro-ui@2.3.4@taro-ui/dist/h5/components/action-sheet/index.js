import Taro from "@tarojs/taro-h5";
import Nerv from "nervjs";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { View } from '@tarojs/components';
import AtComponent from '../../common/component';
import AtActionSheetBody from './body/index';
import AtActionSheetFooter from './footer/index';
import AtActionSheetHeader from './header/index';
export default class AtActionSheet extends AtComponent {
  constructor(props) {
    super(props);

    const { isOpened } = props;
    this.state = {
      _isOpened: isOpened
    };
  }
  componentWillReceiveProps(nextProps) {
    const { isOpened } = nextProps;
    if (isOpened !== this.state._isOpened) {
      this.setState({
        _isOpened: isOpened
      });
      !isOpened && this.handleClose();
    }
  }
  render() {
    const { title, cancelText, className } = this.props;
    const { _isOpened } = this.state;
    const rootClass = classNames('at-action-sheet', {
      'at-action-sheet--active': _isOpened
    }, className);
    return <View className={rootClass} onTouchMove={this.handleTouchMove}>
        <View onClick={this.close} className="at-action-sheet__overlay" />
        <View className="at-action-sheet__container">
          {title && <AtActionSheetHeader>{title}</AtActionSheetHeader>}
          <AtActionSheetBody>{this.props.children}</AtActionSheetBody>
          {cancelText && <AtActionSheetFooter onClick={this.handleCancel}>
              {cancelText}
            </AtActionSheetFooter>}
        </View>
      </View>;
  }
  handleClose = () => {
    if (typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  };
  handleCancel = () => {
    if (typeof this.props.onCancel === 'function') {
      return this.props.onCancel();
    }
    this.close();
  };
  close = () => {
    this.setState({
      _isOpened: false
    }, this.handleClose);
  };
  handleTouchMove = e => {
    e.stopPropagation();
    e.preventDefault();
  };
}
AtActionSheet.defaultProps = {
  title: '',
  cancelText: '',
  isOpened: false
};
AtActionSheet.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
  onCancel: PropTypes.func,
  isOpened: PropTypes.bool.isRequired,
  cancelText: PropTypes.string
};