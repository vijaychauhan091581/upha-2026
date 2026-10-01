const db = require('../config/database');
const UserModel = require('../models/UserModel');
const DistrictModel = require('../models/DistrictModel');
const { hashPassword } = require('../utils/passwordUtils');

function getOrCreateUser({ email, name, role = 'official', phone = '' }) {
  let user = UserModel.findByEmail(email);
  if (!user) {
    user = UserModel.create({
      username: email,
      email,
      password: hashPassword('Pass@1234'),
      name,
      role,
      phone_number: phone,
    });
  }
  return user;
}

const sampleDistricts = [
  {
    name: 'Lucknow District Handball Association',
    district: 'Lucknow',
    year_of_establishment: 1985,
    logo: 'district_uploads/lucknow_logo.png',
    office_address: 'K.D. Singh Babu Stadium, Hazratganj, Lucknow, UP 226001',
    office_phone_number: '+91 94150 12345',
    email: 'lucknow.handball@gmail.com',
    website: 'https://upha.org',
    no_of_players: 220,
    trust_registration_number: 'SR/LKO/1423/1985',
    paid: 1,
    president: { name: 'Dr. Anandeshwar Pandey', email: 'president.lko@upha.org', phone: '+91 94150 11111' },
    secretary: { name: 'Rajesh Sharma', email: 'secretary.lko@upha.org', phone: '+91 94150 22222' },
    treasurer: { name: 'Amitabh Verma', email: 'treasurer.lko@upha.org', phone: '+91 94150 33333' },
  },
  {
    name: 'Kanpur Handball Association',
    district: 'Kanpur Nagar',
    year_of_establishment: 1990,
    logo: 'district_uploads/kanpur_logo.png',
    office_address: 'Green Park Stadium Campus, Civil Lines, Kanpur, UP 208001',
    office_phone_number: '+91 98390 23456',
    email: 'kanpur.handball@gmail.com',
    website: 'https://upha.org',
    no_of_players: 175,
    trust_registration_number: 'SR/KNP/8842/1990',
    paid: 1,
    president: { name: 'Sanjay Kapoor', email: 'president.knp@upha.org', phone: '+91 98390 11111' },
    secretary: { name: 'Pradeep Kumar', email: 'secretary.knp@upha.org', phone: '+91 98390 22222' },
    treasurer: { name: 'Virendra Singh', email: 'treasurer.knp@upha.org', phone: '+91 98390 33333' },
  },
  {
    name: 'Varanasi District Handball Association',
    district: 'Varanasi',
    year_of_establishment: 1993,
    logo: 'district_uploads/varanasi_logo.png',
    office_address: 'Dr. Sampurnanand Sports Stadium, Sigra, Varanasi, UP 221002',
    office_phone_number: '+91 94501 34567',
    email: 'varanasi.handball@gmail.com',
    website: 'https://upha.org',
    no_of_players: 140,
    trust_registration_number: 'SR/VNS/3219/1993',
    paid: 1,
    president: { name: 'Alok Tripathi', email: 'president.vns@upha.org', phone: '+91 94501 11111' },
    secretary: { name: 'Manoj Yadav', email: 'secretary.vns@upha.org', phone: '+91 94501 22222' },
    treasurer: { name: 'Sunil Mishra', email: 'treasurer.vns@upha.org', phone: '+91 94501 33333' },
  },
  {
    name: 'Prayagraj Handball Association',
    district: 'Prayagraj',
    year_of_establishment: 1995,
    logo: 'district_uploads/lucknow_logo.png',
    office_address: 'Madan Mohan Malaviya Stadium, George Town, Prayagraj, UP 211002',
    office_phone_number: '+91 94152 45678',
    email: 'prayagraj.handball@gmail.com',
    website: 'https://upha.org',
    no_of_players: 160,
    trust_registration_number: 'SR/PRY/5610/1995',
    paid: 1,
    president: { name: 'Vivek Srivastava', email: 'president.pry@upha.org', phone: '+91 94152 11111' },
    secretary: { name: 'Dharmendra Yadav', email: 'secretary.pry@upha.org', phone: '+91 94152 22222' },
    treasurer: { name: 'Rakesh Patel', email: 'treasurer.pry@upha.org', phone: '+91 94152 33333' },
  },
  {
    name: 'Meerut District Handball Association',
    district: 'Meerut',
    year_of_establishment: 1988,
    logo: 'district_uploads/kanpur_logo.png',
    office_address: 'Kailash Prakash Stadium, Victoria Park, Meerut, UP 250001',
    office_phone_number: '+91 98970 56789',
    email: 'meerut.handball@gmail.com',
    website: 'https://upha.org',
    no_of_players: 190,
    trust_registration_number: 'SR/MRT/4401/1988',
    paid: 1,
    president: { name: 'Chaudhary Satish Kumar', email: 'president.mrt@upha.org', phone: '+91 98970 11111' },
    secretary: { name: 'Deepak Tyagi', email: 'secretary.mrt@upha.org', phone: '+91 98970 22222' },
    treasurer: { name: 'Mohit Sirohi', email: 'treasurer.mrt@upha.org', phone: '+91 98970 33333' },
  },
  {
    name: 'Agra District Handball Association',
    district: 'Agra',
    year_of_establishment: 1992,
    logo: 'district_uploads/varanasi_logo.png',
    office_address: 'Eklavya Sports Stadium, Sadar Bazar, Agra, UP 282001',
    office_phone_number: '+91 98370 67890',
    email: 'agra.handball@gmail.com',
    website: 'https://upha.org',
    no_of_players: 130,
    trust_registration_number: 'SR/AGR/7219/1992',
    paid: 1,
    president: { name: 'Harish Chander', email: 'president.agr@upha.org', phone: '+91 98370 11111' },
    secretary: { name: 'Sunil Sharma', email: 'secretary.agr@upha.org', phone: '+91 98370 22222' },
    treasurer: { name: 'Gopal Dixit', email: 'treasurer.agr@upha.org', phone: '+91 98370 33333' },
  },
  {
    name: 'Gorakhpur District Handball Association',
    district: 'Gorakhpur',
    year_of_establishment: 1998,
    logo: 'district_uploads/lucknow_logo.png',
    office_address: 'Regional Sports Stadium, Civil Lines, Gorakhpur, UP 273001',
    office_phone_number: '+91 94510 78901',
    email: 'gorakhpur.handball@gmail.com',
    website: 'https://upha.org',
    no_of_players: 155,
    trust_registration_number: 'SR/GKP/9912/1998',
    paid: 1,
    president: { name: 'R. K. Singh', email: 'president.gkp@upha.org', phone: '+91 94510 11111' },
    secretary: { name: 'Arun Mani Tripathi', email: 'secretary.gkp@upha.org', phone: '+91 94510 22222' },
    treasurer: { name: 'Neeraj Dubey', email: 'treasurer.gkp@upha.org', phone: '+91 94510 33333' },
  },
  {
    name: 'Ghaziabad District Handball Association',
    district: 'Ghaziabad',
    year_of_establishment: 2002,
    logo: 'district_uploads/kanpur_logo.png',
    office_address: 'Mahamaya Sports Stadium, Raj Nagar, Ghaziabad, UP 201002',
    office_phone_number: '+91 98110 89012',
    email: 'ghaziabad.handball@gmail.com',
    website: 'https://upha.org',
    no_of_players: 145,
    trust_registration_number: 'SR/GZB/1102/2002',
    paid: 1,
    president: { name: 'Devendra Chaudhary', email: 'president.gzb@upha.org', phone: '+91 98110 11111' },
    secretary: { name: 'Naveen Kumar', email: 'secretary.gzb@upha.org', phone: '+91 98110 22222' },
    treasurer: { name: 'Sanjay Tomar', email: 'treasurer.gzb@upha.org', phone: '+91 98110 33333' },
  },
];

console.log('Seeding initial districts...');
for (const item of sampleDistricts) {
  const existing = db.prepare('SELECT id FROM district_district WHERE district = ?').get(item.district);
  if (existing) {
    console.log(`District ${item.district} already exists (ID: ${existing.id}), skipping.`);
    continue;
  }

  const user = getOrCreateUser({
    email: item.email,
    name: item.name,
    role: 'district',
    phone: item.office_phone_number,
  });

  const pres = getOrCreateUser(item.president);
  const sec = getOrCreateUser(item.secretary);
  const treas = getOrCreateUser(item.treasurer);

  DistrictModel.create({
    name: item.name,
    district: item.district,
    year_of_establishment: item.year_of_establishment,
    logo: item.logo,
    office_address: item.office_address,
    office_phone_number: item.office_phone_number,
    email: item.email,
    website: item.website,
    no_of_players: item.no_of_players,
    trust_registration_number: item.trust_registration_number,
    paid: 1,
    user_id: user.id,
    adhyaksha_id: pres.id,
    sachiv_id: sec.id,
    koshadhyaksha_id: treas.id,
    transaction_id: `TXN-INIT-${item.district.toUpperCase().replace(/\s+/g, '')}`,
  });
  console.log(`Seeded district: ${item.district}`);
}

console.log('Done seeding districts.');
