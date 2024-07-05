import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GradientText = ({ text, colors, style } : any) => {
    return (
        <LinearGradient colors={colors} start={[0, 0]} end={[1, 0]} style={styles.linearGradient}>
            <Text style={[styles.text, style]}>{text}</Text>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    linearGradient: {
        borderRadius: 10,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
    },
});

export default GradientText;
