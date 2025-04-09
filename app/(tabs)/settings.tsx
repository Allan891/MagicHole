// import { StyleSheet, View, ScrollView, SafeAreaView, Text,TouchableOpacity,Switch,Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { globalStateVar,MODE, someNumericValue,someTextValue } from '../state/globalStateVar';
import db from '../db/db';
import coursesJson  from "../../constants/courses";
import React, { useState } from 'react';
import DropdownMenu, { MenuOption } from '../../components/DropdownMenu'; // Adjust the import path based on your project structure

import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  TextInput,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
// Define the type for the state
interface FormState {
  emailNotifications: boolean;
  pushNotifications: boolean;
  test: boolean;
  numericValue:string;
  textValue:string;
}

export default function Example() {
  const data = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
  ];
  // Set the state type to FormState
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [form, setForm] = useState<FormState>({
    
    emailNotifications: true,
    pushNotifications: false,
    test: MODE.test,
    numericValue: someNumericValue.value,
    textValue:'',
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <View style={styles.header}>
        <View style={styles.headerAction}>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}>
            <FeatherIcon
              color="#000"
              name="arrow-left"
              size={24} />
          </TouchableOpacity>
        </View>

        <Text numberOfLines={1} style={styles.headerTitle}>
          Settings
        </Text>

        <View style={[styles.headerAction, { alignItems: 'flex-end' }]}>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}>
            <FeatherIcon
              color="#000"
              name="more-vertical"
              size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}></View>
          <Text style={styles.sectionTitle}>Test Mode</Text>

          <View style={styles.sectionBody}>
          <View style={styles.rowWrapper}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Test</Text>

                <View style={styles.rowSpacer} />

                <Switch
                  onValueChange={(test: boolean) =>{
                    setForm({ ...form, test });
                    MODE.test = test;
                    if(MODE.test){
                      console.log('Form', test);
                      console.log('Global', MODE.test);
                    }
                  }}
                  style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                  value={form.test} />
              </View>
            </View>
          </View>  
        

        <View style={[styles.section, { paddingTop: 4 }]}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.sectionBody}>
            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
              style={styles.profile}>
              <Image
                alt=""
                source={{
                  uri: 'https://cdnb.artstation.com/p/assets/covers/images/079/306/785/large/nicolas-amarilla-nicolas-amarilla-sk-wukong-final-crop.jpg?1724555196',
                }}
                style={styles.profileAvatar} />

              <View style={styles.profileBody}>
                <Text style={styles.profileName}>Wu Kong</Text>

                <Text style={styles.profileHandle}>wu@kong.cn</Text>
              </View>

              <FeatherIcon
                color="#bcbcbc"
                name="chevron-right"
                size={22} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Dropdown */}
        <View style={styles.section}></View>
          <Text style={styles.sectionTitle}>Dropdown Menu</Text>
          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst, styles.rowLast]}>
      <DropdownMenu
        visible={visible}
        handleOpen={() => setVisible(true)}
        handleClose={() => setVisible(false)}
        trigger={
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Dropdown me!</Text>
          </View>
        }>
        <MenuOption onSelect={() => {setVisible(false);}}>
          <Text>View Details</Text>
        </MenuOption>
        <MenuOption onSelect={() => {setVisible(false);}}>
          <Text>Delete</Text>
        </MenuOption>
      </DropdownMenu>
    </View>
    </View>

        {/* Text Fields */}
        <View style={styles.section}></View>
          <Text style={styles.sectionTitle}>Text Fields</Text>
          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst]}>

                <TextInput
                  value={form.textValue.toString()}
                  onChangeText={(text: string) => {
                    setForm({ ...form, textValue: text });
                    someTextValue.value = form.textValue; 
                    if (MODE.test) {
                      console.log('Form', form.textValue);
                      console.log('Global', someTextValue.value);
                    }}}
                  keyboardType="default" // This will bring up the numeric keyboard on mobile
                  placeholder="Enter a text"
                  placeholderTextColor="#888888"
                  style={{
                    height: 40,
                    marginTop: 5,
                    marginBottom: 10,
                    borderBottomWidth: 1,
                    borderRadius: 12,
                    paddingLeft: 10,                    
                    paddingRight: 10,           
                    paddingBottom: 0,                     
                    borderColor: '#ccc',
                    color: '#000',
                    fontSize: 16,}}/>
              </View>

              <View style={[styles.rowWrapper, styles.rowLast]}>
                
                <TextInput
                  value={form.numericValue.toString()}
                  onChangeText={(text: string) => {
                    const numericValue = text || '';
                    setForm({ ...form, numericValue });
                    someNumericValue.value = numericValue; 
                    if (MODE.test) {
                      console.log('Form', form.numericValue);
                      console.log('Global', someNumericValue.value);
                    }}}
                  keyboardType="decimal-pad" // This will bring up the numeric keyboard on mobile
                  placeholder="Enter a number"
                  placeholderTextColor="#888888"
                  style={{
                    height: 40,
                    marginTop: 5,
                    marginBottom: 10,
                    borderBottomWidth: 1,
                    borderRadius: 12,
                    paddingLeft: 10,                    
                    paddingRight: 10,           
                    paddingBottom: 0,         
                    borderColor: '#ccc',
                    color: '#00ff00',
                    fontSize: 16,}}/>
              </View>

            </View> 
        {/* Text Fields */}


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst]}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}>
                <Text style={styles.rowLabel}>Language</Text>

                <View style={styles.rowSpacer} />

                <Text style={styles.rowValue}>Chinese</Text>

                <FeatherIcon
                  color="#bcbcbc"
                  name="chevron-right"
                  size={19} />
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}>
                <Text style={styles.rowLabel}>Location</Text>

                <View style={styles.rowSpacer} />

                <Text style={styles.rowValue}>Hong Kong</Text>

                <FeatherIcon
                  color="#bcbcbc"
                  name="chevron-right"
                  size={19} />
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Email Notifications</Text>

                <View style={styles.rowSpacer} />

                <Switch
                  onValueChange={(emailNotifications: boolean) =>
                    setForm({ ...form, emailNotifications })
                  }
                  style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                  value={form.emailNotifications} />
              </View>
            </View>

            <View style={[styles.rowWrapper, styles.rowLast]}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Push Notifications</Text>

                <View style={styles.rowSpacer} />

                <Switch
                  onValueChange={(pushNotifications: boolean) =>
                    setForm({ ...form, pushNotifications })
                  }
                  style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                  value={form.pushNotifications} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>

          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst]}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}>
                <Text style={styles.rowLabel}>Contact Us</Text>

                <View style={styles.rowSpacer} />

                <FeatherIcon
                  color="#bcbcbc"
                  name="chevron-right"
                  size={19} />
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}>
                <Text style={styles.rowLabel}>Report Bug</Text>

                <View style={styles.rowSpacer} />

                <FeatherIcon
                  color="#bcbcbc"
                  name="chevron-right"
                  size={19} />
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}>
                <Text style={styles.rowLabel}>Rate in App Store</Text>

                <View style={styles.rowSpacer} />

                <FeatherIcon
                  color="#bcbcbc"
                  name="chevron-right"
                  size={19} />
              </TouchableOpacity>
            </View>

            <View style={[styles.rowWrapper, styles.rowLast]}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}>
                <Text style={styles.rowLabel}>Terms and Privacy</Text>

                <View style={styles.rowSpacer} />

                <FeatherIcon
                  color="#bcbcbc"
                  name="chevron-right"
                  size={19} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionBody}>
            <View
              style={[
                styles.rowWrapper,
                styles.rowFirst,
                styles.rowLast,
                { alignItems: 'center' },
              ]}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}>
                <Text style={[styles.rowLabel, styles.rowLabelLogout]}>
                  Log Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={styles.contentFooter}>App Version 2.24 #50491</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  /* Dropdown */
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },

  /** Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#000',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    textAlign: 'center',
  },
  /** Content */
  content: {
    paddingHorizontal: 16,
  },
  contentFooter: {
    marginTop: 24,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    color: '#a69f9f',
  },
  /** Section */
  section: {
    paddingVertical: 12,
  },
  sectionTitle: {
    margin: 8,
    marginLeft: 12,
    fontSize: 13,
    letterSpacing: 0.33,
    fontWeight: '500',
    color: '#a69f9f',
    textTransform: 'uppercase',
  },
  sectionBody: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  /** Profile */
  profile: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
    marginRight: 12,
  },
  profileBody: {
    marginRight: 'auto',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292929',
  },
  profileHandle: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: '400',
    color: '#858585',
  },
  /** Row */
  row: {
    height: 44,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 12,
  },
  rowWrapper: {
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
  },
  rowFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rowLabel: {
    fontSize: 16,
    letterSpacing: 0.24,
    color: '#000',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 2,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ababab',
    marginRight: 4,
  },
  rowLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  rowLabelLogout: {
    width: '100%',
    textAlign: 'center',
    fontWeight: '600',
    color: '#dc2626',
  },
});