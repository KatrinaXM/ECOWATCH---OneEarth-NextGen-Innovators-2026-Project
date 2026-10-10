export type City = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
};

export const ASEAN_CITIES: City[] = [
  { id: "sg", name: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198 },

  { id: "kl", name: "Kuala Lumpur", country: "Malaysia", lat: 3.139, lon: 101.6869 },
  { id: "pg", name: "George Town (Penang)", country: "Malaysia", lat: 5.4141, lon: 100.3288 },
  { id: "jb", name: "Johor Bahru", country: "Malaysia", lat: 1.4927, lon: 103.7414 },
  { id: "kk", name: "Kota Kinabalu", country: "Malaysia", lat: 5.9804, lon: 116.0735 },
  { id: "kch", name: "Kuching", country: "Malaysia", lat: 1.5533, lon: 110.3592 },

  { id: "jkt", name: "Jakarta", country: "Indonesia", lat: -6.2088, lon: 106.8456 },
  { id: "sby", name: "Surabaya", country: "Indonesia", lat: -7.2575, lon: 112.7521 },
  { id: "bdg", name: "Bandung", country: "Indonesia", lat: -6.9175, lon: 107.6191 },
  { id: "mdn", name: "Medan", country: "Indonesia", lat: 3.5952, lon: 98.6722 },
  { id: "dps", name: "Denpasar (Bali)", country: "Indonesia", lat: -8.6705, lon: 115.2126 },
  { id: "mks", name: "Makassar", country: "Indonesia", lat: -5.1477, lon: 119.4327 },

  { id: "bkk", name: "Bangkok", country: "Thailand", lat: 13.7563, lon: 100.5018 },
  { id: "cnx", name: "Chiang Mai", country: "Thailand", lat: 18.7883, lon: 98.9853 },
  { id: "hkt", name: "Phuket", country: "Thailand", lat: 7.8804, lon: 98.3923 },

  { id: "han", name: "Hanoi", country: "Vietnam", lat: 21.0278, lon: 105.8342 },
  { id: "sgn", name: "Ho Chi Minh City", country: "Vietnam", lat: 10.8231, lon: 106.6297 },
  { id: "dad", name: "Da Nang", country: "Vietnam", lat: 16.0544, lon: 108.2022 },

  { id: "mnl", name: "Manila", country: "Philippines", lat: 14.5995, lon: 120.9842 },
  { id: "qc", name: "Quezon City", country: "Philippines", lat: 14.676, lon: 121.0437 },
  { id: "ceb", name: "Cebu City", country: "Philippines", lat: 10.3157, lon: 123.8854 },
  { id: "dvo", name: "Davao City", country: "Philippines", lat: 7.1907, lon: 125.4553 },

  { id: "ygn", name: "Yangon", country: "Myanmar", lat: 16.8409, lon: 96.1735 },
  { id: "mdl", name: "Mandalay", country: "Myanmar", lat: 21.9588, lon: 96.0891 },
  { id: "npt", name: "Naypyidaw", country: "Myanmar", lat: 19.7633, lon: 96.0785 },

  { id: "pnh", name: "Phnom Penh", country: "Cambodia", lat: 11.5564, lon: 104.9282 },
  { id: "rep", name: "Siem Reap", country: "Cambodia", lat: 13.3671, lon: 103.8448 },

  { id: "vte", name: "Vientiane", country: "Laos", lat: 17.9757, lon: 102.6331 },
  { id: "lpq", name: "Luang Prabang", country: "Laos", lat: 19.8856, lon: 102.1347 },

  { id: "bwn", name: "Bandar Seri Begawan", country: "Brunei", lat: 4.9031, lon: 114.9398 },

  { id: "dil", name: "Dili", country: "Timor-Leste", lat: -8.5569, lon: 125.5603 },
];