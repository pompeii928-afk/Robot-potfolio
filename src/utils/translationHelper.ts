import { AboutConfig, AwardItem, JourneyItem, ProjectItem, SkillItem, YouTubeVideoItem } from '../types';
import { Language } from '../context/ThemeContext';

// Multi-language dictionary mapping for common portfolio phrases
export const PORTFOLIO_TRANSLATIONS: Record<Language, Record<string, string>> = {
  ko: {
    '완주 성공률': '완주 성공률',
    '평균 미션 타임': '평균 미션 타임',
    '센서 반응 속도': '센서 반응 속도',
    '위치 추정 오차': '위치 추정 오차',
    '본선 수상': '본선 수상',
    '통신 레이턴시': '통신 레이턴시',
    '해커톤 결과': '해커톤 결과',
    '객체 인식률': '객체 인식률',
    '경진대회 수상': '경진대회 수상',
    '기술 우수상': '기술 우수상',
    '종합 대상': '종합 대상',
    '우수상': '우수상',
    '로봇 제작': '로봇 제작',
    '프로그래밍': '프로그래밍',
    '주행 테스트': '주행 테스트',
    '팀 리더': '팀 리더',
    'SLAM 매핑': 'SLAM 매핑',
    'Nav2 경로 계획': 'Nav2 경로 계획',
    '하드웨어 패키징': '하드웨어 패키징',
    'IoT 통신 프로토콜': 'IoT 통신 프로토콜',
    '중앙 관제 연동': '중앙 관제 연동',
    '모터 드라이버 제어': '모터 드라이버 제어',
    '컴퓨터 비전': '컴퓨터 비전',
    '장애물 회피': '장애물 회피',
    '기구 설계': '기구 설계',
    'ALL': '전체',
    'HARDWARE': '하드웨어',
    'ACTUATION': '구동계/모터',
    'PERCEPTION': '센서/인식',
    'FRAMEWORK': '프레임워크',
    'ALGORITHM': '알고리즘',
    'AI/VISION': '비전/AI',
    'SOFT_SKILL': '소프트 스킬',
    'Competition': '대회/실전',
    'Algorithm': '알고리즘',
    'Hardware': '하드웨어',
    'Field Test': '필드 테스트',
  },
  en: {
    '완주 성공률': 'Completion Rate',
    '평균 미션 타임': 'Avg Mission Time',
    '센서 반응 속도': 'Sensor Response',
    '위치 추정 오차': 'Pose Error',
    '본선 수상': 'Award Standing',
    '통신 레이턴시': 'Latency',
    '해커톤 결과': 'Hackathon Result',
    '객체 인식률': 'Recognition Accuracy',
    '경진대회 수상': 'Contest Standing',
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
    'ALL': 'ALL',
    'HARDWARE': 'HARDWARE',
    'ACTUATION': 'ACTUATION',
    'PERCEPTION': 'PERCEPTION',
    'FRAMEWORK': 'FRAMEWORK',
    'ALGORITHM': 'ALGORITHM',
    'AI/VISION': 'AI/VISION',
    'SOFT_SKILL': 'SOFT SKILLS',
    'Competition': 'Competition',
    'Algorithm': 'Algorithm',
    'Hardware': 'Hardware',
    'Field Test': 'Field Test',
  },
  ja: {
    '완주 성공률': '完走成功率',
    '평균 미션 타임': '平均ミッション時間',
    '센서 반응 속도': 'センサー応答速度',
    '위치 추정 오차': '自己位置推定誤差',
    '본선 수상': '本選受賞',
    '통신 레이턴시': '通信レイテンシ',
    '해커톤 결과': 'ハッカソン結果',
    '객체 인식률': '物体認識率',
    '경진대회 수상': '競技会受賞',
    '기술 우수상': '技術優秀賞',
    '종합 대상': '総合大賞',
    '우수상': '優秀賞',
    '로봇 제작': 'ロボット製作',
    '프로그래밍': 'プログラミング',
    '주행 테스트': '走行テスト',
    '팀 리더': 'チームリーダー',
    'SLAM 매핑': 'SLAMマッピング',
    'Nav2 경로 계획': 'Nav2経路計画',
    '하드웨어 패키징': 'ハードウェア実装',
    'IoT 통신 프로토콜': 'IoT通信プロトコル',
    '중앙 관제 연동': '中央管制連携',
    '모터 드라이버 제어': 'モーター制御',
    '컴퓨터 비전': 'コンピュータビジョン',
    '장애물 회피': '障害物回避',
    '기구 설계': '機構設計',
    'ALL': 'すべて',
    'HARDWARE': 'ハードウェア',
    'ACTUATION': '駆動・モーター',
    'PERCEPTION': 'センサー・認識',
    'FRAMEWORK': 'フレームワーク',
    'ALGORITHM': 'アルゴリズム',
    'AI/VISION': 'ビジョン/AI',
    'SOFT_SKILL': 'ソフトスキル',
    'Competition': '競技・実戦',
    'Algorithm': 'アルゴリズム',
    'Hardware': 'ハードウェア',
    'Field Test': 'フィールドテスト',
  },
  zh: {
    '완주 성공률': '完赛成功率',
    '평균 미션 타임': '平均任务用时',
    '센서 반응 속도': '传感器响应速度',
    '위치 추정 오차': '位姿估计误差',
    '본선 수상': '决赛奖项',
    '통신 레이턴시': '通信延迟',
    '해커톤 결과': '黑客松战绩',
    '객체 인식률': '目标识别率',
    '경진대회 수상': '竞赛获奖',
    '기술 우수상': '技术优秀奖',
    '종합 대상': '特等奖 (Grand Prize)',
    '우수상': '优秀奖',
    '로봇 제작': '机械制作',
    '프로그래밍': '程序编写',
    '주행 테스트': '运行测试',
    '팀 리더': '队长',
    'SLAM 매핑': 'SLAM建图',
    'Nav2 경로 계획': 'Nav2路径规划',
    '하드웨어 패키징': '硬件封装集成',
    'IoT 통신 프로토콜': 'IoT通信协议',
    '중앙 관제 연동': '中央集群调度',
    '모터 드라이버 제어': '电机驱动控制',
    '컴퓨터 비전': '计算机视觉',
    '장애물 회피': '避障算法',
    '기구 설계': '机构设计',
    'ALL': '全部',
    'HARDWARE': '硬件机构',
    'ACTUATION': '驱动控制',
    'PERCEPTION': '传感感知',
    'FRAMEWORK': '开发框架',
    'ALGORITHM': '算法逻辑',
    'AI/VISION': '视觉/AI',
    'SOFT_SKILL': '综合素养',
    'Competition': '比赛竞技',
    'Algorithm': '控制算法',
    'Hardware': '硬件结构',
    'Field Test': '实地路测',
  },
  es: {
    '완주 성공률': 'Tasa de finalización',
    '평균 미션 타임': 'Tiempo medio misión',
    '센서 반응 속도': 'Respuesta sensores',
    '위치 추정 오차': 'Error de pose',
    '본선 수상': 'Premio en finales',
    '통신 레이턴시': 'Latencia',
    '해커톤 결과': 'Resultado Hackathon',
    '객체 인식률': 'Precisión de detección',
    '경진대회 수상': 'Premio del concurso',
    '기술 우수상': 'Premio a la excelencia técnica',
    '종합 대상': 'Gran Premio',
    '우수상': 'Premio a la Excelencia',
    '로봇 제작': 'Fabricación de robot',
    '프로그래밍': 'Programación',
    '주행 테스트': 'Pruebas de conducción',
    '팀 리더': 'Líder de equipo',
    'SLAM 매핑': 'Mapeo SLAM',
    'Nav2 경로 계획': 'Planificación Nav2',
    '하드웨어 패키징': 'Empaquetado Hardware',
    'IoT 통신 프로토콜': 'Protocolos IoT',
    '중앙 관제 연동': 'Gestión de flotas',
    '모터 드라이버 제어': 'Control de motores',
    '컴퓨터 비전': 'Visión por computador',
    '장애물 회피': 'Evitación de obstáculos',
    '기구 설계': 'Diseño mecánico',
    'ALL': 'TODO',
    'HARDWARE': 'HARDWARE',
    'ACTUATION': 'ACTUACIÓN',
    'PERCEPTION': 'PERCEPCIÓN',
    'FRAMEWORK': 'FRAMEWORK',
    'ALGORITHM': 'ALGORITMO',
    'AI/VISION': 'IA/VISIÓN',
    'SOFT_SKILL': 'HABILIDADES BLANDAS',
    'Competition': 'Competición',
    'Algorithm': 'Algoritmo',
    'Hardware': 'Hardware',
    'Field Test': 'Pruebas de Campo',
  },
  de: {
    '완주 성공률': 'Abschlussquote',
    '평균 미션 타임': 'Durchschn. Missionszeit',
    '센서 반응 속도': 'Sensor-Reaktion',
    '위치 추정 오차': 'Positionsfehler',
    '본선 수상': 'Finalauszeichnung',
    '통신 레이턴시': 'Latenzzeit',
    '해커톤 결과': 'Hackathon-Ergebnis',
    '객체 인식률': 'Objekterkennungsrate',
    '경진대회 수상': 'Wettbewerbsauszeichnung',
    '기술 우수상': 'Technik-Exzellenzpreis',
    '종합 대상': 'Hauptpreis (Grand Prize)',
    '우수상': 'Exzellenzpreis',
    '로봇 제작': 'Roboterkonstruktion',
    '프로그래밍': 'Programmierung',
    '주행 테스트': 'Fahrtests',
    '팀 리더': 'Teamleitung',
    'SLAM 매핑': 'SLAM-Kartierung',
    'Nav2 경로 계획': 'Nav2-Pfadplanung',
    '하드웨어 패키징': 'Hardware-Integration',
    'IoT 통신 프로토콜': 'IoT-Protokolle',
    '중앙 관제 연동': 'Flottensteuerung',
    '모터 드라이버 제어': 'Motorsteuerung',
    '컴퓨터 비전': 'Computer Vision',
    '장애물 회피': 'Hindernisvermeidung',
    '기구 설계': 'Mechanik-Design',
    'ALL': 'ALLE',
    'HARDWARE': 'HARDWARE',
    'ACTUATION': 'AKTORIK',
    'PERCEPTION': 'SENSORIK',
    'FRAMEWORK': 'FRAMEWORK',
    'ALGORITHM': 'ALGORITHMEN',
    'AI/VISION': 'KI/VISION',
    'SOFT_SKILL': 'SOFT SKILLS',
    'Competition': 'Wettkampf',
    'Algorithm': 'Algorithmen',
    'Hardware': 'Hardware',
    'Field Test': 'Feldtest',
  },
  fr: {
    '완주 성공률': 'Taux de réussite',
    '평균 미션 타임': 'Temps moyen de mission',
    '센서 반응 속도': 'Réponse des capteurs',
    '위치 추정 오차': 'Erreur de pose',
    '본선 수상': 'Prix en finale',
    '통신 레이턴시': 'Latence réseau',
    '해커톤 결과': 'Résultat Hackathon',
    '객체 인식률': 'Précision de détection',
    '경진대회 수상': 'Prix du concours',
    '기술 우수상': 'Excellence technique',
    '종합 대상': 'Grand Prix',
    '우수상': 'Prix d\'Excellence',
    '로봇 제작': 'Fabrication robotique',
    '프로그래밍': 'Programmation',
    '주행 테스트': 'Essais de roulage',
    '팀 리더': 'Chef d\'équipe',
    'SLAM 매핑': 'Cartographie SLAM',
    'Nav2 경로 계획': 'Planification Nav2',
    '하드웨어 패키징': 'Intégration matérielle',
    'IoT 통신 프로토콜': 'Protocoles IoT',
    '중앙 관제 연동': 'Gestion de flotte',
    '모터 드라이버 제어': 'Contrôle moteur',
    '컴퓨터 비전': 'Vision par ordinateur',
    '장애물 회피': 'Évitement d\'obstacles',
    '기구 설계': 'Conception mécanique',
    'ALL': 'TOUT',
    'HARDWARE': 'MATÉRIEL',
    'ACTUATION': 'ACTIONNEMENT',
    'PERCEPTION': 'PERCEPTION',
    'FRAMEWORK': 'FRAMEWORK',
    'ALGORITHM': 'ALGORITHME',
    'AI/VISION': 'IA/VISION',
    'SOFT_SKILL': 'SAVOIR-ÊTRE',
    'Competition': 'Compétition',
    'Algorithm': 'Algorithmes',
    'Hardware': 'Matériel',
    'Field Test': 'Essais terrain',
  },
};

// Localized About Bios for all 7 languages
export const ABOUT_LANG_MAP: Record<Language, { quote: string; bio: string; subBio: string; goal: string }> = {
  ko: {
    quote: '"결과 뿐만 아니라 내가 개선하고 시도하여 얻은 성과와 과정을 보여준다."',
    bio: '여러 로봇 대회에 참가하며 로봇과 코딩에 대한 지식과 경험을 쌓고 있다. 또한 로봇의 구조를 연구하며 작동 원리를 이해하고, 이를 실제 제작과 코딩에 적용해 보고 있다.',
    subBio: '로봇 공학에 열정을 품고 새로운 기술을 탐구하는 배지훈입니다. 하드웨어 제어부터 자율 주행 소프트웨어까지 다양한 프로젝트를 수행하며 미래를 설계하고 있습니다.',
    goal: '로봇을 직접 창작할 수 있도록 많은 경험을 쌓는 것',
  },
  en: {
    quote: '"Demonstrating not only the outcomes, but the iterative improvements, trials, and engineering journey along the way."',
    bio: 'Accumulating rich knowledge and hands-on experience in robotics and coding through competitive tournaments. Researching mechanical architectures, understanding kinematic principles, and putting them into practice with custom builds and software.',
    subBio: 'Passionate robotics engineer Jihoon Bae exploring cutting-edge autonomy. From embedded hardware control to autonomous navigation, engineering the future through diverse robotic projects.',
    goal: 'Accumulating extensive engineering experience to pioneer and create original autonomous robotic systems',
  },
  ja: {
    quote: '「単なる結果だけでなく、改善と試行錯誤を通じて得た成果と工学的プロセスを伝えます。」',
    bio: '様々なロボット競技会に参加し、ロボット工学とプログラミングの実践的な知識と経験を深めています。機構構造の研究と動作原理の探求を通じ、実機の設計・製作から制御プログラミングまで幅広く取り組んでいます。',
    subBio: 'ロボット工学に情熱を注ぎ、最先端の自律走行技術を探求するエンジニア、ペ・ジフン（Jihoon Bae）です。ハードウェア制御から自律走行ソフトウェアまで多様なプロジェクトを遂行しています。',
    goal: 'オリジナルの自律型ロボットを自在に創作できるよう、豊富な工学経験を培うこと',
  },
  zh: {
    quote: '“不仅展示最终成果，更记录每一次改进、试错与问题攻关中所积累的工程经验。”',
    bio: '通过参加多项机器人大赛，积累了扎实的机器人与软件编程知识。深入研究机械结构与运动原理，掌握从机构自主创作到软硬件协同控制的全栈开发能力。',
    subBio: '专注于机器人工程与自动驾驶技术的研发工程师裴志勋（Jihoon Bae）。从硬件驱动到自主导航软件，全方位开展工程实践。',
    goal: '积累深厚的工程实践经验，打造具有自主原创性的智能机器人系统',
  },
  es: {
    quote: '"Demostrando no solo los resultados finales, sino también las mejoras iterativas, las pruebas y los procesos de ingeniería."',
    bio: 'Acumulando sólidos conocimientos y experiencia práctica en robótica y programación mediante la participación en competiciones. Investigando arquitecturas mecánicas y aplicando principios cinemáticos en construcciones y software reales.',
    subBio: 'Ingeniero de robótica apasionado por las nuevas tecnologías. Desde el control de hardware hasta el software de navegación autónoma, diseñando robots para misiones reales.',
    goal: 'Adquirir una amplia experiencia en ingeniería para diseñar y crear robots autónomos propios',
  },
  de: {
    quote: '„Nicht nur die Endergebnisse präsentieren, sondern den Prozess des kontinuierlichen Verbesserns, Ausprobierens und Lernens zeigen.“',
    bio: 'Erwerb fundierter Kenntnisse in Robotik und Softwareentwicklung durch die Teilnahme an internationalen Wettbewerben. Erforschung mechanischer Systeme und direkte Umsetzung in Konstruktion und Steuerung.',
    subBio: 'Engagierter Robotikingenieur Jihoon Bae, der moderne autonome Technologien erforscht. Von Hardware-Steuerung bis zu Navigationsalgorithmen.',
    goal: 'Umfassende Ingenieurerfahrung sammeln, um eigenständig innovative Robotersysteme zu erschaffen',
  },
  fr: {
    quote: '« Mettre en valeur non seulement les résultats finaux, mais aussi les améliorations, les essais et les avancées d\'ingénierie tout au long du parcours. »',
    bio: 'Développement d\'une solide expertise en robotique et en programmation à travers diverses compétitions. Recherche sur les architectures mécaniques et mise en œuvre concrète en conception et codage.',
    subBio: 'Ingénieur en robotique passionné par les technologies autonomes. Du contrôle matériel embarqué aux logiciels de navigation autonome.',
    goal: 'Accumuler une riche expérience d\'ingénierie pour concevoir et fabriquer ses propres robots',
  },
};

// Full multi-language Journey mapping
const JOURNEY_MAP: Record<Language, Record<string, Partial<JourneyItem>>> = {
  ko: {
    'wro-2026': {
      title: 'World Robot Olympiad (WRO) 2026',
      competition: 'WRO 2026 KOREA',
      award: '2위 Think Award',
      roles: ['로봇 제작', '프로그래밍', '주행 테스트', '팀 리더'],
      strengths: '대회장에서 잘 되던 미션이 자꾸 안되었을 때 당황하지 않고 침착하게 그 문제를 해결한 것',
      improvements: '1라운드 점수가 좋아서 안심하다가, 2라운드 연습 시간에 문제를 제때 확인하지 못한 것',
      quote: '“대회 전까지 팀이 꾸준히 노력한 끝에 성장할 수 있었던 대회”',
      summary: 'WRO(World Robot Olympiad) RoboMission 종목 참가. 고정밀 자율주행 및 복합 미션 수행 로봇 개발.',
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
    'irc-2023-11': {
      title: '국제 로봇 콘테스트 본선 진출',
      competition: '국제 로봇 콘테스트 (IRC)',
      award: '기술 우수상',
      roles: ['SLAM 매핑', 'Nav2 경로 계획', '하드웨어 패키징'],
      strengths: '라이다와 뎁스 카메라 센서 퓨전을 통해 미지의 맵에서도 안정적인 동적 장애물 회피를 구현함',
      improvements: '급격한 회전 구간에서 주행 모터 슬립 현상에 대한 오도메트리 보정이 다소 지연되었던 점 개선 필요',
      quote: '“실제 필드 테스트를 통해 이론과 현실 센서 노이즈의 격차를 좁힌 소중한 기회”',
      summary: '자율주행 배달 로봇 부문 본선 진출 및 기술 우수상 수상.',
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
    'hackathon-2023-08': {
      title: '스마트 팩토리 물류 로봇 해커톤 대상',
      competition: '스마트 팩토리 물류 로봇 해커톤',
      award: '종합 대상 (1위)',
      roles: ['IoT 통신 프로토콜', '중앙 관제 연동', '모터 드라이버 제어'],
      strengths: 'MQTT 기반의 실시간 중앙 관제 시스템과 로봇 간 지연 없는 양방향 텔레메트리 전송 구현',
      improvements: '배터리 전압 강하에 따른 토크 저하 방지를 위한 전원 관리 회로 보강 필요',
      quote: '“48시간 동안 하드웨어와 클라우드 관제를 완벽하게 융합한 팀워크의 결실”',
      summary: 'IoT 기반 스마트 팩토리 물류 로봇 시스템 프로토타입 개발.',
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
    'creator-2022-05': {
      title: '창작 로봇 경진대회 우수상',
      competition: '창작 로봇 경진대회',
      award: '우수상',
      roles: ['컴퓨터 비전', '장애물 회피', '기구 설계'],
      strengths: 'OpenCV 기반 실시간 물체 인식 및 색상 기반 타겟 트래킹의 높은 정확도',
      improvements: '조도 변화에 취약했던 HSV 색공간 임계값 필터링을 적응형 알고리즘으로 발전시킴',
      quote: '“소프트웨어 비전 알고리즘이 물리적 하드웨어와 만나는 첫 번째 도약”',
      summary: '장애물 회피 및 객체 인식 알고리즘 구현 우수상.',
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
  },
  en: {
    'wro-2026': {
      title: 'World Robot Olympiad 2026',
      competition: 'WRO 2026 KOREA',
      award: '2nd Place Think Award',
      roles: ['Robot Fabrication', 'Programming', 'Drive Testing', 'Team Lead'],
      strengths: 'Remained calm and methodically resolved sudden mission failures on the competition field under intense time pressure.',
      improvements: 'Learned to maintain strict vigilance throughout subsequent rounds rather than letting high Round 1 scores delay root-cause debugging.',
      quote: '“A tournament where steady team effort translated into tangible engineering growth.”',
      summary: 'Competed in WRO RoboMission Senior Category. Engineered high-precision autonomous navigation and multi-mission handling robot.',
      description: 'Competed in WRO RoboMission Senior Category. Engineered high-precision autonomous navigation and multi-mission handling robot.',
      detailedPoints: [
        'Implemented high-speed dual color sensor PID line-tracking control algorithm',
        'Engineered intelligent mission object classification and gripper loading mechanism',
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
      competition: 'International Robot Contest (IRC)',
      award: 'Technical Excellence Award',
      roles: ['SLAM Mapping', 'Nav2 Path Planning', 'Hardware Packaging'],
      strengths: 'Achieved stable dynamic obstacle avoidance in uncharted indoor environments using LiDAR-depth camera sensor fusion.',
      improvements: 'Addressed wheel slippage during rapid sharp turns by integrating an IMU-fused odometry compensation routine.',
      quote: '“A pivotal milestone that bridged the gap between theoretical algorithms and real-world sensor noise.”',
      summary: 'Qualified for national finals in the Autonomous Delivery Robot category and won the Technical Excellence Award.',
      description: 'Qualified for national finals in the Autonomous Delivery Robot category and won the Technical Excellence Award.',
      detailedPoints: [
        'ROS 2 Humble distributed nodes for Cartographer 2D SLAM mapping and localized navigation',
        'Applied Euclidean clustering on 2D LiDAR point clouds for real-time pedestrian obstacle avoidance',
      ],
      metrics: [
        { label: 'Pose Error', value: '< 2.5cm' },
        { label: 'Award Standing', value: 'Tech Excellence' },
      ],
    },
    'hackathon-2023-08': {
      title: 'Smart Factory Logistics Robot Hackathon',
      competition: 'Smart Factory Logistics Robot Hackathon',
      award: 'Grand Prize (1st Place)',
      roles: ['IoT Protocols', 'Fleet Management', 'Motor Control'],
      strengths: 'Constructed ultra-low latency bidirectional telemetry between edge robots and cloud dispatch dashboard via MQTT.',
      improvements: 'Implemented constant-voltage power management circuitry to prevent motor torque drop during peak draw.',
      quote: '“The fruit of intensive 48-hour teamwork seamlessly merging hardware kinematics and cloud fleet control.”',
      summary: 'Prototyped an IoT-enabled smart logistics autonomous mobile robot platform with real-time fleet orchestration.',
      description: 'Prototyped an IoT-enabled smart logistics autonomous mobile robot platform with real-time fleet orchestration.',
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
      award: 'Excellence Award',
      roles: ['Computer Vision', 'Obstacle Avoidance', 'Mechanism Design'],
      strengths: 'Delivered high tracking fidelity using OpenCV-based real-time color segmentation and target tracking.',
      improvements: 'Upgraded static HSV thresholding to adaptive histogram filtering for robust performance across variable lighting.',
      quote: '“The initial milestone where computer vision algorithms directly powered physical robot kinematics.”',
      summary: 'Engineered vision-guided object tracking and ultrasonic collision avoidance for autonomous navigation.',
      description: 'Engineered vision-guided object tracking and ultrasonic collision avoidance for autonomous navigation.',
      detailedPoints: [
        'Real-time target tracking via OpenCV color and geometry segmentation',
        'Sensor fusion emergency stop system uniting ultrasonic arrays and vision data',
      ],
      metrics: [
        { label: 'Recognition Accuracy', value: '94.2%' },
        { label: 'Contest Standing', value: 'Excellence Award' },
      ],
    },
  },
  ja: {
    'wro-2026': {
      title: 'World Robot Olympiad 2026',
      competition: 'WRO 2026 KOREA',
      award: '2位 Think Award 受賞',
      roles: ['ロボット製作', 'プログラミング', '走行テスト', 'チームリーダー'],
      strengths: '激しいプレッシャーの中、競技フィールド上で発生した予期せぬトラブルにも冷静に対処し解決。',
      improvements: 'ラウンド1のハイスコアに油断せず、後続ラウンドでも徹底したデータ点検を行う重要性を体得。',
      quote: '「チーム全員の情熱が確かな工学的成長へと結実した、忘れられない大会となりました。」',
      summary: 'WRO RoboMission Senior部門に出場。高精度自律走行および複合ミッション処理ロボットを開発。',
      description: 'WRO RoboMission Senior部門に出場。高精度自律走行および複合ミッション処理ロボットを開発。',
      detailedPoints: [
        'デュアルカラーセンサーによる高速PIDライントレース制御アルゴリズム',
        'ラック＆ピニオン式ペイロードグリッパーおよびミッションオブジェクト自動判別',
        'フィールドの光環境や摩擦変化に対応する適応型自動キャリブレーション機能の実装',
        'チームリーダーとしての現場トラブルシューティングと迅速なタスク配分',
      ],
      metrics: [
        { label: '完走成功率', value: '96.4%' },
        { label: '平均ミッション時間', value: '1分 24秒' },
        { label: 'センサー応答速度', value: '10ms' },
      ],
    },
    'irc-2023-11': {
      title: '国際ロボットコンテスト 本選進出',
      competition: '国際ロボットコンテスト (IRC)',
      award: '技術優秀賞',
      roles: ['SLAMマッピング', 'Nav2経路計画', 'ハードウェア実装'],
      strengths: 'LiDARと深度カメラのセンサーフュージョンにより、未知の環境でも安定した動的障害物回避を実現。',
      improvements: '急旋回時の車輪スリップに対するオドメトリ補正の遅延を改善。',
      quote: '「実機フィールドテストを通じ、理論と現実のセンサーノイズの差異を克服した貴重な機会。」',
      summary: '自律走行配達ロボット部門本選進出および技術優秀賞を受賞。',
      description: '自律走行配達ロボット部門本選進出および技術優秀賞を受賞。',
      detailedPoints: [
        'ROS 2 HumbleによるCartographer 2D SLAMマップ構築および自律走行ノード分散化',
        '歩行者障害物検知のための2D LiDARクラスタリングアルゴリズム適用',
      ],
      metrics: [
        { label: '自己位置推定誤差', value: '< 2.5cm' },
        { label: '本選受賞', value: '技術優秀賞' },
      ],
    },
    'hackathon-2023-08': {
      title: 'スマートファクトリー物流ロボットハッカソン 大賞',
      competition: 'スマートファクトリー物流ロボットハッカソン',
      award: '総合大賞 (1位)',
      roles: ['IoT通信プロトコル', '中央管制連携', 'モーター制御'],
      strengths: 'MQTTに基づくリアルタイム中央管制とロボット間の低遅延双方向通信を構築。',
      improvements: '急激なトルク要求時の電圧降下を抑制する電源管理回路の強化。',
      quote: '「48時間のチームワークでハードウェアとクラウド管制を融合させた結実。」',
      summary: 'IoTベースのスマート物流自律移動ロボットプロトタイプを開発。',
      description: 'IoTベースのスマート物流自律移動ロボットプロトタイプを開発。',
      detailedPoints: [
        'MQTT & WebSocketによるマルチロボット交通調整およびタスク自動配分',
        'エンコーダー付き4輪独立制御による超信地旋回（Spin-turn）機構の適用',
      ],
      metrics: [
        { label: '通信レイテンシ', value: '18ms' },
        { label: 'ハッカソン結果', value: '総合大賞' },
      ],
    },
    'creator-2022-05': {
      title: '創作ロボット競技会 優秀賞',
      competition: '創作ロボット競技会',
      award: '優秀賞',
      roles: ['コンピュータビジョン', '障害物回避', '機構設計'],
      strengths: 'OpenCVに基づくリアルタイム色認識とターゲット追従の高い追従精度を実現。',
      improvements: '環境光の変化に強い適応型色空間フィルタリングへと進化。',
      quote: '「ビジョンアルゴリズムが物理ハードウェアを直接駆動する第一歩。」',
      summary: '障害物回避と物体認識アルゴリズムを実装し優秀賞を受賞。',
      description: '障害物回避と物体認識アルゴリズムを実装し優秀賞を受賞。',
      detailedPoints: [
        'OpenCVによる色と輪郭のフィルタリングを用いたリアルタイムターゲット追従',
        '超音波センサーアレイとビジョン融合による安全停止システム',
      ],
      metrics: [
        { label: '物体認識率', value: '94.2%' },
        { label: '競技会受賞', value: '優秀賞' },
      ],
    },
  },
  zh: {
    'wro-2026': {
      title: 'World Robot Olympiad 2026',
      competition: 'WRO 2026 KOREA',
      award: '亚军 Think Award',
      roles: ['机械制作', '程序编写', '运行测试', '队长'],
      strengths: '在高压竞赛现场沉着应对突发任务故障，快速完成根因定位与修复。',
      improvements: '深刻体会到不可因首轮高分而松懈，需在后续所有轮次保持严密的数据监测。',
      quote: '“团队全力以赴的付出最终化为了实实在在的工程实力与成长。”',
      summary: '参加WRO RoboMission Senior组别，研发高精度自律巡线与多任务抓取机器人平台。',
      description: '参加WRO RoboMission Senior组别，研发高精度自律巡线与多任务抓取机器人平台。',
      detailedPoints: [
        '双颜色传感器高速PID巡线闭环控制算法',
        '齿轮齿条式机械抓手与智能任务目标颜色识别分类',
        '应对赛场光照与摩擦力变化的自适应传感器校准程序',
        '作为队长统筹现场突发排错与任务调度',
      ],
      metrics: [
        { label: '完赛成功率', value: '96.4%' },
        { label: '平均任务用时', value: '1分 24秒' },
        { label: '传感器响应速度', value: '10ms' },
      ],
    },
    'irc-2023-11': {
      title: '国际机器人大赛 晋级全国决赛',
      competition: '国际机器人大赛 (IRC)',
      award: '技术优秀奖',
      roles: ['SLAM建图', 'Nav2路径规划', '硬件封装集成'],
      strengths: '通过激光雷达与深度相机多源融合，在未知室内地图中实现稳定的动态避障。',
      improvements: '改进急转弯工况下的驱动轮打滑里程计补偿滤波。',
      quote: '“通过真实场地实测，缩小了理论算法与物理传感器噪声之间的鸿沟。”',
      summary: '自主配送机器人组别晋级全国总决赛并荣获技术优秀奖。',
      description: '自主配送机器人组别晋级全国总决赛并荣获技术优秀奖。',
      detailedPoints: [
        '基于ROS 2 Humble与Cartographer 2D SLAM进行建图与自主导航',
        '基于激光雷达点云欧氏聚类的行人动态识别与安全避障',
      ],
      metrics: [
        { label: '位姿估计误差', value: '< 2.5cm' },
        { label: '决赛奖项', value: '技术优秀奖' },
      ],
    },
    'hackathon-2023-08': {
      title: '智能制造物流机器人黑客松 特等奖',
      competition: '智能制造物流机器人黑客松',
      award: '特等奖 (第一名)',
      roles: ['IoT通信协议', '中央集群调度', '电机驱动控制'],
      strengths: '构建了基于MQTT的高并发低延迟中央调度与机器人端双向遥测系统。',
      improvements: '优化峰值负载时的稳压供电管理回路，保障电机输出扭矩。',
      quote: '“48小时高强度协作，将底层机械与云端集群调度完美融合。”',
      summary: '成功研发基于物联网的智能物流自主移动机器人（AMR）原型系统。',
      description: '成功研发基于物联网的智能物流自主移动机器人（AMR）原型系统。',
      detailedPoints: [
        '利用MQTT与WebSocket实现多机器人流量协调与实时任务派发',
        '4轮独立编码器电机控制实现原地零半径回转（Spin-turn）',
      ],
      metrics: [
        { label: '通信延迟', value: '18ms' },
        { label: '黑客松战绩', value: '特等奖' },
      ],
    },
    'creator-2022-05': {
      title: '创意机器人大赛 优秀奖',
      competition: '创意机器人大赛',
      award: '优秀奖',
      roles: ['计算机视觉', '避障算法', '机构设计'],
      strengths: '基于OpenCV实现高精度的实时色块识别与移动目标精准跟踪。',
      improvements: '由固定阈值升级为自适应光照直方图均衡化色彩过滤算法。',
      quote: '“视觉算法直接驱动物理机构执行动作的重要启蒙里程碑。”',
      summary: '完成避障与目标视觉识别算法实现，荣获优秀奖。',
      description: '完成避障与目标视觉识别算法实现，荣获优秀奖。',
      detailedPoints: [
        '基于OpenCV颜色与形态学滤波的实时目标识别',
        '超声波传感器阵列与视觉融合的主动安全刹车系统',
      ],
      metrics: [
        { label: '目标识别率', value: '94.2%' },
        { label: '竞赛获奖', value: '优秀奖' },
      ],
    },
  },
  es: {
    'wro-2026': {
      title: 'World Robot Olympiad 2026',
      competition: 'WRO 2026 KOREA',
      award: '2º Puesto Think Award',
      roles: ['Fabricación de robot', 'Programación', 'Pruebas de conducción', 'Líder de equipo'],
      strengths: 'Resolución metódica y calmada de fallos imprevistos en pista bajo intensa presión competitiva.',
      improvements: 'Mantenimiento de la disciplina de inspección en todas las rondas posteriores.',
      quote: '“Un torneo donde el esfuerzo continuo del equipo se tradujo en verdadero crecimiento de ingeniería.”',
      summary: 'Participación en WRO RoboMission Senior. Desarrollo de plataforma robótica autónoma de alta precisión.',
      description: 'Participación en WRO RoboMission Senior. Desarrollo de plataforma robótica autónoma de alta precisión.',
      detailedPoints: [
        'Algoritmo PID de seguimiento de línea con sensores ópticos duales de alta velocidad',
        'Mecanismo de pinza con cremallera y piñón para carga de objetos de misión',
        'Calibración adaptativa de sensores ante variaciones de luz y fricción de pista',
        'Liderazgo de equipo y resolución de incidencias en directo el día de la prueba',
      ],
      metrics: [
        { label: 'Tasa de finalización', value: '96.4%' },
        { label: 'Tiempo medio misión', value: '1m 24s' },
        { label: 'Respuesta sensores', value: '10ms' },
      ],
    },
    'irc-2023-11': {
      title: 'Concurso Internacional de Robótica (IRC)',
      competition: 'Concurso Internacional de Robótica (IRC)',
      award: 'Premio a la Excelencia Técnica',
      roles: ['Mapeo SLAM', 'Planificación Nav2', 'Empaquetado Hardware'],
      strengths: 'Evasión de obstáculos dinámicos en interiores mediante fusión sensorial LiDAR y cámara de profundidad.',
      improvements: 'Compensación de deslizamiento de ruedas en giros cerrados mediante fusión IMU-odometría.',
      quote: '“Un hito clave que unió la teoría algorítmica con el ruido real de los sensores.”',
      summary: 'Clasificación para las finales nacionales en la categoría de robot de reparto autónomo.',
      description: 'Clasificación para las finales nacionales en la categoría de robot de reparto autónomo.',
      detailedPoints: [
        'Nodos distribuidos ROS 2 Humble para mapeo 2D Cartographer SLAM y navegación',
        'Agrupamiento euclidiano en nubes de puntos LiDAR para detección de peatones',
      ],
      metrics: [
        { label: 'Error de pose', value: '< 2.5cm' },
        { label: 'Premio en finales', value: 'Excelencia Técnica' },
      ],
    },
    'hackathon-2023-08': {
      title: 'Hackathon de Robots Logísticos Smart Factory',
      competition: 'Hackathon de Robots Logísticos',
      award: 'Gran Premio (1er Lugar)',
      roles: ['Protocolos IoT', 'Gestión de flotas', 'Control de motores'],
      strengths: 'Telemetría bidireccional de baja latencia entre robots y panel en la nube mediante MQTT.',
      improvements: 'Refuerzo de circuitos de potencia para evitar caídas de tensión en picos de par motor.',
      quote: '“El fruto de 48 horas intensas uniendo cinemática mecánica y control en la nube.”',
      summary: 'Prototipo de robot móvil autónomo (AMR) para logística inteligente con orquestación IoT.',
      description: 'Prototipo de robot móvil autónomo (AMR) para logística inteligente con orquestación IoT.',
      detailedPoints: [
        'Coordinación de tráfico multi-robot y asignación en tiempo real por MQTT y WebSocket',
        'Control independiente de 4 ruedas con encoders para giros sobre el propio eje',
      ],
      metrics: [
        { label: 'Latencia', value: '18ms' },
        { label: 'Resultado Hackathon', value: 'Gran Premio' },
      ],
    },
    'creator-2022-05': {
      title: 'Concurso de Robótica Creativa Premio a la Excelencia',
      competition: 'Concurso de Robótica Creativa',
      award: 'Premio a la Excelencia',
      roles: ['Visión por computador', 'Evitación de obstáculos', 'Diseño mecánico'],
      strengths: 'Alta precisión en seguimiento de objetivos y segmentación de color en tiempo real con OpenCV.',
      improvements: 'Algoritmo adaptativo frente a cambios bruscos de iluminación ambiental.',
      quote: '“El primer gran paso donde la visión artificial controló la mecánica física del robot.”',
      summary: 'Implementación de visión artificial y sensores de ultrasonido para navegación autónoma.',
      description: 'Implementación de visión artificial y sensores de ultrasonido para navegación autónoma.',
      detailedPoints: [
        'Seguimiento en tiempo real mediante filtrado de color y formas en OpenCV',
        'Sistema de frenado de seguridad por fusión de ultrasonidos y visión',
      ],
      metrics: [
        { label: 'Precisión de detección', value: '94.2%' },
        { label: 'Premio del concurso', value: 'Premio Excelencia' },
      ],
    },
  },
  de: {
    'wro-2026': {
      title: 'World Robot Olympiad 2026',
      competition: 'WRO 2026 KOREA',
      award: '2. Platz Think Award',
      roles: ['Roboterkonstruktion', 'Programmierung', 'Fahrtests', 'Teamleitung'],
      strengths: 'Ruhige und methodische Fehlerbehebung unter extremem Zeitdruck auf dem Wettbewerbsfeld.',
      improvements: 'Konsequente Datenkontrolle über alle Wettkampfrunden hinweg beibehalten.',
      quote: '„Ein Wettbewerb, bei dem stetige Teamarbeit zu greifbarem ingenieurtechnischem Wachstum führte.“',
      summary: 'Teilnahme an der WRO RoboMission Senior. Entwicklung eines hochpräzisen autonomen Roboters.',
      description: 'Teilnahme an der WRO RoboMission Senior. Entwicklung eines hochpräzisen autonomen Roboters.',
      detailedPoints: [
        'Dual-Farbsensor PID-Linienverfolgung mit optimierter Kurvendynamik',
        'Zahnstangen-Greifmechanismus zur automatischen Missionsziel-Handhabung',
        'Adaptive Sensorkalibrierung gegen Licht- und Reibungsschwankungen',
        'Teamführung und Live-Fehlerbehebung am Wettkampftag',
      ],
      metrics: [
        { label: 'Abschlussquote', value: '96.4%' },
        { label: 'Durchschn. Missionszeit', value: '1m 24s' },
        { label: 'Sensor-Reaktion', value: '10ms' },
      ],
    },
    'irc-2023-11': {
      title: 'Internationaler Robotik-Wettbewerb (IRC) Finale',
      competition: 'Internationaler Robotik-Wettbewerb (IRC)',
      award: 'Technik-Exzellenzpreis',
      roles: ['SLAM-Kartierung', 'Nav2-Pfadplanung', 'Hardware-Integration'],
      strengths: 'Stabile dynamische Hindernisvermeidung durch Sensorfusion von LiDAR und Tiefenkamera.',
      improvements: 'Optimierung der Odometrie-Kompensation bei schnellen Drehmanövern.',
      quote: '„Ein Meilenstein, der die Lücke zwischen theoretischen Algorithmen und realem Sensorrauschen schloss.“',
      summary: 'Finalqualifikation im Bereich autonomer Lieferroboter und Gewinn des Technikpreises.',
      description: 'Finalqualifikation im Bereich autonomer Lieferroboter und Gewinn des Technikpreises.',
      detailedPoints: [
        'ROS 2 Humble Cartographer 2D SLAM Kartierung und autonome Navigation',
        'Punktwolken-Clustering zur Erkennung dynamischer Hindernisse und Fußgänger',
      ],
      metrics: [
        { label: 'Positionsfehler', value: '< 2.5cm' },
        { label: 'Finalauszeichnung', value: 'Technik-Exzellenz' },
      ],
    },
    'hackathon-2023-08': {
      title: 'Smart Factory Logistik-Roboter Hackathon',
      competition: 'Logistik-Roboter Hackathon',
      award: 'Hauptpreis (1. Platz)',
      roles: ['IoT-Protokolle', 'Flottensteuerung', 'Motorsteuerung'],
      strengths: 'Echtzeit-Telemetrie mit minimaler Latenz zwischen Robotern und Leitstand via MQTT.',
      improvements: 'Verbesserte Spannungsregelung zur Vermeidung von Drehmomentabfällen bei Spitzenlast.',
      quote: '„Das Ergebnis von 48 Stunden intensiver Teamarbeit zwischen Hardware und Cloud-Leitsystem.“',
      summary: 'Prototyp eines autonomen mobilen Logistikroboters mit vernetzter Flottensteuerung.',
      description: 'Prototyp eines autonomen mobilen Logistikroboters mit vernetzter Flottensteuerung.',
      detailedPoints: [
        'Mehrroboter-Verkehrskoordination und Auftragsdisposition über MQTT und WebSockets',
        '4-Rad Einzelradsteuerung für unterbrechungsfreie Drehungen auf der Stelle',
      ],
      metrics: [
        { label: 'Latenzzeit', value: '18ms' },
        { label: 'Hackathon-Ergebnis', value: 'Hauptpreis' },
      ],
    },
    'creator-2022-05': {
      title: 'Kreativ-Robotik-Wettbewerb Exzellenzpreis',
      competition: 'Kreativ-Robotik-Wettbewerb',
      award: 'Exzellenzpreis',
      roles: ['Computer Vision', 'Hindernisvermeidung', 'Mechanik-Design'],
      strengths: 'Hohe Tracking-Präzision durch OpenCV-basierte Farberkennung in Echtzeit.',
      improvements: 'Erweiterung auf adaptive Bildverarbeitung bei wechselndem Umgebungslicht.',
      quote: '„Der erste große Durchbruch, bei dem Bildverarbeitung die physische Kinematik steuerte.“',
      summary: 'Entwicklung von Bildverarbeitung und Ultraschall-Hindernisvermeidung.',
      description: 'Entwicklung von Bildverarbeitung und Ultraschall-Hindernisvermeidung.',
      detailedPoints: [
        'Objektverfolgung in Echtzeit mit Farb- und Konturfilterung in OpenCV',
        'Not-Stopp-Sicherheitssystem durch Fusion von Ultraschall und Kameradaten',
      ],
      metrics: [
        { label: 'Objekterkennungsrate', value: '94.2%' },
        { label: 'Wettbewerbsauszeichnung', value: 'Exzellenzpreis' },
      ],
    },
  },
  fr: {
    'wro-2026': {
      title: 'World Robot Olympiad 2026',
      competition: 'WRO 2026 KOREA',
      award: '2e Prix Think Award',
      roles: ['Fabrication robotique', 'Programmation', 'Essais de roulage', 'Chef d\'équipe'],
      strengths: 'Résolution méthodique et sereine des imprévus sur le terrain sous haute pression.',
      improvements: 'Maintien d\'une rigueur constante de contrôle à chaque manche de la compétition.',
      quote: '« Une compétition où le travail d\'équipe s\'est concrétisé en une véritable maturité d\'ingénierie. »',
      summary: 'Participation à la WRO RoboMission Senior. Conception d\'un robot autonome de haute précision.',
      description: 'Participation à la WRO RoboMission Senior. Conception d\'un robot autonome de haute précision.',
      detailedPoints: [
        'Algorithme PID de suivi de ligne à double capteur optique haute fréquence',
        'Mécanisme de pince à crémaillère pour chargement automatique des objets de mission',
        'Étalonnage adaptatif des capteurs face aux variations de luminosité et de frottement',
        'Direction de l\'équipe et dépannage en temps réel le jour de l\'épreuve',
      ],
      metrics: [
        { label: 'Taux de réussite', value: '96.4%' },
        { label: 'Temps moyen de mission', value: '1m 24s' },
        { label: 'Réponse des capteurs', value: '10ms' },
      ],
    },
    'irc-2023-11': {
      title: 'Concours International de Robotique (IRC)',
      competition: 'Concours International de Robotique (IRC)',
      award: 'Prix d\'Excellence Technique',
      roles: ['Cartographie SLAM', 'Planification Nav2', 'Intégration matérielle'],
      strengths: 'Évitement stable d\'obstacles dynamiques grâce à la fusion capteur LiDAR et caméra de profondeur.',
      improvements: 'Compensation du glissement des roues dans les virages serrés par fusion odométrie-IMU.',
      quote: '« Une étape clé qui a comblé l\'écart entre algorithmes théoriques et bruits de capteurs réels. »',
      summary: 'Qualification en finale nationale dans la catégorie robot livreur autonome et prix technique.',
      description: 'Qualification en finale nationale dans la catégorie robot livreur autonome et prix technique.',
      detailedPoints: [
        'Nœuds distribués ROS 2 Humble pour la cartographie Cartographer 2D SLAM et navigation',
        'Clustering euclidien sur nuages de points LiDAR pour la détection dynamique des piétons',
      ],
      metrics: [
        { label: 'Erreur de pose', value: '< 2.5cm' },
        { label: 'Prix en finale', value: 'Excellence Tech' },
      ],
    },
    'hackathon-2023-08': {
      title: 'Hackathon Robotique Logistique Smart Factory',
      competition: 'Hackathon Robotique Logistique',
      award: 'Grand Prix (1ère Place)',
      roles: ['Protocoles IoT', 'Gestion de flotte', 'Contrôle moteur'],
      strengths: 'Télémétrie bidirectionnelle ultra-rapide entre robots et tableau de bord cloud via MQTT.',
      improvements: 'Régulation de puissance renforcée pour éviter les chutes de couple moteur en pic de charge.',
      quote: '« L\'aboutissement de 48 heures intenses alliant cinématique matérielle et supervision cloud. »',
      summary: 'Prototype de robot mobile autonome pour la logistique industrielle avec gestion connectée.',
      description: 'Prototype de robot mobile autonome pour la logistique industrielle avec gestion connectée.',
      detailedPoints: [
        'Régulation du trafic multi-robots et affectation des tâches via MQTT & WebSocket',
        'Contrôle indépendant des 4 roues motrices permettant des rotations sur place (spin-turn)',
      ],
      metrics: [
        { label: 'Latence réseau', value: '18ms' },
        { label: 'Résultat Hackathon', value: 'Grand Prix' },
      ],
    },
    'creator-2022-05': {
      title: 'Concours de Robotique Créative Prix d\'Excellence',
      competition: 'Concours de Robotique Créative',
      award: 'Prix d\'Excellence',
      roles: ['Vision par ordinateur', 'Évitement d\'obstacles', 'Conception mécanique'],
      strengths: 'Suivi précis de cibles et reconnaissance de couleurs en temps réel avec OpenCV.',
      improvements: 'Mise en œuvre d\'algorithmes adaptatifs résistant aux variations de lumière.',
      quote: '« La première étape majeure où la vision logicielle a directement commandé la mécanique physique. »',
      summary: 'Mise en œuvre d\'algorithmes de vision et d\'évitement d\'obstacles par ultrasons.',
      description: 'Mise en œuvre d\'algorithmes de vision et d\'évitement d\'obstacles par ultrasons.',
      detailedPoints: [
        'Suivi de cible en temps réel par filtrage de couleur et de contours OpenCV',
        'Système d\'arrêt d\'urgence combinant réseau d\'ultrasons et vision par ordinateur',
      ],
      metrics: [
        { label: 'Précision de détection', value: '94.2%' },
        { label: 'Prix du concours', value: 'Prix d\'Excellence' },
      ],
    },
  },
};

// Awards Multi-language dictionary
const AWARDS_MAP: Record<string, Record<Language, { title?: string; competition?: string; description?: string; rank?: string }>> = {
  'wro-2026-award': {
    ko: {
      title: '2nd Place Think Award',
      competition: 'WRO 2026 KOREA',
      description: '알고리즘 최적화, 위기 대처 능력 및 엔지니어링 설계의 창의성과 우수성을 인정받아 수상한 Think Award 2위',
      rank: '2위 (2nd Place)',
    },
    en: {
      title: '2nd Place Think Award',
      competition: 'WRO 2026 KOREA',
      description: 'Awarded 2nd Place Think Award in recognition of algorithm optimization, crisis management, and creative engineering design excellence.',
      rank: '2nd Place',
    },
    ja: {
      title: '2位 Think Award 受賞',
      competition: 'WRO 2026 KOREA',
      description: 'アルゴリズム最適化、現場対応力、および独創的なエンジニアリング設計の優秀性が高く評価され受賞したThink Award第2位。',
      rank: '2位 (2nd Place)',
    },
    zh: {
      title: '亚军 Think Award (Think Award 2nd Place)',
      competition: 'WRO 2026 KOREA',
      description: '凭借卓越的算法优化、敏捷的现场危机排错能力及创新的机械工程设计，荣获Think Award亚军。',
      rank: '亚军 (2nd Place)',
    },
    es: {
      title: '2º Puesto Think Award',
      competition: 'WRO 2026 COREA',
      description: 'Galardonado con el 2º puesto Think Award en reconocimiento a la optimización de algoritmos, resolución de crisis y excelencia en diseño.',
      rank: '2º Puesto',
    },
    de: {
      title: '2. Platz Think Award',
      competition: 'WRO 2026 KOREA',
      description: 'Ausgezeichnet mit dem 2. Platz des Think Awards für herausragende Algorithmenoptimierung, Krisenmanagement und kreatives Konstruktionsdesign.',
      rank: '2. Platz',
    },
    fr: {
      title: '2e Prix Think Award',
      competition: 'WRO 2026 CORÉE',
      description: 'Récompensé par le 2e Prix Think Award pour l\'optimisation des algorithmes, la gestion de crise et l\'excellence de la conception.',
      rank: '2e Place',
    },
  },
  'irc-2023-award': {
    ko: {
      title: '기술 우수상 (본선)',
      competition: '국제 로봇 콘테스트 (IRC)',
      description: 'LiDAR와 뎁스 카메라 기반의 고정밀 SLAM 및 장애물 회피 알고리즘 완성도 부문 우수상',
      rank: '기술 우수상',
    },
    en: {
      title: 'Technical Excellence Award',
      competition: 'International Robot Contest (IRC)',
      description: 'Awarded for precision Cartographer SLAM and robust dynamic obstacle avoidance algorithm completeness using LiDAR and depth camera fusion.',
      rank: 'Tech Excellence',
    },
    ja: {
      title: '技術優秀賞（本選）',
      competition: '国際ロボットコンテスト (IRC)',
      description: 'LiDARと深度カメラに基づく高精度SLAMおよび障害物回避アルゴリズムの完成度が認められ受賞。',
      rank: '技術優秀賞',
    },
    zh: {
      title: '技术优秀奖（全国总决赛）',
      competition: '国际机器人大赛 (IRC)',
      description: '基于激光雷达与深度相机融合的高精度SLAM及动态避障算法完成度获得技术优秀奖。',
      rank: '技术优秀奖',
    },
    es: {
      title: 'Premio a la Excelencia Técnica',
      competition: 'Concurso Internacional de Robótica (IRC)',
      description: 'Premio otorgado por la alta precisión del SLAM y el algoritmo de evasión de obstáculos con fusión LiDAR y cámara de profundidad.',
      rank: 'Excelencia Técnica',
    },
    de: {
      title: 'Technik-Exzellenzpreis',
      competition: 'Internationaler Robotik-Wettbewerb (IRC)',
      description: 'Auszeichnung für präzises SLAM und robuste dynamische Hindernisvermeidung mittels LiDAR und Tiefenkamera-Fusion.',
      rank: 'Technik-Exzellenz',
    },
    fr: {
      title: 'Prix d\'Excellence Technique',
      competition: 'Concours International de Robotique (IRC)',
      description: 'Récompensé pour la précision du SLAM et l\'algorithme d\'évitement d\'obstacles par fusion LiDAR et caméra de profondeur.',
      rank: 'Excellence Technique',
    },
  },
  'hackathon-2023-award': {
    ko: {
      title: '해커톤 대상 (1위)',
      competition: 'IoT 스마트 팩토리 로봇 해커톤',
      description: '스마트 물류 로봇 하드웨어 및 클라우드 관제 프로토타입 최우수 종합 평가 대상',
      rank: 'Grand Prize (1위)',
    },
    en: {
      title: 'Grand Prize (1st Place)',
      competition: 'Smart Factory Logistics Robot Hackathon',
      description: 'Highest overall evaluation for smart logistics robot mechanical prototyping and real-time cloud dispatch architecture.',
      rank: 'Grand Prize (1st)',
    },
    ja: {
      title: 'ハッカソン総合大賞（1位）',
      competition: 'スマートファクトリー物流ロボットハッカソン',
      description: 'スマート物流ロボットのハードウェアおよびクラウド管制プロトタイプの総合最優秀評価により大賞を受賞。',
      rank: '総合大賞 (1位)',
    },
    zh: {
      title: '黑客松特等奖（第一名）',
      competition: '智能制造物流机器人黑客松',
      description: '智能物流机器人硬件机械结构与云端实时调度系统综合评审第一名特等奖。',
      rank: '特等奖 (第一名)',
    },
    es: {
      title: 'Gran Premio (1er Lugar)',
      competition: 'Hackathon de Robots Logísticos Smart Factory',
      description: 'Máxima puntuación general por el prototipo de robot logístico y la arquitectura de gestión en la nube en tiempo real.',
      rank: 'Gran Premio (1º)',
    },
    de: {
      title: 'Hauptpreis (1. Platz)',
      competition: 'Smart Factory Logistik-Roboter Hackathon',
      description: 'Höchste Gesamtbewertung für die Hardware-Entwicklung und das Echtzeit-Flottenleitsystem.',
      rank: 'Hauptpreis (1. Platz)',
    },
    fr: {
      title: 'Grand Prix (1ère Place)',
      competition: 'Hackathon Robotique Logistique Smart Factory',
      description: 'Meilleure évaluation globale pour le prototype de robot logistique et la plateforme de supervision cloud temps réel.',
      rank: 'Grand Prix (1er)',
    },
  },
  'creation-2022-award': {
    ko: {
      title: '창작 로봇 경진대회 우수상',
      competition: '창작 로봇 경진대회',
      description: '컴퓨터 비전 기반 객체 인식 및 자율 장애물 회피 기구 설계 우수',
      rank: '우수상',
    },
    en: {
      title: 'Creative Robotics Excellence Award',
      competition: 'Creative Robotics Competition',
      description: 'Recognized for computer vision target tracking and autonomous collision avoidance mechanism design.',
      rank: 'Excellence Award',
    },
    ja: {
      title: '創作ロボット競技会 優秀賞',
      competition: '創作ロボット競技会',
      description: 'コンピュータビジョンによる物体認識および自律障害物回避機構の設計が高く評価され優秀賞を受賞。',
      rank: '優秀賞',
    },
    zh: {
      title: '创意机器人大赛 优秀奖',
      competition: '创意机器人大赛',
      description: '基于计算机视觉的目标识别与自主避障机构设计荣获优秀奖。',
      rank: '优秀奖',
    },
    es: {
      title: 'Premio a la Excelencia en Robótica Creativa',
      competition: 'Concurso de Robótica Creativa',
      description: 'Reconocimiento al diseño de mecanismos de evasión de obstáculos y seguimiento visual por ordenador.',
      rank: 'Premio a la Excelencia',
    },
    de: {
      title: 'Kreativ-Robotik Exzellenzpreis',
      competition: 'Kreativ-Robotik-Wettbewerb',
      description: 'Ausgezeichnet für Computer-Vision-Objekterkennung und innovative Hindernisvermeidungsmechanismen.',
      rank: 'Exzellenzpreis',
    },
    fr: {
      title: 'Prix d\'Excellence en Robotique Créative',
      competition: 'Concours de Robotique Créative',
      description: 'Distinction pour la reconnaissance d\'objets par vision et la conception de mécanismes d\'évitement d\'obstacles.',
      rank: 'Prix d\'Excellence',
    },
  },
};

// Projects Multi-language Dictionary
const PROJECTS_MAP: Record<string, Record<Language, Partial<ProjectItem>>> = {
  'wro-2025-robot': {
    ko: {
      title: 'WRO 2025 Robot',
      summary: 'WRO 2025 KOREA에서 사용한 로봇의 조립도 및 기구 설계 구조 분석.',
      detailedDescription: 'WRO 2025 KOREA 본선에 출전한 고속 정밀 자율주행 로봇입니다. 저중심 섀시 설계와 4채널 광학 센서 어레이, 랙-앤-피니언 방식의 고속 그리퍼를 결합하여 미션 완수율 98%를 달성했습니다.',
      highlights: [
        '빠른 수리 및 배터리 교체를 위한 모듈형 퀵-체인지 프레임워크',
        '경기장 타일 색상 반사율을 3초 만에 자동 측정하는 원터치 자동 캘리브레이션 모드',
        '슬립 현상을 실시간 보정하는 엔코더-자이로 융합 오도메트리 알고리즘',
      ],
      blueprintAnnotations: [
        { x: 28, y: 35, title: '광학 센서 어레이', detail: '고속 라인 추적 및 코너 감지를 위한 듀얼 센서 마운트' },
        { x: 55, y: 22, title: '정밀 그리퍼 암', detail: '랙-앤-피니언 기구 결합 고속 적재 메커니즘' },
        { x: 70, y: 68, title: '메인 컨트롤러 & 전원', detail: '저잡음 전원 분배기 및 고속 연산 제어 코어' },
        { x: 22, y: 72, title: '고접지 드라이브 트레인', detail: '실리콘 접지 휠 및 1:1.6 가속 기어 트레인' },
      ],
    },
    en: {
      title: 'WRO 2025 Robot',
      summary: 'Assembly CAD blueprint and structural mechanism analysis for the WRO 2025 competition robot.',
      detailedDescription: 'High-speed precision autonomous robot deployed at WRO 2025 KOREA finals. Featuring a low center-of-gravity chassis, 4-channel optical sensor array, and high-speed rack-and-pinion gripper achieving 98% mission completion.',
      highlights: [
        'Modular quick-change structural framework for rapid trackside repair and battery swap',
        'One-touch automatic 3-second calibration routine measuring arena surface reflectivity',
        'Encoder-gyro sensor fusion odometry algorithm continuously compensating for wheel slippage',
      ],
      blueprintAnnotations: [
        { x: 28, y: 35, title: 'LiDAR / Optical Array', detail: 'Dual optical sensor mount for line tracking and high-speed corner detection' },
        { x: 55, y: 22, title: 'Precision Gripper Arm', detail: 'Rack-and-pinion kinematic payload gripper mechanism' },
        { x: 70, y: 68, title: 'Main Controller & Power', detail: 'Low-noise DC-DC step-down power distribution and computing core' },
        { x: 22, y: 72, title: 'High-Traction Wheelbase', detail: 'High-friction silicone wheels with 1:1.6 acceleration gear ratio' },
      ],
    },
    ja: {
      title: 'WRO 2025 Robot',
      summary: 'WRO 2025 KOREAで使用したロボットの組立図面および構造解析。',
      detailedDescription: 'WRO 2025 KOREA本選に出場した高速・高精度自律走行ロボット。低重心シャーシ設計、4チャンネル光学センサーアレイ、ラック＆ピニオン式高速グリッパーを融合し、ミッション完走率98%を達成。',
      highlights: [
        '競技会場での迅速な修理・バッテリー交換を可能にするモジュール式フレームワーク',
        'フィールドの反射率を3秒で自動計測するワンタッチ自動キャリブレーション機能',
        '車輪のスリップをリアルタイムに補正するエンコーダー・ジャイロ融合オドメトリ',
      ],
      blueprintAnnotations: [
        { x: 28, y: 35, title: '光学センサーアレイ', detail: '高精度ライントレースと交差点検知のためのデュアルセンサーマウント' },
        { x: 55, y: 22, title: '精密グリッパーアーム', detail: 'ラック＆ピニオン駆動による高速把持メカニズム' },
        { x: 70, y: 68, title: 'メインコントローラー・電源', detail: '低ノイズ電源分配モジュールと高速演算コア' },
        { x: 22, y: 72, title: '高トラクション駆動部', detail: 'シリコングリップホイールと1:1.6増速ギヤトレイン' },
      ],
    },
    zh: {
      title: 'WRO 2025 Robot',
      summary: 'WRO 2025 KOREA 竞赛机器人的装配图纸与机械结构分析。',
      detailedDescription: '参加 WRO 2025 KOREA 总决赛的高速高精度自律机器人。采用超低重心底盘、4通道光学传感器阵列以及齿轮齿条式机械抓手，达成98%的任务完成率。',
      highlights: [
        '支持赛场快速检修与电池更换的模块化快拆框架',
        '3秒一键自动完成赛道地面反光率测定的智能校准模式',
        '实时消除轮组打滑误差的编码器-陀螺仪融合里程计算法',
      ],
      blueprintAnnotations: [
        { x: 28, y: 35, title: '光学传感阵列', detail: '用于高速巡线和转角检测的双路高灵敏度光电传感器' },
        { x: 55, y: 22, title: '精密夹爪机械臂', detail: '齿轮齿条式高速任务目标抓取与装载机构' },
        { x: 70, y: 68, title: '主控计算与电源模块', detail: '低噪声直流降压供电板与高性能运算核心' },
        { x: 22, y: 72, title: '高抓地力动力底盘', detail: '高附着力硅胶车轮及1:1.6加速比齿轮传动组' },
      ],
    },
    es: {
      title: 'Robot WRO 2025',
      summary: 'Plano de montaje CAD y análisis de la estructura mecánica del robot de competición WRO 2025.',
      detailedDescription: 'Robot autónomo de alta velocidad y precisión desplegado en las finales de WRO 2025. Chasis de bajo centro de gravedad, matriz de 4 sensores ópticos y pinza de cremallera con un 98% de éxito en misiones.',
      highlights: [
        'Estructura modular de cambio rápido para reparaciones y sustitución de batería en pista',
        'Rutina de calibración automática en 3 segundos según la reflectividad del suelo',
        'Odometría por fusión de encoder y giróscopo con compensación de deslizamiento en tiempo real',
      ],
      blueprintAnnotations: [
        { x: 28, y: 35, title: 'Matriz óptica / LiDAR', detail: 'Soporte de sensor dual para seguimiento de línea y curvas a alta velocidad' },
        { x: 55, y: 22, title: 'Brazo de pinza de precisión', detail: 'Mecanismo cinemático de pinza con cremallera y piñón' },
        { x: 70, y: 68, title: 'Controlador y alimentación', detail: 'Distribuidor de potencia con bajo ruido y núcleo de procesamiento' },
        { x: 22, y: 72, title: 'Tren de tracción de alto agarre', detail: 'Ruedas de silicona de alta adherencia con relación de aceleración 1:1.6' },
      ],
    },
    de: {
      title: 'WRO 2025 Roboter',
      summary: 'CAD-Konstruktionsplan und Strukturanalyse des Wettbewerbsroboters für die WRO 2025.',
      detailedDescription: 'Präziser autonomer Hochgeschwindigkeitsroboter für das WRO 2025 Finale. Ausgestattet mit tiefem Schwerpunkt, 4-Kanal-Sensormatrix und Zahnstangen-Greifer (98 % Missionserfolg).',
      highlights: [
        'Modulares Schnellwechselsystem für schnelle Wartung und Akkutausch am Spielfeldrand',
        'Automatische 3-Sekunden-Sensorkalibrierung zur Messung der Bodenreflexion',
        'Encoder-Gyroskop-Fusionsodometrie zur Echtzeitkorrektur von Radschlupf',
      ],
      blueprintAnnotations: [
        { x: 28, y: 35, title: 'Optische Sensormatrix', detail: 'Dualsensor-Halterung für präzise Linien- und Kurvenverfolgung' },
        { x: 55, y: 22, title: 'Präzisions-Greifarm', detail: 'Zahnstangenmechanismus für schnelle Objektmanipulation' },
        { x: 70, y: 68, title: 'Hauptcontroller & Stromversorgung', detail: 'Rauscharme Spannungsverteilung und Hochleistungs-Rechenkern' },
        { x: 22, y: 72, title: 'Hochtraktions-Fahrwerk', detail: 'Silikonräder mit hoher Bodenhaftung und 1:1,6 Getriebeübersetzung' },
      ],
    },
    fr: {
      title: 'Robot WRO 2025',
      summary: 'Plan d\'assemblage CAO et analyse de la structure mécanique du robot WRO 2025.',
      detailedDescription: 'Robot autonome haute vitesse déployé lors des finales WRO 2025. Châssis à centre de gravité bas, réseau de capteurs optiques 4 canaux et pince à crémaillère (taux de réussite de 98 %).',
      highlights: [
        'Cadre modulaire à changement rapide pour réparation immédiate et échange de batterie',
        'Étalonnage automatique en 3 secondes selon la réflectance de la surface de l\'arène',
        'Odométrie par fusion encodeur-gyroscope compensant le glissement des roues en temps réel',
      ],
      blueprintAnnotations: [
        { x: 28, y: 35, title: 'Réseau optique / LiDAR', detail: 'Support de double capteur pour suivi de ligne et détection des virages' },
        { x: 55, y: 22, title: 'Bras de pince de précision', detail: 'Mécanisme cinématique de préhension à crémaillère et pignon' },
        { x: 70, y: 68, title: 'Contrôleur et alimentation', detail: 'Distribution électrique faible bruit et cœur de calcul temps réel' },
        { x: 22, y: 72, title: 'Châssis haute adhérence', detail: 'Roues en silicone adhérentes et train d\'engrenages 1:1.6' },
      ],
    },
  },
  'autonomous-delivery-bot': {
    ko: {
      title: 'Autonomous Delivery Bot',
      summary: '라이다(LiDAR)와 뎁스 카메라를 활용한 실내 자율 주행 로봇 개발. SLAM 매핑 및 Nav2 스택을 이용한 동적 장애물 회피.',
      detailedDescription: '실내 복합 빌딩 환경에서 화물을 안전하게 목적지로 운송하는 자율주행 모바일 로봇(AMR)입니다. 2D 라이다와 인텔 리얼센스 뎁스 카메라를 융합하여 정밀한 2D/3D 점군 지도를 생성하고 Nav2 스택으로 동적 장애물을 회피합니다.',
      highlights: [
        'Cartographer 기반 고해상도 실내 맵 생성 및 로컬라이제이션 오차 2cm 미만 달성',
        '보행자 및 급작스러운 장애물 출현 시 50ms 이내 긴급 경로 재계획(Replanning)',
        '웹 기반 원격 관제 대시보드(ROSBridge & React) 연동',
      ],
    },
    en: {
      title: 'Autonomous Delivery Bot',
      summary: 'Indoor autonomous delivery AMR utilizing 2D LiDAR and depth cameras. SLAM mapping and Nav2 stack dynamic obstacle avoidance.',
      detailedDescription: 'Autonomous Mobile Robot (AMR) designed for safe indoor cargo delivery in complex facilities. Fuses 2D LiDAR and Intel RealSense depth cameras to construct high-definition point cloud maps and execute dynamic avoidance via ROS 2 Nav2.',
      highlights: [
        'Cartographer-based high-resolution indoor mapping with sub-2cm localization accuracy',
        'Sub-50ms emergency local trajectory replanning when detecting unexpected pedestrians',
        'Seamless integration with web-based real-time fleet dashboard (ROSBridge & React)',
      ],
    },
    ja: {
      title: '自律配送ロボット (Delivery Bot)',
      summary: 'LiDARと深度カメラを活用した屋内自律走行ロボット。SLAMマッピングおよびNav2による動的障害物回避。',
      detailedDescription: '屋内複合施設で荷物を目的地へ安全に配送する自律移動ロボット(AMR)。2D LiDARとIntel RealSense深度カメラを統合し、高精度な点群地図生成とNav2スタックによるリアルタイム障害物回避を実現。',
      highlights: [
        'Cartographerベースの高解像度マップ生成と位置推定誤差2cm未満を達成',
        '歩行者や急な障害物の出現時に50ms以内で緊急経路再計画を実行',
        'Webベースの遠隔管制ダッシュボード（ROSBridge & React）と連携',
      ],
    },
    zh: {
      title: '自主配送机器人 (Autonomous Delivery Bot)',
      summary: '结合激光雷达与深度相机的室内自主移动机器人。实现SLAM建图与基于Nav2的动态智能避障。',
      detailedDescription: '专为室内复杂楼宇环境设计的货物自主配送移动机器人（AMR）。融合2D激光雷达与Intel RealSense深度相机生成高精点云地图，基于ROS 2 Nav2导航栈实现动态避障。',
      highlights: [
        '基于Cartographer的高分辨率室内地图构建，定位误差小于2cm',
        '检测到行人等突发动障碍物时，50ms内完成紧急局部路径重规划',
        '对接基于Web的远程调度监控大盘（ROSBridge & React）',
      ],
    },
    es: {
      title: 'Robot Autónomo de Reparto',
      summary: 'Robot móvil autónomo (AMR) para reparto en interiores con LiDAR 2D y cámara de profundidad. Mapeo SLAM y Nav2.',
      detailedDescription: 'Robot móvil autónomo diseñado para el transporte seguro de mercancías en interiores. Fusiona LiDAR 2D y cámara de profundidad Intel RealSense para generar mapas de alta precisión y esquivar obstáculos dinámicos con Nav2.',
      highlights: [
        'Mapeo de alta resolución con Cartographer y precisión de localización inferior a 2 cm',
        'Replanificación de trayectoria de emergencia en menos de 50 ms ante peatones',
        'Integración con panel de control remoto web en tiempo real (ROSBridge & React)',
      ],
    },
    de: {
      title: 'Autonomer Lieferroboter',
      summary: 'Indoor-Lieferroboter (AMR) mit 2D-LiDAR und Tiefenkamera. SLAM-Kartierung und dynamische Nav2-Hindernisvermeidung.',
      detailedDescription: 'Autonomer mobiler Roboter (AMR) für den zuverlässigen Warentransport in Gebäuden. Fusioniert 2D-LiDAR und Intel RealSense Tiefenkameras zur Erstellung hochpräziser Karten und dynamischen Hindernisvermeidung via Nav2.',
      highlights: [
        'Cartographer-basierte hochauflösende Kartierung mit einer Lokalisierungsgenauigkeit unter 2 cm',
        'Notfall-Pfadumplanung in unter 50 ms bei unerwarteten Fußgängern',
        'Anbindung an ein webbasiertes Echtzeit-Flottendashboard (ROSBridge & React)',
      ],
    },
    fr: {
      title: 'Robot Livreur Autonome',
      summary: 'Robot mobile autonome (AMR) de livraison intérieure utilisant LiDAR et caméra de profondeur. SLAM et pile Nav2.',
      detailedDescription: 'Robot mobile autonome conçu pour le transport sécurisé en intérieur. Fusionne LiDAR 2D et caméra de profondeur Intel RealSense pour générer des cartes haute définition et éviter les obstacles avec Nav2.',
      highlights: [
        'Cartographie Cartographer haute résolution avec une précision de localisation inférieure à 2 cm',
        'Replanification d\'urgence de trajectoire en moins de 50 ms face aux piétons',
        'Intégration d\'un tableau de bord de supervision web temps réel (ROSBridge & React)',
      ],
    },
  },
  'six-dof-manipulator': {
    ko: {
      title: '6-DoF Manipulator Control',
      summary: '산업용 6축 로봇 암의 역운동학(Inverse Kinematics) 솔버 구현 및 MoveIt 프레임워크를 활용한 충돌 회피 궤적 생성 프로젝트.',
      detailedDescription: '6개 자유도를 가진 로봇 매니퓰레이터의 기구학(Forward/Inverse Kinematics) 모델을 직접 수식화하고 C++로 최적화된 솔버를 작성했습니다. MoveIt 및 OMPL 라이브러리를 결합하여 3차원 장애물 공간에서 부드러운 충돌 없는 픽앤플레이스를 수행합니다.',
      highlights: [
        '해석적(Analytical) 및 수치적(Numerical) IK 솔버 결합으로 특이점(Singularity) 회피',
        '최소 저크(Minimum-Jerk) 궤적 보간으로 진동 없는 고속 이동 구현',
        '디지털 트윈 기반 실시간 3D 뷰어 및 조인트 각도 모니터링',
      ],
    },
    en: {
      title: '6-DoF Manipulator Control',
      summary: 'Inverse Kinematics (IK) solvers and MoveIt-based collision-free trajectory planning for 6-axis articulated robot arm.',
      detailedDescription: 'Formulated mathematical Forward/Inverse Kinematics kinematic models and developed C++ analytical solvers for a 6-DoF manipulator arm. Integrated MoveIt and OMPL for smooth 3D pick-and-place trajectories in cluttered workspaces.',
      highlights: [
        'Hybrid analytical/numerical IK solvers avoiding kinematic singularities',
        'Minimum-jerk trajectory interpolation eliminating mechanical vibrations during rapid motion',
        'Digital twin real-time 3D simulation and joint state telemetry dashboard',
      ],
    },
    ja: {
      title: '6軸マニピュレーター制御 (6-DoF Arm)',
      summary: '産業用6軸ロボットアームの逆運動学(IK)ソルバー実装およびMoveItによる衝突回避軌道生成。',
      detailedDescription: '6自由度ロボットアームの順・逆運動学モデルを数式化し、C++で高速IKソルバーを実装。MoveItおよびOMPLライブラリを統合し、3次元空間での滑らかなピック＆プレース動作を実現。',
      highlights: [
        '解析的・数値的IKソルバーのハイブリッド構成による特異点回避',
        '最小ジャーク軌道補間による振動のない高速動作の実現',
        'デジタルツインによるリアルタイム3Dシミュレーションと関節角モニタリング',
      ],
    },
    zh: {
      title: '6轴机械臂运动控制 (6-DoF Arm)',
      summary: '工业级6自由度机械臂逆运动学(IK)求解器实现与基于MoveIt的无碰撞轨迹规划。',
      detailedDescription: '推导并建立了6自由度机械臂的正逆运动学数学模型，编写了基于C++的高效求解器。结合MoveIt与OMPL运动规划算法库，在三维障碍物空间中执行平滑的无碰撞抓取与放置任务。',
      highlights: [
        '融合解析与数值IK求解算法，智能规避奇异点（Singularity）',
        '最小加加速度（Minimum-Jerk）轨迹插补，消除高速移动中的机械振动',
        '基于数字孪生的实时3D三维仿真及关节角度状态监测',
      ],
    },
    es: {
      title: 'Control de Manipulador de 6 Ejes',
      summary: 'Resolutor de cinemática inversa (IK) y planificación de trayectorias sin colisiones con MoveIt para brazo robótico de 6 DoF.',
      detailedDescription: 'Modelado cinemático directo e inverso y resolutores C++ para brazo articulado de 6 grados de libertad. Integración con MoveIt y OMPL para movimientos suaves y libres de colisiones en espacios 3D.',
      highlights: [
        'Resolutores cinemáticos híbridos que evitan singularidades mecánicas',
        'Interpolación de trayectoria con tirón mínimo (minimum-jerk) que suprime vibraciones',
        'Simulación 3D en tiempo real tipo gemelo digital y telemetría de articulaciones',
      ],
    },
    de: {
      title: '6-Achs-Manipulatorsteuerung',
      summary: 'Inverse Kinematik (IK) Solver und MoveIt-basierte kollisionsfreie Trajektorienplanung für 6-Achs-Roboterarme.',
      detailedDescription: 'Mathematische Modellierung der Vorwärts- und Inversen Kinematik sowie C++ Solver für 6-DoF-Manipulatoren. Verknüpfung mit MoveIt und OMPL für ruckfreie Pick-and-Place-Manöver in 3D-Räumen.',
      highlights: [
        'Hybride analytisch-numerische IK-Solver zur Vermeidung kinematischer Singularitäten',
        'Minimum-Jerk-Trajektorieninterpolation zur Unterdrückung mechanischer Schwingungen',
        'Digitaler Zwilling mit 3D-Echtzeitsimulation und Gelenkzustandsüberwachung',
      ],
    },
    fr: {
      title: 'Contrôle de Manipulateur 6 Axes',
      summary: 'Solveur de cinématique inverse (IK) et planification de trajectoires sans collision avec MoveIt pour bras 6 axes.',
      detailedDescription: 'Modélisation mathématique de cinématique directe et inverse et développement de solveurs C++ pour bras robotique 6 axes. Intégration de MoveIt et OMPL pour des trajectoires fluides en environnement 3D.',
      highlights: [
        'Solveurs IK hybrides évitant les singularités cinématiques',
        'Interpolation de trajectoire à à-coup minimal (minimum-jerk) éliminant les vibrations',
        'Jumeau numérique avec simulation 3D temps réel et télémétrie des articulations',
      ],
    },
  },
  'awaiting-data': {
    ko: {
      title: '새 프로젝트 준비 중...',
      summary: '차기 대회 및 새로운 로봇 시스템 데이터가 이곳에 등록될 예정입니다.',
      detailedDescription: '새로운 2026/2027 시즌 로봇 시스템 아키텍처 및 자율 비전 알고리즘 개발이 진행 중입니다.',
    },
    en: {
      title: 'Awaiting Data...',
      summary: 'Next competition data and robotic system specs will be compiled here.',
      detailedDescription: 'Currently architecting next-generation 2026/2027 robotics system architectures and vision algorithms.',
    },
    ja: {
      title: '新プロジェクト準備中...',
      summary: '次回大会および新しいロボットシステムのデータがここに登録されます。',
      detailedDescription: '次世代2026/2027シーズンのロボットシステムアーキテクチャおよび自律ビジョンアルゴリズムを開発中です。',
    },
    zh: {
      title: '新项目筹备中...',
      summary: '后续赛季比赛与新一代机器人系统数据将在此汇总展示。',
      detailedDescription: '新一期2026/2027赛季机器人系统架构与自主视觉算法正在积极研发中。',
    },
    es: {
      title: 'Preparando nuevo proyecto...',
      summary: 'Los datos de la próxima competición y nuevo sistema robótico se registrarán aquí.',
      detailedDescription: 'En desarrollo la arquitectura robótica y algoritmos de visión autónoma de la próxima temporada 2026/2027.',
    },
    de: {
      title: 'Neues Projekt in Vorbereitung...',
      summary: 'Hier werden demnächst die Daten des nächsten Robotersystems erfasst.',
      detailedDescription: 'Die nächste Roboter-Systemarchitektur und Vision-Algorithmen für die Saison 2026/2027 befinden sich in Entwicklung.',
    },
    fr: {
      title: 'Nouveau projet en préparation...',
      summary: 'Les données de la prochaine compétition et du nouveau système robotique seront publiées ici.',
      detailedDescription: 'Architecture robotique et algorithmes de vision autonome de nouvelle génération pour la saison 2026/2027 en cours de développement.',
    },
  },
};

// YouTube Video Multi-language Dictionary
const YOUTUBE_MAP: Record<string, Record<Language, { title: string; description: string; category?: string }>> = {
  'yt-1': {
    ko: {
      title: 'WRO 로봇 자율주행 실전 경기 주행 및 미션 결과 분석',
      description: '대회 때 로봇이 어떻게 움직였고 어떤 결과를 냈는지에 대한 실전 경기 주행 영상입니다.',
      category: '대회/실전',
    },
    en: {
      title: 'WRO Robot Autonomous Match Run & Mission Results',
      description: 'Match run footage showcasing autonomous mission navigation, obstacle handling, and score outcomes during WRO competition.',
      category: 'Competition',
    },
    ja: {
      title: 'WRO ロボット自律走行 本番試合走行＆ミッション結果分析',
      description: '大会本番でのロボットの走行軌跡とミッション達成結果を記録した実戦映像です。',
      category: '競技・実戦',
    },
    zh: {
      title: 'WRO 机器人自主巡线实战赛场运行与任务成果分析',
      description: '记录比赛现场机器人自主导航、避障抓取以及最终得分情况的实战赛况分析视频。',
      category: '比赛竞技',
    },
    es: {
      title: 'Robot WRO: Prueba de Competición y Resultados de Misión',
      description: 'Metraje de la carrera en competición mostrando la navegación autónoma y el cumplimiento de misiones en la WRO.',
      category: 'Competición',
    },
    de: {
      title: 'WRO Roboter Autonomer Wettkampflauf & Missionsanalyse',
      description: 'Videoaufzeichnung des autonomen Wettkampflaufs mit Hindernisbewältigung und Punktanalyse bei der WRO.',
      category: 'Wettkampf',
    },
    fr: {
      title: 'Robot WRO : Course en Compétition et Analyse de Mission',
      description: 'Vidéo de la course en conditions réelles illustrant la navigation autonome et les résultats obtenus lors de la WRO.',
      category: 'Compétition',
    },
  },
  'yt-2': {
    ko: {
      title: '정밀 듀얼 컬러 센서 라인트레이싱 및 자이로 PID 제어 튜닝',
      description: '직각 턴과 교차로에서 오버슈트 없이 고속 궤적을 유지하는 PID 튜닝 및 자율주행 알고리즘 분석입니다.',
      category: '알고리즘',
    },
    en: {
      title: 'Dual Color Sensor Line Tracking & Gyro PID Control',
      description: 'Precision line tracking demonstration and PID control tuning analysis for zero-overshoot cornering and high-speed intersections.',
      category: 'Algorithm',
    },
    ja: {
      title: '高精度デュアルカラーセンサー ライントレース＆ジャイロPID制御チューニング',
      description: '直角ターンや交差点でオーバーシュートなく高速走行を維持するPIDチューニングと制御アルゴリズムの解説動画です。',
      category: '制御・アルゴリズム',
    },
    zh: {
      title: '高精度双颜色传感器巡线与陀螺仪PID闭环控制调优',
      description: '展示在直角转弯与交叉路口无超调平稳高速巡线的PID参数整定与自主控制算法解析。',
      category: '控制算法',
    },
    es: {
      title: 'Seguimiento de Línea con Sensor Dual y Control PID con Giróscopo',
      description: 'Demostración de seguimiento de línea de precisión y sintonización de control PID para curvas cerradas a alta velocidad.',
      category: 'Algoritmo',
    },
    de: {
      title: 'Dual-Farbsensor Linienverfolgung & Gyro-PID-Regelung',
      description: 'Präzise Linienführung und PID-Tuning-Analyse für überschwingungsfreie Kurvenfahrten und hohe Geschwindigkeiten.',
      category: 'Algorithmen',
    },
    fr: {
      title: 'Suivi de Ligne Double Capteur Couleur et Contrôle PID Gyroscope',
      description: 'Démonstration de suivi de ligne de précision et analyse du réglage PID pour virages rapides sans dépassement.',
      category: 'Algorithmes',
    },
  },
  'yt-3': {
    ko: {
      title: '자율주행 로봇 3D CAD 기구부 설계 및 하드웨어 조립 과정',
      description: '초경량 섀시 구조, 듀얼 모터 드라이브 트레인 및 센서 브라켓 기구 설계 빌드 영상입니다.',
      category: '하드웨어',
    },
    en: {
      title: 'Autonomous Robotics CAD Blueprint & Hardware Assembly',
      description: '3D CAD mechanical chassis modeling, dual-motor drivetrain assembly, and modular sensor bracket build timelapse.',
      category: 'Hardware',
    },
    ja: {
      title: '自律走行ロボット 3D CAD機構設計＆ハードウェア組み立て工程',
      description: '軽量シャーシ構造、デュアルモータートレイン、センサーブラケットの設計・組み立てタイムラプス動画です。',
      category: 'ハードウェア・機構',
    },
    zh: {
      title: '自主移动机器人 3D CAD 机构设计与硬件组装全过程',
      description: '超轻量底盘结构设计、双电机传动系组装以及传感器快拆支架设计的延时搭建实录。',
      category: '硬件结构',
    },
    es: {
      title: 'Diseño Mecánico CAD 3D y Ensamblaje de Hardware Robótico',
      description: 'Modelado del chasis mecánico en CAD 3D, montaje de transmisión de doble motor y soportes modulares.',
      category: 'Hardware',
    },
    de: {
      title: 'Autonome Robotik CAD-Konstruktion & Hardware-Montage',
      description: '3D-CAD-Chassismodellierung, Doppelmotor-Antriebsstrangmontage und modulares Sensorhalterungs-Making-of.',
      category: 'Hardware',
    },
    fr: {
      title: 'Conception Mécanique CAO 3D et Assemblage Matériel Robotique',
      description: 'Modélisation CAO 3D du châssis, assemblage de la transmission à double moteur et fabrication des supports.',
      category: 'Matériel',
    },
  },
};

// Skills Multi-language Dictionary
const SKILLS_MAP: Record<string, Record<Language, { name: string; description: string; category?: string }>> = {
  'micropython': {
    ko: {
      name: 'MicroPython',
      description: '로봇 제어 로직 및 자율 동작을 구현하기 위한 핵심 프로그래밍 언어.',
      category: '알고리즘',
    },
    en: {
      name: 'MicroPython',
      description: 'Core programming language for implementing robotic control logic and autonomous behaviors.',
      category: 'ALGORITHM',
    },
    ja: {
      name: 'MicroPython',
      description: 'ロボット制御ロジックおよび自律動作を実装するための主要プログラミング言語。',
      category: 'アルゴリズム',
    },
    zh: {
      name: 'MicroPython',
      description: '用于编写机器人控制逻辑与自主运行行为的核心编程语言。',
      category: '算法控制',
    },
    es: {
      name: 'MicroPython',
      description: 'Lenguaje de programación principal para implementar lógica de control robótico y comportamientos autónomos.',
      category: 'ALGORITMO',
    },
    de: {
      name: 'MicroPython',
      description: 'Kernprogrammiersprache zur Implementierung von Robotersteuerungslogik und autonomem Verhalten.',
      category: 'ALGORITHMEN',
    },
    fr: {
      name: 'MicroPython',
      description: 'Langage principal de programmation pour la logique de contrôle et les comportements autonomes.',
      category: 'ALGORITHME',
    },
  },
  'robot-building': {
    ko: {
      name: '로봇 기구 설계 및 제작',
      description: '모듈형 섀시 설계, 기어 트레인 감속/가속비 최적화, 프레임 강성 및 퀵-체인지 기구부 설계.',
      category: '하드웨어',
    },
    en: {
      name: 'Robot Building',
      description: 'Modular chassis design, gear train transmission ratios, structural integrity and quick-swap mechanisms.',
      category: 'HARDWARE',
    },
    ja: {
      name: 'ロボット機構設計・製作',
      description: 'モジュール式シャーシ設計、ギヤ比最適化、フレーム剛性およびクイックチェンジ機構の設計。',
      category: 'ハードウェア',
    },
    zh: {
      name: '机器人机构设计与制作',
      description: '模块化底盘设计、齿轮组传动比调优、结构刚性保证及快拆机构开发。',
      category: '硬件结构',
    },
    es: {
      name: 'Construcción Robótica',
      description: 'Diseño de chasis modular, relaciones de transmisión de engranajes, integridad estructural y mecanismos de cambio rápido.',
      category: 'HARDWARE',
    },
    de: {
      name: 'Roboterkonstruktion',
      description: 'Modulares Chassis-Design, Getriebeübersetzungen, strukturelle Integrität und Schnellwechselmechanismen.',
      category: 'HARDWARE',
    },
    fr: {
      name: 'Construction Robotique',
      description: 'Conception de châssis modulaire, rapports d\'engrenages, rigidité structurelle et mécanismes à échange rapide.',
      category: 'MATÉRIEL',
    },
  },
  'motor-control': {
    ko: {
      name: '모터 및 구동계 제어',
      description: '폐루프 PID 속도/위치 제어, 엔코더 텔레메트리 피드백 및 자이로 동기화 차동 구동 제어.',
      category: '구동계/모터',
    },
    en: {
      name: 'Motor Control',
      description: 'Closed-loop PID velocity/position regulation, encoder telemetry feedback, and gyro-sync differential drive.',
      category: 'ACTUATION',
    },
    ja: {
      name: 'モーター・駆動制御',
      description: '閉ループPID速度・位置制御、エンコーダーテレメトリフィードバック、ジャイロ同期差動駆動。',
      category: '駆動・モーター',
    },
    zh: {
      name: '电机与底盘动力控制',
      description: '闭环PID速度/位置调节、编码器遥测数据反馈及陀螺仪同步差速驱动。',
      category: '动力驱动',
    },
    es: {
      name: 'Control de Motores',
      description: 'Regulación de velocidad/posición PID en bucle cerrado, telemetría de encoder y tracción diferencial sincronizada con giróscopo.',
      category: 'ACTUACIÓN',
    },
    de: {
      name: 'Motorsteuerung',
      description: 'Closed-Loop PID-Geschwindigkeits-/Positionsregelung, Encoder-Telemetrie und kreiselstabilisierter Differenzialantrieb.',
      category: 'AKTORIK',
    },
    fr: {
      name: 'Contrôle Moteur',
      description: 'Régulation PID vitesse/position en boucle fermée, retour télémétrique d\'encodeur et entraînement différentiel synchronisé.',
      category: 'ACTIONNEMENT',
    },
  },
  'sensor-control': {
    ko: {
      name: '센서 제어 및 퓨전',
      description: '컬러/조도, 초음파, 2D LiDAR 고주파 샘플링 및 IMU 센서 퓨전 캘리브레이션.',
      category: '센서/인식',
    },
    en: {
      name: 'Sensor Control',
      description: 'High-frequency sampling of Color/Light, Ultrasonic, 2D LiDAR, and IMU sensor fusion calibration.',
      category: 'PERCEPTION',
    },
    ja: {
      name: 'センサー制御・フュージョン',
      description: 'カラー・照度、超音波、2D LiDARの高周波サンプリングおよびIMUセンサーフュージョン校正。',
      category: 'センサー・認識',
    },
    zh: {
      name: '传感器控制与数据融合',
      description: '颜色/光感、超声波、2D激光雷达的高频采样及IMU传感器融合校准。',
      category: '传感感知',
    },
    es: {
      name: 'Control de Sensores',
      description: 'Muestreo de alta frecuencia de sensores de color/luz, ultrasonidos, LiDAR 2D y calibración por fusión IMU.',
      category: 'PERCEPCIÓN',
    },
    de: {
      name: 'Sensorsteuerung',
      description: 'Hochfrequente Erfassung von Farb-, Ultraschall-, 2D-LiDAR- und IMU-Sensorfusionskalibrierung.',
      category: 'SENSORIK',
    },
    fr: {
      name: 'Contrôle des Capteurs',
      description: 'Échantillonnage haute fréquence des capteurs de couleur/lumière, ultrasons, LiDAR 2D et fusion IMU.',
      category: 'PERCEPTION',
    },
  },
  'ros2-framework': {
    ko: {
      name: 'ROS 2 프레임워크',
      description: 'ROS 2 Humble 노드, 토픽, 서비스, 액션, Nav2 네비게이션 스택 및 Micro-ROS 마이크로컨트롤러 인터페이스.',
      category: '프레임워크',
    },
    en: {
      name: 'ROS 2',
      description: 'ROS 2 Humble nodes, topics, services, actions, Nav2 stack and Micro-ROS microcontroller interfacing.',
      category: 'FRAMEWORK',
    },
    ja: {
      name: 'ROS 2 フレームワーク',
      description: 'ROS 2 Humbleノード、トピック、サービス、アクション、Nav2ナビゲーションスタックおよびMicro-ROS連携。',
      category: 'フレームワーク',
    },
    zh: {
      name: 'ROS 2 机器人系统',
      description: 'ROS 2 Humble 节点、话题、服务、动作、Nav2自主导航栈及Micro-ROS微控制器通信。',
      category: '开发框架',
    },
    es: {
      name: 'Framework ROS 2',
      description: 'Nodos, topics, servicios, acciones de ROS 2 Humble, pila de navegación Nav2 e interfaz Micro-ROS.',
      category: 'FRAMEWORK',
    },
    de: {
      name: 'ROS 2',
      description: 'ROS 2 Humble Nodes, Topics, Services, Actions, Nav2-Stack und Micro-ROS-Anbindung.',
      category: 'FRAMEWORK',
    },
    fr: {
      name: 'ROS 2',
      description: 'Nœuds, topics, services, actions ROS 2 Humble, pile Nav2 et interfaçage Micro-ROS.',
      category: 'FRAMEWORK',
    },
  },
  'cpp-python': {
    ko: {
      name: 'C++ / Python',
      description: '실시간 임베디드 C++ 펌웨어 실행과 상위 Python 자율주행 로직의 유기적 결합.',
      category: '알고리즘',
    },
    en: {
      name: 'C++ / Python',
      description: 'Real-time embedded C++ firmware execution paired with high-level Python autonomy logic.',
      category: 'ALGORITHM',
    },
    ja: {
      name: 'C++ / Python',
      description: 'リアルタイム組込みC++ファームウェア実行と上位Python自律制御ロジックの連携。',
      category: 'アルゴリズム',
    },
    zh: {
      name: 'C++ / Python',
      description: '实时嵌入式C++固件运行与上层Python自主控制逻辑的高效结合。',
      category: '算法控制',
    },
    es: {
      name: 'C++ / Python',
      description: 'Ejecución de firmware C++ embebido en tiempo real emparejado con lógica de autonomía en Python.',
      category: 'ALGORITMO',
    },
    de: {
      name: 'C++ / Python',
      description: 'Echtzeit-Embedded-C++-Firmware kombiniert mit übergeordneter Python-Autonomielogik.',
      category: 'ALGORITHMEN',
    },
    fr: {
      name: 'C++ / Python',
      description: 'Exécution temps réel de firmware C++ embarqué associée à la logique d\'autonomie Python.',
      category: 'ALGORITHME',
    },
  },
  'kinematics': {
    ko: {
      name: '로봇 기구학 (FK/IK)',
      description: '다관절 매니퓰레이터 암을 위한 정기구학 및 역기구학(FK/IK) 수학적 솔버 구현.',
      category: '하드웨어',
    },
    en: {
      name: 'Kinematics',
      description: 'Forward & Inverse Kinematics (FK/IK) mathematical solvers for multi-axis articulated manipulator arms.',
      category: 'HARDWARE',
    },
    ja: {
      name: 'ロボット運動学 (FK/IK)',
      description: '多関節マニピュレーターアームのための順・逆運動学（FK/IK）数学的ソルバーの実装。',
      category: 'ハードウェア',
    },
    zh: {
      name: '机器人运动学 (FK/IK)',
      description: '针对多自由度关节机械臂的正向与逆向运动学（FK/IK）数学求解器实现。',
      category: '硬件结构',
    },
    es: {
      name: 'Cinemática (FK/IK)',
      description: 'Solucionadores matemáticos de cinemática directa e inversa (FK/IK) para brazos robóticos articulados.',
      category: 'HARDWARE',
    },
    de: {
      name: 'Kinematik (FK/IK)',
      description: 'Mathematische Vorwärts- und Inverse Kinematik (FK/IK) Solver für mehrachsige Knickarmroboter.',
      category: 'HARDWARE',
    },
    fr: {
      name: 'Cinématique (FK/IK)',
      description: 'Solveurs mathématiques de cinématique directe et inverse (FK/IK) pour bras manipulateurs articulés.',
      category: 'MATÉRIEL',
    },
  },
  'computer-vision': {
    ko: {
      name: '컴퓨터 비전',
      description: 'OpenCV 파이프라인, HSV 색공간 분할, AprilTag 마커 인식 및 실시간 장애물 바운딩 박스 추적.',
      category: '비전/AI',
    },
    en: {
      name: 'Computer Vision',
      description: 'OpenCV pipeline, HSV segmentation, AprilTag fiducial detection, and real-time obstacle bounding boxes.',
      category: 'AI/VISION',
    },
    ja: {
      name: 'コンピュータビジョン',
      description: 'OpenCVパイプライン、HSV色空間分割、AprilTagマーカー認識およびリアルタイム障害物検出。',
      category: 'ビジョン/AI',
    },
    zh: {
      name: '计算机视觉',
      description: 'OpenCV流水线、HSV色彩分割、AprilTag基准标记检测及实时障碍物边界框跟踪。',
      category: '视觉/AI',
    },
    es: {
      name: 'Visión por Computador',
      description: 'Pipeline OpenCV, segmentación HSV, detección de etiquetas AprilTag y cajas delimitadoras en tiempo real.',
      category: 'IA/VISIÓN',
    },
    de: {
      name: 'Computer Vision',
      description: 'OpenCV-Pipeline, HSV-Segmentierung, AprilTag-Erkennung und Echtzeit-Hindernisverfolgung.',
      category: 'KI/VISION',
    },
    fr: {
      name: 'Vision par Ordinateur',
      description: 'Pipeline OpenCV, segmentation HSV, détection de repères AprilTag et suivi d\'obstacles temps réel.',
      category: 'IA/VISION',
    },
  },
  'problem-solving': {
    ko: {
      name: '문제 해결 & 디버깅',
      description: '경기장 고압박 상황에서 하드웨어 및 소프트웨어 문제를 분석적으로 진단하고 해결하는 역량.',
      category: '소프트 스킬',
    },
    en: {
      name: 'Problem Solving',
      description: 'Analytical approach to debugging hardware and software issues under intense competition time pressure.',
      category: 'SOFT_SKILL',
    },
    ja: {
      name: '課題解決・デバッグ',
      description: '競技本番の高プレッシャー環境下でハードウェアとソフトウェアの課題を論理的に解決する能力。',
      category: 'ソフトスキル',
    },
    zh: {
      name: '故障排查与问题攻坚',
      description: '在竞赛高压环境下严密分析并快速定位软硬件故障的实战排错能力。',
      category: '软实力',
    },
    es: {
      name: 'Resolución de Problemas',
      description: 'Enfoque analítico para depurar problemas de hardware y software bajo intensa presión competitiva.',
      category: 'HABILIDADES',
    },
    de: {
      name: 'Problemlösung & Debugging',
      description: 'Analytischer Ansatz zur Fehlerbehebung bei Hardware- und Softwareproblemen unter Zeitdruck.',
      category: 'SOFT SKILLS',
    },
    fr: {
      name: 'Résolution de Problèmes',
      description: 'Approche analytique du débogage matériel et logiciel sous forte pression en compétition.',
      category: 'SAVOIR-ÊTRE',
    },
  },
  'teamwork': {
    ko: {
      name: '팀워크 & 리더십',
      description: '팀 리더로서 빌더, 프로그래머, 드라이버 간의 역할을 조율하고 신속한 의사결정을 이끄는 협업 역량.',
      category: '소프트 스킬',
    },
    en: {
      name: 'Teamwork',
      description: 'Effective collaboration as team leader, synchronizing builder, programmer, and driver roles efficiently.',
      category: 'SOFT_SKILL',
    },
    ja: {
      name: 'チームワーク・リーダーシップ',
      description: 'チームリーダーとして設計者、プログラマー、操縦者の役割を統括し迅速な判断を導く連携力。',
      category: 'ソフトスキル',
    },
    zh: {
      name: '团队协作与领导力',
      description: '作为队长高效协调机械师、程序员与操作手角色分工并作出敏捷决策的协作能力。',
      category: '软实力',
    },
    es: {
      name: 'Trabajo en Equipo',
      description: 'Colaboración eficaz como líder de equipo, sincronizando los roles de montaje, programación y conducción.',
      category: 'HABILIDADES',
    },
    de: {
      name: 'Teamarbeit & Führung',
      description: 'Effektive Zusammenarbeit als Teamleiter, koordinierte Abstimmung zwischen Konstruktion, Code und Steuerung.',
      category: 'SOFT SKILLS',
    },
    fr: {
      name: 'Travail d\'Équipe',
      description: 'Collaboration efficace en tant que chef d\'équipe, synchronisant constructeur, programmeur et pilote.',
      category: 'SAVOIR-ÊTRE',
    },
  },
};

// YouTube Channel multi-language dictionary
const CHANNEL_MAP: Record<Language, { description: string; tagline: string; topics: string[] }> = {
  ko: {
    description: 'World Robot Olympiad (WRO) 및 CoSpace 로보틱스, 자율주행 주행 테스트, PID 제어 튜닝, 하드웨어 빌드 메이킹 영상을 공유하는 공식 채널입니다.',
    tagline: 'WRO 로봇 공학, 자율주행 알고리즘 및 로봇 시스템 개발 기록 채널',
    topics: ['WRO 실전 경기', '라인트레이싱 PID', '자율주행 제어', '3D CAD & 로봇 제작', '필드 테스트'],
  },
  en: {
    description: 'Official YouTube channel archiving World Robot Olympiad (WRO) & CoSpace autonomous runs, PID control tuning, hardware CAD builds, and field match analyses.',
    tagline: 'WRO Robotics, Autonomous Navigation & Systems Engineering Channel',
    topics: ['WRO Competition Match', 'Line Tracking PID', 'Autonomous Navigation', 'Robotics CAD & Build', 'Field Tests'],
  },
  ja: {
    description: 'World Robot Olympiad (WRO) や CoSpace ロボティクス、自律走行走行テスト、PID制御チューニング、機体製作動画を共有する公式チャンネルです。',
    tagline: 'WROロボット工学・自律走行アルゴリズム・システム開発アーカイブチャンネル',
    topics: ['WRO本番試合', 'ライントレースPID', '自律走行制御', '3D CAD＆ロボット製作', 'フィールドテスト'],
  },
  zh: {
    description: 'World Robot Olympiad (WRO) 及 CoSpace 机器人自主巡线实测、PID控制调优、硬件机械3D CAD搭建实录与现场赛况分析的官方频道。',
    tagline: 'WRO 机器人工程、自主导航算法与机器人系统开发记录频道',
    topics: ['WRO 实战竞技', '巡线 PID 调优', '自主导航控制', '3D CAD 与机构搭建', '实地测试'],
  },
  es: {
    description: 'Canal oficial de YouTube que archiva carreras autónomas de la World Robot Olympiad (WRO), ajuste de control PID, construcciones CAD de hardware y análisis de partidos de campo.',
    tagline: 'Canal de robótica WRO, navegación autónoma e ingeniería de sistemas',
    topics: ['Competición WRO', 'Seguimiento PID', 'Navegación Autónoma', 'CAD y Montaje Robótico', 'Pruebas de Campo'],
  },
  de: {
    description: 'Offizieller YouTube-Kanal für autonome Läufe der World Robot Olympiad (WRO), PID-Regler-Tuning, Hardware-CAD-Konstruktionen und Feldversuchsanalysen.',
    tagline: 'WRO Robotik, Autonome Navigation & Systemtechnik Kanal',
    topics: ['WRO Wettkampf', 'Linienverfolgung PID', 'Autonome Navigation', 'Robotik CAD & Bau', 'Feldtests'],
  },
  fr: {
    description: 'Chaîne YouTube officielle archivant les parcours autonomes de la World Robot Olympiad (WRO), le réglage PID, la conception CAO et les analyses de matchs.',
    tagline: 'Chaîne d\'ingénierie des systèmes robotiques WRO et de navigation autonome',
    topics: ['Matchs WRO', 'Suivi de Ligne PID', 'Navigation Autonome', 'CAO et Fabrication Robotique', 'Tests Terrain'],
  },
};

export interface ChannelInfoType {
  channelName: string;
  handle: string;
  channelUrl: string;
  customUrl: string;
  tagline: string;
  taglineKo?: string;
  description: string;
  descriptionKo?: string;
  topics: string[];
  topicsKo?: string[];
}

/**
 * Resolves localized Channel Info
 */
export function getLocalizedChannelInfo(info: ChannelInfoType, lang: Language): ChannelInfoType {
  const map = CHANNEL_MAP[lang] || CHANNEL_MAP.en;
  return {
    ...info,
    description: map.description,
    tagline: map.tagline,
    topics: map.topics,
  };
}

/**
 * Resolves localized About configuration
 */
export function getLocalizedAbout(about: AboutConfig, lang: Language): AboutConfig {
  const translation = ABOUT_LANG_MAP[lang] || (lang === 'ko' ? ABOUT_LANG_MAP.ko : ABOUT_LANG_MAP.en);
  const isDefaultBio = !about.bio || about.bio.includes('여러 로봇 대회에 참가하며') || about.bio.includes('Accumulating rich knowledge');
  const isDefaultQuote = !about.quote || about.quote.includes('결과 뿐만 아니라') || about.quote.includes('Demonstrating not only');
  const isDefaultGoal = !about.goal || about.goal.includes('로봇을 직접 창작할 수 있도록') || about.goal.includes('Accumulating extensive engineering');
  const isDefaultSubBio = !about.subBio || about.subBio.includes('로봇 공학에 열정을 품고') || about.subBio.includes('Passionate robotics engineer');

  return {
    ...about,
    quote: isDefaultQuote ? translation.quote : about.quote,
    bio: isDefaultBio ? translation.bio : about.bio,
    subBio: isDefaultSubBio ? translation.subBio : about.subBio,
    goal: isDefaultGoal ? translation.goal : about.goal,
  };
}

/**
 * Resolves localized Journey item
 */
export function getLocalizedJourney(journey: JourneyItem, lang: Language): JourneyItem {
  const langMap = JOURNEY_MAP[lang] || {};
  const enFallback = JOURNEY_MAP.en?.[journey.id] || {};
  const koFallback = JOURNEY_MAP.ko?.[journey.id] || {};
  const override = langMap[journey.id] || (lang === 'ko' ? koFallback : enFallback);
  const dict = PORTFOLIO_TRANSLATIONS[lang] || PORTFOLIO_TRANSLATIONS.en;

  // Localize roles
  const roles =
    override?.roles ||
    journey.roles?.map((r) => dict[r] || PORTFOLIO_TRANSLATIONS.en[r] || r) ||
    [];

  // Localize metrics
  const metrics =
    override?.metrics ||
    journey.metrics?.map((m) => ({
      label: dict[m.label] || PORTFOLIO_TRANSLATIONS.en[m.label] || m.label,
      value: dict[m.value] || PORTFOLIO_TRANSLATIONS.en[m.value] || m.value,
    })) ||
    [];

  // Localize detailed points
  const detailedPoints = override?.detailedPoints || journey.detailedPoints;

  // Localize strings
  const title = override?.title || dict[journey.title || ''] || journey.title;
  const competition =
    override?.competition ||
    dict[journey.competition || ''] ||
    journey.competition;
  const team = override?.team || dict[journey.team || ''] || journey.team;
  const teamName =
    override?.teamName ||
    dict[journey.teamName || ''] ||
    journey.teamName;
  const award = override?.award || dict[journey.award || ''] || journey.award;
  const summary = override?.summary || journey.summary;
  const description = override?.description || journey.description;
  const strengths = override?.strengths || journey.strengths;
  const improvements = override?.improvements || journey.improvements;
  const quote = override?.quote || journey.quote;

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
  const dict = PORTFOLIO_TRANSLATIONS[lang] || PORTFOLIO_TRANSLATIONS.en;
  const awardOverride = AWARDS_MAP[award.id]?.[lang] || AWARDS_MAP[award.id]?.en || (lang === 'ko' ? AWARDS_MAP[award.id]?.ko : undefined);

  return {
    ...award,
    title: awardOverride?.title || dict[award.title] || award.title,
    competition: awardOverride?.competition || dict[award.competition] || award.competition,
    description: awardOverride?.description || award.description,
    rank: awardOverride?.rank || dict[award.rank || ''] || award.rank,
    category: dict[award.category || ''] || award.category,
    score: award.score,
  };
}

/**
 * Resolves localized Skill item
 */
export function getLocalizedSkill(skill: SkillItem, lang: Language): SkillItem {
  const dict = PORTFOLIO_TRANSLATIONS[lang] || PORTFOLIO_TRANSLATIONS.en;
  const skillOverride = SKILLS_MAP[skill.id]?.[lang] || SKILLS_MAP[skill.id]?.en || (lang === 'ko' ? SKILLS_MAP[skill.id]?.ko : undefined);

  if (skillOverride) {
    return {
      ...skill,
      name: skillOverride.name,
      category: (skillOverride.category || dict[skill.category] || skill.category) as SkillItem['category'],
      description: skillOverride.description,
    };
  }

  // Fallback lookup
  return {
    ...skill,
    name: dict[skill.name] || skill.name,
    category: (dict[skill.category] || skill.category) as SkillItem['category'],
    description: dict[skill.description] || skill.description,
  };
}

/**
 * Resolves localized Project item
 */
export function getLocalizedProject(project: ProjectItem, lang: Language): ProjectItem {
  const projectOverride = PROJECTS_MAP[project.id]?.[lang] || PROJECTS_MAP[project.id]?.en || (lang === 'ko' ? PROJECTS_MAP[project.id]?.ko : undefined);

  return {
    ...project,
    title: projectOverride?.title || project.title,
    summary: projectOverride?.summary || project.summary,
    detailedDescription: projectOverride?.detailedDescription || project.detailedDescription,
    highlights: projectOverride?.highlights || project.highlights,
    blueprintAnnotations: projectOverride?.blueprintAnnotations || project.blueprintAnnotations,
  };
}

/**
 * Resolves localized YouTube video item
 */
export function getLocalizedYouTubeVideo(video: YouTubeVideoItem, lang: Language): YouTubeVideoItem {
  const dict = PORTFOLIO_TRANSLATIONS[lang] || PORTFOLIO_TRANSLATIONS.en;
  
  // Resolve key: by direct ID, or matching order / keywords
  let key = video.id;
  if (!YOUTUBE_MAP[key]) {
    if (video.id === 'yt-1' || video.order === 1 || video.title?.includes('Autonomous Match') || video.title?.includes('미션 결과') || video.titleKo?.includes('미션 결과')) {
      key = 'yt-1';
    } else if (video.id === 'yt-2' || video.order === 2 || video.title?.includes('Line Tracking') || video.title?.includes('컬러 센서') || video.titleKo?.includes('컬러 센서')) {
      key = 'yt-2';
    } else if (video.id === 'yt-3' || video.order === 3 || video.title?.includes('CAD') || video.title?.includes('기구부') || video.titleKo?.includes('기구부')) {
      key = 'yt-3';
    }
  }

  const override = YOUTUBE_MAP[key]?.[lang] || YOUTUBE_MAP[key]?.en || (lang === 'ko' ? YOUTUBE_MAP[key]?.ko : undefined);

  if (override) {
    return {
      ...video,
      title: override.title,
      description: override.description,
      category: override.category || (dict[video.category || ''] || video.category),
    };
  }

  // Fallback for custom added videos
  if (lang === 'ko') {
    return {
      ...video,
      title: video.titleKo || video.title,
      description: video.descriptionKo || video.description,
      category: dict[video.category || ''] || video.category,
    };
  }

  return {
    ...video,
    title: video.title || video.titleKo,
    description: video.description || video.descriptionKo,
    category: dict[video.category || ''] || video.category,
  };
}
