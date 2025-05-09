// import { StyleSheet, View, ScrollView, SafeAreaView, Text,TouchableOpacity,Switch,Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { globalStateVar, SETTINGS, settingsList } from '../state/globalStateVar';
import db from '../db/db';
import coursesJson  from "../../constants/courses";
import React, { useState,useEffect } from 'react';
import { useRouter } from 'expo-router';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

interface FormState {
  toggleButton: boolean;
  textValue:string;
  handicap:number;
  location:string;
}

export default function SettingsTab() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    toggleButton: SETTINGS.TEST,
    textValue: SETTINGS.LANGUAGE,
    handicap: SETTINGS.HANDICAP,
    location: SETTINGS.LOCATION,
  });
  const testMode = globalStateVar((state) => state.testMode);
  const setTestMode = globalStateVar((state) => state.setTestMode);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await settingsList();
      //console.log('Settings', settings);
      if (settings && typeof settings === 'object') {
        setForm(prevForm => ({
          ...prevForm,
          ...settings,
        }));
      }
    };
    loadSettings();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <View style={styles.header}>
        <View style={styles.headerAction}>
          <TouchableOpacity onPress={() => {}}>
            <FeatherIcon color="#000" name="arrow-left" size={24} />
          </TouchableOpacity>
        </View>

        <View style={[styles.headerAction, { alignItems: 'flex-end' }]}>
          <TouchableOpacity onPress={async() => {
            for(const [key,value] of Object.entries(form)){
              await db.setSetting(key,value);
            }
          }}>
            <FeatherIcon color="#000" name="save" size={24} />
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
                onValueChange={(value: boolean) => {
                  setTestMode(value); // Update global state
                  setForm(prevForm => ({ ...prevForm, toggleButton: value })); // Optional: keep form in sync
                  SETTINGS.TEST = value;
                }}
                value={testMode}
                style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}/>
            </View>
          </View>
        </View>

        <View style={[styles.section, { paddingTop: 4 }]}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionBody}>
            <TouchableOpacity onPress={() => {}} style={styles.profile}>
              <Image
                alt=""
                source={{ uri: 'https://cdnb.artstation.com/p/assets/covers/images/079/306/785/large/nicolas-amarilla-nicolas-amarilla-sk-wukong-final-crop.jpg?1724555196' }}
                style={styles.profileAvatar} />
              <View style={styles.profileBody}>
                <Text style={styles.profileName}>Wu Kong</Text>
                <Text style={styles.profileHandle}>wu@kong.cn</Text>
              </View>
              <FeatherIcon color="#bcbcbc" name="chevron-right" size={22} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}></View>
        <Text style={styles.sectionTitle}>Text Fields</Text>
        <View style={styles.sectionBody}>
          <View style={[styles.rowWrapper, styles.rowFirst]}>
            <TextInput
              value={form.textValue.toString()}
              onChangeText={(text: string) => {
                setForm({ ...form, textValue: text });
                SETTINGS.LANGUAGE = form.textValue;
              }}
              keyboardType="default"
              placeholder="Enter a text"
              placeholderTextColor="#888888"
              style={{ height: 40, marginTop: 5, borderBottomWidth: 1, borderRadius: 12, paddingLeft: 10, paddingRight: 10, paddingBottom: 0, borderColor: '#ccc', color: '#000', fontSize: 16 }}
            />
          </View>

          <View style={[styles.rowWrapper, styles.rowLast]}>
            <TextInput
              value={form.handicap.toString()}
              onChangeText={(text: string) => {
                let handicap: number = parseInt(text);
                setForm({ ...form, handicap });
                SETTINGS.HANDICAP = handicap;
              }}
              keyboardType="decimal-pad"
              placeholder="Change your handicap here:"
              placeholderTextColor="#888888"
              style={{ height: 40, marginTop: 5, marginBottom: 2, borderBottomWidth: 1, borderRadius: 12, paddingLeft: 10, paddingRight: 10, paddingBottom: 0, borderColor: '#ccc', color: '#00ff00', fontSize: 16 }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst]}>
              <TouchableOpacity
                onPress={() => {
                  router.push({pathname: "../screens/settings/LanguageScreen"});
                }}
                style={styles.row}>
                <Text style={styles.rowLabel}>Language</Text>
                <View style={styles.rowSpacer} />
                <Text style={styles.rowValue}>Chinese</Text>
                <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <TouchableOpacity
                onPress={() => {
                  router.push({pathname: "../screens/settings/LocationScreen"});
                }}
                style={styles.row}>
                <Text style={styles.rowLabel}>Location</Text>
                <View style={styles.rowSpacer} />
                <Text style={styles.rowValue}> {form.location} </Text>
                <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <TouchableOpacity
                onPress={() => {
                  router.push({pathname: "../screens/settings/ClubSettingScreen"});
                }}
                style={styles.row}>
                <Text style={styles.rowLabel}>Clubs</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>
          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst]}>
              <TouchableOpacity onPress={() => {}} style={styles.row}>
                <Text style={styles.rowLabel}>Contact Us</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <TouchableOpacity onPress={() => {}} style={styles.row}>
                <Text style={styles.rowLabel}>Report Bug</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <TouchableOpacity onPress={() => {}} style={styles.row}>
                <Text style={styles.rowLabel}>Rate in App Store</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
              </TouchableOpacity>
            </View>

            <View style={[styles.rowWrapper, styles.rowLast]}>
              <TouchableOpacity onPress={() => {}} style={styles.row}>
                <Text style={styles.rowLabel}>Terms and Privacy</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst, styles.rowLast, { alignItems: 'center' }]}>
              <TouchableOpacity onPress={async () => {
                await AsyncStorage.setItem('hasSeenOnboarding','false');
              }} style={styles.row}>
                <Text style={[styles.rowLabel, styles.rowLabelLogout]}>Log Out</Text>
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
