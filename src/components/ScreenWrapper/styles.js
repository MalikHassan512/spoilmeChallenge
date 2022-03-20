import { StyleSheet } from 'react-native';
import { height } from 'react-native-dimension'
import AppColors from '../../util/colors';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white
  },
  scroll: {
    flex: 1,
    paddingBottom: height(1.5),
  }
});
export default styles;
