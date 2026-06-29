import { WorkshopClass, ProductItem, FAQItem, Notice, GalleryItem, Review, Booking } from './types';

export const INITIAL_CLASSES: WorkshopClass[] = [
  {
    id: 'class-1',
    name: '비즈 액세서리 만들기',
    description: '나만의 개성을 담은 알록달록 비즈 팔찌, 목걸이, 키링 공방',
    categories: ['팔찌', '목걸이', '키링', '액세서리'],
    level: '입문',
    duration: '1시간 30분',
    maxPeople: 6,
    price: 20000,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    reviewCount: 34,
    intro: '소박하고 영롱하게 반짝이는 비즈로 나만의 유니크한 액세서리를 만듭니다. 수백 가지 다양한 색상과 모양의 수입 비즈, 빈티지 비즈, 아크릴 참을 자유롭게 매치하며 손끝에서 조잘거리는 비즈의 달그락거리는 즐거움을 느껴보세요.',
    materials: ['크리스탈 비즈', '수입 유리 비즈', '우레탄줄', '낚싯줄', '펜치', 'O링 부자재'],
    provided: ['웰컴 음료', '선물용 에코 파우치', '개인 보관 케이스'],
    completedItem: '비즈 팔찌 1개 + 비즈 반지 1개 + 비즈 미니 키링 1개',
    precautions: ['시력이 좋지 않으신 분들은 안경을 지참해주시면 더욱 수월하게 참여하실 수 있습니다.', '미취학 아동의 경우 보호자 동반이 필수적입니다.'],
    refundPolicy: '체험일 3일 전 100% 환불, 2일 전 50% 환불, 1일 전 및 당일 환불 불가',
    isFeatured: true
  },
  {
    id: 'class-2',
    name: '천연 아로마 소이 캔들 만들기',
    description: '향기로운 에센셜 오일과 화사한 드라이플라워로 꾸미는 캔들 레이어링',
    categories: ['캔들', '향기', '아로마', '인테리어'],
    level: '초급',
    duration: '2시간',
    maxPeople: 4,
    price: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    reviewCount: 42,
    intro: '100% 콩에서 추출한 소이왁스와 엄선된 천연 에센셜 오일로 마음의 안정과 감각적인 인테리어를 완성할 아로마 캔들을 제작합니다. 온도를 맞추고 천천히 왁스를 저어가며 지친 일상을 위로하는 향기 치료를 선물하세요.',
    materials: ['골든 소이왁스', '프리미엄 프래그런스 향료 15종', '컬러 액체 염료', '우드 심지', '드라이플라워', '유리 용기'],
    provided: ['클래스 설명서', '캔들 박스 완포장', '티 라이트 캔들 2구 추가 증정'],
    completedItem: '메인 드라이플라워 캔들 1구 (250ml) + 스펙트라 컬러 캔들 1구',
    precautions: ['캔들이 완전히 굳는 데 시간이 필요하므로 완성 직후 흔들림에 주의해야 합니다.', '환기가 잘 되는 환경에서 사용하시기 바랍니다.'],
    refundPolicy: '체험일 3일 전 100% 환불, 2일 전 50% 환불, 일요일 월요일 예약 취소는 목요일 이전 필수',
    isFeatured: true
  },
  {
    id: 'class-3',
    name: '커스텀 플라워 디퓨저 만들기',
    description: '원하는 허브와 꽃잎을 가득 담은 프리미엄 블렌딩 디퓨저',
    categories: ['디퓨저', '향기', '플라워', '선물'],
    level: '초급',
    duration: '1시간',
    maxPeople: 8,
    price: 30000,
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    reviewCount: 29,
    intro: '공간의 무드를 바꾸는 프리미엄 디퓨저입니다. 디퓨저 베이스에 자연의 에센셜 오일을 커스텀 블렌딩하고, 유리 보틀 안에 안개꽃, 장미, 유칼립투스 등 다양한 보존 플라워를 레이아웃하여 시각과 후각을 동시에 채웁니다.',
    materials: ['곡물 발표 주정 디퓨저 베이스', '천연 아로마 향료 10종', '인테리어 프리저브드 플라워 세트', '유리 공병', '섬유 스틱 5개'],
    provided: ['고급 시프트 선물 포장 백', '미니 드라이플라워 카드'],
    completedItem: '프리미엄 보태니컬 디퓨저 1구 (150ml) + 차량용 미니 디퓨저 1구',
    precautions: ['밀폐된 실내 공간에서 대량 블렌딩 시 가벼운 두통이 생길 수 있으니 음료를 드시며 진행하세요.', '꽃잎이 변색될 수 있어 직사광선이 닿지 않는 곳에 거치해야 합니다.'],
    refundPolicy: '체험일 3일 전 100% 환불, 2일 전 50% 환불',
    isFeatured: false
  },
  {
    id: 'class-4',
    name: '자수 & 패브릭 아크 에코백 꾸미기',
    description: '감성적인 패치, 나만의 프랑스식 자수, 패브릭펜으로 그리는 에코백 드로잉',
    categories: ['에코백', '자수', '드로잉', '패션'],
    level: '중급',
    duration: '2시간 30분',
    maxPeople: 5,
    price: 18000,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    reviewCount: 18,
    intro: '무표정한 미색 에코백에 숨을 불어넣습니다. 기초 프랑스 자수 스티치를 배우고 귀여운 열접착식 와펜 패치와 영구 패브릭 펜으로 세상에 하나뿐인 반려 가방을 제작합니다. 손재주가 없어도 도안이 풍부해 안심하고 오세요.',
    materials: ['고급 광목 코튼 캔버스 에코백', '자수틀 및 자수실 30색', '패브릭 드로잉 펜', '패치 아플리케 100종', '열 다림기'],
    provided: ['도안 카탈로그 및 트레이싱지', '따뜻한 카푸치노'],
    completedItem: '커스텀 디자인 에코백 1개 + 미니 동전지갑 1개',
    precautions: ['자수 바늘을 사용하므로 찔림 사고에 유의해야 합니다.', '완성작은 다림질로 잉크를 완전히 세팅한 후 24시간 뒤에 세탁 가능합니다.'],
    refundPolicy: '체험일 3일 전 100% 환불, 2일 전 50% 환불',
    isFeatured: false
  },
  {
    id: 'class-5',
    name: '미니 화분 & 반려 다육 테라리움',
    description: '작은 유리 정원 속에 만드는 앙증맞은 다육식물의 힐링 포레스트',
    categories: ['화분', '테라리움', '식물', '원예'],
    level: '입문',
    duration: '1시간 30분',
    maxPeople: 6,
    price: 22000,
    imageUrl: 'https://images.unsplash.com/photo-1446071103084-c257b5f70672?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    reviewCount: 51,
    intro: '흙을 만지며 마음의 위로를 얻는 원예 테라리움입니다. 유리 볼 안에 자갈, 색모래, 혼합토를 차례로 쌓고 귀여운 미니 다육이와 선인장을 정성스레 심은 뒤, 지브리 느낌의 미니어처 피규어로 동화 속 한 장면을 완성합니다.',
    materials: ['인테리어 투명 유리 보울', '미니 다육이 2~3종', '혼합 분갈이 흙 및 배수 자갈', '파스텔 색모래 5색', '정원 미니어처 피규어 3종'],
    provided: ['원예용 긴 핀셋', '다육이 관리 가이드 리플릿', '수송 보호 캐리어 박스'],
    completedItem: '미니 글라스 정원 테라리움 화분 1개',
    precautions: ['선인장의 가시에 찔릴 수 있으니 제공되는 안전 장갑을 꼭 착용해야 합니다.', '유리 용기 특성상 낙하에 의한 파손에 각별히 유의하세요.'],
    refundPolicy: '생물이 사용되므로 예약 2일 전까지만 환불 가능 (전액), 이후 환불 불가능',
    isFeatured: true
  },
  {
    id: 'class-6',
    name: '아크릴 & 참 시그니처 키링 만들기',
    description: '개성이 넘치는 다양한 빈티지 참과 레이저 커팅 아크릴 조합 키링',
    categories: ['키링', '아크릴', '이니셜', '참액세서리'],
    level: '입문',
    duration: '1시간',
    maxPeople: 10,
    price: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    reviewCount: 67,
    intro: '달그락 상점 최고의 베스트셀러! 가방, 에어팟, 다이어리에 매달면 너무나 사랑스러운 키링입니다. 투명, 파스텔, 우드 아크릴 펜던트와 수백종의 이니셜 참을 사용하여 부담 없이 손쉽게 나만의 감성을 달그락 조립할 수 있습니다.',
    materials: ['참 펜던트 수백 종', '아크릴 펜던트', '가죽 태그', '군조 고리 및 열쇠고리 세트', 'O링 바이스 공구'],
    provided: ['원클릭 키링 박스 패키지', '폴라로이드 기념 촬영 1장'],
    completedItem: '커스텀 아크릴 시그니처 키링 2개',
    precautions: ['공구 사용이 서툴면 고리가 튕겨나갈 수 있어 보호안경을 대여해 드립니다.', '작고 귀여운 부품이 많아 분실에 유의해주세요.'],
    refundPolicy: '체험일 3일 전 100% 환불, 2일 전 50% 환불',
    isFeatured: true
  },
  {
    id: 'class-7',
    name: '보호와 축복의 드림캐처 만들기',
    description: '좋은 꿈을 실어다 줄 에스닉하고 사랑스러운 핸드메이드 드림캐처',
    categories: ['드림캐처', '인테리어', '실공예', '보호'],
    level: '중급',
    duration: '2시간',
    maxPeople: 4,
    price: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    reviewCount: 15,
    intro: '악몽을 거르고 좋은 꿈을 안겨준다는 인디언 전설의 침실 인테리어 장식, 드림캐처를 제작합니다. 메탈 링 주위를 따뜻한 스웨이드 끈으로 감고 거미줄 패턴의 실 그물을 섬세하게 엮은 뒤 깃털과 조개, 나무 구슬로 화려함을 더합니다.',
    materials: ['고급 메탈 지지 링', '스웨이드 레이스 끈', '깃털 및 빈티지 레이스 밴드', '에스닉 참 장식', '천연 자개 칩 및 나무 구슬'],
    provided: ['따뜻한 허브티', '달그락 엽서 세트', '안전 벽면 거치 핀'],
    completedItem: '보헤미안 드림캐처 1개 (메인 원 지름 12cm)',
    precautions: ['실을 매듭짓는 작업이 반복되므로 눈의 피로도가 다소 있을 수 있습니다.', '천천히 한 땀씩 엮어가며 마음의 평화를 찾아보세요.'],
    refundPolicy: '체험일 3일 전 100% 환불, 2일 전 50% 환불, 당일 취소 불가',
    isFeatured: false
  },
  {
    id: 'class-8',
    name: '크리스탈 레진아트 바다 컵받침 & 트레이',
    description: '투명하고 영롱한 레진액과 푸른 조색제로 표현하는 청량한 바다의 파도',
    categories: ['레진아트', '레진', '바다', '컵받침'],
    level: '고급',
    duration: '2시간 30분',
    maxPeople: 4,
    price: 35000,
    imageUrl: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=600',
    rating: 5.0,
    reviewCount: 22,
    intro: '액체 레진과 청량한 안료를 이용해 바다의 영롱한 물결과 밀려드는 흰 파도를 그대로 응고시켜 간직하는 시각적인 레진 클래스입니다. 우드 코스터와 아크릴 트레이를 캔버스 삼아 조색과 라이터 히팅 기법으로 현실적인 파도 결을 연출합니다.',
    materials: ['무독성 프리미엄 에폭시 레진', '바다색 안료 세트', '모래 가루 및 미세 천연 조개껍데기', '우드 컵받침 틀 및 투명 미니 트레이', '히팅건 및 안전 가스 토치'],
    provided: ['라텍스 장갑 및 방진 마스크', '클래스 의상 가운 대여', '음료 무제한'],
    completedItem: '바다 레진 컵받침 2개 + 아크릴 디저트 레진 트레이 1개',
    precautions: ['화학 소재(레진액)를 다루므로 임산부나 약한 피부 질환, 알레르기가 있으신 분들은 예약 전 상담을 권장합니다.', '충분히 굳는 데 24시간이 걸리므로 완성작은 공방에서 택배(무료) 또는 직접 다음 날 픽업 수령하셔야 합니다.'],
    refundPolicy: '체험일 3일 전 100% 환불, 2일 전 50% 환불',
    isFeatured: true
  },
  {
    id: 'class-9',
    name: '친환경 석고 방향제 & 리프레셔',
    description: '화사한 꽃으로 장식하고 천연 에센셜 오일 향을 가득 품은 천연 석고 방향제',
    categories: ['석고방향제', '방향제', '향기', '플라워'],
    level: '초급',
    duration: '1시간 30분',
    maxPeople: 6,
    price: 20000,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    reviewCount: 19,
    intro: '천연 석고 분말에 기분 좋은 오일을 믹싱해 굳히는 방향제입니다. 석고 위에 화사한 보존 장미, 시나몬 스틱, 미니 오렌지 슬라이스를 예쁘게 레이아웃하여 리본 끈을 묶어 옷장, 차 안, 화장실에 두고 쓰는 최고의 인테리어 디퓨저 소품입니다.',
    materials: ['의료용 최고급 친환경 석고 분말', '아로마 향료 12종', '고급 실리콘 몰드 20종', '말린 과일 및 드라이 허브 자재', '선물 패브릭 리본'],
    provided: ['천연 미스트 리필 액 10ml 증정', '선물 상자 패킹 서비스'],
    completedItem: '고급 석고 방향제 타블렛 2개 (플라워 타일 1개 + 조각 캐릭터 1개)',
    precautions: ['석고가 굳을 때 발열 현상이 있으므로 만질 때 주의가 필요합니다.', '충격에 약해 떨어뜨리면 쉽게 깨집니다.'],
    refundPolicy: '체험일 3일 전 100% 환불, 2일 전 50% 환불',
    isFeatured: false
  },
  {
    id: 'class-10',
    name: '세라믹 머그컵 라인 드로잉',
    description: '구워내도 벗겨지지 않는 영구적인 전용 안료로 그리는 감성 도자기 머그 캔버스',
    categories: ['머그컵', '드로잉', '세라믹', '식기'],
    level: '초급',
    duration: '2시간',
    maxPeople: 6,
    price: 28000,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    reviewCount: 38,
    intro: '새하얗고 매끄러운 세라믹 식기에 세밀한 연필 스케치 후, 도자기 전용 독일제 안료와 라이너 펜으로 자신만의 고유한 드로잉을 기록합니다. 커플, 우정, 가족 단위로 서로의 얼굴을 드로잉해주면 행복이 가득 쏟아집니다.',
    materials: ['최고급 국산 백자 머그컵 2구', '세라믹 전용 특수 조색 안료 20색', '세라믹 파인 라이너', '스케치 먹지 및 수정 알코올', '전문 미니 오븐 구움가마'],
    provided: ['달그락 로고 머그 캐리어 박스', '구움 가마 소성 가이드 설명서'],
    completedItem: '나만의 드로잉 머그컵 2개 (세트 완포장)',
    precautions: ['식기는 가마에서 220도 고온으로 굽는 과정이 필요하여 클래스 후 20분의 오븐 소성 시간이 추가 대기가 요구됩니다.', '전자레인지 및 식기세척기 사용이 가능한 안전한 식기입니다.'],
    refundPolicy: '체험일 3일 전 100% 환불, 2일 전 50% 환불',
    isFeatured: true
  }
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    name: '달그락 시그니처 글라스 캔들',
    price: 18000,
    imageUrl: 'https://images.unsplash.com/photo-1508669232496-137b159c1cdb?auto=format&fit=crop&q=80&w=600',
    description: '달그락 감성을 담은 콩 왁스로 빚어낸 한정 아로마 소이 캔들',
    category: '캔들',
    stock: 25,
    wishlistCount: 142,
    isFeatured: true
  },
  {
    id: 'prod-2',
    name: '수제 우드랜드 허브 디퓨저',
    price: 26000,
    imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600',
    description: '숲속의 젖은 흙내음과 소나무 향을 가득 풍기는 감성 유리 플라워 디퓨저',
    category: '디퓨저',
    stock: 12,
    wishlistCount: 98,
    isFeatured: true
  },
  {
    id: 'prod-3',
    name: '미니멀 코튼 린넨 자수 에코백',
    price: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=600',
    description: '달그락 로고 자수가 은은하게 수놓인 매일 가벼운 미색 면 에코백',
    category: '에코백',
    stock: 40,
    wishlistCount: 205,
    isFeatured: true
  },
  {
    id: 'prod-4',
    name: '빈티지 플라워 리프레셔 엽서 세트 (5장)',
    price: 6000,
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600',
    description: '자연의 풀잎과 꽃잎을 유기농 종이에 인쇄한 포근한 감성 엽서집',
    category: '엽서',
    stock: 100,
    wishlistCount: 320,
    isFeatured: false
  },
  {
    id: 'prod-5',
    name: '시그니처 아크릴 달그락 키링',
    price: 7500,
    imageUrl: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=600',
    description: '달그락 소리가 정겹게 나는 투명 이니셜 빈티지 아크릴 펜던트 키링',
    category: '키링',
    stock: 50,
    wishlistCount: 188,
    isFeatured: true
  },
  {
    id: 'prod-6',
    name: '세라믹 미니 식물 페인팅 머그컵',
    price: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600',
    description: '우아한 보태니컬 무드가 도자기에 얇게 페인팅 된 핸드메이드 머그',
    category: '머그컵',
    stock: 15,
    wishlistCount: 76,
    isFeatured: false
  },
  {
    id: 'prod-7',
    name: '감성 다꾸 무광 스티커 팩 (30pcs)',
    price: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1572375995501-4b0894dbe0d1?auto=format&fit=crop&q=80&w=600',
    description: '손으로 그린 귀여운 아기자기 공방 소품 스티커들이 담긴 무광 팩',
    category: '스티커',
    stock: 150,
    wishlistCount: 412,
    isFeatured: false
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: '예약',
    question: '체험 클래스는 몇 일 전까지 예약할 수 있나요?',
    answer: '클래스는 자리가 남아있는 경우 최소 하루(24시간) 전까지 실시간 예약이 가능합니다. 단, 주말 및 공휴일의 베스트 셀러인 아크릴 키링 및 캔들의 경우 사전 마감이 빠르니 3~5일 전 미리 예약을 추천해 드립니다.'
  },
  {
    id: 'faq-2',
    category: '취소',
    question: '예약을 변경하거나 취소하려면 어떻게 해야 하나요?',
    answer: '예약 확인 탭 혹은 마이페이지의 예약 내역에서 직접 예약을 취소하실 수 있습니다. 일정 변경은 기존 예약 취소 후 재예약해주시거나, 카카오채널 "달그락 상점"을 통해 문의 남겨주시면 조율 가능 여부를 안내해 드립니다.'
  },
  {
    id: 'faq-3',
    category: '환불',
    question: '환불 규정이 어떻게 되나요?',
    answer: '기본적으로 체험 예정일 기준 3일 전 취소 시 100% 환불이 가능합니다. 2일 전 취소 시에는 예약금의 50%가 취소 수수료로 공제되며, 1일 전 혹은 예약 당일 불참(No-Show) 시에는 재료 선구매 및 강사 배치 등의 사유로 인해 아쉽게도 환불이 전면 불가합니다.'
  },
  {
    id: 'faq-4',
    category: '주차',
    question: '공방 건물에 주차가 가능한가요?',
    answer: '네, 달그락 상점 건물 지하 1층 및 건물 뒤편 공용 야외 주차 공간에 차량 4대까지 선착순 무료 주차가 제공됩니다. 만차 시 도보 2분 거리에 위치한 시립 무료 공용주차장을 이용해주시면 편리하게 찾아오실 수 있습니다.'
  },
  {
    id: 'faq-5',
    category: '반려동물',
    question: '반려동물과 동반 입장이 가능한가요?',
    answer: '네! 저희 달그락 상점은 반려동물 동반이 매우 긍정적으로 허용되는 펫 프렌들리 공방입니다. 다만, 식기 페인팅이나 자수 공구, 레진아트 등 날카롭거나 뜨거운 재료를 다루는 수업이 있을 수 있으므로 케이지를 지참하시거나 리드줄을 짧게 잡아 다른 수강생에게 영향이 없도록 보호자분들의 세심한 배려를 간곡히 부탁드립니다.'
  },
  {
    id: 'faq-6',
    category: '아이 동반',
    question: '어린이(키즈)도 참여할 수 있는 클래스가 있을까요?',
    answer: '네, 아크릴 시그니처 키링 만들기, 미니 다육 테라리움, 비즈 액세서리 만들기는 초등학교 고학년부터 혼자 무리 없이 수행할 수 있는 "입문" 및 "초급" 난이도입니다. 미취학 아동의 경우 가위 및 낚싯줄 절단 등 섬세한 부품 조작이 필요하므로, 성인 보호자분이 1:1로 함께 동석해 주셔야 수월히 참여할 수 있습니다.'
  },
  {
    id: 'faq-7',
    category: '단체예약',
    question: '워크숍이나 학교 단체 체험 예약도 받으시나요?',
    answer: '그럼요! 회사 동호회, 기업 워크숍, 커플 기념 단체, 학급 체험 등을 위한 단체 동반(최대 16명) 출장 대관 및 강사 파견도 제공하고 있습니다. 단체 예약 시 맞춤형 쿠폰(10%~20%) 혜택이 주어지므로 마이페이지 문의 혹은 공식 이메일로 인원과 원하시는 일시, 클래스 종류를 적어 보내주시면 특별 패키지 맞춤 견적서를 작성해 드리겠습니다.'
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'notice-1',
    title: '🌿 여름맞이 "시원한 바다 레진아트" 스페셜 할인 클래스 오픈!',
    content: `안녕하세요, 감성 공방 달그락 상점의 점장입니다.\n\n날씨가 부쩍 무더워진 요즘, 수강생 여러분들께 청량하고 영롱한 여름의 파도를 안겨드리기 위해 "크리스탈 레진아트 바다 컵받침 & 트레이" 명품 클래스를 전격 개편하였습니다!\n\n이번 신규 레진 클래스 수강생에게는 한정 기간 특별한 혜택을 제공합니다.\n\n■ 할인 이벤트 기간: 7월 1일 ~ 7월 31일\n■ 이벤트 혜택: 레진 클래스 단품 예약 시 10% 자동 할인 적용 + 마이페이지 웰컴 쿠폰 중복 사용 가능!\n\n일상의 스트레스를 투명하게 응고시키는 아로마 바다 물결에 시원하게 취해보세요. 감사합니다!`,
    author: '점장',
    createdAt: '2026-06-25T14:30:00Z',
    category: '이벤트',
    views: 124
  },
  {
    id: 'notice-2',
    title: '📢 [공지] 달그락 상점 공식 예약 홈페이지 정식 런칭 & 신규 회원 쿠폰팩 안내',
    content: `손끝에서 작은 행복이 반짝이는 공간, 달그락 상점의 정식 예약 시스템이 가동되었습니다!\n\n이제 인스타그램 DM이나 전화 통화 대기 없이, 원하시는 날짜와 시간의 잔여 좌석을 직접 조율하여 간편하게 결제 예약하실 수 있습니다.\n\n■ 신규 런칭 가입 감사 혜택:\n1. 가입 즉시 지급되는 "웰컴 10% 체험권 할인 쿠폰"\n2. 체험 후 후기를 남겨주시면 다음 굿즈샵 구매 시 즉시 현금처럼 쓸 수 있는 1,000 포인트 적립!\n\n여러분들의 손끝을 스치는 따스한 우드 향과 꽃잎 가득한 공방에서 기다리고 있겠습니다.\n\n이용 중 궁금하신 문의 사항은 마이페이지 Q&A 혹은 FAQ 게시판을 널리 활용해주시길 부탁드립니다. 감사합니다.`,
    author: '점장',
    createdAt: '2026-06-20T09:00:00Z',
    category: '공지',
    views: 312
  },
  {
    id: 'notice-3',
    title: '🌸 "나만의 드로잉 머그컵" 클래스, 구움 오븐 굽기 안전 수칙 강화',
    content: `안녕하세요, 달그락 상점 공방 헤드 티처입니다.\n\n저희 세라믹 머그컵 라인 드로잉 클래스는 독일제 특수 오븐 가공 안료를 사용해 클래스 후 가마 오븐에서 구워 즉시 가져가는 빠른 가공 시스템을 자랑하고 있습니다.\n\n수강생분들이 한층 더 안전하고 퀄리티 높은 구움을 가질 수 있도록 공방 내 전용 마스크 착용 가이드 및 오븐 실 작동 시간 조절에 들어갑니다.\n\n- 소성 온도: 220도 (완성 직후 머그 표면이 매우 뜨거우니 제공되는 집게와 면장갑을 착용한 스태프의 안내를 받아주세요.)\n- 오븐 대기 시간 동안 시원한 보리수 티와 폴라로이드 사진 꾸미기를 무료로 즐기실 수 있도록 준비했습니다.\n\n한 발짝 더 안전하고 친근한 손맛을 약속하는 달그락이 되겠습니다.`,
    author: '헤드티처',
    createdAt: '2026-06-15T11:20:00Z',
    category: '클래스',
    views: 89
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    userId: 'user-sample-1',
    userName: '김하늘',
    userEmail: 'sky@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
    description: '남자친구랑 커플 기념일로 비즈 반지랑 팔찌 만들고 왔어요! 오링 벌리는 도구가 신기하고 달그락달그락 비즈 굴러다니는 소리가 힐링 그 자체였습니다.',
    likes: 42,
    likedBy: [],
    createdAt: '2026-06-28T10:00:00Z'
  },
  {
    id: 'gal-2',
    userId: 'user-sample-2',
    userName: '이사랑',
    userEmail: 'love@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600',
    description: '공방 분위기가 너무 따뜻해요! 시나몬이랑 드라이 안개꽃을 올린 소이 아로마 캔들인데 벌써 침실 가득 향기가 솔솔 퍼져서 아껴 키고 있습니다.',
    likes: 56,
    likedBy: [],
    createdAt: '2026-06-27T15:30:00Z'
  },
  {
    id: 'gal-3',
    userId: 'user-sample-3',
    userName: '정민우',
    userEmail: 'minu@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=600',
    description: '대망의 바다 레진아트 결과물! 진짜 몰디브 파도가 넘실대는 거 같아요. 토치로 기포 날리고 파도 물길 만드는 게 전문가가 된 기분이 들었네요 ㅎㅎ 적극 추천!',
    likes: 71,
    likedBy: [],
    createdAt: '2026-06-26T18:20:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userId: 'user-sample-1',
    userName: '김하늘',
    userEmail: 'sky@example.com',
    rating: 5,
    content: '공방 문 열자마자 잔잔하게 풍겨오는 꽃 향기랑 커피 냄새에 1차로 반했어요. 키링이랑 비즈 팔찌 만들었는데 참 종류가 너무 다양해서 결정장애 왔네요 ㅎㅎ 수강 쌤이 너무 친절하셔서 손재주 없어도 대만족 완성했습니다!',
    likes: 12,
    likedBy: [],
    comments: [
      { id: 'comm-1', userName: '달그락상점 점장', content: '하늘님 반가워요! 달그락 소리 가득했던 시간이 하늘님의 예쁜 기억에도 반짝이길 바랄게요. 또 놀러오세요!', createdAt: '2026-06-28T12:00:00Z' }
    ],
    classId: 'class-1',
    className: '비즈 액세서리 만들기',
    createdAt: '2026-06-28T10:15:00Z'
  },
  {
    id: 'rev-2',
    userId: 'user-sample-2',
    userName: '이사랑',
    userEmail: 'love@example.com',
    rating: 5,
    content: '우드 소이 캔들이랑 스펙트라 컬러 캔들 세트로 만들었습니다. 왁스 온도 맞출 때 초집중하는 게 마치 힐링 마인드풀니스 요가하는 기분이었어요. 완성 캔들을 우드 박스에 포장해주시는데 MUJI 느낌의 정갈한 포장이 취향저격입니다.',
    likes: 8,
    likedBy: [],
    comments: [],
    classId: 'class-2',
    className: '천연 아로마 소이 캔들 만들기',
    createdAt: '2026-06-27T16:00:00Z'
  },
  {
    id: 'rev-3',
    userId: 'user-sample-3',
    userName: '정민우',
    userEmail: 'minu@example.com',
    rating: 5,
    content: '인생 첫 레진 공예였는데 결과가 프로 샵에서 파는 퀄리티로 나옵니다. 파도 표현하려고 토치 불로 바람을 일으켜 파도를 주름잡는 게 진짜 흥미로워요. 택배 안전하게 포장되어 잘 수령했습니다. 감사합니다!',
    likes: 24,
    likedBy: [],
    comments: [],
    classId: 'class-8',
    className: '크리스탈 레진아트 바다 컵받침 & 트레이',
    createdAt: '2026-06-26T19:00:00Z'
  }
];
