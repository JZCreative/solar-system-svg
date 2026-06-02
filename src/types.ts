export interface MoonData {
  id: string;
  nameCN: string;
  nameEN: string;
  size: number;
  orbitRadius: number;
  speed: string; // duration in seconds
  color: string;
}

export interface PlanetData {
  id: string;
  nameCN: string;
  nameEN: string;
  color: string;
  baseColor: string;
  size: number;
  orbitRx: number;
  orbitRy: number;
  orbitSpeed: number; // duration in seconds for base speed scale
  moons: MoonData[];
  distanceText: string;
  mass: string;
  periodTextCN: string;
  periodTextEN: string;
  descriptionCN: string;
  descriptionEN: string;
  hasRings?: boolean;
  ringsRadius?: number;
  ringsTilt?: number;
  ringsColor?: string;
}

export const SOLAR_SYSTEM_DATA: PlanetData[] = [
  {
    id: "mercury",
    nameCN: "水星",
    nameEN: "Mercury",
    color: "#9ca3af",
    baseColor: "#9ca3af",
    size: 4.5,
    orbitRx: 130,
    orbitRy: 115,
    orbitSpeed: 8,
    moons: [],
    distanceText: "0.39 AU",
    mass: "0.055 Earths",
    periodTextCN: "88 地球日",
    periodTextEN: "88 Earth Days",
    descriptionCN: "距离太阳最近的行星，昼夜温差极大，没有大气层保护，地表布满陨石坑。",
    descriptionEN: "The closest planet to the Sun, with extreme day/night temperature variations, no atmosphere, and a heavily cratered surface."
  },
  {
    id: "venus",
    nameCN: "金星",
    nameEN: "Venus",
    color: "#eab308",
    baseColor: "#eab308",
    size: 7.5,
    orbitRx: 185,
    orbitRy: 165,
    orbitSpeed: 14,
    moons: [],
    distanceText: "0.72 AU",
    mass: "0.815 Earths",
    periodTextCN: "224.7 地球日",
    periodTextEN: "224.7 Earth Days",
    descriptionCN: "拥有极厚温室效应大气层的行星，地表温度超过 460°C，是太阳系中最热的行星。",
    descriptionEN: "A planet with an extremely dense greenhouse-effect atmosphere, elevating surface temperatures over 460°C, making it the hottest planet."
  },
  {
    id: "earth",
    nameCN: "地球",
    nameEN: "Earth",
    color: "#3b82f6",
    baseColor: "#3b82f6",
    size: 8,
    orbitRx: 245,
    orbitRy: 220,
    orbitSpeed: 20,
    moons: [
      { id: "moon", nameCN: "月球", nameEN: "Moon", size: 2.2, orbitRadius: 18, speed: "4s", color: "#e2e8f0" }
    ],
    distanceText: "1.00 AU",
    mass: "1.000 Earths",
    periodTextCN: "365.25 日",
    periodTextEN: "365.25 Days",
    descriptionCN: "我们充满生命的蓝色家园，也是目前已知唯一存在生命和液态水的星球。",
    descriptionEN: "Our vibrant blue home planet, and the only cosmic celestial body currently known to support life and liquid surface oceans."
  },
  {
    id: "mars",
    nameCN: "火星",
    nameEN: "Mars",
    color: "#ef4444",
    baseColor: "#ef4444",
    size: 6,
    orbitRx: 310,
    orbitRy: 280,
    orbitSpeed: 30,
    moons: [
      { id: "phobos", nameCN: "火卫一", nameEN: "Phobos", size: 1.4, orbitRadius: 11, speed: "2.5s", color: "#cbd5e1" },
      { id: "deimos", nameCN: "火卫二", nameEN: "Deimos", size: 1.1, orbitRadius: 16, speed: "5.5s", color: "#94a3b8" }
    ],
    distanceText: "1.52 AU",
    mass: "0.107 Earths",
    periodTextCN: "687 地球日",
    periodTextEN: "687 Earth Days",
    descriptionCN: "红色的干燥世界，拥有太阳系最大火山（奥林匹斯山）和由于氧化铁呈现的红褐色地貌。",
    descriptionEN: "A dry, red world hosting the solar system's largest volcano (Olympus Mons) and characteristically rust-red iron-oxide dust."
  },
  {
    id: "jupiter",
    nameCN: "木星",
    nameEN: "Jupiter",
    color: "#f97316",
    baseColor: "#f97316",
    size: 19,
    orbitRx: 450,
    orbitRy: 405,
    orbitSpeed: 50,
    moons: [
      { id: "io", nameCN: "木卫一", nameEN: "Io", size: 1.8, orbitRadius: 26, speed: "3s", color: "#eab308" },
      { id: "europa", nameCN: "木卫二", nameEN: "Europa", size: 1.6, orbitRadius: 32, speed: "5s", color: "#93c5fd" },
      { id: "ganymede", nameCN: "木卫三", nameEN: "Ganymede", size: 2.2, orbitRadius: 39, speed: "8s", color: "#cbd5e1" },
      { id: "callisto", nameCN: "木卫四", nameEN: "Callisto", size: 2.0, orbitRadius: 46, speed: "12s", color: "#a1a1aa" }
    ],
    distanceText: "5.20 AU",
    mass: "317.8 Earths",
    periodTextCN: "11.86 年",
    periodTextEN: "11.86 Years",
    descriptionCN: "太阳系最大的气态巨行星，拥有著名的“大红斑”超级风暴，以及壮丽的卫星系统。",
    descriptionEN: "The largest planet in our system, a gas giant covered in bands of ammonia clouds and characterized by its famous giant red spot storm."
  },
  {
    id: "saturn",
    nameCN: "土星",
    nameEN: "Saturn",
    color: "#facc15",
    baseColor: "#facc15",
    size: 15.5,
    orbitRx: 580,
    orbitRy: 520,
    orbitSpeed: 80,
    moons: [
      { id: "titan", nameCN: "土卫六", nameEN: "Titan", size: 2.3, orbitRadius: 34, speed: "9s", color: "#f59e0b" }
    ],
    hasRings: true,
    ringsRadius: 28,
    ringsTilt: 16,
    ringsColor: "rgba(224, 186, 120, 0.45)",
    distanceText: "9.58 AU",
    mass: "95.2 Earths",
    periodTextCN: "29.45 年",
    periodTextEN: "29.45 Years",
    descriptionCN: "以其宽广宏伟的冰质星环系统闻名，密度极低（甚至低于水），也拥有数量庞大的卫星群。",
    descriptionEN: "Instantly recognizable for its majestic ring system made of billions of icy particles, Saturn is also light enough to float in water."
  },
  {
    id: "uranus",
    nameCN: "天王星",
    nameEN: "Uranus",
    color: "#22d3ee",
    baseColor: "#22d3ee",
    size: 11,
    orbitRx: 700,
    orbitRy: 630,
    orbitSpeed: 120,
    moons: [
      { id: "titania", nameCN: "天卫三", nameEN: "Titania", size: 1.8, orbitRadius: 21, speed: "6s", color: "#cbd5e1" }
    ],
    hasRings: true,
    ringsRadius: 18,
    ringsTilt: 75, // tilted vertical rings
    ringsColor: "rgba(165, 243, 252, 0.3)",
    distanceText: "19.18 AU",
    mass: "14.5 Earths",
    periodTextCN: "84.01 年",
    periodTextEN: "84.01 Years",
    descriptionCN: "这极平淡的冰巨星独特的自转倾角达 97.77 度，几乎是“躺着”围绕太阳旋转的。",
    descriptionEN: "A pale cyan ice giant with an extreme rotational tilt of 97.77 degrees, causing it to literally roll on its side as it orbits the Sun."
  },
  {
    id: "neptune",
    nameCN: "海王星",
    nameEN: "Neptune",
    color: "#1d4ed8",
    baseColor: "#1d4ed8",
    size: 10.5,
    orbitRx: 810,
    orbitRy: 725,
    orbitSpeed: 170,
    moons: [
      { id: "triton", nameCN: "海卫一", nameEN: "Triton", size: 1.8, orbitRadius: 20, speed: "7s", color: "#e2e8f0" }
    ],
    distanceText: "30.07 AU",
    mass: "17.1 Earths",
    periodTextCN: "164.8 年",
    periodTextEN: "164.8 Years",
    descriptionCN: "最外侧的深蓝色冰质巨行星，也是太阳系中风速快得最恐怖的行星，风速最高可达每小时 2100 公里。",
    descriptionEN: "The most distant ice giant in the solar system, boasting fierce supersonic storm winds that can reach speeds of 2100 km/h."
  }
];
