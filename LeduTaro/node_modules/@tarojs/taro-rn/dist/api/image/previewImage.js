import React from 'react';
import { Modal, View, ActivityIndicator, StyleSheet } from 'react-native';
import RootSiblings from 'react-native-root-siblings';
import ImageViewer from 'react-native-image-zoom-viewer';
const styles = StyleSheet.create({
    loadingWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
function previewImage(obj) {
    let { current, urls, success, fail, complete } = obj || {};
    let index = urls.indexOf(current);
    let sibling;
    try {
        sibling = new RootSiblings(React.createElement(Modal, { visible: true, transparent: true },
            React.createElement(ImageViewer, { imageUrls: urls.map((item) => {
                    return {
                        url: item,
                        props: ''
                    };
                }), index: index === -1 ? 0 : index, onClick: onSuccess, onSwipeDown: onSuccess, enableSwipeDown: true, loadingRender: () => {
                    return (React.createElement(View, { style: [styles.loadingWrapper] },
                        React.createElement(ActivityIndicator, { size: "large", color: '#999' })));
                } })));
    }
    catch (e) {
        onFail(e);
    }
    function onSwipeDown() {
        sibling && sibling.destroy();
        sibling = undefined;
    }
    function onSuccess() {
        const rsp = { errMsg: 'previewImage:ok' };
        onSwipeDown();
        success && success(rsp);
        complete && complete(rsp);
    }
    function onFail(e) {
        onSwipeDown();
        fail && fail(Object.assign({ errMsg: 'err' }, e));
        complete && complete('err', ...e);
    }
}
export { previewImage };
