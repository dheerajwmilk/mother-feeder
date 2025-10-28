export interface Caregiver {
  id: string;
  name: string;
  experience: string;
  rating: number;
  reviews: number;
  rate: string;
  specialties: string[];
  languages: string[];
  verified: boolean;
  bio: string;
  availability: string;
  badges: string[];
  image?: string;
}

interface CaregiverResponse {
  caregivers: Caregiver[];
}

export const fetchCaregivers = async (): Promise<Caregiver[]> => {
  try {
    const res = await fetch("http://localhost:5000/v1/info/get-caregivers-info");

    if (!res.ok) {
      throw new Error(`Failed to fetch caregivers: ${res.status}`);
    }

    const data: CaregiverResponse = await res.json();

    // Ensure we always return an array even if API fails partially
    return data.caregivers || [];
  } catch (error) {
    console.error("Error fetching caregivers:", error);
    return [];
  }
};
