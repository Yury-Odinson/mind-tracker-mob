import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Wheel() {

	return (
		<View style={styles.container}>
			<Text>wheel component</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		borderRadius: 8,
		backgroundColor: "#fff"
	}
});
