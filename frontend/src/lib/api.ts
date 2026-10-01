// ΓöÇΓöÇΓöÇ Base URL ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
const ADMIN_BASE = `${API_BASE}/admin`;

// ΓöÇΓöÇΓöÇ TypeScript Interfaces ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface UserData {
  id: number;
  username: string;
  email: string;
  name: string;
  role: "admin" | "player" | "coach" | "referee";
  phone_number: string;
  mobile?: string;
  gender: string;
  created_at: string;
  father_name?: string;
  mother_name?: string;
  blood_group?: string;
  date_of_birth?: string;
  adhar_number?: string;
  adhar_image?: string | null;
  passport_image?: string | null;
  valid_through?: string;
}

export type ApplicantData = PlayerData | CoachData | RefereeData | AcademyData | DistrictData;

export interface PlayerData {
  id: number;
  user: UserData;
  district: string;
  dominant_hand: string;
  club_name: string;
  school_name: string;
  coach_name: string;
  height: number;
  weight: number;
  transaction_id: string;
  transaction_image: string | null;
  certificate_image: string | null;
  paid: boolean;
  adhar_number?: string;
  passport_image?: string | null;
  adhar_image?: string | null;
}

export interface CoachData {
  id: number;
  user: UserData;
  district: string;
  occupation: string;
  highest_coaching_grade: string;
  transaction_id: string;
  transaction_image: string | null;
  paid: boolean;
  passport_image?: string | null;
}

export interface RefereeData {
  id: number;
  user: UserData;
  district: string;
  occupation: string;
  grade_applying_for: string;
  year_of_officiating_experience: number;
  highest_level_officiated: string;
  tournament_officiated: string;
  previous_referee_id: string;
  transaction_id: string;
  transaction_image: string | null;
  paid: boolean;
  adhar_number?: string;
  passport_image?: string | null;
  adhar_image?: string | null;
}

export interface AcademyData {
  id: number;
  name: string;
  district: string;
  year_of_establishment: number;
  logo: string | null;
  trust_registration_number: string | null;
  office_address: string;
  office_phone_number: string;
  email: string;
  website: string | null;
  no_of_players: number;
  director: UserData | null;
  coach_name: string | null;
  coach_mobile: string | null;
  coach_email: string | null;
  coach_upha_id: string | null;
  coach_experience: number;
  registration_certificate: string | null;
  transaction_id: string;
  transaction_image: string | null;
  paid: boolean;
  academy_type: string | null;
  discipline_focus: string | null;
  categories_trained: string | null;
  coach_grade: string | null;
  pin_code: string | null;
  training_venue: string | null;
  coaches_employed: number;
  address_proof: string | null;
  bank_details: string | null;
  facility_photos: (string | null)[];
}

export interface DistrictData {
  id: number;
  name: string;
  district: string;
  year_of_establishment: number;
  logo: string | null;
  trust_registration_number: string;
  office_address: string;
  office_phone_number: string;
  email: string;
  website: string | null;
  no_of_players: number;
  adhyaksha: UserData | null;
  sachiv: UserData | null;
  koshadhyaksha: UserData | null;
  registration_certificate: string | null;
  transaction_id: string;
  transaction_image: string | null;
  paid: boolean;
}


export interface EventData {
  id: number;
  name: string;
  location: string;
  venue?: string | null;
  start_date: string;
  end_date: string;
  registration_end_date: string;
  category: string;
  image?: string | null;
  created_at: string;
  has_tournament_result?: boolean;
  results: EventResultData[];
}

export interface EventResultData {
  id: number;
  event: { id: number; name: string };
  player: PlayerData;
  position: number;
}



export type MeData =
  | { type: "player"; data: PlayerData }
  | { type: "coach"; data: CoachData }
  | { type: "referee"; data: RefereeData }
  | { type: "academy"; data: AcademyData };

// ΓöÇΓöÇΓöÇ Core Fetch Utility ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

function getFriendlyErrorMessage(errorMsg: string): string {
  if (!errorMsg) return "An unknown error occurred.";

  const msg = errorMsg.toLowerCase();
  if (msg.includes("duplicate key value violates unique constraint")) {
    if (msg.includes("email")) return "This email address is already registered.";
    if (msg.includes("phone_number")) return "This phone number is already registered.";
    if (msg.includes("adhar_number") || msg.includes("aadhar")) return "This Aadhar number is already registered.";
    if (msg.includes("trust_registration_number")) return "This Society/Trust Registration Number is already registered.";
    if (msg.includes("transaction_id")) return "This Payment Transaction ID has already been used.";
    return "A record with this information already exists. Please check your details and try again.";
  }

  return errorMsg;
}

async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit & { silentAuth?: boolean } = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    cache: "no-store",
    ...options,
    headers,
    credentials: "include",
  });

  let json;
  try {
    json = await res.json();
  } catch (e) {
    // If not JSON, we'll handle it via res.ok check below
  }

  if (!res.ok) {
    if (res.status === 401 && options.silentAuth) {
      return (json || { success: false, message: "Not authenticated", user: null }) as T;
    }
    const rawMsg = json?.message || json?.error || json?.detail || `Error ${res.status}: ${res.statusText}`;
    throw new Error(getFriendlyErrorMessage(String(rawMsg)));
  }

  return json as T;
}

async function multipartApiFetch<T = unknown>(
  url: string,
  formData: FormData
): Promise<T> {
  return apiFetch<T>(url, { method: "POST", body: formData });
}

export async function registerPlayer(formData: FormData) {
  return multipartApiFetch<{ success: boolean; message: string; player: PlayerData }>(
    `${API_BASE}/register/player/`,
    formData
  );
}

export async function registerCoach(formData: FormData) {
  return multipartApiFetch<{ success: boolean; message: string; coach: CoachData }>(
    `${API_BASE}/register/coach/`,
    formData
  );
}

export async function registerReferee(formData: FormData) {
  return multipartApiFetch<{ success: boolean; message: string; referee: RefereeData }>(
    `${API_BASE}/register/referee/`,
    formData
  );
}

export async function registerDistrict(formData: FormData) {
  return multipartApiFetch<{ success: boolean; message: string; district: DistrictData }>(
    `${API_BASE}/register/district/`,
    formData
  );
}

export async function registerAcademy(formData: FormData) {
  return multipartApiFetch<{ success: boolean; message: string; academy: AcademyData }>(
    `${API_BASE}/register/academy/`,
    formData
  );
}

export async function submitRenewal(formData: FormData) {
  return multipartApiFetch<{ success: boolean; message: string }>(
    `${API_BASE}/renew/`,
    formData
  );
}

// ΓöÇΓöÇΓöÇ User Profile ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export interface NotificationData {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export async function getNotifications() {
  return apiFetch<{ success: boolean; notifications: NotificationData[] }>(
    `${API_BASE}/notifications/`
  );
}

export async function markNotificationRead(id: number) {
  return apiFetch<{ success: boolean; message: string }>(
    `${API_BASE}/notifications/${id}/read/`,
    { method: "POST" }
  );
}


// ΓöÇΓöÇΓöÇ Settings ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export interface SystemSettingsData {
  payment_qr_code: string | null;
  player_fee: number;
  referee_fee: number;
  coach_fee?: number;
  academy_fee: number;
  district_fee: number;
  facebook_link: string;
  instagram_link: string;
  twitter_link: string;
  youtube_link: string;
  hai_affiliation_letter?: string | null;
  up_olympic_letter?: string | null;
  contact_email?: string;
  contact_mobile?: string;
  contact_address?: string;
  auto_approve?: boolean;
}

export async function getSystemSettings() {
  return apiFetch<{ success: boolean; settings: SystemSettingsData }>(
    `${API_BASE}/settings/`
  );
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  phone?: string;
  category?: string;
  subject?: string;
  message: string;
}

export async function submitContactMessage(payload: ContactMessagePayload) {
  return apiFetch<{ success: boolean; message: string; reference_number?: string }>(
    `${API_BASE}/contact/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function updateSystemSettings(formData: FormData) {
  return multipartApiFetch<{ success: boolean; message: string; settings: SystemSettingsData }>(
    `${ADMIN_BASE}/settings/`,
    formData
  );
}

export async function login(email: string, password: string) {
  return apiFetch<{ success: boolean; message: string; user: UserData }>(
    `${API_BASE}/login/`,
    { method: "POST", body: JSON.stringify({ email, password }) }
  );
}

export async function logout() {
  return apiFetch<{ success: boolean; message: string }>(
    `${API_BASE}/logout/`,
    { method: "POST", body: JSON.stringify({}) }
  );
}

export async function updateCredentials(current_password: string, new_password?: string, new_email?: string) {
  return apiFetch<{ success: boolean; message: string }>(
    `${API_BASE}/update-credentials/`,
    {
      method: "POST",
      body: JSON.stringify({ current_password, new_password, new_email }),
    }
  );
}

export async function getMe(): Promise<{
  success: boolean;
  message: string;
  user: PlayerData | CoachData | RefereeData | null;
}> {
  try {
    return await apiFetch<{
      success: boolean;
      message: string;
      user: PlayerData | CoachData | RefereeData | null;
    }>(`${API_BASE}/me/`, { silentAuth: true });
  } catch {
    return { success: false, message: "Not authenticated", user: null };
  }
}

// ΓöÇΓöÇΓöÇ Listing (Public / Admin) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export interface OfficeBearerData {
  id: number;
  name: string;
  role: string;
  image: string | null;
  order: number;
  term: string;
}

export async function listOfficeBearers() {
  return apiFetch<{ success: boolean; office_bearers: OfficeBearerData[] }>(
    `${API_BASE}/office-bearers/`
  );
}

export async function listPlayers() {
  return apiFetch<{ success: boolean; players: PlayerData[] }>(
    `${API_BASE}/players/`
  );
}

export async function listCoaches() {
  return apiFetch<{ success: boolean; coaches: CoachData[] }>(
    `${API_BASE}/coaches/`
  );
}

export async function listReferees() {
  return apiFetch<{ success: boolean; referees: RefereeData[] }>(
    `${API_BASE}/referees/`
  );
}

export async function listAcademies() {
  return apiFetch<{ success: boolean; academies: AcademyData[] }>(
    `${API_BASE}/academies/`
  );
}

export async function getMyAcademyPlayers() {
  return apiFetch<{ success: boolean; players: PlayerData[] }>(
    `${API_BASE}/me/academy/players/`
  );
}

export async function listEvents(year?: string) {
  const url = year
    ? `${API_BASE}/events/?year=${encodeURIComponent(year)}`
    : `${API_BASE}/events/`;
  return apiFetch<{ success: boolean; events: EventData[] }>(url);
}

export async function listEventResults() {
  return apiFetch<{ success: boolean; results: EventResultData[] }>(
    `${API_BASE}/event-results/`
  );
}

// ─── AGM Letters ──────────────────────────────────────────────────────────────

export interface AGMLetterData {
  id: number;
  title: string;
  description: string;
  letter_date: string;
  letter_type: 'text' | 'pdf';
  file: string | null;
  created_at: string;
}

export async function getAGMLetters() {
  return apiFetch<{ success: boolean; letters: AGMLetterData[] }>(
    `${API_BASE}/agm-letters/`
  );
}

export async function createAGMLetter(formData: FormData) {
  return multipartApiFetch<{ success: boolean; message: string; letter: AGMLetterData }>(
    `${ADMIN_BASE}/agm-letters/`,
    formData
  );
}

export async function deleteAGMLetter(id: number) {
  return apiFetch<{ success: boolean; message: string }>(
    `${ADMIN_BASE}/agm-letters/${id}/delete/`,
    { method: 'POST' }
  );
}

// ΓöÇΓöÇΓöÇ Admin: Payment Approvals ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export async function approvePlayerPayment(playerId: number | string, notes?: string) {
  return apiFetch<{ success: boolean; message: string; player: PlayerData }>(
    `${ADMIN_BASE}/players/${playerId}/payment/`,
    { method: "POST", body: JSON.stringify({ paid: true, notes }) }
  );
}

export async function approveCoachPayment(coachId: number | string, notes?: string) {
  return apiFetch<{ success: boolean; message: string; coach: CoachData }>(
    `${ADMIN_BASE}/coaches/${coachId}/payment/`,
    { method: "POST", body: JSON.stringify({ paid: true, notes }) }
  );
}

export async function approveRefereePayment(refereeId: number | string, notes?: string) {
  return apiFetch<{ success: boolean; message: string; referee: RefereeData }>(
    `${ADMIN_BASE}/referees/${refereeId}/payment/`,
    { method: "POST", body: JSON.stringify({ paid: true, notes }) }
  );
}

export async function approveAcademyPayment(academyId: number | string, notes?: string) {
  return apiFetch<{ success: boolean; message: string; academy: AcademyData }>(
    `${ADMIN_BASE}/academies/${academyId}/payment/`,
    { method: "POST", body: JSON.stringify({ paid: true, notes }) }
  );
}

export async function approveDistrictPayment(districtId: number | string, notes?: string) {
  return apiFetch<{ success: boolean; message: string; district: DistrictData }>(
    `${ADMIN_BASE}/districts/${districtId}/payment/`,
    { method: "POST", body: JSON.stringify({ paid: true, notes }) }
  );
}

export async function rejectApplication(type: string, id: number | string, notes: string) {
  return apiFetch<{ success: boolean; message: string }>(
    `${ADMIN_BASE}/reject/`,
    { method: "POST", body: JSON.stringify({ type, id, notes }) }
  );
}

export async function bulkApproveRegistrations() {
  return apiFetch<{ success: boolean; message: string }>(
    `${ADMIN_BASE}/registrations/bulk-approve/`,
    { method: "POST" }
  );
}

function normalizeEntityType(type: string): string {
  const t = (type || "").toLowerCase().trim();
  if (t === "coach" || t === "coaches" || t === "coachs") return "coaches";
  if (t === "player" || t === "players") return "players";
  if (t === "referee" || t === "referees") return "referees";
  if (t === "academy" || t === "academies" || t === "academys") return "academies";
  if (t === "district" || t === "districts") return "districts";
  return t.endsWith("s") ? t : `${t}s`;
}

export async function updateRegistration(
  type: "players" | "referees" | "coaches" | "academies" | "districts" | string,
  id: number | string,
  payload: FormData | Record<string, any>
) {
  const normType = normalizeEntityType(type);
  if (payload instanceof FormData) {
    return multipartApiFetch<{ success: boolean; message: string; data: any }>(
      `${ADMIN_BASE}/${normType}/${id}/update/`,
      payload
    );
  }
  return apiFetch<{ success: boolean; message: string; data: any }>(
    `${ADMIN_BASE}/${normType}/${id}/update/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function createCoachByAdmin(formData: FormData) {
  return multipartApiFetch<{ success: boolean; message: string; coach: CoachData; data: CoachData }>(
    `${ADMIN_BASE}/coaches/create/`,
    formData
  );
}

export async function deleteRegistration(type: string, id: number | string) {
  const normType = normalizeEntityType(type);
  return apiFetch<{ success: boolean; message: string }>(
    `${ADMIN_BASE}/${normType}/${id}/delete/`,
    { method: "POST" }
  );
}

export async function removeRegistrationPhoto(type: string, id: number | string) {
  const normType = normalizeEntityType(type);
  return apiFetch<{ success: boolean; message: string; data?: any }>(
    `${ADMIN_BASE}/${normType}/${id}/remove-photo/`,
    { method: "POST" }
  );
}

export async function createRefereeByAdmin(formData: FormData) {
  return multipartApiFetch<{ success: boolean; message: string; referee: RefereeData; data: RefereeData }>(
    `${ADMIN_BASE}/referees/create/`,
    formData
  );
}

export async function inviteAdmin(payload: { email: string; name: string; password?: string }) {
  return apiFetch<{ success: boolean; message: string; credentials: { email: string; password: string; name: string } }>(
    `${API_BASE}/invite-admin/`,
    { method: "POST", body: JSON.stringify(payload) }
  );
}

export interface AdminStatsData {
  approved_today: number;
  approved_this_week: number;
  rejected_this_month: number;
  total_pending: number;
  pending_players: number;
  pending_coaches: number;
  pending_referees: number;
  pending_academies: number;
  active_events: number;
  draft_events: number;
  results_awaiting: number;
  gallery_albums: number;
  active_admins: number;
  scheduled_notices: number;
}

export async function getAdminStats(): Promise<{ success: boolean; message: string; stats: AdminStatsData }> {
  return apiFetch<{ success: boolean; message: string; stats: AdminStatsData }>(`${ADMIN_BASE}/stats/`);
}

export interface DecisionLogData {
  id: number;
  applicant_type: string;
  applicant_id: number;
  action: string;
  applicant_name_ref: string;
  details: string;
  admin_name: string;
  notes: string;
  created_at: string;
}

export async function getDecisionLog() {
  return apiFetch<{ success: boolean; decisions: DecisionLogData[] }>(
    `${ADMIN_BASE}/decisions/`
  );
}

// ΓöÇΓöÇΓöÇ Admin: Event Management ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export interface CreateEventPayload {
  name: string;
  location: string;
  venue?: string;
  start_date: string;
  end_date: string;
  registration_end_date?: string;
  category: string;
}

export async function createEvent(payload: FormData | CreateEventPayload) {
  if (payload instanceof FormData) {
    return multipartApiFetch<{ success: boolean; message: string; event: EventData }>(
      `${ADMIN_BASE}/events/create/`,
      payload
    );
  }
  return apiFetch<{ success: boolean; message: string; event: EventData }>(
    `${ADMIN_BASE}/events/create/`,
    { method: "POST", body: JSON.stringify(payload) }
  );
}

export async function updateEvent(eventId: number | string, payload: FormData | CreateEventPayload) {
  if (payload instanceof FormData) {
    return multipartApiFetch<{ success: boolean; message: string; event: EventData }>(
      `${ADMIN_BASE}/events/${eventId}/update/`,
      payload
    );
  }
  return apiFetch<{ success: boolean; message: string; event: EventData }>(
    `${ADMIN_BASE}/events/${eventId}/update/`,
    { method: "POST", body: JSON.stringify(payload) }
  );
}

export async function deleteEvent(eventId: number | string) {
  return apiFetch<{ success: boolean; message: string }>(
    `${ADMIN_BASE}/events/${eventId}/delete/`,
    { method: "DELETE" }
  );
}

export interface AddEventResultPayload {
  player_id: number | string;
  position: number;
}

export async function addEventResult(eventId: number, payload: { player_id: number; position: number }) {
  return apiFetch<{ success: boolean; message: string; result: EventResultData }>(
    `${ADMIN_BASE}/events/${eventId}/results/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function deleteEventResult(eventId: number, resultId: number) {
  return apiFetch<{ success: boolean; message: string }>(
    `${ADMIN_BASE}/events/${eventId}/results/${resultId}/delete/`,
    { method: "POST" }
  );
}

export async function deleteTournamentResult(eventId: number) {
  return apiFetch<{ success: boolean; message: string }>(
    `${ADMIN_BASE}/events/${eventId}/upload-results/delete/`,
    { method: "POST" }
  );
}

// ─── Albums ──────────────────────────────────────────────────────────────────

export interface AlbumData {
  id: number;
  title: string;
  category?: string;
  description?: string;
  date?: string | null;
  event: { id: number; name: string; location: string; category: string; } | null;
  youtube_link?: string;
  cover_photo: string | null;
  photo_count: number;
  photos: string[];
  created_at: string;
}

export async function listAlbums() {
  return apiFetch<{ success: boolean; message: string; albums: AlbumData[] }>(
    `${API_BASE}/gallery/albums/`
  );
}

export async function createAlbum(formData: FormData) {
  return multipartApiFetch<{ success: boolean; message: string; album: AlbumData }>(
    `${API_BASE}/gallery/albums/create/`,
    formData
  );
}

export async function deleteAlbum(albumId: number) {
  return apiFetch<{ success: boolean; message: string }>(
    `${ADMIN_BASE}/gallery/albums/${albumId}/delete/`,
    { method: "POST" }
  );
}

// ΓöÇΓöÇΓöÇ Districts ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export interface DistrictData {
  id: number;
  name: string;
  district: string;
  year_of_establishment: number;
  logo: string | null;
  trust_registration_number: string;
  office_address: string;
  office_phone_number: string;
  email: string;
  website: string | null;
  no_of_players: number;
  adhyaksha: UserData | null;
  sachiv: UserData | null;
  koshadhyaksha: UserData | null;
  registration_certificate: string | null;
  transaction_id: string;
  transaction_image: string | null;
  paid: boolean;
}

export async function listDistricts() {
  return apiFetch<{ success: boolean; districts: DistrictData[] }>(
    `${API_BASE}/districts/`
  );
}

export async function getDistrict(id: string | number) {
  return apiFetch<{ success: boolean; district: DistrictData }>(
    `${API_BASE}/districts/${id}/`
  );
}


// ΓöÇΓöÇΓöÇ Achievements ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export interface PlayerAchievementData {
  id: number;
  name: string;
  district: string;
  position: string;
  player_id_str: string;
  event_name: string;
  event_location: string;
  description: string;
  category_tag: string;
  color_theme: string;
}

export interface CoachAchievementData {
  id: number;
  name: string;
  award_name: string;
  year: string;
  role_description: string;
  coach_id_str: string;
}

export interface FederationAwardData {
  id: number;
  year: string;
  award_name: string;
  awarded_by: string;
}

export interface NationalMedalData {
  id: number;
  year: string;
  medal_type: string;
  title: string;
  description: string;
  category: string;
  result: string;
  created_at: string;
}

export interface TournamentStandingData {
  position: number;
  team_name: string;
  notes: string;
}

export interface TournamentResultData {
  event_id: number;
  event_name: string;
  event_location: string;
  event_category: string;
  final_date: string | null;
  total_matches: number | null;
  top_scorer: string;
  best_player: string;
  best_goalkeeper: string;
  most_promising_junior: string;
  uploaded_at: string;
  standings: TournamentStandingData[];
}

export async function listAchievements() {
  return apiFetch<{
    success: boolean;
    players: PlayerAchievementData[];
    coaches: CoachAchievementData[];
    awards: FederationAwardData[];
    medals: NationalMedalData[];
    tournament_results: TournamentResultData[];
  }>(`${API_BASE}/achievements/`);
}

export interface GlobalStatsData {
  districts: number;
  players: number;
  coaches: number;
  referees: number;
  academies: number;
  tournaments: number;
}

export async function getGlobalStats() {
  return apiFetch<{ success: boolean; stats: GlobalStatsData }>(
    `${API_BASE}/stats/`,
    { cache: "no-store" }
  );
}

export interface CertificateData {
  id: number;
  title: string;
  status: string;
  details: string;
  certificate_id: string;
  icon_type: string;
  created_at: string;
}

export interface EventAssignmentData {
  id: number;
  event: {
    id: number;
    name: string;
    location: string;
    start_date: string;
    end_date: string;
    category: string;
  };
  status: string;
  role: string;
  created_at: string;
}

export async function getMyCertificates(): Promise<{ success: boolean; message?: string; certificates?: CertificateData[] }> {
  return apiFetch<{ success: boolean; message?: string; certificates?: CertificateData[] }>(`${API_BASE}/me/certificates/`);
}

export async function downloadCertificatePdf(certId: string): Promise<Blob> {
  const url = `${API_BASE}/me/certificates/${certId}/download/`;
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    let json;
    try {
      json = await res.json();
    } catch (e) { }
    const rawMsg = json?.message || json?.error || `Error ${res.status}: ${res.statusText}`;
    throw new Error(rawMsg);
  }

  return res.blob();
}

export async function downloadIdCardPdf(): Promise<Blob> {
  const url = `${API_BASE}/me/idcard/download/`;
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    let json;
    try {
      json = await res.json();
    } catch (e) { }
    const rawMsg = json?.message || json?.error || `Error ${res.status}: ${res.statusText}`;
    throw new Error(rawMsg);
  }

  return res.blob();
}

export async function getMyAssignments(): Promise<{ success: boolean; message?: string; assignments?: EventAssignmentData[] }> {
  return apiFetch<{ success: boolean; message?: string; assignments?: EventAssignmentData[] }>(`${API_BASE}/me/assignments/`);
}

// --- Announcements ---

export interface AnnouncementData {
  id: number;
  title: string;
  message: string;
  created_at: string;
}

export async function getAnnouncements(): Promise<{ success: boolean; announcements: AnnouncementData[] }> {
  return apiFetch<{ success: boolean; announcements: AnnouncementData[] }>(`${API_BASE}/announcements/`);
}

export async function createAnnouncement(payload: { title: string; message: string }): Promise<{ success: boolean; message: string; announcement: AnnouncementData }> {
  return apiFetch<{ success: boolean; message: string; announcement: AnnouncementData }>(
    `${ADMIN_BASE}/announcements/create/`,
    { method: 'POST', body: JSON.stringify(payload) }
  );
}

export async function updateAnnouncement(id: number, payload: { title: string; message: string }): Promise<{ success: boolean; message: string; announcement: AnnouncementData }> {
  return apiFetch<{ success: boolean; message: string; announcement: AnnouncementData }>(
    `${ADMIN_BASE}/announcements/${id}/`,
    { method: 'PUT', body: JSON.stringify(payload) }
  );
}

export async function deleteAnnouncement(id: number): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>(
    `${ADMIN_BASE}/announcements/${id}/`,
    { method: 'DELETE' }
  );
}

// --- Referee Stats ---

export interface RefereeBoardMember {
  name: string;
  role: string;
  initials: string;
}

export interface RefereeStats {
  total_referees: number;
  districts_represented: number;
  board_count: number;
  board_members: RefereeBoardMember[];
}

export async function getRefereeStats(): Promise<{ success: boolean } & RefereeStats> {
  return apiFetch<{ success: boolean } & RefereeStats>(`${API_BASE}/referee-stats/`);
}

// --- District Stats ---

export interface DistrictStats {
  total_districts: number;
  affiliated: number;
  open: number;
}

export async function getDistrictStats(): Promise<{ success: boolean } & DistrictStats> {
  return apiFetch<{ success: boolean } & DistrictStats>(`${API_BASE}/district-stats/`);
}

// --- Tournament Results Upload ---

export interface StandingPayload {
  team: string;
  notes: string;
}

export async function uploadTournamentResults(
  eventId: number | string,
  payload: {
    standings: StandingPayload[];
    final_date?: string;
    total_matches?: string;
    top_scorer?: string;
    best_player?: string;
    best_goalkeeper?: string;
    most_promising_junior?: string;
    scoresheet?: File | null;
  }
): Promise<{ success: boolean; message: string; event_id: number; event_name: string; standings_saved: number }> {
  const form = new FormData();
  form.append("standings", JSON.stringify(payload.standings));
  if (payload.final_date) form.append("final_date", payload.final_date);
  if (payload.total_matches) form.append("total_matches", payload.total_matches);
  if (payload.top_scorer) form.append("top_scorer", payload.top_scorer);
  if (payload.best_player) form.append("best_player", payload.best_player);
  if (payload.best_goalkeeper) form.append("best_goalkeeper", payload.best_goalkeeper);
  if (payload.most_promising_junior) form.append("most_promising_junior", payload.most_promising_junior);
  if (payload.scoresheet) form.append("scoresheet", payload.scoresheet);

  return multipartApiFetch(
    `${ADMIN_BASE}/events/${eventId}/upload-results/`,
    form
  );
}

// --- Council Members (Office Bearers) --------------------------

export interface OfficeBearerData {
  id: number;
  name: string;
  role: string;
  image: string | null;
  order: number;
}

export function getOfficeBearers() {
  return apiFetch<{ success: boolean; office_bearers: OfficeBearerData[] }>(`${API_BASE}/office-bearers/`);
}

export function createOfficeBearer(data: FormData) {
  return multipartApiFetch<{ success: boolean; message: string; bearer: OfficeBearerData }>(
    `${ADMIN_BASE}/office-bearers/`,
    data
  );
}

export function updateOfficeBearer(data: FormData) {
  return multipartApiFetch<{ success: boolean; message: string; }>(
    `${ADMIN_BASE}/office-bearers/`,
    data
  );
}

export function deleteOfficeBearer(id: number) {
  return apiFetch<{ success: boolean; message: string; }>(`${ADMIN_BASE}/office-bearers/`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}

// Achievements Admin API
export function createNationalMedal(data: Partial<NationalMedalData>) {
  return apiFetch<{ success: boolean; message: string; }>(`${ADMIN_BASE}/achievements/medals/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
export function updateNationalMedal(data: Partial<NationalMedalData>) {
  return apiFetch<{ success: boolean; message: string; }>(`${ADMIN_BASE}/achievements/medals/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
export function deleteNationalMedal(id: number) {
  return apiFetch<{ success: boolean; message: string; }>(`${ADMIN_BASE}/achievements/medals/`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}

export function createPlayerAchievement(data: Partial<PlayerAchievementData>) {
  return apiFetch<{ success: boolean; message: string; }>(`${ADMIN_BASE}/achievements/players/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
export function updatePlayerAchievement(data: Partial<PlayerAchievementData>) {
  return apiFetch<{ success: boolean; message: string; }>(`${ADMIN_BASE}/achievements/players/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
export function deletePlayerAchievement(id: number) {
  return apiFetch<{ success: boolean; message: string; }>(`${ADMIN_BASE}/achievements/players/`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}

export function createCoachAchievement(data: Partial<CoachAchievementData>) {
  return apiFetch<{ success: boolean; message: string; }>(`${ADMIN_BASE}/achievements/coaches/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
export function updateCoachAchievement(data: Partial<CoachAchievementData>) {
  return apiFetch<{ success: boolean; message: string; }>(`${ADMIN_BASE}/achievements/coaches/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
export function deleteCoachAchievement(id: number) {
  return apiFetch<{ success: boolean; message: string; }>(`${ADMIN_BASE}/achievements/coaches/`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}

export function createFederationAward(data: Partial<FederationAwardData>) {
  return apiFetch<{ success: boolean; message: string; }>(`${ADMIN_BASE}/achievements/awards/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
export function updateFederationAward(data: Partial<FederationAwardData>) {
  return apiFetch<{ success: boolean; message: string; }>(`${ADMIN_BASE}/achievements/awards/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
export function deleteFederationAward(id: number) {
  return apiFetch<{ success: boolean; message: string; }>(`${ADMIN_BASE}/achievements/awards/`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}

// --- Event Certificates (Admin) ---

export type CertificateType =
  | '1st Position Certificate'
  | '2nd Position Certificate'
  | '3rd Position Certificate'
  | 'Runner-Up Certificate'
  | 'Participation Certificate';

/** A cert that has already been issued for this event (from the backend) */
export interface IssuedCertEntry {
  player_id: number | null;
  player_name: string;
  district: string;
  cert_type: string;
  cert_id: string;
  issued_at: string;
}

/** Event record returned by GET /admin/events/participants/ */
export interface EventWithCertData {
  id: number;
  name: string;
  location: string;
  start_date: string;
  end_date: string;
  category: string;
  certs_issued: number;
  issued_certs: IssuedCertEntry[];
}

/** A player row the admin has manually added to the issue list */
export interface CertificateAssignment {
  player_id: number;
  cert_type: CertificateType;
}

export interface PlayerSearchResult {
  id: number;
  name: string;
  district: string;
  club_name: string;
  player_id_str: string;
}

export interface IssuedCertResult {
  player_id: number;
  player_name: string;
  cert_type: string;
}

export interface SkippedCertResult {
  player_id: number;
  player_name?: string;
  reason: string;
}

export async function getEventParticipantsForCertificates(): Promise<{
  success: boolean;
  message: string;
  events: EventWithCertData[];
}> {
  return apiFetch(`${ADMIN_BASE}/events/participants/`);
}

export async function searchPlayersForCert(q: string): Promise<{
  success: boolean;
  message: string;
  players: PlayerSearchResult[];
}> {
  return apiFetch(`${ADMIN_BASE}/players/search/?q=${encodeURIComponent(q)}`);
}

export async function issueEventCertificates(
  eventId: number,
  assignments: CertificateAssignment[]
): Promise<{
  success: boolean;
  message: string;
  issued_count: number;
  skipped_count: number;
  issued: IssuedCertResult[];
  skipped: SkippedCertResult[];
}> {
  return apiFetch(`${ADMIN_BASE}/events/${eventId}/issue-certificates/`, {
    method: 'POST',
    body: JSON.stringify({ assignments }),
  });
}

// ─── UPHA Forms ────────────────────────────────────────────────────────────────

export interface UPHAFormData {
  id: number;
  title: string;
  file: string;
  created_at: string;
}

export async function getUPHAForms() {
  return apiFetch<{ success: boolean; forms: UPHAFormData[] }>(`${API_BASE}/upha-forms/`);
}

export async function createUPHAForm(formData: FormData) {
  return multipartApiFetch<{ success: boolean; form: UPHAFormData }>(`${ADMIN_BASE}/upha-forms/create/`, formData);
}

export async function deleteUPHAForm(id: number) {
  return apiFetch<{ success: boolean }>(`${ADMIN_BASE}/upha-forms/${id}/delete/`, { method: "DELETE" });
}

