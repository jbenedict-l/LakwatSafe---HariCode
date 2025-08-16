import * as Location from 'expo-location';
import { collection, onSnapshot, DocumentData, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import { db } from '../../firebaseConfig';
import FilterPills from '../../components/FilterPills';

const { width, height } = Dimensions.get('window');

// Type definitions
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface HazardType {
  emoji: string;
  color: string;
  name: string;
}

interface HazardTypes {
  flood: HazardType;
  blocked: HazardType;
  wellLit: HazardType;
  wheelchair: HazardType;
}

interface Hazard {
  id: string;
  type: keyof HazardTypes;
  coords: Coordinates;
  description?: string;
  photoUrl?: string;
  timestamp?: Timestamp | Date;
}

interface ActiveFilters {
  flood: boolean;
  blocked: boolean;
  wellLit: boolean;
  wheelchair: boolean;
}

const MapScreen: React.FC = () => {
  const [region, setRegion] = useState<Region>({
    latitude: 14.5995, // Manila default
    longitude: 120.9842,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [selectedHazard, setSelectedHazard] = useState<Hazard | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    flood: true,
    blocked: true,
    wellLit: true,
    wheelchair: true,
  });
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  const hazardTypes: HazardTypes = {
    flood: { emoji: '🌊', color: '#3498db', name: 'Flood' },
    blocked: { emoji: '🚧', color: '#e74c3c', name: 'Blocked Path' },
    wellLit: { emoji: '☀️', color: '#f39c12', name: 'Well-Lit' },
    wheelchair: { emoji: '♿', color: '#27ae60', name: 'Wheelchair-Friendly' },
  };

  useEffect(() => {
    getUserLocation();
    const unsubscribe = subscribeToHazards();
    return unsubscribe;
  }, []);

  const getUserLocation = async (): Promise<void> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to show your location');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const userCoords: Coordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setUserLocation(userCoords);
      setRegion({
        ...userCoords,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const subscribeToHazards = (): (() => void) => {
    const unsubscribe = onSnapshot(
      collection(db, 'hazards'),
      (snapshot) => {
        const hazardsData: Hazard[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as Omit<Hazard, 'id'>
        }));
        setHazards(hazardsData);
      },
      (error) => {
        console.error('Error fetching hazards:', error);
        Alert.alert('Error', 'Failed to load hazard data');
      }
    );

    return unsubscribe;
  };

  const filteredHazards: Hazard[] = hazards.filter(hazard => activeFilters[hazard.type]);

  const formatTimestamp = (timestamp?: Timestamp | Date): string => {
    if (!timestamp) return 'Unknown time';
    
    const date = timestamp instanceof Date 
      ? timestamp 
      : (timestamp as Timestamp).toDate();
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 60) {
      return `${diffMins} mins ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} days ago`;
    }
  };

  const centerOnUser = (): void => {
    if (userLocation) {
      setRegion({
        ...userLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } else {
      getUserLocation();
    }
  };

  const handleRegionChange = (newRegion: Region): void => {
    setRegion(newRegion);
  };

  const handleMarkerPress = (hazard: Hazard): void => {
    setSelectedHazard(hazard);
  };

  const handleFilterChange = (filters: ActiveFilters): void => {
    setActiveFilters(filters);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={handleRegionChange}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
      >
        {/* User Location Marker */}
        {userLocation && (
          <Marker coordinate={userLocation}>
            <View style={styles.userLocationMarker}>
              <Icon name="person" size={12} color="#fff" />
            </View>
          </Marker>
        )}

        {/* Hazard Markers */}
        {filteredHazards.map((hazard) => (
          <Marker
            key={hazard.id}
            coordinate={hazard.coords}
            onPress={() => handleMarkerPress(hazard)}
          >
            <View style={[styles.markerContainer, { backgroundColor: hazardTypes[hazard.type]?.color }]}>
              <Text style={styles.markerEmoji}>{hazardTypes[hazard.type]?.emoji}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Icon name="location" size={20} color="#4A90E2" />
          <Text style={styles.appTitle}>LakwatSafe</Text>
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Icon name="options" size={20} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      {/* My Location Button */}
      <TouchableOpacity style={styles.myLocationButton} onPress={centerOnUser}>
        <Icon name="locate" size={24} color="#4A90E2" />
      </TouchableOpacity>

      {/* Active Filters Display */}
      <View style={styles.activeFilters}>
        {Object.entries(activeFilters)
          .filter(([_, value]) => value)
          .map(([key]) => (
            <View key={key} style={[styles.filterPill, { backgroundColor: hazardTypes[key as keyof HazardTypes]?.color }]}>
              <Text style={styles.filterPillText}>{hazardTypes[key as keyof HazardTypes]?.emoji}</Text>
            </View>
          ))}
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Hazards</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Icon name="close" size={24} color="#2c3e50" />
              </TouchableOpacity>
            </View>
            
            <FilterPills
              filters={activeFilters}
              onFilterChange={handleFilterChange}
              hazardTypes={hazardTypes}
            />
            
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Hazard Detail Modal */}
      <Modal
        visible={!!selectedHazard}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedHazard(null)}
      >
        <TouchableOpacity
          style={styles.hazardModalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedHazard(null)}
        >
          <View style={styles.hazardModalContent}>
            <View style={styles.hazardHeader}>
              <View style={[styles.hazardTypeIcon, { backgroundColor: hazardTypes[selectedHazard?.type ?? 'flood']?.color }]}>
                <Text style={styles.hazardTypeEmoji}>{hazardTypes[selectedHazard?.type ?? 'flood']?.emoji}</Text>
              </View>
              <View style={styles.hazardInfo}>
                <Text style={styles.hazardTitle}>{hazardTypes[selectedHazard?.type ?? 'flood']?.name}</Text>
                <Text style={styles.hazardTime}>{formatTimestamp(selectedHazard?.timestamp)}</Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedHazard(null)}
              >
                <Icon name="close" size={20} color="#7f8c8d" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.hazardDescription}>
              {selectedHazard?.description || 'No additional details available.'}
            </Text>
            
            {selectedHazard?.photoUrl && (
              <Image
                source={{ uri: selectedHazard.photoUrl }}
                style={styles.hazardPhoto}
                resizeMode="cover"
              />
            )}
            
            <View style={styles.hazardFooter}>
              <Text style={styles.reportedBy}>
                Reported by commuter • {formatTimestamp(selectedHazard?.timestamp)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 8,
  },
  filterButton: {
    width: 36,
    height: 36,
    backgroundColor: '#f8f9fa',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  activeFilters: {
    position: 'absolute',
    top: 130,
    left: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterPill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  filterPillText: {
    fontSize: 16,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  markerEmoji: {
    fontSize: 18,
  },
  userLocationMarker: {
    width: 20,
    height: 20,
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    maxHeight: height * 0.6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  applyButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  hazardModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  hazardModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxHeight: '70%',
  },
  hazardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  hazardTypeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  hazardTypeEmoji: {
    fontSize: 24,
  },
  hazardInfo: {
    flex: 1,
  },
  hazardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  hazardTime: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  hazardDescription: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 22,
    marginBottom: 16,
  },
  hazardPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  hazardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 12,
  },
  reportedBy: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
  },
});

export default MapScreen;