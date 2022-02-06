import React, {useState, useCallback} from 'react';
import {StyleSheet, Modal} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import {statusBarHeight} from 'src/components/withSafeArea';
import {topBarHeight} from 'src/screens/VonageBoxScreen/components/TopBar';

const CloseBarWrapper = styled.TouchableOpacity({
  paddingVertical: 16,
  alignItems: 'center',
});

const CloseBar = styled.View({
  width: 96,
  height: 4,
  borderRadius: 4,
  backgroundColor: colors.white,
});

const DismissibleBackground = styled.TouchableOpacity({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
});

const ModalContent = styled.View(({opaque}) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  paddingTop: statusBarHeight + topBarHeight,
  justifyContent: 'flex-end',
  opacity: opaque ? 1 : 0.95,
}));

const PreventOverflow = styled.View(({cardHeight, buttonsHeight}) => ({
  maxHeight: cardHeight - statusBarHeight - topBarHeight - buttonsHeight - 32,
}));

const Buttons = styled.View({
  width: '100%',
});

const styles = StyleSheet.create({
  gradient: ({height}) => ({
    maxHeight: height - statusBarHeight - topBarHeight,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
  }),
});

export default function BottomModal({
  visible,
  onRequestClose,
  children,
  green = false,
  title,
  buttons,
  onLayout,
  opaque = false,
}) {
  const [height, setHeight] = useState(0);
  const [buttonsHeight, setButtonsHeight] = useState(0);

  const handleLayout = useCallback(
    (e) => {
      setHeight(e.nativeEvent.layout.height);
      if (typeof onLayout === 'function') {
        onLayout(e);
      }
    },
    [onLayout],
  );

  const handleButtonsLayout = useCallback((e) => {
    setButtonsHeight(e.nativeEvent.layout.height);
  }, []);

  const handleClose = useCallback(() => {
    if (visible) {
      onRequestClose();
    }
  }, [visible, onRequestClose]);

  const getGradientColors = () => {
    const opacity = opaque ? '' : '99';
    return green
      ? [`#d8ff3f${opacity}`, `#beef00${opacity}`, `#03ccd9${opacity}`]
      : [`#4a2098${opacity}`, `#501f98${opacity}`, `#5f1c96${opacity}`];
  };

  return (
    <Modal transparent statusBarTranslucent animationType="slide" visible={visible} onRequestClose={handleClose}>
      <ModalContent onLayout={handleLayout} opaque={opaque}>
        <DismissibleBackground onPress={handleClose} activeOpacity={1} touchSoundDisabled />
        <LinearGradient
          style={styles.gradient({height})}
          start={{x: 0, y: green ? 1 : 0.3}}
          end={{x: 1, y: 0}}
          colors={getGradientColors()}>
          <CloseBarWrapper onPress={handleClose} activeOpacity={1} touchSoundDisabled>
            <CloseBar />
          </CloseBarWrapper>
          {title}
          {buttons ? (
            <PreventOverflow cardHeight={height} buttonsHeight={buttonsHeight}>
              {children}
            </PreventOverflow>
          ) : (
            children
          )}
          {buttons && <Buttons onLayout={handleButtonsLayout}>{buttons}</Buttons>}
        </LinearGradient>
      </ModalContent>
    </Modal>
  );
}
