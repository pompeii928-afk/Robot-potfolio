import { AboutConfig, AwardItem, JourneyItem, ProjectItem, SkillItem, YouTubeVideoItem, CompetitionReviewItem, ExternalSiteItem } from '../types';

export const DEFAULT_ABOUT_CONFIG: AboutConfig = {
  title: 'MY ROBOT',
  subtitle: 'PORTFOLIO',
  quote: '"결과 뿐만 아니라 내가 개선하고 시도하여 얻은 성과와 과정을 보여준다."',
  bio: '여러 로봇 대회에 참가하며 로봇과 코딩에 대한 지식과 경험을 쌓고 있다. 또한 로봇의 구조를 연구하며 작동 원리를 이해하고, 이를 실제 제작과 코딩에 적용해 보고 있다.',
  subBio: '로봇 공학에 열정을 품고 새로운 기술을 탐구하는 배지훈입니다. 하드웨어 제어부터 자율 주행 소프트웨어까지 다양한 프로젝트를 수행하며 미래를 설계하고 있습니다.',
  goal: '로봇을 직접 창작할 수 있도록 많은 경험을 쌓는 것',
  heroImage: '/src/assets/images/hero_robot_arm_1786764552106.jpg',
  currentFocus: 'WRO 2026',
  coreDomain: 'Robotics & AI',
  teamRole: 'Lead & Dev',
};

export const JOURNEY_DATA: JourneyItem[] = [
  {
    id: 'wro-2026',
    season: '2026 Season',
    title: 'World Robot Olympiad',
    team: 'Team K.F.C.Code Chaser',
    period: '2025.10 ~ 2026.08',
    roles: ['로봇 제작', '프로그래밍', '주행 테스트', '팀 리더'],
    strengths: '대회장에서 잘 되던 미션이 자꾸 안되었을 때 당황하지 않고 침착하게 그 문제를 해결한 것',
    improvements: '1라운드 점수가 좋아서 안심하다가, 2라운드 연습 시간에 문제를 제때 확인하지 못한 것',
    quote: '“대회 전까지 팀이 꾸준히 노력한 끝에 성장할 수 있었던 대회”',
    description: 'WRO(World Robot Olympiad) RoboMission 종목 참가. 고정밀 자율주행 및 복합 미션 수행 로봇 개발.',
    detailedPoints: [
      '듀얼 컬러 센서 기반의 고속 라인트레이싱 PID 제어 알고리즘 구현',
      '지능형 미션 오브젝트 분류 및 그리퍼 적재 메커니즘 설계',
      '경기장 조명 및 마찰력 변화에 대응하는 적응형 센서 보정(Calibration) 루틴 개발',
      '팀 리더로서 역할 분담 및 경기 당일 실시간 디버깅 지휘',
    ],
    metrics: [
      { label: '완주 성공률', value: '96.4%' },
      { label: '평균 미션 타임', value: '1m 24s' },
      { label: '센서 반응 속도', value: '10ms' },
    ],
  },
  {
    id: 'irc-2023-11',
    season: '2023. 11',
    title: '국제 로봇 콘테스트 본선 진출',
    team: '자율주행 배달 로봇 부문',
    period: '2023.09 ~ 2023.11',
    roles: ['SLAM 매핑', 'Nav2 경로 계획', '하드웨어 패키징'],
    strengths: '라이다와 뎁스 카메라 센서 퓨전을 통해 미지의 맵에서도 안정적인 동적 장애물 회피를 구현함',
    improvements: '급격한 회전 구간에서 주행 모터 슬립 현상에 대한 오도메트리 보정이 다소 지연되었던 점 개선 필요',
    quote: '“실제 필드 테스트를 통해 이론과 현실 센서 노이즈의 격차를 좁힌 소중한 기회”',
    description: '자율주행 배달 로봇 부문 본선 진출 및 기술 우수상 수상.',
    detailedPoints: [
      'ROS 2 Humble 기반의 Cartographer 2D SLAM 맵 빌딩 및 주행 노드 분산화',
      '동적 보행자 장애물 인식을 위한 2D LiDAR 클러스터링 알고리즘 적용',
    ],
    metrics: [
      { label: '위치 추정 오차', value: '< 2.5cm' },
      { label: '본선 수상', value: '기술 우수상' },
    ],
  },
  {
    id: 'hackathon-2023-08',
    season: '2023. 08',
    title: '스마트 팩토리 물류 로봇 해커톤 대상',
    team: 'Team K.F.C.',
    period: '2023.08',
    roles: ['IoT 통신 프로토콜', '중앙 관제 연동', '모터 드라이버 제어'],
    strengths: 'MQTT 기반의 실시간 중앙 관제 시스템과 로봇 간 지연 없는 양방향 텔레메트리 전송 구현',
    improvements: '배터리 전압 강하에 따른 토크 저하 방지를 위한 전원 관리 회로 보강 필요',
    quote: '“48시간 동안 하드웨어와 클라우드 관제를 완벽하게 융합한 팀워크의 결실”',
    description: 'IoT 기반 스마트 팩토리 물류 로봇 시스템 프로토타입 개발.',
    detailedPoints: [
      'MQTT & WebSocket을 활용한 다중 로봇 트래픽 조율 및 실시간 작업 배정',
      '엔코더 모터 4륜 독립 제어를 통한 제자리 회전(Spin-turn) 기구학 적용',
    ],
    metrics: [
      { label: '통신 레이턴시', value: '18ms' },
      { label: '해커톤 결과', value: '종합 대상' },
    ],
  },
  {
    id: 'creator-2022-05',
    season: '2022. 05',
    title: '대학생 창작 로봇 경진대회 우수상',
    team: 'Vision Robot Crew',
    period: '2022.03 ~ 2022.05',
    roles: ['컴퓨터 비전', '장애물 회피', '기구 설계'],
    strengths: 'OpenCV 기반 실시간 물체 인식 및 색상 기반 타겟 트래킹의 높은 정확도',
    improvements: '조도 변화에 취약했던 HSV 색공간 임계값 필터링을 적응형 알고리즘으로 발전시킴',
    quote: '“소프트웨어 비전 알고리즘이 물리적 하드웨어와 만나는 첫 번째 도약”',
    description: '장애물 회피 및 객체 인식 알고리즘 구현 우수상.',
    detailedPoints: [
      'OpenCV 기반 색상 및 형태 필터링을 통한 실시간 타겟 추적',
      '초음파 센서 어레이와 비전 융합 안전 정지 시스템 구축',
    ],
    metrics: [
      { label: '객체 인식률', value: '94.2%' },
      { label: '경진대회 수상', value: '우수상' },
    ],
  },
];

export const AWARDS_DATA: AwardItem[] = [
  {
    id: 'wro-2026-award',
    title: '2nd Place Think Award',
    competition: 'WRO 2026 KOREA',
    date: '2026',
    category: 'RoboMission Senior',
    description: '알고리즘 최적화, 위기 대처 능력 및 엔지니어링 설계의 창의성과 우수성을 인정받아 수상한 Think Award 2위',
    highlight: true,
    score: 'Top 2%',
    rank: '2nd Place',
  },
  {
    id: 'irc-2023-award',
    title: '기술 우수상 (본선)',
    competition: '국제 로봇 콘테스트 (IRC)',
    date: '2023. 11',
    category: 'Autonomous Mobile Robot',
    description: 'LiDAR와 뎁스 카메라 기반의 고정밀 SLAM 및 장애물 회피 알고리즘 완성도 부문 우수상',
    highlight: false,
    rank: '기술 우수상',
  },
  {
    id: 'hackathon-2023-award',
    title: '해커톤 대상 (1위)',
    competition: 'IoT 스마트 팩토리 로봇 해커톤',
    date: '2023. 08',
    category: 'Smart Logistics',
    description: '스마트 물류 로봇 하드웨어 및 클라우드 관제 프로토타입 최우수 종합 평가 대상',
    highlight: false,
    rank: 'Grand Prize (1st)',
  },
  {
    id: 'creation-2022-award',
    title: '창작 로봇 경진대회 우수상',
    competition: '창작 로봇 경진대회',
    date: '2022. 05',
    category: 'Vision Tracking Robot',
    description: '컴퓨터 비전 기반 객체 인식 및 자율 장애물 회피 기구 설계 우수',
    highlight: false,
    rank: '우수상',
  },
];

export const SKILLS_DATA: SkillItem[] = [
  {
    id: 'python-logic',
    name: 'Python & Logic',
    description: 'Core programming language for implementing robotic control logic and autonomous behaviors.',
    category: 'ALGORITHM',
    proficiency: 85,
    iconName: 'Code2',
    highlighted: true,
  },
  {
    id: 'robot-building',
    name: 'Robot Building',
    description: 'Modular chassis design, gear train transmission ratios, structural integrity and quick-swap mechanisms.',
    category: 'HARDWARE',
    iconName: 'Wrench',
  },
  {
    id: 'motor-control',
    name: 'Motor Control',
    description: 'Closed-loop PID velocity/position regulation, encoder telemetry feedback, and gyro-sync differential drive.',
    category: 'ACTUATION',
    iconName: 'Cpu',
  },
  {
    id: 'sensor-control',
    name: 'Sensor Control',
    description: 'High-frequency sampling of Color/Light, Ultrasonic, 2D LiDAR, and IMU sensor fusion calibration.',
    category: 'PERCEPTION',
    iconName: 'Radio',
  },
  {
    id: 'ros2-framework',
    name: 'ROS 2',
    description: 'ROS 2 Humble nodes, topics, services, actions, Nav2 stack and Micro-ROS microcontroller interfacing.',
    category: 'FRAMEWORK',
    proficiency: 80,
    iconName: 'CircuitBoard',
  },
  {
    id: 'cpp-python',
    name: 'C++ / Python',
    description: 'Real-time embedded C++ firmware execution paired with high-level Python autonomy logic.',
    category: 'ALGORITHM',
    proficiency: 88,
    iconName: 'Binary',
  },
  {
    id: 'kinematics',
    name: 'Kinematics',
    description: 'Forward & Inverse Kinematics (FK/IK) mathematical solvers for multi-axis articulated manipulator arms.',
    category: 'HARDWARE',
    proficiency: 78,
    iconName: 'Crosshair',
  },
  {
    id: 'computer-vision',
    name: 'Computer Vision',
    description: 'OpenCV pipeline, HSV segmentation, AprilTag fiducial detection, and real-time obstacle bounding boxes.',
    category: 'AI/VISION',
    proficiency: 82,
    iconName: 'Eye',
  },
  {
    id: 'problem-solving',
    name: 'Problem Solving',
    description: 'Analytical approach to debugging hardware and software issues under intense competition time pressure.',
    category: 'SOFT_SKILL',
    iconName: 'SearchCode',
  },
  {
    id: 'teamwork',
    name: 'Teamwork',
    description: 'Effective collaboration as team leader, synchronizing builder, programmer, and driver roles efficiently.',
    category: 'SOFT_SKILL',
    iconName: 'Users2',
  },
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'wro-2025-robot',
    projectId: 'PROJECT_ID: WRO_25',
    title: 'WRO 2025 Robot',
    summary: 'WRO 2025 KOREA에서 사용한 로봇의 조립도 및 기구 설계 구조 분석.',
    detailedDescription: 'WRO 2025 KOREA 본선에 출전한 고속 정밀 자율주행 로봇입니다. 저중심 섀시 설계와 4채널 광학 센서 어레이, 랙-앤-피니언 방식의 고속 그리퍼를 결합하여 미션 완수율 98%를 달성했습니다.',
    image: '/src/assets/images/robot_blueprint_1786764563396.jpg',
    tags: ['Studio 2.0', 'Hardware CAD', 'PID Control', 'Dual Gyro'],
    status: 'COMPLETED',
    specs: {
      microcontroller: 'Spike Prime / Raspberry Pi Pico Co-Processor',
      sensors: ['듀얼 컬러 센서 (I2C 100Hz)', '고정밀 6축 IMU 자이로', '초음파 장애물 감지 센서'],
      actuators: ['고토크 미디엄 앵글러 모터 x2 (구동)', '리니어 랙 피니언 서보 x2 (그리퍼)'],
      softwareStack: ['MicroPython', 'Studio 2.0 CAD', 'Custom PID Tuning Tool'],
      dimensions: '245mm x 230mm x 210mm',
      weight: '820g',
      speed: '0.85 m/s (Line Following)',
    },
    highlights: [
      '빠른 수리 및 배터리 교체를 위한 모듈형 퀵-체인지 프레임워크',
      '경기장 타일 색상 반사율을 3초 만에 자동 측정하는 원터치 자동 캘리브레이션 모드',
      '슬립 현상을 실시간 보정하는 엔코더-자이로 융합 오도메트리 알고리즘',
    ],
    blueprintAnnotations: [
      { x: 28, y: 35, title: 'LiDAR/Optical Array', detail: '라인 추적 및 코너 감지를 위한 듀얼 광학 센서 마운트' },
      { x: 55, y: 22, title: '6-Axis Manipulator Arm', detail: '경량 알루미늄 및 레고 테크닉 복합 관절 구조' },
      { x: 70, y: 68, title: 'Autonomous PCB & Power', detail: '저잡음 DC-DC 스텝다운 전원 분배기 및 메인 컨트롤러' },
      { x: 22, y: 72, title: 'High-Traction Wheelbase', detail: '실리콘 접지 휠 및 1:1.6 가속 기어 트레인' },
    ],
  },
  {
    id: 'autonomous-delivery-bot',
    projectId: 'PROJECT_ID: NAV_02',
    title: 'Autonomous Delivery Bot',
    summary: '라이다(LiDAR)와 뎁스 카메라를 활용한 실내 자율 주행 로봇 개발. SLAM 매핑 및 Nav2 스택을 이용한 동적 장애물 회피.',
    detailedDescription: '실내 복합 빌딩 환경에서 화물을 안전하게 목적지로 운송하는 자율주행 모바일 로봇(AMR)입니다. 2D 라이다와 인텔 리얼센스 뎁스 카메라를 융합하여 정밀한 2D/3D 점군 지도를 생성하고 Nav2 스택으로 동적 장애물을 회피합니다.',
    image: '/src/assets/images/delivery_bot_1786764573579.jpg',
    tags: ['ROS 2', 'Nav2', 'LiDAR', 'SLAM', 'C++'],
    status: 'COMPLETED',
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
      'Cartographer 기반 고해상도 실내 맵 생성 및 로컬라이제이션 오차 2cm 미만 달성',
      '보행자 및 급작스러운 장애물 출현 시 50ms 이내 긴급 경로 재계획(Replanning)',
      '웹 기반 원격 관제 대시보드(ROSBridge & React) 연동',
    ],
  },
  {
    id: 'six-dof-manipulator',
    projectId: 'PROJECT_ID: ARM_6AXIS',
    title: '6-DoF Manipulator Control',
    summary: '산업용 6축 로봇 암의 역운동학(Inverse Kinematics) 솔버 구현 및 MoveIt 프레임워크를 활용한 충돌 회피 궤적 생성 프로젝트.',
    detailedDescription: '6개 자유도를 가진 로봇 매니퓰레이터의 기구학(Forward/Inverse Kinematics) 모델을 직접 수식화하고 C++로 최적화된 솔버를 작성했습니다. MoveIt 및 OMPL 라이브러리를 결합하여 3차원 장애물 공간에서 부드러운 충돌 없는 픽앤플레이스를 수행합니다.',
    image: '/src/assets/images/six_dof_arm_1786764586533.jpg',
    tags: ['C++', 'MoveIt', 'Inverse Kinematics', 'Trajectory Planning', 'Robotics'],
    status: 'COMPLETED',
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
      '해석적(Analytical) 및 수치적(Numerical) IK 솔버 결합으로 특이점(Singularity) 회피',
      '최소 저크(Minimum-Jerk) 궤적 보간으로 진동 없는 고속 이동 구현',
      '디지털 트윈 기반 실시간 3D 뷰어 및 조인트 각도 모니터링',
    ],
  },
  {
    id: 'awaiting-data',
    projectId: 'PROJECT_ID: FUTURE_MISSION',
    title: 'Awaiting Data...',
    summary: 'Next competition data will be compiled here.',
    detailedDescription: '새로운 2026/2027 시즌 로봇 시스템 아키텍처 및 자율 비전 알고리즘 개발이 진행 중입니다.',
    image: '',
    tags: ['Next Season', 'Under Development', 'AI Vision'],
    status: 'AWAITING',
  },
];

export const DEFAULT_CHANNEL_INFO = {
  channelName: 'WRO COSPACE / K.F.C.Code Chaser',
  handle: '@Wrocospace',
  channelUrl: 'http://www.youtube.com/@Wrocospace',
  customUrl: 'https://www.youtube.com/@Wrocospace',
  tagline: 'WRO Robotics, Autonomous Navigation & Systems Engineering Channel',
  taglineKo: 'WRO 로봇 공학, 자율주행 알고리즘 및 로봇 시스템 개발 기록 채널',
  description: 'Official YouTube channel archiving World Robot Olympiad (WRO) & CoSpace autonomous runs, PID control tuning, hardware CAD builds, and field match analyses.',
  descriptionKo: 'World Robot Olympiad (WRO) 및 CoSpace 로보틱스, 자율주행 주행 테스트, PID 제어 튜닝, 하드웨어 빌드 메이킹 영상을 공유하는 공식 채널입니다.',
  topics: ['WRO Competition Match', 'Line Tracking PID', 'Autonomous Navigation', 'Robotics CAD & Build', 'Field Tests'],
  topicsKo: ['WRO 실전 경기', '라인트레이싱 PID', '자율주행 제어', '3D CAD & 로봇 제작', '필드 테스트'],
};

export const DEFAULT_YOUTUBE_VIDEOS: YouTubeVideoItem[] = [
  {
    id: 'yt-1',
    title: 'WRO Robot Autonomous Match Run & Mission Results',
    titleKo: 'WRO 로봇 자율주행 실전 경기 주행 및 미션 결과 분석',
    description: 'Match run footage showcasing autonomous mission navigation, obstacle handling, and score outcomes during WRO competition.',
    descriptionKo: '대회 때 로봇이 어떻게 움직였고 어떤 결과를 냈는지에 대한 실전 경기 주행 영상입니다.',
    youtubeUrl: 'https://www.youtube.com/watch?v=y4K_5A4wNrw',
    videoId: 'y4K_5A4wNrw',
    thumbnail: 'https://img.youtube.com/vi/y4K_5A4wNrw/hqdefault.jpg',
    duration: '02:09',
    tags: ['WRO 2026', 'Autonomous', 'Match Run', 'Robotics'],
    tagsKo: ['WRO 2026', '자율주행', '실전경기', '로보틱스'],
    category: 'Competition',
    views: '1.2K',
    isFeatured: true,
    order: 1,
  },
  {
    id: 'yt-2',
    title: 'Dual Color Sensor Line Tracking & Gyro PID Control',
    titleKo: '정밀 듀얼 컬러 센서 라인트레이싱 및 자이로 PID 제어 튜닝',
    description: 'Precision line tracking demonstration and PID control tuning analysis for zero-overshoot cornering and high-speed intersections.',
    descriptionKo: '직각 턴과 교차로에서 오버슈트 없이 고속 궤적을 유지하는 PID 튜닝 및 자율주행 알고리즘 분석입니다.',
    youtubeUrl: 'https://www.youtube.com/watch?v=y4K_5A4wNrw',
    videoId: 'y4K_5A4wNrw',
    thumbnail: 'https://img.youtube.com/vi/y4K_5A4wNrw/hqdefault.jpg',
    duration: '03:45',
    tags: ['PID Control', 'Color Sensor', 'Algorithm'],
    tagsKo: ['PID 제어', '컬러 센서', '알고리즘'],
    category: 'Algorithm',
    views: '890',
    isFeatured: false,
    order: 2,
  },
  {
    id: 'yt-3',
    title: 'Autonomous Robotics CAD Blueprint & Hardware Assembly',
    titleKo: '자율주행 로봇 3D CAD 기구부 설계 및 하드웨어 조립 과정',
    description: '3D CAD mechanical chassis modeling, dual-motor drivetrain assembly, and modular sensor bracket build timelapse.',
    descriptionKo: '초경량 섀시 구조, 듀얼 모터 드라이브 트레인 및 센서 브라켓 기구 설계 빌드 영상입니다.',
    youtubeUrl: 'http://www.youtube.com/@Wrocospace',
    videoId: 'y4K_5A4wNrw',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    duration: '03:15',
    tags: ['3D CAD', 'Hardware', 'Making'],
    tagsKo: ['3D CAD', '하드웨어', '로봇 제작'],
    category: 'Hardware',
    views: '1.5K',
    isFeatured: false,
    order: 3,
  },
];

export const DEFAULT_REVIEWS_DATA: CompetitionReviewItem[] = [
  {
    id: 'wro-oc-2026-india',
    title: 'WRO Open Championship 2026 India- ASIA PACIFIC',
    competition: 'WRO Open Championship 2026 India (ASIA PACIFIC)',
    period: '2026년 9월 25일 ~ 27일',
    location: 'GMR Arena, Aerocity, Hyderabad, India',
    teamName: 'K.F.C.',
    members: ['배지훈', '송민규'],
    officialUrl: 'https://oc26.wroindia.org/schedule/',
    scoringUrl: 'https://scoring.wro-association.org/en/event/scoring/420',
    notionUrl: 'https://app.notion.com/p/WRO-Open-Championship-2026-India-ASIA-PACIFIC-3b21be0cb00f802d9956ed228decbaff?source=copy_link',
    coverImage: '/wro-oc-regular-apac-india-2026.webp',
    icon: '/favicon.svg',
    rankBadge: '11등 (총 249점)',
    finalScore: '249점',
    overviewSummary: '인도 하이데라바드에서 개최된 WRO Open Championship 2026 ASIA PACIFIC 실전 참가 후기 및 라운드별 분석 기록입니다.',
    day1: {
      title: '첫째 날',
      subtitle: '연습',
      fixes: [
        '먼지 미션을 할 때 빨간 베리어를 침',
        '유물을 잡을 때 직진 속도가 너무 빨라 유물을 쳐서 잘 못 잡음',
      ],
      fixesDetailed: [
        {
          problem: '먼지 미션을 할 때 빨간 베리어를 침',
          solution:
            '빨간 베리어를 치는 문제의 요인이 팔 때문이라는 것을 인지하고 팔의 각도를 높여 베리어의 높이 보다 높이 들어 베리어를 안 치게 하였다.',
        },
        {
          problem: '유물을 잡을 때 직진 속도가 너무 빨라 유물을 쳐서 잘 못 잡음',
          solution:
            '유물을 집을 때 속도가 너무 빨라 유물을 놓치는 경우는 라이브러리 파일에서 유물을 잡는 함수를 찾은 뒤 속도를 낮추었다.',
        },
      ],
      strategy: '속도는 둘째 치고 무조건 점수에 유리한 쪽으로 선택한다.',
      strategyReason: '점수가 높아야지 속도가 빠른게 의미가 있기 때문이다.',
      codeSummary: '연습 주행 및 경기장 조명·마찰력 적응형 제어 코드 튜닝',
      result: '11등 (249점)',
    },
    day2: {
      title: '둘째 날',
      subtitle: '1, 2, 3, 4라운드 (240점 만점)',
      rank: '11등',
      scores: [
        { round: '1라운드', score: 30 },
        { round: '2라운드', score: 107 },
        { round: '3라운드', score: 109 },
        { round: '4라운드', score: 179 },
      ],
      scoresDetailed: [
        {
          round: '1라운드',
          score: 30,
          cause: '시작 지점을 잘못 잡아서 로봇이 미션을 수행하지 못함',
          lesson: '시작 지점을 잘 잡도록 다음번에는 틀을 만들어 시작 지점을 잡아야겠다.',
        },
        {
          round: '2라운드',
          score: 107,
          cause: '마지막에 코드를 작성할 때 콤마를 마침표로 찍었다.',
          lesson: '콤마와 마침표를 구분을 잘 해야겠다.',
        },
        {
          round: '3라운드',
          score: 109,
          cause: '함수 이름을 착각해 다른 곳에 있는 코드를 고쳐 로봇이 미션을 수행하지 못하였다.',
          lesson: '함수 이름을 명확하게 구분해야 하고 다시 한번 고쳐야 될 함수가 맞는지 확인해야겠다.',
        },
        {
          round: '4라운드',
          score: 179,
          cause: '유물 색깔 감지를 잘 하지 못하였다.',
          lesson: '다음에는 색깔 감지를 하는 객체의 높이에 맞춰 컬러센서 높이를 조정해야겠다.',
        },
      ],
      surpriseMission: {
        title: '서프라이즈 미션',
        rules:
          '새로운 유물인 하얀색 유물이 추가되어 하얀색 유물을 WRO 2026 seasonal logo가 있는 곳에 갔다 놓는 미션이였다.',
        scoring: [
          '부분적으로 유물이 seasonal logo에 걸쳐져 있음 : 15점',
          '유물이 완전히 seasonal logo안에 있음 : 25점 (넘어지면 안됨)',
        ],
        reason:
          '우리 상황에서 새로운 유물을 추가하면 오류가 더욱 날 것 같기도 하였고 흰색 유물은 프로그램에서 무작위 색상으로 판단해서 유물을 가져다 놓는 것으로 되어있었기 때문에 기존에 있던 로직을 수정해야 하는데 스스로 고치기가 어려웠기 때문이다.',
        disadvantage:
          '유물 하나를 흰색 유물로 바꾸었기 때문에 흰색 유물을 포기한 팀 상황으로써는 25점을 손해 보았다.',
        lesson: '시도를 하기 위해 색상감지 프로그램은 미리 이해해야겠다.',
        images: [
          { name: '서프라이즈 미션 1', src: '/reviews/wro2026/surprise_mission_1.jpg' },
          { name: '서프라이즈 미션 2', src: '/reviews/wro2026/surprise_mission_2.jpg' },
        ],
      },
      strategy: '시간보다는 정확도를 높이기로 함',
      codeSummary: '1, 2, 3라운드 실수를 딛고 4라운드에서 끝까지 포기하지 않고 179점 고득점 달성',
      codeFile: {
        name: 'WRO_FINAL_2026_MAIN_2.py',
        path: '/reviews/wro2026/WRO_FINAL_2026_MAIN_2.py',
      },
      problemAndFix: {
        problem: '로봇에 업로드된 프로그램이 실행이 안되었다.',
        solution: '로봇을 계속 껐다 켰다를 로봇이 실행될 때 까지 반복하였다.',
      },
      mustFix:
        '아무리 상황이 급박해도 당황하지 않고 차근차근 코드를 쓰고 로봇이 잘 작동이 안되어도 시작 지점은 꼭 잘 지켜야 한다.',
    },
    day3: {
      title: '셋째 날',
      subtitle: '1, 2라운드 (240점 만점)',
      rank: '11등',
      scores: [
        { round: '1라운드', score: 55 },
        { round: '2라운드', score: 60 },
        { round: '3라운드 (멀리건)', score: 70 },
      ],
      scoresDetailed: [
        {
          round: '1라운드',
          score: 55,
          cause: '뒤에 팔이 관객을 잘 잡지 못하는 구조여서 사람을 놓쳤다.',
          lesson: '팀의 모형의 단점이 있으면 바로바로 고치고 문제점을 확인해야겠다.',
        },
        {
          round: '2라운드',
          score: 60,
          cause: '빨간탑이 부서지면 점수가 없는데 부서져 점수를 못 얻었다.',
          lesson: '탑 공략 시 물리적 충돌 및 감속 루틴 정밀 제어',
        },
        {
          round: '3라운드 (멀리건)',
          score: 70,
          cause:
            '마지막에 라인을 타는 프로그램에서 직진이 부족해 라인을 타는 과정이 잘못되어 점수를 못 얻었다.',
          lesson: '라인을 잘 타는지 안타는지 검토를 제대로 해야겠다.',
        },
      ],
      challengeMission: {
        title: '챌린지 미션',
        tasks: [
          {
            taskNumber: 1,
            name: '앵무새 구출 (Free the parrot)',
            description:
              '목표: 앵무새가 스폰서 로고 구역 안에 세워진 상태를 유지하도록 합니다. 완료 조건: 울타리를 흰색 로고 구역 밖으로 완전히 치웁니다.',
            score: '완료 시 20점 (최대 20점)',
          },
          {
            taskNumber: 2,
            name: '빨간 탑 쓰러뜨리기 (Knock down the tower)',
            description:
              '목표: 매 라운드 지정된 빨간색 위치 중 한 곳에 무작위로 놓인 큰 빨간 탑을 쓰러뜨립니다.',
            score: '탑을 쓰러뜨리면 25점 (최대 25점)',
          },
          {
            taskNumber: 3,
            name: '관람객 이동 (Move the visitors)',
            description:
              '목표: 빈 사각형 구역에 있는 관람객 4명을 발굴 현장(excavation site)으로 옮깁니다. 완료 조건: 관람객이 발굴 현장 안에 완전히 들어가 똑바로 서 있어야 합니다.',
            score: '1명당 15점 (최대 60점)',
          },
          {
            taskNumber: 4,
            name: '유물 재배치 (Rearrange the artefacts)',
            description:
              '목표: 무작위로 놓인 파란색·초록색·빨간색·노란색 유물을 박물관의 같은 색 전시 구역으로 옮깁니다.',
            score: '해당 전시 구역에 완전히 또는 일부 들어간 유물 1개당 20점 (최대 80점)',
          },
          {
            taskNumber: 5,
            name: '탑 쌓기 (Build the tower)',
            description:
              '목표: 시즌 챌린지와 위치가 바뀐 노란색 탑의 기둥(base)과 상단(top)을 찾아 상단을 기둥 위에 똑바로 올립니다.',
            score:
              '기둥이 노란색 목표 구역 안에 완전히 있으면 개당 20점 (최대 40점), 일부만 있으면 개당 15점',
          },
          {
            taskNumber: 6,
            name: '로봇 주차 (Park the robot)',
            description:
              '목표: 로봇이 주행 중 시작 구역을 완전히 한 번 이상 벗어난 뒤, 마지막에 시작 구역(Start area)으로 돌아옵니다. 완료 조건: 로봇이 시작 구역 안에 완전히 또는 일부 들어가 있어야 합니다.',
            score: '완료 시 15점 (최대 15점)',
          },
        ],
        images: [
          { name: '챌린지 미션 1', src: '/reviews/wro2026/challenge_mission.png' },
          { name: '챌린지 미션 2', src: '/reviews/wro2026/challenge_mission_2.jpg' },
        ],
      },
      strategy: '안되는것은 과감히 포기하고 할수 있는것 부터 함',
      strategyTasks: [
        '관객 3명 유물 픽업 위치에 갔다 놓는 미션',
        '빨간 탑을 넘어 뜨리는 미션',
        '로봇이 멈췄을때 시작지점에 있게 하는 미션(1라운드, 멀리건에서 작동 x : 라인을 타지 못함)',
      ],
      codeSummary:
        '멀리건 기회 활용 및 불안정한 미션을 과감히 제외하고 확정 점수 위주로 안정화',
      codeFile: {
        name: 'WRO_Challenge_MAIN.py',
        path: '/reviews/wro2026/WRO_Challenge_MAIN.py',
      },
      problemAndFix: {
        problem: '뒤에 있는 팔이 관객을 잘 잡지 못하는 구조였다.',
        solution: '뒤에 있는 팔의 길이를 늘려 관객을 잘 잡도록 하였다.',
      },
      mustFix:
        '한번에 많은 미션을 동시에 병행하지 않고 차근차근 자신이 할 수 있는 미션을 먼저 코드를 써야 한다',
    },
    libraryFile: {
      name: 'WRO_FINAL_2026_LIB.py',
      path: '/reviews/wro2026/WRO_FINAL_2026_LIB.py',
    },
    reflections: {
      strengths:
        '둘째 날, 1,2,3라운드 모두 점수가 실수로 인해 망했는데 4라운드 때 끝까지 포기하지 않아서 좋은 점수를 얻음',
      regrets:
        '둘째 날, 셋째 날 모두 실수 때문에 점수를 잘내지 못하였고 셋째 날에는 특히 못 하는 미션을 오래 붙잡아 두고 있어 시간을 낭비하였다.',
      improvements: '코드에서 콤마를 점으로 잘못 고쳐 실수를 범하였다.',
      mistakesList: [
        '시작 지점을 잘못 잡아서 로봇이 미션을 수행하지 못함',
        '마지막에 코드를 작성할 때 콤마를 마침표로 찍었다.',
        '함수 이름을 착각해 다른 곳에 있는 코드를 고쳐 로봇이 미션을 수행하지 못하였다.',
      ],
    },
    competitionDetails: {
      venueAndDate:
        'GMR Arena, Aerocity, Hyderabad, India / 2026년 9월 25일 ~ 27일',
      criticalRules:
        '유물 중 쓰러져도 그 색상에만 갔다 놓기만 하면 5점으로 처리됨 (우리나라의 룰과 달랐음)',
      ruleLessonLearned:
        '챌린지 미션 1라운드 때 룰 중 스타팅 지점에 마지막에 부분적으로 로봇이 포함되어 있으면 점수가 15점이 적립되는데 우리가 번역을 자세히 하지 못하여서 스타팅 지점에 나와 있어야지 15점을 얻는 줄 알아서 15점을 잃었다.',
      differencesFromPrevious:
        '미션 난이도가 쉽고 동선과 전략을 짜기가 훨씬 쉬웠다. (민규형 피셜)',
    },
    order: 1,
    updatedAt: new Date().toISOString(),
    lastSyncedAt: new Date().toISOString(),
  },
];

export const DEFAULT_EXTERNAL_SITES: ExternalSiteItem[] = [
  {
    id: 'site-wro-store',
    title: 'ROBO STORE',
    url: 'https://wro-2026-selling-site.vercel.app/',
    description: 'WRO & CoSpace Robotics 공식 스토어 및 리소스 사이트',
    category: 'STORE',
    isDefault: true,
    order: 0,
    updatedAt: new Date().toISOString(),
  },
];



