import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TextInput} from 'react-native'
import {
    View, 
    StyleSheet
} from 'react-native';
import {
    TextField
} from 'react-native-material-textfield';

export default class PasswordInputText extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            icEye: 'visibility-off',
            password: true
        }
    }

    changePwdType = () => {
        let newState;
        if (this.state.password) {
            newState = {
                icEye: 'visibility',
                password: false
            }
        } else {
            newState = {
                icEye: 'visibility-off',
                password: true
            }
        }

        // set new state value
        this.setState(newState)

    };
    
    render() {
        return (
            <View>
                <TextInput {...this.props} placeholder="Password" placeholderTextColor="#757575" underlineColorAndroid={'#FC3838'} secureTextEntry={this.state.password} maxLength={25} autoCapitalize={'none'} autoCorrect={false}>
                </TextInput>
                <Icon style={styles.icon}
                      name={this.state.icEye}
                      size={this.props.iconSize}
                      color={'#FC3838'}
                      onPress={this.changePwdType}
                />
            </View>
        );
    }
}


export const styles = StyleSheet.create({

    icon: {
        position: 'absolute',
        top: 3,
        right: 0
    }

});

PasswordInputText.defaultProps = {
iconSize:25,
}
    
