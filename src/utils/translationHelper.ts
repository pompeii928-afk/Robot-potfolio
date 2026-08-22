import { AboutConfig, AwardItem, JourneyItem, ProjectItem, SkillItem } from '../types';
import { Language } from '../context/ThemeContext';

// Dictionary mapping for all portfolio data translations
export const PORTFOLIO_TRANSLATIONS: Record<string, string> = {
  // Common terms & metrics
  '완주 성공률': 'Completion Rate',
  '평균 미션 타임': 'Avg Mission Time',
  '센서 반응 속도': 'Sensor Response',
  '위치 추정 오차': 'Pose Error',
  '본선 수상': 'Award Standing',
  '통신 레이턴시': 'Latency',
  '해커톤 결과': 'Hackathon Result',
  '객체 인식률': 'Recognition Accuracy',
  '기술 우수상': 'Tech Excellence',
  '종합 대상': 'Grand Prize',
  '우수상': 'Excellence Award',
  '로봇 제작': 'Robot Fabrication',
  '프로그래밍': 'Programming',
  '주행 테스트': 'Drive Testing',
  '팀 리더': 'Team Lead',
  'SLAM 매핑': 'SLAM Mapping',
  'Nav2 경로 계획': 'Nav2 Path Planning',
  '하드웨어 패키징': 'Hardware Packaging',
  'IoT 통신 프로토콜': 'IoT Protocols',
  '중앙 관제 연동': 'Fleet Management',
  '모터 드라이버 제어': 'Motor Control',
  '컴퓨터 비전': 'Computer Vision',
  '장애물 회피': 'Obstacle Avoidance',
  '기구 설계': 'Mechanism Design',

  // Journey Titles
  'World Robot Olympiad': 'World Robot Olympiad',
  '국제 로봇 콘테스트 본선 진출': 'International Robot Contest (IRC) National Finals',
  '스마트 팩토리 물류 로봇 해커톤 대상': 'Smart Factory Logistics Robot Hackathon Grand Prize',
  '대학생 창작 로봇 경진대회 우수상': 'Creative Robotics Competition Excellence Award',

  // Journey Teams
  'Team K.F.C.Code Chaser': 'Team K.F.C.Code Chaser',
  '자율주행 배달 로봇 부문': 'Autonomous Delivery AMR Division',
  'Team K.F.C.': 'Team K.F.C.',
  'Vision Robot Crew': 'Vision Robot Crew',

  // Award Titles & Competitions
  '2nd Place Think Award': '2nd Place Think Award',
  '기술 우수상 (본선)': 'Technical Excellence Award',
  '국제 로봇 콘테스트 (IRC)': 'International Robot Contest (IRC)',
  '해커톤 대상 (1위)': 'Grand Prize (1st Place)',
  'IoT 스마트 팩토리 로봇 해커톤': 'IoT Smart Factory Robot Hackathon',
  '창작 로봇 경진대회 우수상': 'Creative Robotics Excellence Award',
  '창작 로봇 경진대회': 'Creative Robotics Competition',

  // Categories
  'ALL': 'ALL',
  'HARDWARE': 'HARDWARE',
  'ACTUATION': 'ACTUATION',
  'PERCEPTION': 'PERCEPTION',
  'FRAMEWORK': 'FRAMEWORK',
  'ALGORITHM': 'ALGORITHM',
  'AI/VISION': 'AI/VISION',
  'SOFT_SKILL': 'SOFT SKILLS',
};

// Complete Journey English mapping
const JOURNEY_EN_MAP: Record<string, Partial<JourneyItem>> = {
  'wro-2026': {
    title: 'World Robot Olympiad 2026',
    competition: 'World Robot Olympiad 2026',
    team: 'Team K.F.C.Code Chaser',
    teamName: 'Team K.F.C.Code Chaser',
    award: '2nd Place Think Award',
    roles: ['Robot Fabrication', 'Programming', 'Drive Testing', 'Team Lead'],
    strengths:
      'Remained calm and methodically resolved sudden mission failures on the competition field under intense time pressure.',
    improvements:
      'Learned to maintain strict vigilance throughout subsequent rounds rather than letting high Round 1 scores delay root-cause debugging.',
    quote: '“A transformative tournament where relentless team effort translated into tangible engineering growth.”',
    summary:
      'Competed in WRO RoboMission Senior Category. Engineered high-precision autonomous navigation and multi-mission handling robotic platform.',
    description:
      'Competed in WRO RoboMission Senior Category. Engineered high-precision autonomous navigation and multi-mission handling robotic platform.',
    detailedPoints: [
      'Implemented high-speed dual color sensor PID line-tracking control algorithm',
      'Engineered intelligent mission object classification and rack-and-pinion payload gripper',
      'Developed adaptive sensor calibration routine to counteract arena lighting and surface friction variance',
      'Directed task allocation and live troubleshooting as team leader on match day',
    ],
    metrics: [
      { label: 'Completion Rate', value: '96.4%' },
      { label: 'Avg Mission Time', value: '1m 24s' },
      { label: 'Sensor Response', value: '10ms' },
    ],
  },
  'irc-2023-11': {
    title: 'International Robot Contest (IRC) Finals',
    competition: 'International Robot Contest (IRC) Finals',
    team: 'Autonomous Delivery AMR Division',
    teamName: 'Autonomous Delivery AMR Division',
    award: 'Technical Excellence Award',
    roles: ['SLAM Mapping', 'Nav2 Path Planning', 'Hardware Packaging'],
    strengths:
      'Achieved stable dynamic obstacle avoidance in uncharted indoor environments using LiDAR-depth camera sensor fusion.',
    improvements:
      'Addressed wheel slippage during rapid sharp turns by integrating an IMU-fused Kalman odometry filter.',
    quote: '“A pivotal milestone that bridged the gap between theoretical algorithms and real-world sensor noise.”',
    summary:
      'Qualified for national finals in the Autonomous Delivery Robot category and won the Technical Excellence Award.',
    description:
      'Qualified for national finals in the Autonomous Delivery Robot category and won the Technical Excellence Award.',
    detailedPoints: [
      'ROS 2 Humble distributed nodes for Cartographer 2D SLAM mapping and localized navigation',
      'Applied Euclidean clustering on 2D LiDAR point clouds for real-time pedestrian avoidance',
    ],
    metrics: [
      { label: 'Pose Error', value: '< 2.5cm' },
      { label: 'Award', value: 'Tech Excellence' },
    ],
  },
  'hackathon-2023-08': {
    title: 'Smart Factory Logistics Robot Hackathon',
    competition: 'Smart Factory Logistics Robot Hackathon',
    team: 'Team K.F.C.',
    teamName: 'Team K.F.C.',
    award: 'Grand Prize (1st Place)',
    roles: ['IoT Protocols', 'Fleet Management', 'Motor Control'],
    strengths:
      'Constructed ultra-low latency bidirectional telemetry between edge robots and cloud dispatch dashboard via MQTT.',
    improvements:
      'Implemented constant-voltage buck-boost circuitry to prevent motor torque degradation during peak draw.',
    quote: '“The fruit of intensive 48-hour teamwork seamlessly merging hardware kinematics and cloud fleet control.”',
    summary:
      'Prototyped an IoT-enabled smart logistics autonomous mobile robot platform with real-time fleet orchestration.',
    description:
      'Prototyped an IoT-enabled smart logistics autonomous mobile robot platform with real-time fleet orchestration.',
    detailedPoints: [
      'Multi-robot traffic coordination and real-time dispatch via MQTT & WebSocket pipelines',
      '4-wheel independent encoder drive kinematics enabling zero-radius spin turns',
    ],
    metrics: [
      { label: 'Latency', value: '18ms' },
      { label: 'Hackathon Result', value: 'Grand Prize' },
    ],
  },
  'creator-2022-05': {
    title: 'Creative Robotics Competition Excellence Award',
    competition: 'Creative Robotics Competition',
    team: 'Vision Robot Crew',
    teamName: 'Vision Robot Crew',
    award: 'Excellence Award',
    roles: ['Computer Vision', 'Obstacle Avoidance', 'Mechanism Design'],
    strengths:
      'Delivered high tracking fidelity using OpenCV-based real-time color segmentation and shape recognition.',
    improvements:
      'Upgraded static HSV thresholding to adaptive histogram equalization for robust performance across variable lighting.',
    quote: '“The initial milestone where computer vision algorithms directly powered physical robot kinematics.”',
    summary:
      'Engineered vision-guided object tracking and ultrasonic collision avoidance for autonomous navigation.',
    description:
      'Engineered vision-guided object tracking and ultrasonic collision avoidance for autonomous navigation.',
    detailedPoints: [
      'Real-time target tracking via OpenCV color segmentation and contour analysis',
      'Sensor fusion emergency stop system uniting ultrasonic arrays and vision data',
    ],
    metrics: [
      { label: 'Object Accuracy', value: '94.2%' },
      { label: 'Award', value: 'Excellence Award' },
    ],
  },
};

// Complete Awards English mapping
const AWARDS_EN_MAP: Record<string, Partial<AwardItem>> = {
  'wro-2026-award': {
    title: '2nd Place Think Award',
    competition: 'WRO 2026 KOREA',
    category: 'RoboMission Senior',
    description:
      'Awarded 2nd Place Think Award in recognition of algorithmic optimization, crisis troubleshooting, and innovative mechanical design.',
    rank: '2nd Place',
    score: 'Top 2%',
  },
  'irc-2023-award': {
    title: 'Technical Excellence Award',
    competition: 'International Robot Contest (IRC)',
    category: 'Autonomous Mobile Robot',
    description:
      'Honored for excellence in high-precision LiDAR/Depth SLAM mapping and dynamic obstacle avoidance algorithms.',
    rank: 'Tech Excellence',
  },
  'hackathon-2023-award': {
    title: 'Grand Prize (1st Place)',
    competition: 'IoT Smart Factory Robot Hackathon',
    category: 'Smart Logistics',
    description:
      'Ranked #1 overall for end-to-end autonomous logistics hardware design and cloud telemetry integration.',
    rank: 'Grand Prize (1st)',
  },
  'creation-2022-award': {
    title: 'Creative Robotics Excellence Award',
    competition: 'Creative Robotics Competition',
    category: 'Vision Tracking Robot',
    description:
      'Recognized for high-precision computer vision object recognition and obstacle avoidance mechanism.',
    rank: 'Excellence Award',
  },
};

// Complete Projects English mapping
const PROJECTS_EN_MAP: Record<string, Partial<ProjectItem>> = {
  'wro-2025-robot': {
    title: 'WRO 2025 Robot',
    summary: 'CAD assembly and structural engineering analysis of the autonomous robot deployed at WRO 2025 KOREA.',
    detailedDescription:
      'High-precision autonomous competition robot deployed at WRO 2025 KOREA finals. Integrates a low center-of-gravity chassis, 4-channel optical sensor array, and high-speed rack-and-pinion gripper, attaining a 98% mission success rate.',
    tags: ['Studio 2.0', 'Hardware CAD', 'PID Control', 'Dual Gyro'],
    specs: {
      microcontroller: 'Spike Prime / Raspberry Pi Pico Co-Processor',
      sensors: ['Dual Color Sensors (I2C 100Hz)', '6-Axis IMU Gyroscope', 'Ultrasonic Proximity Sensor'],
      actuators: ['High-Torque Angular Motors x2 (Drive)', 'Linear Rack-and-Pinion Servos x2 (Gripper)'],
      softwareStack: ['MicroPython', 'Studio 2.0 CAD', 'Custom PID Tuning Tool'],
      dimensions: '245mm x 230mm x 210mm',
      weight: '820g',
      speed: '0.85 m/s (Line Following)',
    },
    highlights: [
      'Modular quick-swap chassis for rapid in-field repairs and battery replacement',
      'One-touch automatic 3-second sensor calibration for field tile reflectance',
      'Real-time slip-compensating encoder and gyroscope sensor fusion odometry',
    ],
    blueprintAnnotations: [
      { x: 28, y: 35, title: 'LiDAR/Optical Array', detail: 'Dual optical sensor mount for line tracking and corner detection' },
      { x: 55, y: 22, title: '6-Axis Manipulator Arm', detail: 'Lightweight aluminum and Lego Technic composite articulation' },
      { x: 70, y: 68, title: 'Autonomous PCB & Power', detail: 'Low-noise DC-DC buck power distribution and main controller' },
      { x: 22, y: 72, title: 'High-Traction Wheelbase', detail: 'Silicone traction wheels with 1:1.6 acceleration gear ratio' },
    ],
  },
  'autonomous-delivery-bot': {
    title: 'Autonomous Delivery Bot',
    summary:
      'Indoor autonomous mobile delivery robot powered by 2D LiDAR and Intel RealSense depth camera, utilizing Cartographer SLAM and Nav2 dynamic obstacle avoidance.',
    detailedDescription:
      'Autonomous Mobile Robot (AMR) engineered for secure cargo transportation in complex indoor environments. Fuses 2D LiDAR and Intel RealSense depth data to generate accurate 2D/3D occupancy grids and execute real-time collision-free path planning via ROS 2 Nav2.',
    tags: ['ROS 2', 'Nav2', 'LiDAR', 'SLAM', 'C++'],
    specs: {
      microcontroller: 'NVIDIA Jetson Orin Nano + STM32F4 Core',
      sensors: ['RPLiDAR A2M8 360°', 'Intel RealSense D435i Depth Camera', 'Wheel Optical Encoders'],
      actuators: ['BLDC 24V 50W Geared Motors x2', 'Electro-magnetic Cargo Lock'],
      softwareStack: ['ROS 2 Humble', 'Cartographer SLAM', 'Nav2 Costmap2D', 'BehaviorTree.CPP'],
      dimensions: '380mm x 320mm x 450mm',
      weight: '4.8kg',
      speed: '1.2 m/s',
    },
    highlights: [
      'Sub-2cm localization accuracy with high-resolution Cartographer 2D grid maps',
      'Sub-50ms reactive path replanning when pedestrians or dynamic obstacles appear',
      'Full telemetry sync with cloud web fleet dashboard via ROSBridge & React',
    ],
  },
  'six-dof-manipulator': {
    title: '6-DoF Manipulator Control',
    summary:
      'Inverse Kinematics solver implementation and collision-free trajectory generation for 6-DoF articulated robotic manipulators using MoveIt 2.',
    detailedDescription:
      'Derived mathematical kinematic models for a 6-DoF articulated robotic manipulator and developed an optimized C++ numerical/analytical IK solver. Leveraged MoveIt 2 and OMPL for smooth, obstacle-aware pick-and-place trajectories.',
    tags: ['C++', 'MoveIt', 'Inverse Kinematics', 'Trajectory Planning', 'Robotics'],
    specs: {
      microcontroller: 'EtherCAT Master IPC / Teensy 4.1 Actuator Node',
      sensors: ['19-bit Absolute Magnetic Encoders', 'Force/Torque Wrist Sensor'],
      actuators: ['Harmonic Drive Actuators x6', 'Soft Gripper Pneumatic End-Effector'],
      softwareStack: ['MoveIt 2', 'KDL / TRAC-IK', 'C++17', 'Gazebo Sim'],
      dimensions: 'Reach: 650mm, Payload: 1.5kg',
      weight: '6.2kg',
      speed: 'Joint Max 180°/s',
    },
    highlights: [
      'Hybrid analytical/numerical IK solver to avoid kinematic singularities',
      'Minimum-jerk polynomial trajectory interpolation for vibration-free high-speed motion',
      'Digital twin synchronized 3D telemetry viewer and joint state visualizer',
    ],
  },
  'awaiting-data': {
    title: 'Awaiting Data...',
    summary: 'Next competition data will be compiled here.',
    detailedDescription:
      'System architecture and vision algorithms for the upcoming 2026/2027 robotics season are currently in development.',
    tags: ['Next Season', 'Under Development', 'AI Vision'],
  },
};

// Complete Skills English mapping
const SKILLS_EN_MAP: Record<string, Partial<SkillItem>> = {
  'python-logic': {
    name: 'Python & Logic',
    description: 'Core programming language for implementing robotic control logic and autonomous behaviors.',
  },
  'robot-building': {
    name: 'Robot Building',
    description: 'Modular chassis design, gear train transmission ratios, structural integrity and quick-swap mechanisms.',
  },
  'motor-control': {
    name: 'Motor Control',
    description: 'Closed-loop PID velocity/position regulation, encoder telemetry feedback, and gyro-sync differential drive.',
  },
  'sensor-control': {
    name: 'Sensor Control',
    description: 'High-frequency sampling of Color/Light, Ultrasonic, 2D LiDAR, and IMU sensor fusion calibration.',
  },
  'ros2-framework': {
    name: 'ROS 2',
    description: 'ROS 2 Humble nodes, topics, services, actions, Nav2 stack and Micro-ROS microcontroller interfacing.',
  },
  'cpp-python': {
    name: 'C++ / Python',
    description: 'Real-time embedded C++ firmware execution paired with high-level Python autonomy logic.',
  },
  'kinematics': {
    name: 'Kinematics',
    description: 'Forward & Inverse Kinematics (FK/IK) mathematical solvers for multi-axis articulated manipulator arms.',
  },
  'computer-vision': {
    name: 'Computer Vision',
    description: 'OpenCV pipeline, HSV segmentation, AprilTag fiducial detection, and real-time obstacle bounding boxes.',
  },
  'problem-solving': {
    name: 'Problem Solving',
    description: 'Analytical approach to debugging hardware and software issues under intense competition time pressure.',
  },
  'teamwork': {
    name: 'Teamwork',
    description: 'Effective collaboration as team leader, synchronizing builder, programmer, and driver roles efficiently.',
  },
};

/**
 * Resolves localized About configuration
 */
export function getLocalizedAbout(about: AboutConfig, lang: Language): AboutConfig {
  if (lang === 'ko') return about;

  const isDefaultBio = about.bio?.includes('여러 로봇 대회에 참가하며');
  const isDefaultQuote = about.quote?.includes('결과 뿐만 아니라');
  const isDefaultGoal = about.goal?.includes('로봇을 직접 창작할 수 있도록');
  const isDefaultSubBio = about.subBio?.includes('로봇 공학에 열정을 품고');

  return {
    ...about,
    quote: isDefaultQuote
      ? '"Showcasing not merely the final results, but the growth, trials, and lessons learned through every iteration."'
      : about.quote,
    bio: isDefaultBio
      ? 'Cultivating deep knowledge and practical expertise in robotics and coding through competitive robotics olympiads. Researching mechanical structures, mastering operational principles, and translating theoretical concepts into custom-built, software-controlled robotic systems.'
      : about.bio,
    subBio: isDefaultSubBio
      ? 'I am Jihoon Bae, a dedicated robotics engineer exploring emerging autonomous technologies. From precision embedded control to autonomous navigation algorithms, I design and build robots for real-world missions.'
      : about.subBio,
    goal: isDefaultGoal
      ? 'To accumulate extensive engineering experience and pioneer custom autonomous robotic creations'
      : about.goal,
  };
}

/**
 * Resolves localized Journey item
 */
export function getLocalizedJourney(journey: JourneyItem, lang: Language): JourneyItem {
  if (lang === 'ko') return journey;

  const enOverride = JOURNEY_EN_MAP[journey.id] || {};

  // Localize roles
  const roles =
    enOverride.roles ||
    journey.roles?.map((r) => PORTFOLIO_TRANSLATIONS[r] || r) ||
    [];

  // Localize metrics
  const metrics =
    enOverride.metrics ||
    journey.metrics?.map((m) => ({
      label: PORTFOLIO_TRANSLATIONS[m.label] || m.label,
      value: PORTFOLIO_TRANSLATIONS[m.value] || m.value,
    })) ||
    [];

  // Localize detailed points
  const detailedPoints = enOverride.detailedPoints || journey.detailedPoints;

  // Localize strings
  const title = enOverride.title || PORTFOLIO_TRANSLATIONS[journey.title || ''] || journey.title;
  const competition =
    enOverride.competition ||
    PORTFOLIO_TRANSLATIONS[journey.competition || ''] ||
    journey.competition;
  const team = enOverride.team || PORTFOLIO_TRANSLATIONS[journey.team || ''] || journey.team;
  const teamName =
    enOverride.teamName ||
    PORTFOLIO_TRANSLATIONS[journey.teamName || ''] ||
    journey.teamName;
  const award = enOverride.award || PORTFOLIO_TRANSLATIONS[journey.award || ''] || journey.award;
  const summary = enOverride.summary || journey.summary;
  const description = enOverride.description || journey.description;
  const strengths = enOverride.strengths || journey.strengths;
  const improvements = enOverride.improvements || journey.improvements;
  const quote = enOverride.quote || journey.quote;

  return {
    ...journey,
    title,
    competition,
    team,
    teamName,
    award,
    roles,
    summary,
    description,
    strengths,
    improvements,
    quote,
    detailedPoints,
    metrics,
  };
}

/**
 * Resolves localized Award item
 */
export function getLocalizedAward(award: AwardItem, lang: Language): AwardItem {
  if (lang === 'ko') return award;

  const enOverride = AWARDS_EN_MAP[award.id] || {};

  return {
    ...award,
    title: enOverride.title || PORTFOLIO_TRANSLATIONS[award.title] || award.title,
    competition:
      enOverride.competition || PORTFOLIO_TRANSLATIONS[award.competition] || award.competition,
    description: enOverride.description || award.description,
    rank: enOverride.rank || PORTFOLIO_TRANSLATIONS[award.rank || ''] || award.rank,
    category: enOverride.category || award.category,
    score: enOverride.score || award.score,
  };
}

/**
 * Resolves localized Skill item
 */
export function getLocalizedSkill(skill: SkillItem, lang: Language): SkillItem {
  if (lang === 'ko') return skill;

  const enOverride = SKILLS_EN_MAP[skill.id] || {};

  return {
    ...skill,
    name: enOverride.name || skill.name,
    description: enOverride.description || skill.description,
  };
}

/**
 * Resolves localized Project item
 */
export function getLocalizedProject(project: ProjectItem, lang: Language): ProjectItem {
  if (lang === 'ko') return project;

  const enOverride = PROJECTS_EN_MAP[project.id] || {};

  return {
    ...project,
    title: enOverride.title || project.title,
    summary: enOverride.summary || project.summary,
    detailedDescription: enOverride.detailedDescription || project.detailedDescription,
    tags: enOverride.tags || project.tags,
    specs: enOverride.specs || project.specs,
    highlights: enOverride.highlights || project.highlights,
    blueprintAnnotations: enOverride.blueprintAnnotations || project.blueprintAnnotations,
  };
}
