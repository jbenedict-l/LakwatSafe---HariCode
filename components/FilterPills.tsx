import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface HazardType {
  emoji: string;
  color: string;
  name: string;
}

interface HazardTypes {
  [key: string]: HazardType;
}

interface FilterPillsProps {
  filters: { [key: string]: boolean };
  hazardTypes: HazardTypes;
  onFilterChange: (filters: { [key: string]: boolean }) => void;
}

const FilterPills: React.FC<FilterPillsProps> = ({ filters, hazardTypes, onFilterChange }) => {
  const toggleFilter = (key: string) => {
    onFilterChange({
      ...filters,
      [key]: !filters[key],
    });
  };

  return (
    <View style={styles.container}>
      {Object.entries(hazardTypes).map(([key, type]) => (
        <TouchableOpacity
          key={key}
          style={[
            styles.pill,
            {
              backgroundColor: filters[key] ? type.color : '#ecf0f1',
            },
          ]}
          onPress={() => toggleFilter(key)}
        >
          <Text style={styles.pillText}>{type.emoji} {type.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  pillText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
  },
});

export default FilterPills;
