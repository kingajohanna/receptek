import {AppRegistry} from 'react-native';
import Share from './src/components/ShareModal';
import {Recipes} from './src/screens/Recipes';

AppRegistry.registerComponent('Test', () => Recipes);
AppRegistry.registerComponent('ShareMenuModuleComponent', () => Share);
