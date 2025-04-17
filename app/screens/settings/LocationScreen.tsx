import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { countries,hasFlag, } from 'country-flag-icons';
//`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country.code}.svg`


////console.log(countries)
type objectCountry = {
    flag:string;
    name:string;
}

const countryList: objectCountry[] = countries.map(countryCode => ({
    flag: `http://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode}.svg`, // This assumes the country code can be used to get the flag
    name: countryCode,
}));
//console.log("Contries",countryList);

export default function Example() {
  return (
    <SafeAreaView style={{ backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Countries</Text>

        {countryList.map(({ flag,name}, index) => {
            //console.log("link",flag);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                //console.log("link",flag);
                // handle onPress
              }}>
              <View style={styles.card}>
                <Image
                  alt=""
                  resizeMode="cover"
                  style={styles.cardImg}
                  source={{ uri: flag}} /> 
                  {/* TODO: Fix The Flags */}

                <View>
                  <Text style={styles.cardTitle}>{name}</Text>
                </View>

                <View style={styles.cardAction}>
                  <FeatherIcon
                    color="#9ca3af"
                    name="chevron-right"
                    size={22} />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  /** Card */
  card: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardImg: {
    width: 50,
    height: 50,
    borderRadius: 9999,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  cardStats: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardStatsItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  cardStatsItemText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#636a73',
    marginLeft: 2,
  },
  cardAction: {
    marginLeft: 'auto',
  },
});