import Taro from "@tarojs/taro-h5";
import Nerv from "nervjs";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ScrollView, Text, View } from '@tarojs/components';
import AtComponent from '../../common/component';
import { handleTouchScroll } from '../../common/utils';
export default class AtFloatLayout extends AtComponent {
  constructor(props) {
    super(props);

    const { isOpened } = props;
    this.state = {
      _isOpened: isOpened
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
    const { _isOpened } = this.state;
    const { title, scrollY, scrollX, scrollTop, scrollLeft, upperThreshold, lowerThreshold, scrollWithAnimation } = this.props;
    const rootClass = classNames('at-float-layout', {
      'at-float-layout--active': _isOpened
    }, this.props.className);
    return <View className={rootClass} onTouchMove={this.handleTouchMove}>
        <View onClick={this.close} className="at-float-layout__overlay" />
        <View className="at-float-layout__container layout">
          {title ? <View className="layout-header">
              <Text className="layout-header__title">{title}</Text>
              <View className="layout-header__btn-close" onClick={this.close} />
            </View> : null}
          <View className="layout-body">
            <ScrollView scrollY={scrollY} scrollX={scrollX} scrollTop={scrollTop} scrollLeft={scrollLeft} upperThreshold={upperThreshold} lowerThreshold={lowerThreshold} scrollWithAnimation={scrollWithAnimation}
          // @ts-ignore // TODO: Fix typings
          onScroll={this.props.onScroll}
          // @ts-ignore // TODO: Fix typings
          onScrollToLower={this.props.onScrollToLower}
          // @ts-ignore // TODO: Fix typings
          onScrollToUpper={this.props.onScrollToUpper} className="layout-body__content">
              {this.props.children}
            </ScrollView>
          </View>
        </View>
      </View>;
  }
  handleClose = () => {
    if (typeof this.props.onClose === 'function') {
      // @ts-ignore // TODO: Fix typings
      this.props.onClose();
    }
  };
  close = () => {
    this.setState({
      _isOpened: false
    }, this.handleClose);
  };
  handleTouchMove = e => {
    e.stopPropagation();
  };
}
AtFloatLayout.defaultProps = {
  title: '',
  isOpened: false,
  scrollY: true,
  scrollX: false,
  scrollWithAnimation: false,
  onClose: () => {},
  onScroll: () => {},
  onScrollToLower: () => {},
  onScrollToUpper: () => {}
};
AtFloatLayout.propTypes = {
  title: PropTypes.string,
  isOpened: PropTypes.bool,
  scrollY: PropTypes.bool,
  scrollX: PropTypes.bool,
  scrollTop: PropTypes.number,
  scrollLeft: PropTypes.number,
  upperThreshold: PropTypes.number,
  lowerThreshold: PropTypes.number,
  scrollWithAnimation: PropTypes.bool,
  onClose: PropTypes.func,
  onScroll: PropTypes.func,
  onScrollToLower: PropTypes.func,
  onScrollToUpper: PropTypes.func
};