import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const PasswordSchema = yup.object().shape({
  passwordLength: yup
    .number()
    .min(4, 'Should be min of 4 characters')
    .max(16, 'Should be max of 16 characters')
    .required('Length is required'),
});

export default function App() {
  const [password, setPassword] = useState('');
  const [isPasswordGenerated, setIsPasswordGenerated] = useState(false);
  const [lowerCase, setLowerCase] = useState(true);
  const [upperCase, setUpperCase] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [symbols, setSymbols] = useState(false);

  const generatedPasswordString = passwordLength => {
    let characterList = '';

    const upperCaseChars = 'ABCDEFGHIJKLMOPQRSTUVWXYZ';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const digitChars = '123456789';
    const specialChars = '!@#%^&*()_+';

    if (upperCase) characterList += upperCaseChars;
    if (lowerCase) characterList += lowerCaseChars;
    if (numbers) characterList += digitChars;
    if (symbols) characterList += specialChars;

    if (characterList === '') {
      setPassword('Select at least one option');
      setIsPasswordGenerated(true);
      return;
    }

    const passwordResult = createPassword(characterList, passwordLength);
    setPassword(passwordResult);
    setIsPasswordGenerated(true);
  };

  const createPassword = (characters, passwordLength) => {
    let result = '';
    for (let i = 0; i < passwordLength; i++) {
      const characterIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(characterIndex);
    }
    return result;
  };

  const resetPassword = () => {
    setPassword('');
    setIsPasswordGenerated(false);
    setLowerCase(true);
    setUpperCase(false);
    setNumbers(false);
    setSymbols(false);
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <SafeAreaView>
        <View>
          <Text style={styles.title}>Password Generator</Text>

          <Formik
            initialValues={{passwordLength: ''}}
            validationSchema={PasswordSchema}
            onSubmit={values => {
              generatedPasswordString(Number(values.passwordLength));
            }}>
            {({
              values,
              errors,
              touched,
              isValid,
              handleChange,
              handleSubmit,
              handleReset,
            }) => (
              <>
                <View>
                  <View style={styles.row}>
                    <Text>Password Length</Text>
                    <TextInput
                      style={styles.box}
                      value={values.passwordLength}
                      onChangeText={handleChange('passwordLength')}
                      placeholder="Give Length"
                      keyboardType="numeric"
                    />
                  </View>
                  {touched.passwordLength && errors.passwordLength && (
                    <Text style={styles.error}>{errors.passwordLength}</Text>
                  )}

                  <View style={styles.row}>
                    <Text>Include Lowercase Letters</Text>
                    <BouncyCheckbox
                      isChecked={lowerCase}
                      onPress={() => setLowerCase(!lowerCase)}
                    />
                  </View>

                  <View style={styles.row}>
                    <Text>Include Uppercase Letters</Text>
                    <BouncyCheckbox
                      isChecked={upperCase}
                      onPress={() => setUpperCase(!upperCase)}
                    />
                  </View>

                  <View style={styles.row}>
                    <Text>Include Numbers</Text>
                    <BouncyCheckbox
                      isChecked={numbers}
                      onPress={() => setNumbers(!numbers)}
                    />
                  </View>

                  <View style={styles.row}>
                    <Text>Include Symbols</Text>
                    <BouncyCheckbox
                      isChecked={symbols}
                      onPress={() => setSymbols(!symbols)}
                    />
                  </View>

                  <View style={styles.bw}>
                    <TouchableOpacity
                      disabled={!isValid}
                      onPress={() => handleSubmit()}>
                      <Text style={styles.btn}>Generate</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        handleReset();
                        resetPassword();
                      }}>
                      <Text style={styles.btn}>Reset</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </Formik>
        </View>

        {isPasswordGenerated ? (
          <View style={[styles.card, styles.cardElevated]}>
            <Text style={styles.subTitle}>Result:</Text>
            <Text style={styles.description}>Long Press to copy</Text>
            <Text selectable style={styles.generatedPassword}>
              {password}
            </Text>
          </View>
        ) : null}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 30,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  box: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#000000',
    padding: 8,
  },
  btn: {
    width: 100,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#000000',
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 30,
  },
  bw: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-evenly',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginLeft: 10,
  },
  subTitle: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    color: '#758283',
    marginBottom: 8,
  },
  card: {
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 12,
  },
  cardElevated: {
    backgroundColor: '#ffffff',
    elevation: 1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: '#333',
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  generatedPassword: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 12,
    color: '#000',
  },
});
