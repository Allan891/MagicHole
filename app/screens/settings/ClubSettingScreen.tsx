import { GolfClub } from '@/app/db/GolfDatabaseTypes';
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
} from 'react-native';
import db from '@/app/db/db';
import golfClubs from '@/constants/golfClubs';


const CLUB_CATEGORIES = {
  'Drivers & Woods': golfClubs.filter(a => a.iconType == 'Driver' || a.iconType == 'Wood'),
  Hybrids: golfClubs.filter(a => a.iconType == 'Hybrid'),
  Irons: golfClubs.filter(a => a.iconType == 'Iron'),
  Wedges: golfClubs.filter(a => a.iconType == 'Wedge')
};

export default function ClubSettingScreen() {
  const [activeClubs, setActiveClubs] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const clubs = globalStateVar((state) => state.currentBag);

  const getClubType = (name: string) => {
    if (name === 'Drivers & Woods') return 'Wood';
    if (name === 'Hybrids') return 'Wood';
    if (name === 'Irons') return 'Iron';
    if (name === 'Wedges') return 'Wedge';
    if (name === 'Putter') return 'Putter';
    return '';
  };

  const setCurrentBag = globalStateVar((state) => state.setCurrentBag);

  const toggleClub = (club: string) => {
    const updated = activeClubs.includes(club)
      ? activeClubs.filter((c) => c !== club)
      : [...activeClubs, club];
    setActiveClubs(updated);
  };

  const addClubToBag = (club: GolfClub) => {
    if(clubs.some(a => a.id == club.id)) return;
    club.showInList = 1;
    setCurrentBag([club, ...clubs]);
    db.updateGolfClub(club)
  }

  const removeClubFromBag = async (club: GolfClub) => {
    if (club.id == 99) return
    club.showInList = 0;
    db.updateGolfClub(club)
    const golfBag = await db.getGolfClubsInList()
    setCurrentBag(golfBag)
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Club Settings</Text>
        <ClubPicker onClubChoose={removeClubFromBag} />

      </View>

      {Object.entries(CLUB_CATEGORIES).map(([category, clubList]) => {
        const isExpanded = expandedCategories.includes(category);
        const clubType = getClubType(category);
        return (
          <View key={category} style={styles.section}>
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() => toggleCategory(category)}
            >
              <View style={styles.categoryContent}>
                <ClubCircleButton onPress={() => {}} currentClub={{ iconType: clubType }} />
                <Text style={styles.sectionTitle}>{category}</Text>
              </View>
              <Text style={styles.chevron}>{isExpanded ? '⌄' : '>'}</Text>
            </TouchableOpacity>

            {isExpanded &&
              clubList.map((club) => (
                <View key={club.id} style={styles.clubRow}>
                  <Text style={styles.clubName}>{club.name}</Text>
                  <TouchableOpacity onPress={() => addClubToBag(club)}>
                    <Text style={styles.toggleButton}>
                      Add
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        );
      })}
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
  section: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    fontSize: 18,
    color: '#999',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
  },
  clubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 10,
  },
  clubName: {
    flex: 1,
    fontSize: 16,
  },
  toggleButton: {
    marginRight: 12,
    color: '#007bff',
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
