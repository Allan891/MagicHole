import { globalStateVar } from '@/app/state/globalStateVar';
import { ClubCircleButton } from '@/components/ClubCircleButton';
import { ClubPicker } from '@/components/ClubPicker';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Circle } from 'react-native-maps';

const CLUB_CATEGORIES = {
  'Drivers & Woods': ['Driver (1 Wood)', '3 Wood', '5 Wood', '7 Wood'],
  Hybrids: ['2 Hybrid', '3 Hybrid', '4 Hybrid', '5 Hybrid'],
  Irons: ['3 Iron', '4 Iron', '5 Iron', '6 Iron', '7 Iron', '8 Iron', '9 Iron'],
  Wedges: ['Pitching Wedge (PW)', 'Gap Wedge (GW)', 'Approach Wedge (AW)', 'Sand Wedge (SW)', 'Lob Wedge (LW)'],
  Putter: ['Putter'],
};

export default function ClubSettingScreen() {
  const [activeClubs, setActiveClubs] = useState([]);
  const [parkedClubs, setParkedClubs] = useState([]);
  const [proPlay, setProPlay] = useState(false);
  const [backupClubs, setBackupClubs] = useState([]);
  const clubs = globalStateVar((state) => state.currentBag);
  const getClubType = (name) => {
    if (name == 'Drivers & Woods') return "wood";
    if (name =='Hybrids') return "wood";
    if (name == 'Irons') return "iron";
    if (name =='Wedges') return "wedge";
    if (name == 'Putter') return "putter";
  }
  

  const toggleClub = (club) => {
    const updated = activeClubs.includes(club)
      ? activeClubs.filter((c) => c !== club)
      : [...activeClubs, club];
    setActiveClubs(updated);
  };

  const togglePark = (club) => {
    const updated = parkedClubs.includes(club)
      ? parkedClubs.filter((c) => c !== club)
      : [...parkedClubs, club];
    setParkedClubs(updated);
  };

  const restoreUserClubs = () => {
    setActiveClubs(backupClubs);
  };

  const handleProPlayToggle = (value) => {
    setProPlay(value);
    if (value) {
      useProPlay();
    } else {
      restoreUserClubs();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Club Settings</Text>
        <ClubPicker onClubChoose={() => {}} />
        

        {activeClubs.length > 0 && (
          <View style={styles.activeClubsContainer}>
            <Text style={styles.subTitle}>Selected Clubs:</Text>
            <View style={styles.selectedList}>
              {activeClubs.map((club) => (
                <View key={club} style={styles.selectedClub}>
                  <Text style={styles.selectedClubText}>{club}</Text>
                  <TouchableOpacity onPress={() => toggleClub(club)}>
                    <Text style={styles.removeButton}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

      
      </View>

      {Object.entries(CLUB_CATEGORIES).map(([category, clubs]) => (
        <View key={category} style={styles.section}>
                <ClubCircleButton onPress={() => {}} currentClub={{type : getClubType(category)}} />
          <Text style={styles.sectionTitle}>{category}</Text>
          {clubs.map((club) => (
            <View key={club} style={styles.clubRow}>
              <Text style={styles.clubName}>{club}</Text>
              <TouchableOpacity onPress={() => toggleClub(club)}>
                <Text style={styles.toggleButton}>
                  {activeClubs.includes(club) ? 'Remove' : 'Add'}
                </Text>
              </TouchableOpacity>
              
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  clubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  clubName: {
    flex: 1,
    fontSize: 16,
  },
  toggleButton: {
    marginRight: 12,
    color: '#007bff',
  },
  parkButton: {
    color: '#999',
  },
  parked: {
    color: 'orange',
    fontWeight: 'bold',
  },
  activeClubsContainer: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  selectedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedClub: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedClubText: {
    marginRight: 6,
    fontSize: 14,
  },
  removeButton: {
    color: '#ff4444',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
