import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactNative, {
    NativeModules,
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    TextInput,
    ViewPropTypes,
} from "react-native";

import CreditCard from "./CardView";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

const s = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    form: {
        marginTop: 20,
        width: '100%',
        padding: 20
    },
    inputContainer: {
        marginBottom: 30
    },
    inputLabel: {
    },
    input: {
    },
});

const CVC_INPUT_WIDTH = 100;
const EXPIRY_INPUT_WIDTH = CVC_INPUT_WIDTH;
const CARD_NUMBER_INPUT_WIDTH = 250;
const NAME_INPUT_WIDTH = CARD_NUMBER_INPUT_WIDTH;
const POSTAL_CODE_INPUT_WIDTH = 120;

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class CreditCardInput extends Component {
    static propTypes = {
        ...InjectedProps,
        labels: PropTypes.object,
        placeholders: PropTypes.object,

        labelStyle: Text.propTypes.style,
        inputStyle: Text.propTypes.style,
        inputContainerStyle: ViewPropTypes.style,

        validColor: PropTypes.string,
        invalidColor: PropTypes.string,
        placeholderColor: PropTypes.string,

        cardImageFront: PropTypes.number,
        cardImageBack: PropTypes.number,
        cardScale: PropTypes.number,
        cardFontFamily: PropTypes.string,
        cardBrandIcons: PropTypes.object,

        allowScroll: PropTypes.bool,

        additionalInputsProps: PropTypes.objectOf(PropTypes.shape(TextInput.propTypes)),
    };

    static defaultProps = {
        cardViewSize: {},
        labels: {
            name: "CARDHOLDER'S NAME",
            number: "CARD NUMBER",
            expiry: "EXPIRY",
            cvc: "CVC/CCV",
            postalCode: "POSTAL CODE",
        },
        placeholders: {
            name: "",
            number: "1234 5678 1234 5678",
            expiry: "MM/YY",
            cvc: "CVC",
            postalCode: "34567",
        },
        inputContainerStyle: {
            borderBottomWidth: 1,
            borderBottomColor: "black",
        },
        validColor: "",
        invalidColor: "red",
        placeholderColor: "gray",
        allowScroll: false,
        additionalInputsProps: {},
    };

    _inputProps = field => {
        const {
            inputStyle, labelStyle, validColor, invalidColor, placeholderColor,
            placeholders, labels, values, status,
            onFocus, onChange, onBecomeEmpty, onBecomeValid,
            additionalInputsProps,
        } = this.props;

        return {
            inputStyle: [s.input, inputStyle],
            labelStyle: [s.inputLabel, labelStyle],
            validColor, invalidColor, placeholderColor,
            ref: field, field,

            label: labels[field],
            placeholder: placeholders[field],
            value: values[field],
            status: status[field],

            onFocus, onChange, onBecomeEmpty, onBecomeValid,

            additionalInputProps: additionalInputsProps[field],
        };
    };

    render() {
        const {
            cardImageFront, cardImageBack, inputContainerStyle,
            values: { number, expiry, cvc, name, type }, focused,
            allowScroll, requiresName, requiresCVC, requiresPostalCode,
            cardScale, cardFontFamily, cardBrandIcons,
        } = this.props;

        return (
            <View style={s.container}>
                <CreditCard
                    focused={focused}
                    brand={type}
                    scale={cardScale}
                    fontFamily={cardFontFamily}
                    imageFront={cardImageFront}
                    imageBack={cardImageBack}
                    customIcons={cardBrandIcons}
                    name={requiresName ? name : " "}
                    number={number}
                    expiry={expiry}
                    cvc={cvc} />

                <ScrollView ref="Form"
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={false}
                    style={s.form}>
                    {requiresName &&
                        <CCInput {...this._inputProps("name")}
                            containerStyle={[s.inputContainer, inputContainerStyle, {}]} />}
                    <CCInput {...this._inputProps("number")}
                        keyboardType="numeric"
                        containerStyle={[s.inputContainer, inputContainerStyle, {}]} />
                    <View style={{ flexDirection: 'row' }}>
                        <CCInput {...this._inputProps("expiry")}
                            keyboardType="numeric"
                            containerStyle={[s.inputContainer, inputContainerStyle, { width: EXPIRY_INPUT_WIDTH, marginRight: 20 }]} />

                        {requiresCVC &&
                            <CCInput {...this._inputProps("cvc")}
                                keyboardType="numeric"
                                containerStyle={[s.inputContainer, inputContainerStyle, { width: CVC_INPUT_WIDTH }]} />}
                    </View>
                    {requiresPostalCode &&
                        <CCInput {...this._inputProps("postalCode")}
                            keyboardType="numeric"
                            containerStyle={[s.inputContainer, inputContainerStyle, { width: POSTAL_CODE_INPUT_WIDTH }]} />}
                </ScrollView>
            </View>
        );
    }
}
