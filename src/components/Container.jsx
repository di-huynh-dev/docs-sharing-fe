import { View, Text } from "react-native";
import React from "react";

const Container = ({ children, styles }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgColor }}>
      <View style={[globalStyles.container, {}, styles]}>{children}</View>
    </SafeAreaView>
  );
};

export default Container;
