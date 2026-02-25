import { StyleSheet, Text, View } from 'react-native';

export default function HistoryScreen() {

	return (
		<View style={styles.container}>
			<Text>История</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		gap: 16
	},
});
