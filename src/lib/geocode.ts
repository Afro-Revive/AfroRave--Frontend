export const geocodeLocation = async (location: string) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      location
    )}`
  );
  const data = await res.json();
  if (data && data.length > 0) {
    return {
      lat: Number.parseFloat(data[0].lat),
      lon: Number.parseFloat(data[0].lon),
    };
  }
  return null;
};

export function toGoogleMapsUrl(lat: number, lon: number) {
  return `https://www.google.com/maps?q=${lat},${lon}`;
}

export async function locationToGoogleMapsUrl(location: string) {
  const coords = await geocodeLocation(location);
  if (!coords) return null;
  return toGoogleMapsUrl(coords.lat, coords.lon);
}
