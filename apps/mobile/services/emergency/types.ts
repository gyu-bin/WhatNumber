export type Coordinate = {
  latitude: number;
  longitude: number;
};

/** 서버 프록시가 앱에 전달하는, 화면에 필요한 최소 응급실 정보입니다. */
export type EmergencyRoom = {
  id: string;
  name: string;
  address: string;
  location: Coordinate;
  emergencyPhone?: string;
  phone?: string;
  /** 공공 데이터가 명시적으로 제공한 경우에만 표시합니다. */
  availableBeds?: number;
  distanceKm: number;
};

export type EmergencyRoomsResponse = {
  rooms: EmergencyRoom[];
  /** 서버가 국립중앙의료원 응답을 받은 시각입니다. 데이터의 갱신 시각은 아닙니다. */
  fetchedAt?: string;
};
