import Nerv from "nervjs";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Button, Text, View } from '@tarojs/components';
import Taro from "@tarojs/taro-h5";
import AtComponent from '../../common/component';
import { handleTouchScroll } from '../../common/utils';
import AtModalAction from './action/index';
import AtModalContent from './content/index';
import AtModalHeader from './header/index';
export default class AtModal extends AtComponent {
  constructor(props) {
    super(props);

    const { isOpened } = props;
    this.state = {
      _isOpened: isOpened,
      isWEB: Taro.getEnv() === Taro.ENV_TYPE.WEB
    };
  }
  componentWillReceiveProps(nextProps) {
    const { isOpened } = nextProps;
    if (this.props.isOpened !== isOpened) {
      handleTouchScroll(isOpened);
    }
    if (isOpened !== this.state._isOpened) {
      this.setState({
        _isOpened: isOpened
      });
    }
  }
  render() {
    const { _isOpened, isWEB } = this.state;
    const { title, content, cancelText, confirmText } = this.props;
    const rootClass = classNames('at-modal', {
      'at-modal--active': _isOpened
    }, this.props.className);
    if (title || content) {
      const isRenderAction = cancelText || confirmText;
      return <View className={rootClass}>
          <View onClick={this.handleClickOverlay} className="at-modal__overlay" />
          <View className="at-modal__container">
            {title && <AtModalHeader>
                <Text>{title}</Text>
              </AtModalHeader>}
            {content && <AtModalContent>
                <View className="content-simple">
                  {isWEB ? <Text
              // @ts-ignore
              dangerouslySetInnerHTML={{
                __html: content.replace(/\n/g, '<br/>')
              }}></Text> : <Text>{content}</Text>}
                </View>
              </AtModalContent>}
            {isRenderAction && <AtModalAction isSimple>
                {cancelText && <Button onClick={this.handleCancel}>{cancelText}</Button>}
                {confirmText && <Button onClick={this.handleConfirm}>{confirmText}</Button>}
              </AtModalAction>}
          </View>
        </View>;
    }
    return <View onTouchMove={this.handleTouchMove} className={rootClass}>
        <View className="at-modal__overlay" onClick={this.handleClickOverlay} />
        <View className="at-modal__container">{this.props.children}</View>
      </View>;
  }
  handleClickOverlay = () => {
    if (this.props.closeOnClickOverlay) {
      this.setState({
        _isOpened: false
      }, this.handleClose);
    }
  };
  handleClose = event => {
    if (typeof this.props.onClose === 'function') {
      this.props.onClose(event);
    }
  };
  handleCancel = event => {
    if (typeof this.props.onCancel === 'function') {
      this.props.onCancel(event);
    }
  };
  handleConfirm = event => {
    if (typeof this.props.onConfirm === 'function') {
      this.props.onConfirm(event);
    }
  };
  handleTouchMove = e => {
    e.stopPropagation();
  };
}
AtModal.defaultProps = {
  isOpened: false,
  closeOnClickOverlay: true
};
AtModal.propTypes = {
  title: PropTypes.string,
  isOpened: PropTypes.bool,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  content: PropTypes.string,
  closeOnClickOverlay: PropTypes.bool,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string
};